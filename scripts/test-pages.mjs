import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
const prefix = "/descubriendovenezuela/";
const server = createServer(async (req, res) => {
  try {
    const path = new URL(req.url, "http://local").pathname;
    if (!path.startsWith(prefix) || path.includes("..")) { res.writeHead(404); res.end(); return; }
    let name = path.slice(prefix.length);
    if (!name || name.endsWith("/")) name += "index.html";
    if (!/^(index\.html|(explorar|contribuir|privacidad|politica-editorial)\/index\.html|lugares\/[a-z0-9-]+\/index\.html|regiones\/[a-z0-9-]+\/index\.html|media\/[a-z0-9-]+\.webp|sw\.js|layout-balance\.css|icon\.svg|manifest\.webmanifest|sitemap\.xml)$/.test(name)) {
      res.writeHead(404); res.end(); return;
    }
    const bytes = await readFile("docs/" + name);
    res.setHeader("Content-Type", name.endsWith(".webp") ? "image/webp" : name.endsWith(".svg") ? "image/svg+xml" : name.endsWith(".css") ? "text/css; charset=utf-8" : name.endsWith(".js") ? "text/javascript" : name.endsWith(".webmanifest") ? "application/manifest+json" : name.endsWith(".xml") ? "application/xml" : "text/html; charset=utf-8");
    res.end(bytes);
  } catch { res.writeHead(404); res.end(); }
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
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(origin);
    await expect(page.locator('link[href$="layout-balance.css"]')).toHaveCount(1);
    const box = await page.evaluate(() => {
      const hero = document.querySelector(".hero").getBoundingClientRect();
      const card = document.querySelector(".directory-grid .place-card").getBoundingClientRect();
      const title = document.querySelector(".hero h1").getBoundingClientRect();
      return { scrollWidth: document.documentElement.scrollWidth, heroWidth: hero.width,
        cardWidth: card.width, titleLeft: title.left, titleRight: title.right };
    });
    if (box.scrollWidth > width + 1) throw Error("Portada desbordada a " + width + "px");
    if (box.heroWidth > 1320) throw Error("Portada demasiado ancha a " + width + "px");
    if (box.cardWidth < 220 || box.cardWidth > 470)
      throw Error("Tarjeta desproporcionada a " + width + "px: " + box.cardWidth);
    if (box.titleLeft < -1 || box.titleRight > width + 1)
      throw Error("Título fuera del viewport a " + width + "px");
    await page.goto(origin + "explorar/");
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1))
      throw Error("Explorador desbordado a " + width + "px");
    await page.goto(origin + "lugares/merida-ciudad/");
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1))
      throw Error("Ficha desbordada a " + width + "px");
    await page.close();
    console.log("Proporciones verificadas a " + width + "px");
  }
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
    await page.getByRole("link", { name: "Explorar", exact: true }).click();
    await expect(page.getByRole("heading", {name: "Explorar destinos y localidades"})).toBeVisible();
    await page.getByLabel("Categoría", {exact:true}).selectOption("Localidades");
    await page.getByLabel("Estado o región").selectOption("Mérida");
    await page.getByLabel("Buscar lugar").fill("merida");
    await page.getByRole("button", {name:"Buscar",exact:true}).click();
    await expect(page.locator("#count")).toHaveText("1 lugar documentado");
    await page.locator('a[href$="/lugares/merida-ciudad/"]').click();
    await expect(page.getByRole("heading", {name:"Mérida",exact:true})).toBeVisible();
    await expect(page.getByText("Cartografía:", {exact:false})).toBeVisible();
    await expect(page.locator(".detail-photo img")).toHaveJSProperty("naturalWidth",900);
    await expect(page.getByRole("link", {name:"Dominio público",exact:true})).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href",/lugares\/merida-ciudad\/$/);
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
