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
  await pool.query(await readFile("db/migrations/002_documented_catalog.sql", "utf8"));
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
  it("paginación fraccionaria se normaliza", async () => {
    expect((await searchPlaces({ page: 1.1 })).page).toBe(1);
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
