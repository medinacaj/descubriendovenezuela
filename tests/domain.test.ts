import { describe, it, expect } from "vitest";
import { validatePlace, publicPlace, priceLabel } from "../src/lib/domain";
const base = {
  name: "Registro de prueba",
  category: "Naturaleza",
  territoryId: 1,
  description: "Contenido sintético de pruebas",
  source: "https://example.org/evidencia",
  reviewedAt: "2026-11-04",
  status: "verified",
  published: true,
  sensitive: false,
  lat: 10,
  lon: -66,
  demo: true,
};
describe("reglas editoriales", () => {
  it("publicar exige fuente y revisión", () => {
    expect(() => validatePlace({ ...base, source: "" })).toThrow();
    expect(() => validatePlace({ ...base, reviewedAt: "" })).toThrow();
  });
  it("borradores no se proyectan", () =>
    expect(publicPlace({ ...base, published: false } as any)).toBeNull());
  it("coordenadas sensibles no se filtran", () => {
    const p = publicPlace({ ...base, sensitive: true } as any);
    expect(p?.lat).toBeNull();
    expect(p?.lon).toBeNull();
  });
  it("tarifas desconocidas y caducadas no se anuncian", () => {
    expect(priceLabel(null)).toBe("Consultar precio");
    expect(
      priceLabel({
        amount: 5,
        currency: "USD",
        unit: "persona",
        source: "https://example.org",
        validUntil: "2020-01-01",
      }),
    ).toBe("Consultar precio");
  });
  it("valida coordenadas y enlaces", () => {
    expect(() => validatePlace({ ...base, lat: 200 })).toThrow();
    expect(() =>
      validatePlace({ ...base, source: "javascript:alert(1)" }),
    ).toThrow();
  });
});
