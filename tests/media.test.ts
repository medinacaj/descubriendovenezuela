import { it, expect } from "vitest";
import { photoSchema, catalogSchema } from "../content/schema.mjs";
import places from "../content/places.json";
const photo = {
  src: "media/canaima.jpg",
  alt: "Vista documentada del parque Canaima",
  author: "Autora identificada",
  sourceUrl: "https://example.org/original",
  license: "CC BY-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  changes: "Sin modificaciones",
};
it("cada foto exige autor licencia fuente y texto alternativo", () => {
  expect(photoSchema.safeParse(photo).success).toBe(true);
  for (const key of ["author", "license", "licenseUrl", "sourceUrl", "alt"]) {
    expect(photoSchema.safeParse({ ...photo, [key]: "" }).success).toBe(false);
  }
});
it("no se admiten fotos con copyright desconocido ni rutas arbitrarias", () => {
  expect(
    photoSchema.safeParse({
      ...photo,
      license: "Todos los derechos reservados",
    }).success,
  ).toBe(false);
  expect(photoSchema.safeParse({ ...photo, src: "../../.env" }).success).toBe(
    false,
  );
  expect(
    photoSchema.safeParse({ ...photo, sourceUrl: "javascript:alert(1)" })
      .success,
  ).toBe(false);
});
it("catálogo mantiene límites de datos verificados", () => {
  expect(catalogSchema.safeParse(places).success).toBe(true);
  expect(catalogSchema.safeParse([...places, places[0]]).success).toBe(false);
});
