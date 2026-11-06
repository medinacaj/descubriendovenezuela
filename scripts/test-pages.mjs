import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
const prefix = "/descubriendovenezuela/";
const server = createServer(async (req, res) => {
  try {
    const path = new URL(req.url, "http://local").pathname;
    const name =
      path === prefix
        ? "index.html"
        : path.startsWith(prefix + "media/")
          ? path.slice(prefix.length)
          : null;
    if (
      !name ||
      name.includes("..") ||
      !/^index\.html$|^media\/[a-z0-9-]+\.webp$/.test(name)
    ) {
      res.writeHead(404);
      res.end();
      return;
    }
    const bytes = await readFile("docs/" + name);
    res.setHeader(
      "Content-Type",
      name.endsWith(".webp") ? "image/webp" : "text/html; charset=utf-8",
    );
    res.end(bytes);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const origin = "http://127.0.0.1:" + server.address().port + prefix;
const { access } = await import("node:fs/promises");
let executablePath = process.env.CHROMIUM_PATH;
if (!executablePath) {
  try { await access("/usr/bin/chromium"); executablePath = "/usr/bin/chromium"; } catch {}
}
const browser = await chromium.launch({
  ...(executablePath ? { executablePath } : {}),
  args: ["--no-sandbox"],
});
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(origin);
    await page
      .locator("img")
      .evaluateAll((imgs) => imgs.forEach((img) => (img.loading = "eager")));
    await expect
      .poll(() =>
        page
          .locator("img")
          .evaluateAll(
            (imgs) =>
              imgs.length === 6 &&
              imgs.every((i) => i.complete && i.naturalWidth > 0),
          ),
      )
      .toBe(true);
    await page
      .getByRole("link", { name: "Explorar el mapa", exact: true })
      .click();
    await page
      .getByLabel("Categoría", { exact: true })
      .selectOption("Localidades");
    await page.getByLabel("Estado o región").selectOption("Mérida");
    await page.getByLabel("Buscar lugar").fill("merida");
    await page.getByRole("button", { name: "Buscar", exact: true }).click();
    await expect(page.locator("#count")).toHaveText("1 lugar documentado");
    await page.locator('a[href="#/lugares/merida-ciudad"]').click();
    await expect(
      page.getByRole("heading", { name: "Mérida", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("Cartografía:", { exact: false }),
    ).toBeVisible();
    await expect(page.locator(".detail-photo img")).toHaveJSProperty(
      "naturalWidth",
      900,
    );
    await expect(
      page.getByRole("link", { name: "Dominio público", exact: true }),
    ).toBeVisible();
    if (
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      )
    )
      throw Error("Desbordamiento horizontal");
    if (errors.length) throw Error(errors.join(";"));
    console.log(
      `Pages ${width}px: imágenes locales, búsqueda sin acentos, filtros, detalle y licencia OK`,
    );
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
