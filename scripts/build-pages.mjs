import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { dirname } from "node:path";
import { catalogSchema } from "../content/schema.mjs";
import { buildDirectories } from "./build-directories.mjs";
import { renderEditorialHighlights } from "./editorial-highlights.mjs";

const places = catalogSchema.parse(JSON.parse(await readFile("content/places.json","utf8")));
for (const place of places) for (const media of place.photos) await stat("docs/" + media.src);
const css = await readFile("src/app/globals.css","utf8");
const layout = JSON.parse(await readFile("scripts/pages-layout.json","utf8"));
const geo=JSON.parse(await readFile("content/maps/states.geojson","utf8"));
const files = buildDirectories(places,css,layout.hero,geo);
// El script común ya se carga en todas las fichas: extenderlo sin duplicar 314 HTML.
// Validar la firma evita dejar de generar esta mejora si cambia el renderizador.
const sharedCandidates = Object.keys(files).filter(path => /^docs\/js\/script-[a-z0-9]+-[0-9]+\.js$/.test(path) &&
  files[path].includes('navigator.serviceWorker.register("/descubriendovenezuela/sw.js"'));
if (sharedCandidates.length !== 1) throw new Error("No se encontró un único script común de fichas");
files[sharedCandidates[0]] += "\n" + await readFile("scripts/detail-favorites.js","utf8");

files["docs/layout-balance.css"] = await readFile("src/app/layout-balance.css", "utf8");
files["docs/states.css"] = await readFile("src/app/states.css", "utf8");
files["docs/cinematic-hero.css"] = await readFile("src/app/cinematic-hero.css", "utf8");
files["docs/js/cinematic-hero.js"] = await readFile("scripts/hero-carousel.js", "utf8");
files["docs/js/explore-experiences.js"] = await readFile("scripts/explore-experiences.js", "utf8");
const editorialRaw = await readFile("content/editorial-highlights.json", "utf8");
const editorial = JSON.parse(editorialRaw);
if (!Array.isArray(editorial.news) || !Array.isArray(editorial.creators) || !editorial.news.length || !editorial.creators.length) {
  throw new Error("Sección editorial sin noticias o creadores");
}
const licensedPhotos = new Map(places.flatMap(place =>
  place.photos.filter(media => media.kind === "photograph").map(media => [media.src, media])));
for (const entry of [...editorial.news, ...editorial.creators]) {
  const image = entry.image, photo = licensedPhotos.get(image?.src);
  if (!photo || !image.src.startsWith("media/foto-") || !image.src.endsWith(".webp") ||
      !image.alt || !image.caption ||
      ["author", "sourceUrl", "license", "licenseUrl"].some(key => image[key] !== photo[key])) {
    throw new Error("Imagen editorial sin origen/licencia verificados: " + entry.id);
  }
}
files["docs/editorial-highlights.css"] = await readFile("src/app/editorial-highlights.css", "utf8");
files["docs/js/editorial-highlights.js"] = await readFile("scripts/editorial-carousel.js", "utf8");
files["docs/index.html"] = files["docs/index.html"]
  .replace("</head>", `<link rel="stylesheet" href="/descubriendovenezuela/editorial-highlights.css"></head>`)
  .replace("</main>", renderEditorialHighlights(editorial) + "</main>")
  .replace("</body>", `<script defer src="/descubriendovenezuela/js/editorial-highlights.js"></script></body>`);
if (!files["docs/index.html"].includes("id=\"editorial-creators-title\"")) throw new Error("Fallo al incorporar el carrusel");
let editorialHash = 2166136261;
for (const char of editorialRaw + files["docs/cinematic-hero.css"] + files["docs/editorial-highlights.css"] + files["docs/js/editorial-highlights.js"] + files["docs/layout-balance.css"] + files["docs/js/explore-experiences.js"] + files["docs/index.html"] + files["docs/base.css"]) editorialHash = Math.imul(editorialHash ^ char.charCodeAt(0), 16777619);
const edition = (editorialHash >>> 0).toString(16);
files["docs/sw.js"] = files["docs/sw.js"]
  .replace('BASE+"js/cinematic-hero.js",', 'BASE+"js/cinematic-hero.js",BASE+"js/explore-experiences.js",BASE+"editorial-highlights.css",BASE+"js/editorial-highlights.js",')
  .replace(/CACHE="([^"]+)"/, (_full, name) => `CACHE="${name}-ed${edition}"`);
files["docs/vista-demo.html"] = '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url=/descubriendovenezuela/"><link rel="canonical" href="https://medinacaj.github.io/descubriendovenezuela/"><title>Venezuela en el Mapa</title></head><body><a href="/descubriendovenezuela/">Abrir el directorio actualizado</a></body></html>';
for (const [path,content] of Object.entries(files)) { await mkdir(dirname(path),{recursive:true}); await writeFile(path,content); }
console.log("Catálogo generado desde una sola fuente: "+places.length+" fichas, "+Object.keys(files).length+" archivos.");
