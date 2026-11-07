import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { chromium, firefox, webkit, expect } from "@playwright/test";
const prefix = "/descubriendovenezuela/";
const allPlaces = JSON.parse(await readFile("content/places.json", "utf8"));
const stateCount = new Set(allPlaces.map(p => p.region)).size;
const server = createServer(async (req, res) => {
  try {
    const path = new URL(req.url, "http://local").pathname;
    if (!path.startsWith(prefix) || path.includes("..")) { res.writeHead(404); res.end(); return; }
    let name = path.slice(prefix.length);
    if (!name || name.endsWith("/")) name += "index.html";
    if (!/^(index\.html|(explorar|mapa|contribuir|privacidad|politica-editorial|estados)\/index\.html|lugares\/[a-z0-9-]+\/index\.html|regiones\/[a-z0-9-]+\/index\.html|media\/[a-z0-9-]+\.webp|sw\.js|base\.css|js\/(?:script-[a-z0-9]+-[0-9]+|cinematic-hero)\.js|layout-balance\.css|states\.css|cinematic-hero\.css|icon\.svg|manifest\.webmanifest|sitemap\.xml|robots\.txt)$/.test(name)) {
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
const engineName=process.env.BROWSER_ENGINE||"chromium";
if(!["chromium","firefox","webkit"].includes(engineName))throw Error("Motor no admitido");
const engine={chromium,firefox,webkit}[engineName];
const browser=await engine.launch({
  ...(engineName==="chromium"&&executablePath ? { executablePath } : {}),
  ...(engineName==="chromium" ? {args:["--no-sandbox"]} : {}),
});
try {
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(origin);
    await expect(page.locator('link[href$="layout-balance.css"]')).toHaveCount(1);
    await expect(page.locator('link[href$="base.css"]')).toHaveCount(1);
    await expect(page.locator('link[href$="cinematic-hero.css"]')).toHaveCount(1);
    await expect(page.locator("body")).toHaveCSS("background-color","rgb(8, 25, 35)");
    await expect(page.locator(".editorial-states .section-head h2")).toHaveCSS("color","rgb(241, 247, 250)");
    await expect(page.getByRole("button", {name:"Siguiente destino"})).toBeVisible();
    await page.getByRole("button", {name:"Siguiente destino"}).click();
    await expect(page.locator(".cinematic-hero h1")).toContainText("CANAIMA");
    await page.locator('.cinematic-hero__timeline button[data-index="2"]').click();
    await expect(page.locator(".cinematic-hero h1")).toContainText("LOS ROQUES");
    await expect(page.locator('.cinematic-hero__timeline button[data-index="2"]')).toHaveAttribute("aria-pressed","true");
    const box = await page.evaluate(() => {
      const hero = document.querySelector(".cinematic-hero").getBoundingClientRect();
      const card = document.querySelector(".directory-grid .place-card").getBoundingClientRect();
      const title = document.querySelector(".cinematic-hero h1").getBoundingClientRect();
      return { scrollWidth: document.documentElement.scrollWidth, heroWidth: hero.width,
        cardWidth: card.width, titleLeft: title.left, titleRight: title.right };
    });
    if (box.scrollWidth > width + 1) {
      const offenders=await page.evaluate(()=>[...document.querySelectorAll("body *")].map(el=>({tag:el.tagName,cls:typeof el.className==="string"?el.className.slice(0,75):"",text:el.textContent?.slice(0,35),x:Math.round(el.getBoundingClientRect().x),right:Math.round(el.getBoundingClientRect().right),sw:el.scrollWidth,cw:el.clientWidth})).filter(o=>o.right>innerWidth+1||o.x< -1||o.sw>o.cw+5).slice(0,20));
      const cssInfo=await page.evaluate(()=>({margin:getComputedStyle(document.body).margin,heroDisplay:getComputedStyle(document.querySelector(".cinematic-hero")).display,styleSheets:[...document.styleSheets].map(x=>({href:x.href,disabled:x.disabled,rules:(()=>{try{return x.cssRules.length}catch{return "not available"}})()})),resources:performance.getEntriesByType("resource").filter(x=>x.name.endsWith(".css")).map(x=>({name:x.name,duration:x.duration,size:x.transferSize}))}));
      throw Error("Portada desbordada en "+engineName+" a "+width+"px: scrollWidth "+box.scrollWidth+"; CSS "+JSON.stringify(cssInfo)+"; "+JSON.stringify(offenders));
    }
    if (box.heroWidth > width + 1 || box.heroWidth < width * .78) throw Error("Portada desproporcionada a " + width + "px");
    if (box.cardWidth < 220 || box.cardWidth > 470)
      throw Error("Tarjeta desproporcionada a " + width + "px: " + box.cardWidth);
    if (box.titleLeft < -1 || box.titleRight > width + 1)
      throw Error("Título fuera del viewport a " + width + "px");
    await page.goto(origin + "mapa/");
    await expect(page.getByRole("heading",{name:"Mapa de Venezuela por estados"})).toBeVisible();
    await expect(page.locator("body")).toHaveCSS("background-color","rgb(8, 25, 35)");
    await expect(page.locator(".territory-map__sidebar")).toHaveCSS("background-color","rgb(16, 44, 57)");
    await expect(page.locator("svg .map-area")).toHaveCount(stateCount);
    await page.getByLabel("Buscar territorio").fill("merida");
    await expect(page.locator(".map-state-link:visible")).toHaveCount(1);
    if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error("Mapa desbordado a "+width+"px");
    await page.goto(origin + "estados/");
    await expect(page.getByRole("heading", {name:"Estados de Venezuela y Distrito Capital"})).toBeVisible();
    await expect(page.locator("#state-results .state-tile")).toHaveCount(stateCount);
    await expect(page.locator("#state-results .state-tile").first()).toHaveCSS("background-color","rgb(16, 42, 55)");
    await expect(page.locator('link[href$="states.css"]')).toHaveCount(1);
    await page.getByLabel("Buscar estado o Distrito Capital").fill("falcon");
    await expect(page.locator("#state-results .state-tile:visible")).toHaveCount(1);
    await expect(page.locator("#state-count")).toHaveText("1 territorio documentado");
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1))
      throw Error("Índice de estados desbordado a " + width + "px");
    await page.locator('#state-results a[href$="/regiones/falcon/"]').click();
    await expect(page.getByRole("heading", {name:"Falcón", exact:true})).toBeVisible();
    await expect(page.locator('[data-featured-id="parque-nacional-morrocoy"]')).toBeVisible();
    await expect(page.locator(".state-feature").first()).toHaveCSS("background-color","rgb(16, 42, 55)");
    await expect(page.locator('.state-feature__media figcaption a')).toHaveCount(2);
    await expect.poll(() => page.locator(".state-feature__media img").evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1))
      throw Error("Ficha de Falcón desbordada a " + width + "px");
    await page.goto(origin + "regiones/merida/");
    await expect(page.getByRole("heading", {name:"Mérida",level:1,exact:true})).toBeVisible();
    await expect(page.locator('[data-featured-id="parque-nacional-sierra-nevada"]')).toHaveCount(1);
    await expect(page.locator(".state-more-sites")).toHaveCount(1);
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1))
      throw Error("Ficha de Mérida desbordada a " + width + "px");
    await page.goto(origin + "explorar/");
    await expect(page.locator(".filter-bar")).toHaveCSS("background-color","rgb(16, 43, 56)");
    await expect(page.getByRole("button",{name:"Buscar",exact:true})).toHaveCSS("background-color","rgb(18, 109, 145)");
    await page.getByLabel("Imagen").selectOption("propia");
    if(await page.locator("#results .place-card:visible").count() > allPlaces.filter(p=>p.photos?.length).length)throw Error("No se aplicó filtro de fotos propias");
    await page.getByLabel("Imagen").selectOption("");
    await expect(page.locator("#results .place-card:visible")).toHaveCount(30);
    await page.getByRole("button",{name:"Mostrar más lugares"}).click();
    await expect(page.locator("#results .place-card:visible")).toHaveCount(60);
    await page.getByRole("button",{name:"Lista",exact:true}).click();
    await expect(page.locator("#results")).toHaveAttribute("data-view","lista");
    await page.getByRole("button",{name:"Fichas",exact:true}).click();
    await expect(page.locator("#results")).toHaveAttribute("data-view","fichas");
    await page.getByRole("button",{name:"Tarjetas",exact:true}).click();
    await expect(page.locator("#results")).toHaveAttribute("data-view","tarjetas");
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1))
      throw Error("Explorador desbordado a " + width + "px");
    await page.goto(origin + "lugares/merida-ciudad/");
    await expect(page.locator(".place-facts")).toHaveCSS("background-color","rgb(16, 44, 57)");
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
            (imgs, count) =>
              imgs.length >= 8 &&
              imgs.every((i) => i.complete && i.naturalWidth > 0),
          ),
      )
      .toBe(true);
    await page.locator('a.cinematic-hero__primary[href$="/explorar/"]').click();
    await expect(page.getByRole("heading", {name: "Explorar destinos y localidades"})).toBeVisible();
    await page.getByLabel("Buscar lugar").fill("monumento natural cueva del guacharo");
    await expect(page.locator("#count")).toHaveText("1 lugar documentado");
    await page.getByLabel("Buscar lugar").fill("");
    await expect(page.locator("#count")).toHaveText(allPlaces.length + " lugares documentados");
    await page.getByLabel("Categoría", {exact:true}).selectOption("Localidades");
    await page.getByLabel("Estado o región").selectOption("Mérida");
    await page.getByLabel("Buscar lugar").fill("merida");
    await page.getByRole("button", {name:"Buscar",exact:true}).click();
    await expect(page.locator("#count")).toHaveText("1 lugar documentado");
    await page.locator('a[href$="/lugares/merida-ciudad/"]').click();
    await expect(page.getByRole("heading", {name:"Mérida",exact:true})).toBeVisible();
    await expect(page.getByText("Cartografía de referencia:", {exact:false})).toBeVisible();
    await expect(page.locator(".place-cover img")).toHaveJSProperty("naturalWidth",900);
    await expect(page.locator(".place-intro h1")).toBeVisible();
    await expect(page.locator(".place-facts")).toBeVisible();
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
