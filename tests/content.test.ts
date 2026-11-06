import { it, expect } from "vitest";
import places from "../content/places.json";
import { readFile, stat } from "node:fs/promises";
it("directorio ampliado con procedencia y sin datos operativos inventados", () => {
  expect(places.length).toBeGreaterThanOrEqual(6);
  expect(new Set(places.map((p) => p.id)).size).toBe(places.length);
  for (const p of places) {
    expect(p.demo).toBe(false);
    expect(p.sourceUrls.length).toBeGreaterThanOrEqual(1);
    expect(typeof p.primaryConsulted).toBe("boolean");
    expect(p.lat).toBeNull();
    expect(p.lon).toBeNull();
    expect(p.price).toBeNull();
  }
});
it("imágenes publicadas tienen archivos locales y atribución visible", async () => {
  const photos = places.flatMap((p) => p.photos);
  expect(photos.length).toBeGreaterThanOrEqual(12);
  for (const p of places) {
    const detail = await readFile("docs/lugares/" + p.id + "/index.html", "utf8");
    for (const photo of p.photos) {
      expect((await stat("docs/" + photo.src)).size).toBeGreaterThan(1000);
      expect(detail).toContain(photo.src);
      expect(detail).toContain(photo.author.replaceAll("&", "&amp;"));
      expect(detail).toContain(photo.licenseUrl);
      expect(detail).toContain(photo.sourceUrl.replaceAll("&", "&amp;"));
    }
  }
});
it("Pages incorpora lugares y fuentes, con categoría y búsqueda dinámicas", async () => {
  const html = await readFile("docs/index.html", "utf8");
  for (const p of places) {
    const detail = await readFile("docs/lugares/" + p.id + "/index.html", "utf8");
    expect(detail).toContain(p.name);
    expect(detail).toContain(p.sourceUrls[0]);
    expect(detail).toContain("Consultar precio");
  }
  expect(html).toContain("Descubre Venezuela por estado");
  expect(html).toContain("Sitios que merecen conocerse");
  expect(html).not.toContain("Paisaje por descubrir · DEMO");
});
