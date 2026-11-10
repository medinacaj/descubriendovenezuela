import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { readFile } from "node:fs/promises";
import { pool } from "../src/lib/db";
import { savePlace, getPlace, searchPlaces } from "../src/lib/repository";
import { hashPassword, checkPassword, login } from "../src/lib/auth";
let territory: number, actor: string, id: string;
const input = {
  name: "Solo pruebas",
  category: "Naturaleza" as const,
  territoryId: 0,
  description: "Datos sintéticos exclusivos de pruebas.",
  source: "https://example.org/test",
  reviewedAt: "2026-11-04",
  status: "verified" as const,
  published: false,
  sensitive: true,
  lat: 10,
  lon: -66,
  demo: true,
};
beforeAll(async () => {
  expect(new URL(process.env.DATABASE_URL!).pathname).toBe("/venezuela_test");
  await pool.query(await readFile("db/migrations/001_core.sql", "utf8"));
  await pool.query(await readFile("db/migrations/002_catalog_bridge.sql", "utf8"));
  await pool.query(await readFile("db/migrations/002_documented_catalog.sql", "utf8"));
  await pool.query(await readFile("db/migrations/003_business_contacts.sql", "utf8"));
  await pool.query(await readFile("db/migrations/004_verified_prices.sql", "utf8"));
  await pool.query(
    "TRUNCATE change_log,sessions,login_attempts,admin_users,places,territories RESTART IDENTITY CASCADE",
  );
  let parent: null | number = null;
  for (const kind of [
    "country",
    "region",
    "municipality",
    "parish",
    "locality",
  ]) {
    parent = (
      await pool.query(
        "INSERT INTO territories(name,kind,parent_id) VALUES($1,$2,$3) RETURNING id",
        [kind, kind, parent],
      )
    ).rows[0].id;
  }
  territory = parent!;
  input.territoryId = territory;
  actor = (
    await pool.query(
      "INSERT INTO admin_users(email,password_hash) VALUES($1,$2) RETURNING id",
      ["test@example.org", hashPassword("a-test-password-only")],
    )
  ).rows[0].id;
});
afterAll(() => pool.end());
describe("persistencia y publicación reales", () => {
  it("salud confirma esquema y conexión sin revelar datos", async () => {
    const { GET } = await import("../src/app/api/health/route");
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ready" });
  });
  it("PostGIS activo", async () =>
    expect(
      (await pool.query("SELECT postgis_version()")).rows[0].postgis_version,
    ).toContain("3.5"));
  it("rechaza jerarquía inválida", async () => {
    await expect(
      pool.query("INSERT INTO territories(name,kind) VALUES('mal','locality')"),
    ).rejects.toThrow("Parent required");
  });
  it("borrador persistente y oculto", async () => {
    id = await savePlace(input, actor);
    expect(await getPlace(id)).toBeNull();
    expect((await getPlace(id, true))?.name).toBe("Solo pruebas");
  });
  it("publicación exige evidencia", async () => {
    await expect(
      savePlace({ ...input, published: true, source: "" }, actor, id),
    ).rejects.toThrow();
    expect(await getPlace(id)).toBeNull();
  });
  it("publica sin divulgar coordenadas sensibles", async () => {
    await savePlace({ ...input, published: true }, actor, id);
    expect((await getPlace(id))?.lat).toBeNull();
    const result = await searchPlaces({
      category: "Naturaleza",
      territory: String(territory),
    });
    expect(result.total).toBe(1);
    expect(JSON.stringify(result)).not.toContain('"lat":10');
  });
  it("filtros y consultas maliciosas no alteran datos", async () => {
    expect((await searchPlaces({ q: "'; DROP TABLE places;--" })).total).toBe(
      0,
    );
    expect((await searchPlaces({ category: "Hospedaje" })).total).toBe(0);
  });
  it("editor conserva coordenadas privadas al editar", async () => {
    const p = await getPlace(id, true);
    expect(p?.lat).toBe(10);
    await savePlace({ ...p!, name: "Edición conservada" }, actor, id);
    expect((await getPlace(id, true))?.lon).toBe(-66);
    expect((await getPlace(id))?.lat).toBeNull();
  });
  it("una ficha importada del catálogo versionado no se sobreescribe desde admin", async () => {
    await pool.query("UPDATE places SET catalog_id=$1, verification_note=$2 WHERE id=$3", [
      "catalog-test", "Identificación documental de prueba", id,
    ]);
    expect((await getPlace("catalog-test"))?.id).toBe(id);
    const oldOrigin=process.env.APP_ORIGIN, oldReady=process.env.SITE_PUBLIC_READY;
    try {
      process.env.APP_ORIGIN='https://ejemplo.org';process.env.SITE_PUBLIC_READY='true';
      await pool.query("UPDATE places SET demo=false WHERE id=$1",[id]);
      const {default:sitemap}=await import('../src/app/sitemap');
      const urls=(await sitemap()).map(p=>p.url);
      expect(urls).toContain('https://ejemplo.org/lugares/catalog-test');
      expect(urls).not.toContain('https://ejemplo.org/lugares/'+id);
    } finally {
      if(oldOrigin===undefined)delete process.env.APP_ORIGIN;else process.env.APP_ORIGIN=oldOrigin;
      if(oldReady===undefined)delete process.env.SITE_PUBLIC_READY;else process.env.SITE_PUBLIC_READY=oldReady;
      await pool.query("UPDATE places SET demo=true WHERE id=$1",[id]);
    }
    expect(await getPlace("catalog-test", true)).toBeNull();
    await pool.query("UPDATE places SET published=false WHERE id=$1", [id]);
    expect(await getPlace("catalog-test")).toBeNull();
    await pool.query("UPDATE places SET published=true WHERE id=$1", [id]);
    await expect(savePlace({ ...input, name: "Cambio bloqueado" }, actor, id)).rejects.toThrow("Ficha versionada");
    expect((await getPlace(id))?.name).not.toBe("Cambio bloqueado");
    await pool.query("UPDATE places SET catalog_id=NULL, verification_note='' WHERE id=$1", [id]);
  });
  it("paginación fraccionaria se normaliza", async () => {
    expect((await searchPlaces({ page: 1.1 })).page).toBe(1);
  });
  it("oculta contactos sin autorización y publica únicamente los consentidos", async () => {
    const businessId = await savePlace({
      ...input,
      name: "Negocio sintético para prueba",
      category: "Negocios y servicios",
      published: true,
      contactPhone: "+58 212 1234567",
      whatsappPhone: "+584121234567",
      website: "https://example.org/",
      openingHoursNote: "Consultar antes de visitar",
      streetAddress: "Dirección de prueba",
      contactAuthorized: false,
    }, actor);
    const hidden = await getPlace(businessId);
    expect(hidden?.contactPhone).toBeNull();
    expect(hidden?.website).toBeNull();
    expect(hidden?.streetAddress).toBeNull();
    expect(hidden?.openingHoursNote).toBeNull();
    expect((await getPlace(businessId, true))?.contactPhone).toBe("+58 212 1234567");
    await expect(savePlace({
      ...input, contactAuthorized: true, contactEvidence: "", name: "Sin autorización",
    }, actor, businessId)).rejects.toThrow();
    await savePlace({
      ...input, name: "Negocio sintético para prueba",
      category: "Negocios y servicios", published: true,
      contactPhone: "+58 212 1234567",
      whatsappPhone: "+584121234567", website: "https://example.org/",
      openingHoursNote: "Consultar antes de visitar",
      streetAddress: "Dirección de prueba",
      contactAuthorized: true,
      contactEvidence: "Consentimiento documental interno registrado en prueba",
    }, actor, businessId);
    const visible = await getPlace(businessId);
    expect(visible?.contactPhone).toBe("+58 212 1234567");
    expect(visible?.website).toBe("https://example.org/");
    expect(JSON.stringify(visible)).not.toContain("Consentimiento documental interno");
  });
  it("solo presenta precios con fuente y vigencia válidas", async () => {
    const details = {
      priceAmount: 25,
      priceCurrency: "USD" as const,
      priceUnit: "entrada" as const,
      priceValidUntil: "2099-12-31",
      priceSource: "https://example.org/tarifa-oficial",
    };
    const priceId = await savePlace({
      ...input, name: "Entrada sintética documentada", published: true, ...details,
    }, actor);
    expect((await getPlace(priceId))?.priceAmount).toBe(25);
    expect((await getPlace(priceId))?.priceSource).toBe(details.priceSource);
    await savePlace({
      ...input, name: "Entrada sintética documentada", published: true,
      ...details, priceValidUntil: "2020-01-01",
    }, actor, priceId);
    expect((await getPlace(priceId))?.priceAmount).toBeNull();
    expect((await getPlace(priceId))?.priceSource).toBeNull();
    expect((await getPlace(priceId, true))?.priceAmount).toBe(25);
    await expect(savePlace({
      ...input, name: "Sin fuente de tarifa", ...details, priceSource: "",
    }, actor)).rejects.toThrow();
  });
  it("retirar oculta la ficha y conserva auditoría", async () => {
    await savePlace(input, actor, id);
    expect(await getPlace(id)).toBeNull();
    expect(
      Number(
        (
          await pool.query(
            "SELECT count(*) FROM change_log WHERE place_id=$1",
            [id],
          )
        ).rows[0].count,
      ),
    ).toBe(4);
  });
  it("accesos correctos no acumulan bloqueo", async () => {
    for (let i = 0; i < 12; i++)
      expect(
        await login("test@example.org", "a-test-password-only", "successful"),
      ).toHaveLength(64);
  });
  it("contraseña y limitación de intentos", async () => {
    expect(checkPassword("errónea", hashPassword("correcta"))).toBe(false);
    for (let i = 0; i < 10; i++)
      await expect(
        login("test@example.org", "errónea", "test"),
      ).rejects.toThrow("incorrectas");
    await expect(
      login("test@example.org", "a-test-password-only", "test"),
    ).rejects.toThrow("Demasiados");
  });
});
