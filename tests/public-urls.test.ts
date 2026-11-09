import { afterEach, expect, it } from "vitest";
import { placePath, publicBase, publicMetadata } from "../src/lib/public-urls";
const original = { ...process.env };
afterEach(() => {
  process.env = { ...original };
});
it("las fichas documentadas comparten el ID de Pages y las editoriales conservan UUID", () => {
  expect(placePath({ id: "uuid", catalogId: "merida-ciudad" })).toBe(
    "/lugares/merida-ciudad",
  );
  expect(placePath({ id: "uuid", catalogId: null })).toBe("/lugares/uuid");
});
it("solo un origen HTTPS y publicación explícita permiten indexar", () => {
  process.env.SITE_PUBLIC_READY = "true";
  process.env.APP_ORIGIN = "http://localhost:3000";
  expect(publicBase()).toBeNull();
  expect(publicMetadata("/explorar", "Explorar", "Lugares").robots).toEqual({
    index: false,
    follow: false,
  });
  process.env.APP_ORIGIN = "https://ejemplo.org/";
  expect(
    publicMetadata("/lugares/merida-ciudad", "Mérida", "Lugar documentado")
      .alternates?.canonical,
  ).toBe("https://ejemplo.org/lugares/merida-ciudad");
  expect(publicMetadata("/explorar", "Explorar", "Lugares").robots).toEqual({
    index: true,
    follow: true,
  });
  delete process.env.SITE_PUBLIC_READY;
  expect(publicMetadata("/explorar", "Explorar", "Lugares").robots).toEqual({
    index: false,
    follow: false,
  });
});
