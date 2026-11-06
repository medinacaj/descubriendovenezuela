import { describe, it, expect } from "vitest";
import catalog from "../content/places.json";
import { normaliseCatalogEntry, type CuratedEntry } from "../src/lib/catalog";

describe("puente del catálogo documental", () => {
  it("normaliza todas las fichas reales y preserva su procedencia", () => {
    const entries = catalog.map(entry => normaliseCatalogEntry(entry as CuratedEntry));
    expect(entries).toHaveLength(37);
    expect(new Set(entries.map(p => p.catalogId)).size).toBe(entries.length);
    expect(entries.every(p => p.source.startsWith("https://"))).toBe(true);
    expect(entries.every(p => p.verificationNote.length > 0)).toBe(true);
    expect(new Set(catalog.map(p => p.region)).size).toBe(24);
    for (const id of ["isla-de-plata-mochima", "parque-nacional-tapo-caparo", "parque-nacional-san-esteban", "parque-nacional-tirgua", "reserva-biosfera-delta-orinoco", "parque-nacional-yacambu", "parque-nacional-el-guache", "relampago-del-catatumbo"]) {
      expect(entries.some(p => p.catalogId === id)).toBe(true);
    }
    expect(catalog.find(p => p.id === "reserva-biosfera-delta-orinoco")?.verification).toContain("biosfera");
    expect(entries.find(p => p.name === "Porlamar")?.mediaCredits[0].kind).toBe("map");
    expect(entries.find(p => p.catalogId === "parque-nacional-morrocoy")?.source).toContain("inparques.gob.ve");
    for (const id of ["hacienda-chuao", "casco-historico-la-guaira"]) {
      const item = catalog.find(p => p.id === id);
      expect(item?.verification).toContain("Lista Indicativa");
      expect(item?.primaryConsulted).toBe(true);
    }
    expect(entries.filter(p => p.mediaCredits.some(m => m.kind === "photograph")).length).toBe(17);
  });
  it("rechaza registros demo, sin fuente o de categoría arbitraria", () => {
    const item = catalog[0] as CuratedEntry;
    expect(() => normaliseCatalogEntry({ ...item, demo: true as false })).toThrow();
    expect(() => normaliseCatalogEntry({ ...item, sourceUrls: [] })).toThrow();
    expect(() => normaliseCatalogEntry({ ...item, category: "Inventado" })).toThrow();
  });
  it("no inventa coordenadas, fotografías o precios en la transformación", () => {
    const item = normaliseCatalogEntry(catalog[0] as CuratedEntry);
    expect(item).not.toHaveProperty("lat");
    expect(item).not.toHaveProperty("price");
    expect(item.mediaCredits.map(m => m.src)).toEqual(catalog[0].photos.map(m => m.src));
    expect(item.mediaCredits[0].sourceUrl).toContain("commons.wikimedia.org");
  });
});
