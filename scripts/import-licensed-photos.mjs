/**
 * Importación fotográfica reproducible, solo desde archivos Wikimedia
 * identificados y licenciados individualmente en el manifiesto revisado.
 * Ejecutar en un entorno con Internet antes de generar GitHub Pages.
 */
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import sharp from "sharp";
const manifest = JSON.parse(await readFile("content/licensed-photographs.json", "utf8"));
const places = JSON.parse(await readFile("content/places.json", "utf8"));
const index = new Map(places.map(p => [p.id, p]));
const seen = new Set();
const licenses = new Set(["CC0 1.0", "CC BY 2.0", "CC BY 3.0", "CC BY 4.0", "CC BY-SA 2.0", "CC BY-SA 3.0", "CC BY-SA 4.0", "Dominio público"]);
await mkdir("docs/media", { recursive: true });
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function download(url) {
  let last;
  for (let retry = 0; retry < 3; retry++) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "VenezuelaEnElMapa/1.0 (https://github.com/medinacaj/descubriendovenezuela; catalogo-fotografico-con-creditos)" },
        signal: AbortSignal.timeout(60000),
      });
      if (!response.ok) throw Error("HTTP " + response.status + " " + response.statusText);
      if (!/^image\/(jpeg|png|webp)/i.test(response.headers.get("content-type") || "")) throw Error("No es imagen");
      const buf = Buffer.from(await response.arrayBuffer());
      if (buf.length < 9000 || buf.length > 20000000) throw Error("Tamaño fuera de límites");
      return buf;
    } catch (e) {
      last = e;
      if (retry < 2) await pause((retry + 1) * 4000);
    }
  }
  throw Error("No se pudo obtener " + url + ": " + last);
}
for (const item of manifest) {
  if (!/^[a-z0-9-]+$/.test(item.id) || seen.has(item.id)) throw Error("ID duplicado/inválido");
  seen.add(item.id);
  const place = index.get(item.id);
  if (!place) throw Error("Ficha inexistente: " + item.id);
  if (!licenses.has(item.license) || !item.licenseUrl.startsWith("https://creativecommons.org/"))
    throw Error("Licencia no validada: " + item.id);
  if (!item.file || !/^[^/\\]+\.jpe?g$/i.test(item.file)) throw Error("Nombre de foto inválido");
  if (item.output !== "foto-" + item.id + ".webp") throw Error("Ruta destino inválida");
  const filename = item.file.replaceAll(" ", "_");
  const source = "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(filename);
  if (item.sourceUrl !== source) throw Error("La fuente no coincide: " + item.id);
  const digest = createHash("md5").update(filename).digest("hex");
  const url = "https://upload.wikimedia.org/wikipedia/commons/" + digest[0] + "/" + digest.slice(0, 2) + "/" + encodeURIComponent(filename);
  const raw = await download(url);
  const meta = await sharp(raw, { limitInputPixels: 50000000 }).metadata();
  if (!meta.width || !meta.height || meta.width < 500 || meta.height < 350) throw Error("Resolución insuficiente: " + item.id);
  const path = "docs/media/" + item.output;
  await sharp(raw, { limitInputPixels: 50000000 }).rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 80, effort: 4 }).toFile(path);
  const size = (await stat(path)).size;
  if (size < 5000) throw Error("WebP vacío: " + path);
  const photo = { kind: "photograph", src: "media/" + item.output,
    alt: item.alt, author: item.author, sourceUrl: item.sourceUrl,
    license: item.license, licenseUrl: item.licenseUrl,
    changes: "Copia técnica convertida a WebP y redimensionada (máximo 1200 px); sin retoques de contenido." };
  place.photos = [photo, ...place.photos.filter(p => p.src !== photo.src)];
  console.log(item.id + ": " + meta.width + "x" + meta.height + " → " + size + " bytes, " + item.license);
}
await writeFile("content/places.json", JSON.stringify(places, null, 2) + "\n");
console.log("Fotografías integradas: " + manifest.length + " lugares. Fotos y atribuciones disponibles para GitHub Pages y Next.");
