import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { dirname } from "node:path";
import { catalogSchema } from "../content/schema.mjs";
import { buildDirectories } from "./build-directories.mjs";

const places = catalogSchema.parse(JSON.parse(await readFile("content/places.json","utf8")));
for (const place of places) for (const media of place.photos) await stat("docs/" + media.src);
const css = await readFile("src/app/globals.css","utf8");
const layout = JSON.parse(await readFile("scripts/pages-layout.json","utf8"));
const files = buildDirectories(places,css,layout.hero);
files["docs/vista-demo.html"] = '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url=/descubriendovenezuela/"><link rel="canonical" href="https://medinacaj.github.io/descubriendovenezuela/"><title>Venezuela en el Mapa</title></head><body><a href="/descubriendovenezuela/">Abrir el directorio actualizado</a></body></html>';
for (const [path,content] of Object.entries(files)) { await mkdir(dirname(path),{recursive:true}); await writeFile(path,content); }
console.log("Catálogo generado desde una sola fuente: "+places.length+" fichas, "+Object.keys(files).length+" archivos.");
