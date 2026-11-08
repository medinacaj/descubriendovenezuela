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
    if (!/^(index\.html|(explorar|mapa|posadas|contribuir|privacidad|politica-editorial|estados)\/index\.html|lugares\/[a-z0-9-]+\/index\.html|regiones\/[a-z0-9-]+\/index\.html|media\/[a-z0-9-]+\.webp|sw\.js|base\.css|js\/(?:script-[a-z0-9]+-[0-9]+|cinematic-hero|editorial-highlights)\.js|layout-balance\.css|states\.css|cinematic-hero\.css|editorial-highlights\.css|icon\.svg|manifest\.webmanifest|sitemap\.xml|robots\.txt)$/.test(name)) {
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
    await expect(page.locator("body")).toHaveCSS("background-color","rgb(255, 248, 241)");
    await expect(page.locator(".editorial-states .section-head h2")).toHaveCSS("color","rgb(16, 39, 70)");
    await expect(page.getByRole("button", {name:"Siguiente destino"})).toBeVisible();
    await page.getByRole("button", {name:"Siguiente destino"}).click();
    await expect(page.locator(".cinematic-hero h1")).toContainText("CANAIMA");
    if (width <= 620) {
      await expect(page.locator(".cinematic-hero__timeline")).toBeHidden();
      await page.getByRole("button", {name:"Siguiente destino"}).click();
    } else {
      await page.locator('.cinematic-hero__timeline button[data-index="2"]').click();
    }
    await expect(page.locator(".cinematic-hero h1")).toContainText("LOS ROQUES");
    await expect(page.locator(".cinematic-hero__category")).toHaveCount(5);
    await expect(page.getByRole("heading", { name: "Noticias de nuestra Venezuela." })).toBeVisible();
    await expect(page.locator(".editorial-news__card")).toHaveCount(3);
    await expect(page.locator(".editorial-creators__card")).toHaveCount(9);
    await expect(page.locator(".editorial-news__art img")).toHaveCount(3);
    await expect(page.locator(".editorial-creators__portrait img")).toHaveCount(9);
    if (width === 390 || width === 1440) {
      for (const selector of [".editorial-news__art img", ".editorial-creators__portrait img"]) {
        const img = page.locator(selector).first();
        await img.scrollIntoViewIfNeeded();
        await expect.poll(() => img.evaluate(element => element.complete && element.naturalWidth > 0)).toBe(true);
      }
    }
    await expect(page.locator('link[href$="editorial-highlights.css"]')).toHaveCount(1);
    await expect(page.locator(".editorial-news__grid")).toHaveCSS("scroll-snap-type","none");
    await expect(page.locator(".editorial-news__grid")).toHaveCSS("display","flex");
    await expect(page.locator(".editorial-creators__track")).toHaveCSS("display","flex");
    await expect(page.locator(".editorial-creators__track")).toHaveCSS("scroll-snap-type","none");
    await expect(page.locator(".editorial-image__tag")).toHaveCount(0);
    await expect(page.locator(".editorial-news__body h3 a")).toHaveCount(3);
    await expect(page.locator(".editorial-news__body>a")).toHaveCount(0);
    const newsTrack=page.locator("[data-news-track]");
    await newsTrack.hover(); // Pausar desplazamiento autónomo para medir el layout.
    await expect(newsTrack).toHaveCSS("scroll-behavior","auto");
    const newsNext=page.getByRole("button", {name:"Siguientes noticias"});
    const newsMetrics=await newsTrack.evaluate(el=>({
      width:el.clientWidth,scrollWidth:el.scrollWidth,scrollLeft:el.scrollLeft,
      columns:getComputedStyle(el).gridTemplateColumns,
      autoColumns:getComputedStyle(el).gridAutoColumns,
      cards:[...el.children].map(child=>Math.round(child.getBoundingClientRect().width))
    }));
    if (newsMetrics.scrollWidth <= newsMetrics.width + 3)
      throw Error("Noticias sin espacio desplazable o desplazadas a " + width + "px: " + JSON.stringify(newsMetrics));
    await expect(newsNext).toBeEnabled();
    await newsNext.click();
    await expect.poll(()=>newsTrack.evaluate(el=>el.scrollLeft)).toBeGreaterThan(5);
    const creatorNext=page.getByRole("button", {name:"Siguientes creadores"});
    const creatorTrack=page.locator("[data-creators-track]");
    await creatorTrack.hover();
    await expect(creatorTrack).toHaveCSS("scroll-behavior","auto");
    await expect(page.locator(".place-card .card-bottom").first()).toBeHidden();
    await expect(page.locator(".place-card .card-meta b").first()).toBeHidden();
    await expect(page.locator(".editorial-creators__body h3 a")).toHaveCount(9);
    await expect(page.locator(".editorial-creators__body>a")).toHaveCount(0);
    const creatorGeometry=await creatorTrack.evaluate(track=>{
      const box=track.getBoundingClientRect();
      return {
        overflows: track.scrollWidth > track.clientWidth + 3,
        allCardsVisible: [...track.children].every(child=>{
          const card=child.getBoundingClientRect();
          return card.left >= box.left - 3 && card.right <= box.right + 3;
        })
      };
    });
    if (creatorGeometry.overflows) {
      await expect(creatorNext).toBeEnabled();
      await creatorNext.click();
      await expect(page.locator("[data-creators-counter]")).toContainText(" / 9");
      await expect.poll(()=>creatorTrack.evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);
    } else {
      if (!creatorGeometry.allCardsVisible) throw Error("Carrusel sin desplazamiento, pero con tarjetas ocultas a " + width + "px");
      await expect(creatorNext).toBeDisabled();
    }

    // Movimiento real por sí solo y arrastre con ratón (una ejecución representativa).
    if (engineName==="chromium" && width===390) {
      const autoPage=await browser.newPage({viewport:{width:390,height:900}});
      await autoPage.goto(origin);
      const moving=autoPage.locator("[data-creators-track]");
      await moving.scrollIntoViewIfNeeded();
      await autoPage.mouse.move(1,1);
      const initial=await moving.evaluate(el=>el.scrollLeft);
      await autoPage.waitForTimeout(2100);
      const debug=await moving.evaluate(el=>({state:el.dataset.autoDebug,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,scrollLeft:el.scrollLeft,rect:el.getBoundingClientRect().toJSON(),active:document.activeElement?.tagName}));
      if(debug.scrollLeft<=initial+8)throw Error("El carrusel no arrancó: "+JSON.stringify(debug));
      const rect=await moving.boundingBox();
      const fromX=rect.x+rect.width*.75, y=rect.y+Math.min(85,rect.height*.25);
      await autoPage.mouse.move(fromX,y);
      const dragBefore=await moving.evaluate(el=>el.scrollLeft);
      await autoPage.mouse.down();
      await autoPage.mouse.move(fromX-120,y,{steps:8});
      await autoPage.mouse.up();
      await expect.poll(()=>moving.evaluate(el=>el.scrollLeft)).toBeGreaterThan(dragBefore+75);
      await autoPage.close();
    }
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
    const geometry = await page.evaluate(() => {
      const bounds = selector => {
        const b = document.querySelector(selector).getBoundingClientRect();
        return { top:b.top, bottom:b.bottom, left:b.left, right:b.right, height:b.height };
      };
      return {
        hero:bounds(".cinematic-hero"),
        copy:bounds(".cinematic-hero__copy"),
        bottom:bounds(".cinematic-hero__bottom"),
        categories:bounds(".cinematic-hero__categories"),
        firstSection:bounds("main .editor-picks"),
        shortcuts:[...document.querySelectorAll(".cinematic-hero__category")].map(el=>{
          const b=el.getBoundingClientRect();
          return {left:b.left,right:b.right,top:b.top,bottom:b.bottom};
        })
      };
    });
    const topLayout = await page.evaluate(() => {
      const header = document.querySelector("body > header").getBoundingClientRect();
      const banner = document.querySelector(".cinematic-hero").getBoundingClientRect();
      const main = document.querySelector("main#contenido").getBoundingClientRect();
      const scrollY = window.scrollY;
      return {headerTop:header.top + scrollY,bannerTop:banner.top + scrollY,mainTop:main.top + scrollY};
    });
    const expectedTop = Math.max(18, Math.min(width * .02, 30));
    if (Math.abs(topLayout.bannerTop - expectedTop) > 2 ||
        Math.abs(topLayout.headerTop - topLayout.bannerTop) > 2)
      throw Error("Margen exterior o cabecera desalineados a " + width + "px: " + JSON.stringify(topLayout));
    if (geometry.hero.height > (width <= 620 ? 540 : 465))
      throw Error("Banner demasiado alto a " + width + "px: " + geometry.hero.height);
    if (geometry.copy.bottom > geometry.bottom.top + 2)
      throw Error("Texto superpuesto a los créditos del banner a " + width + "px");
    if (geometry.categories.top < geometry.hero.bottom + 7)
      throw Error("Categorías superpuestas a la fotografía a " + width + "px");
    if (geometry.categories.bottom > geometry.firstSection.top + 2)
      throw Error("Categorías superpuestas a las tarjetas a " + width + "px");
    for (const category of geometry.shortcuts) {
      if (category.left < geometry.hero.left - 1 || category.right > geometry.hero.right + 1)
        throw Error("Categoría fuera de la retícula a " + width + "px");
    }
    const gutter = Math.max(20, Math.min(width * .035, 48));
    const expectedHeroWidth = Math.min(1220, width - gutter * 2);
    if (Math.abs(box.heroWidth - expectedHeroWidth) > 2)
      throw Error("Portada fuera de la retícula a " + width + "px: actual=" + box.heroWidth + ", esperado=" + expectedHeroWidth);

    // Una sola retícula para banner, cabecera, tarjetas, noticias y creadores.
    const rail = await page.evaluate(() => {
      const hero = document.querySelector(".cinematic-hero").getBoundingClientRect();
      const edges = element => {
        const rect = element.getBoundingClientRect();
        return {name:element.className||element.tagName,left:rect.left,right:rect.right};
      };
      return {
        hero: {left:hero.left,right:hero.right},
        blocks:[document.querySelector("body > header"),
          ...document.querySelectorAll("main .section, main .editorial-contribute, main .manifesto")].filter(Boolean).map(edges)
      };
    });
    for (const block of rail.blocks) {
      if (Math.abs(block.left - rail.hero.left) > 2 || Math.abs(block.right - rail.hero.right) > 2) {
        throw Error("Desalineación en " + engineName + " a " + width + "px: "
          + JSON.stringify({banner:rail.hero,block}));
      }
    }
    if (box.cardWidth < 220 || box.cardWidth > 470)
      throw Error("Tarjeta desproporcionada a " + width + "px: " + box.cardWidth);
    if (box.titleLeft < -1 || box.titleRight > width + 1)
      throw Error("Título fuera del viewport a " + width + "px");
    await page.goto(origin + "mapa/");
    await expect(page.getByRole("heading",{name:"Mapa de Venezuela por estados"})).toBeVisible();
    await expect(page.locator("body")).toHaveCSS("background-color","rgb(255, 248, 241)");
    await expect(page.locator(".territory-map__sidebar")).toHaveCSS("background-color","rgb(255, 253, 249)");
    await expect(page.locator("svg .map-area")).toHaveCount(stateCount);
    await page.getByLabel("Buscar territorio").fill("merida");
    await expect(page.locator(".map-state-link:visible")).toHaveCount(1);
    if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error("Mapa desbordado a "+width+"px");
    await page.goto(origin + "estados/");
    await expect(page.getByRole("heading", {name:"Estados de Venezuela y Distrito Capital"})).toBeVisible();
    await expect(page.locator("#state-results .state-tile")).toHaveCount(stateCount);
    await expect(page.locator("#state-results .state-tile").first()).toHaveCSS("background-color","rgb(255, 253, 249)");
    await expect(page.locator('link[href$="states.css"]')).toHaveCount(1);
    await page.getByLabel("Buscar estado o Distrito Capital").fill("falcon");
    await expect(page.locator("#state-results .state-tile:visible")).toHaveCount(1);
    await expect(page.locator("#state-count")).toHaveText("1 territorio documentado");
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1))
      throw Error("Índice de estados desbordado a " + width + "px");
    await page.locator('#state-results a[href$="/regiones/falcon/"]').click();
    await expect(page.getByRole("heading", {name:"Falcón", exact:true})).toBeVisible();
    await expect(page.locator('[data-featured-id="parque-nacional-morrocoy"]')).toBeVisible();
    await expect(page.locator(".state-feature").first()).toHaveCSS("background-color","rgb(255, 253, 249)");
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
    await page.goto(origin + "posadas/");
    await expect(page.getByRole("heading",{name:"Posadas y planes para compartir"})).toBeVisible();
    await expect(page.locator(".family-guide__grid .place-card")).toHaveCount(16);
    await expect(page.locator(".family-guide .directory-grid").last().locator(".place-card")).toHaveCount(4);
    await expect(page.locator('a[href$="/lugares/posada-casa-sol-merida/"]')).toHaveCount(1);
    await expect(page.locator('a[href$="/lugares/museo-de-los-ninos-caracas/"]')).toHaveCount(1);
    if(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1))
      throw Error("Guía de posadas desbordada a "+width+"px");
    await page.goto(origin + "explorar/");
    await expect(page.locator(".filter-bar")).toHaveCSS("background-color","rgb(255, 253, 250)");
    await expect(page.getByRole("button",{name:"Buscar",exact:true})).toHaveCSS("background-image",/linear-gradient/);
    await page.getByLabel("Imagen").selectOption("propia");
    const withOwnImages = allPlaces.filter(p=>p.photos?.length).length;
    await expect(page.locator("#count")).toHaveText(withOwnImages + " lugares documentados");
    await page.getByLabel("Imagen").selectOption("pendiente");
    const withoutOwnImages = allPlaces.filter(p=>!p.photos?.length).length;
    await expect(page.locator("#count")).toHaveText(withoutOwnImages + " lugares documentados");
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
    await expect(page.locator(".place-facts")).toHaveCSS("background-color","rgb(255, 250, 244)");
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
    // La navegación llega antes que los scripts diferidos en algunos móviles.
    // Comprobar que el filtro está inicializado antes de enviar eventos.
    await expect(page.locator("#results .place-card:visible")).toHaveCount(30);
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
    await expect(page.getByText("Mapa documental:", {exact:false})).toBeVisible();
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
