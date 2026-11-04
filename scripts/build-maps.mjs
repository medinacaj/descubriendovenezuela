import { readFile, writeFile, mkdir } from "node:fs/promises";
import sharp from "sharp";
if (!process.env.XDG_CACHE_HOME) {
  process.env.XDG_CACHE_HOME = "/tmp/venezuela-map-font-cache";
  await mkdir(process.env.XDG_CACHE_HOME + "/fontconfig", { recursive: true });
}
const data = JSON.parse(await readFile("content/maps/states.geojson", "utf8"));
const regions = JSON.parse(await readFile("content/maps/regions.json", "utf8"));
const places = JSON.parse(await readFile("content/places.json", "utf8"));
const e = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
// Schematic equirectangular projection, regional context only; no city point markers.
function xy([lon, lat]) {
  return [80 + (lon + 73.8) * 49, 490 - (lat - 0.5) * 29];
}
function ring(points) {
  return (
    points
      .map((p, i) => {
        const [x, y] = xy(p);
        return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ") + " Z"
  );
}
function path(g) {
  return (g.type === "Polygon" ? [g.coordinates] : g.coordinates)
    .map((poly) => poly.map(ring).join(" "))
    .join(" ");
}
await mkdir("docs/media", { recursive: true });
for (const [id, iso] of Object.entries(regions)) {
  const p = places.find((p) => p.id === id);
  if (!p) throw Error("Falta localidad para mapa " + id);
  if (!data.features.some((f) => f.properties.iso === iso))
    throw Error("Región no encontrada " + iso);
  const shapes = data.features
    .map(
      (f) =>
        `<path d="${path(f.geometry)}" fill="${f.properties.iso === iso ? "#e62036" : "#a5c7dc"}" stroke="#ffffff" stroke-width="1.6" fill-rule="evenodd"/>`,
    )
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600"><rect width="900" height="600" fill="#e5f5ff"/><path d="M0 0H900V8H0Z" fill="#0058d9"/><circle cx="800" cy="90" r="45" fill="#ffd000"/><g>${shapes}</g><rect x="35" y="24" width="600" height="92" rx="10" fill="#ffffff"/><text x="55" y="56" font-family="sans-serif" font-size="14" letter-spacing="2" fill="#0058ba">REFERENCIA REGIONAL · VENEZUELA</text><text x="55" y="94" font-family="sans-serif" font-size="29" font-weight="700" fill="#12304d">${e(p.region)}</text><rect x="35" y="520" width="830" height="55" rx="8" fill="#fff"/><rect x="53" y="539" width="15" height="15" rx="3" fill="#e62036"/><text x="80" y="551" font-family="sans-serif" font-size="17" fill="#12304d">Región de ${e(p.name)} · Natural Earth · Dominio público</text><text x="35" y="594" font-family="sans-serif" font-size="12" fill="#34516a">Mapa esquemático: límites generalizados no oficiales. No usar para navegación ni delimitación territorial.</text></svg>`;
  await writeFile(`content/maps/${id}.svg`, svg);
  await sharp(Buffer.from(svg))
    .webp({ quality: 88 })
    .toFile(`docs/media/mapa-${id}.webp`);
}
console.log(
  "Seis mapas regionales renderizados desde datos abiertos, con SVG fuente.",
);
