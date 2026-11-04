import { test, expect } from "@playwright/test";
test("explorador accesible y filtros reales", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Venezuela tiene/ }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Explorar el mapa", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Encuentra tu próximo lugar" }),
  ).toBeVisible();
  await expect(page.locator("[data-ready=true]")).toBeVisible();
  await page.getByLabel("Buscar lugar").fill("imposible-no-existe");
  await page.getByRole("button", { name: "Buscar", exact: true }).click();
  await expect(
    page.getByText("No encontramos lugares con estos filtros."),
  ).toBeVisible();
});
test("administración exige sesión", async ({ page }) => {
  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Acceso editorial" }),
  ).toBeVisible();
});
test("flujo editorial publica y retira con sesión", async ({
  page,
  request,
}) => {
  const { readFile } = await import("node:fs/promises");
  const access = JSON.parse(await readFile(".data/demo-access.json", "utf8"));
  const denied = await request.post("/api/admin/places", {
    headers: { origin: "http://localhost:3000" },
    form: { name: "no permitido" },
  });
  expect(denied.status()).toBe(401);
  const csrf = await request.post("/api/admin/places", {
    headers: { origin: "https://malicioso.example" },
    form: {},
  });
  expect(csrf.status()).toBe(403);
  await page.goto("/admin");
  await page.getByLabel("Correo", { exact: true }).fill(access.email);
  await page.getByLabel("Contraseña", { exact: true }).fill(access.password);
  await page.getByRole("button", { name: /Entrar al panel/ }).click();
  await expect(
    page.getByRole("heading", { name: "Nueva ficha" }),
  ).toBeVisible();
  const name = "E2E temporal " + Date.now();
  await page.getByLabel("Nombre", { exact: true }).fill(name);
  await page
    .getByLabel("Territorio", { exact: true })
    .selectOption({ label: "Localidad de ejemplo · demo" });
  await page
    .getByLabel("Descripción", { exact: true })
    .fill("Prueba automatizada sintética. No representa un sitio real.");
  await page.getByLabel("Fuente HTTPS").fill("https://example.org/prueba");
  await page.getByLabel("Fecha de revisión").fill("2026-11-04");
  await page.getByLabel("Estado de verificación").selectOption("verified");
  await page.getByLabel("Publicar ficha").check();
  await page.getByRole("button", { name: "Guardar ficha" }).click();
  await expect(page.getByRole("status")).toContainText("Ficha guardada");
  await page.goto("/explorar?q=" + encodeURIComponent(name));
  const card = page.getByRole("link").filter({ hasText: name });
  await card.click();
  await expect(page.getByRole("heading", { name })).toBeVisible();
  expect(await page.content()).not.toContain('"lat":10');
  await page.goto("/admin");
  await page.getByRole("link").filter({ hasText: name }).click();
  await expect(
    page.getByRole("heading", { name: "Editar ficha" }),
  ).toBeVisible();
  await expect(page.getByLabel("Nombre", { exact: true })).toHaveValue(name);
  await expect(page.getByLabel("Publicar ficha")).toBeChecked();
  await page.getByLabel("Publicar ficha").uncheck();
  await page.getByRole("button", { name: "Guardar ficha" }).click();
  await expect(page.getByRole("status")).toContainText("Ficha guardada");
  await page.goto("/explorar?q=" + encodeURIComponent(name));
  await expect(
    page.getByText("No encontramos lugares con estos filtros."),
  ).toBeVisible();
  await page.goto("/admin");
  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(
    page.getByRole("heading", { name: "Acceso editorial" }),
  ).toBeVisible();
});
