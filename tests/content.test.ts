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
  expect(photos.length).toBeGreaterThanOrEqual(1);
  const html = await readFile("docs/index.html", "utf8");
  for (const photo of photos) {
    expect((await stat("docs/" + photo.src)).size).toBeGreaterThan(1000);
    expect(html).toContain(photo.src);
    expect(html).toContain(photo.author.replaceAll("&", "&amp;"));
    expect(html).toContain(photo.licenseUrl);
  }
});
it("Pages incorpora lugares y fuentes, con categoría y búsqueda dinámicas", async () => {
  const html = await readFile("docs/index.html", "utf8");
  for (const p of places) {
    expect(html).toContain(p.name);
    const detail = await readFile("docs/lugares/" + p.id + "/index.html", "utf8");
    expect(detail).toContain(p.sourceUrls[0]);
    expect(detail).toContain("Consultar precio");
  }
  expect(html).not.toContain("Paisaje por descubrir · DEMO");
});
