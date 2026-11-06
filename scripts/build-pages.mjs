import { readFile, writeFile, stat } from "node:fs/promises";
import { catalogSchema } from "../content/schema.mjs";
const places = catalogSchema.parse(
  JSON.parse(await readFile("content/places.json", "utf8")),
);
for (const p of places)
  for (const photo of p.photos) await stat("docs/" + photo.src);
const layout = JSON.parse(await readFile("scripts/pages-layout.json", "utf8"));
const css = (await readFile("src/app/globals.css", "utf8")).replace(
  /^@import[^;]+;/gm,
  "",
);
const e = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const icons = {
  Naturaleza: "↟",
  Cultura: "▥",
  Hospedaje: "⌂",
  Gastronomía: "◒",
  "Negocios y servicios": "◇",
  Localidades: "⌖",
};
const area = (p) =>
  [p.locality, p.region, p.country].filter(Boolean).join(" · ");
function credit(photo) {
  return `<figcaption>${photo.kind === "map" ? "Cartografía" : "Foto"}: ${e(photo.author)} · <a href="${e(photo.licenseUrl)}" target="_blank" rel="noopener noreferrer">${e(photo.license)}</a> · <a href="${e(photo.sourceUrl)}" target="_blank" rel="noopener noreferrer">Origen y atribución</a><small>${e(photo.changes)}</small></figcaption>`;
}
function card(p) {
  const photo = p.photos[0];
  return `<article class="place-card"> <a class="card-main" href="#/lugares/${p.id}" data-name="${e(p.name)}" data-category="${e(p.category)}" data-region="${e(p.region || "")}">${photo ? `<div class="card-photo" data-kind="${photo.kind}"><img src="${e(photo.src)}" alt="${e(photo.alt)}" loading="lazy" decoding="async" width="900" height="600"></div>` : `<div class="card-art art-${p.category.toLowerCase()}" aria-hidden="true"><span>${icons[p.category]}</span><small>ILUSTRACIÓN · FOTOGRAFÍA PENDIENTE</small></div>`}<div class="card-body"><div class="card-meta"><span>${e(p.category)}</span><b>DOCUMENTADO</b></div><h3>${e(p.name)}</h3><p class="location">⌖ ${e(area(p))}</p><div class="card-bottom"><span>Consultar precio</span><b aria-hidden="true">↗</b></div></div></a>${photo ? `<div class="card-credit">${photo.kind === "map" ? "Cartografía" : "Foto"}: ${e(photo.author)} · <a href="${e(photo.licenseUrl)}" target="_blank" rel="noopener noreferrer">${e(photo.license)}</a></div>` : ""}</article>`;
}
const cards = places.map(card).join("");
const intro =
  '<p class="catalog-note">Catálogo en crecimiento · Cada ficha identifica sus fuentes y el alcance de la revisión. Consulta las condiciones actuales con el lugar antes de viajar.</p>';
const categories = [...new Set(places.map((p) => p.category))];
const regions = [
  ...new Set(places.map((p) => p.region).filter(Boolean)),
].sort();
const home =
  layout.hero +
  `<section class="section"><div class="section-head"><div><span class="eyebrow">EL PAÍS, LUGAR A LUGAR</span><h2>Más razones para descubrir Venezuela.</h2></div><a class="text-link" href="#/explorar">Explorar el directorio →</a></div><div class="catalog-tabs">${categories.map((c) => `<a href="#/explorar?category=${encodeURIComponent(c)}">${e(c)} <span>${places.filter((p) => p.category === c).length}</span></a>`).join("")}</div>${intro}<div class="cards">${cards}</div></section><section class="manifesto"><span class="eyebrow">HISTORIAS REALES, FUENTES VISIBLES</span><h2>Un lugar también se conoce<br>por la historia de su imagen.</h2><p>Las imágenes incluidas tienen autor, origen y licencia identificados.<br>Cuando falta una imagen autorizada, lo indicamos con una ilustración.</p></section>`;
const explorer = `<section class="section explorer"><span class="eyebrow">DESTINOS Y LUGARES DOCUMENTADOS</span><h1>Encuentra tu próximo lugar</h1>${intro}<form class="filter-bar" id="filters"><div><label for="q">Buscar lugar</label><input id="q" name="q" placeholder="Nombre o palabra clave…" maxlength="120"></div><div><label for="category">Categoría</label><select id="category" name="category"><option value="">Todas las categorías</option>${["Naturaleza", "Cultura", "Hospedaje", "Gastronomía", "Negocios y servicios", "Localidades"].map((c) => `<option>${e(c)}</option>`).join("")}</select></div><div><label for="region">Estado o región</label><select id="region" name="region"><option value="">Todo el país</option>${regions.map((r) => `<option>${e(r)}</option>`).join("")}</select></div><button class="button">Buscar</button><a href="#/explorar" class="reset">Limpiar</a></form><div class="results-head"><b id="count">${places.length} lugares documentados</b><span>Sin posiciones patrocinadas.</span></div><div class="cards" id="results">${cards}</div><p id="empty" class="empty" hidden>No encontramos lugares con estos filtros. El catálogo todavía es pequeño.</p><p class="catalog-note">No se calculan rutas ni se publican coordenadas exactas sin verificación.</p></section>`;
const views = { "/": home, "/explorar": explorer };
for (const p of places) {
  const sources = p.sourceUrls
    .map(
      (url, i) =>
        `<dt>${i === 0 ? "Fuente consultada" : "Contraste documental"}</dt><dd><a href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(p.sourceLabels?.[i] || ["Catálogo de Brandon Himpfen", "UWHS · Richard Iannone (auditoría 2014)"][i] || "Referencia documental")} →</a></dd>`,
    )
    .join("");
  views["/lugares/" + p.id] =
    `<article class="section detail"><a href="#/explorar" class="text-link">← Volver al directorio</a><div class="detail-grid"><div><span class="eyebrow">${e(p.category)} · LUGAR DOCUMENTADO</span><h1>${e(p.name)}</h1><p class="location">${e(area(p))}${p.unescoReference ? " · Referencia UNESCO " + p.unescoReference : ""}</p>${p.photos.map((photo) => `<figure class="detail-photo"><img src="${e(photo.src)}" alt="${e(photo.alt)}" decoding="async" width="1200" height="800">${credit(photo)}</figure>`).join("")}<h2>Sobre este lugar</h2><p class="description">${e(p.description)}</p><div class="notice">${e(p.verification)}</div><h2>Antes de organizar la visita</h2><p>Horarios, acceso, contacto, tarifas y coordenadas: pendientes de verificación. No se ofrecen reservas ni garantías de seguridad.</p></div><aside class="facts"><span class="eyebrow">PROCEDENCIA VISIBLE</span><h2>Información documentada</h2><dl>${p.inscriptionYear ? `<dt>Inscripción patrimonial (dato histórico)</dt><dd>${p.inscriptionYear}</dd>` : ""}<dt>Precio</dt><dd>Consultar precio</dd><dt>Consulta documental</dt><dd>${e(p.reviewedAt)}</dd>${sources}${p.primaryUrl ? `<dt>${p.primaryConsulted ? "Referencia primaria consultada" : "Referencia oficial, no consultada directamente"}</dt><dd><a href="${e(p.primaryUrl)}" target="_blank" rel="noopener noreferrer">${p.unescoReference ? "Ficha UNESCO" : "Ver referencia"} →</a></dd>` : ""}</dl><small>La revisión confirma únicamente los hechos descritos y sus fuentes. No acredita condiciones operativas actuales. ${p.photos.length ? "Las imágenes representan la región o el lugar que indica su pie. Los mapas se identifican como tales y tienen licencia documentada." : "Fotografía autorizada pendiente: no se reutilizan fotos de terceros sin permiso."}</small></aside></div></article>`;
}
views["/politica-editorial"] =
  `<article class="section prose"><h1>Primero la confianza.</h1><p>Publicamos identificación documental, con fuentes y alcance de revisión en cada ficha. No equivale a verificación de campo ni a una garantía de apertura, calidad o seguridad.</p><p>Parte de las fuentes turísticas originales no puede consultarse desde la red de esta sesión; las referencias no leídas directamente se identifican. Los catálogos históricos no confirman condiciones actuales.</p><p>Los textos son originales. Cada fotografía se publica únicamente cuando puede documentarse autor, origen y licencia compatible. Su pie indica cambios y atribución; las ilustraciones se distinguen de las fotografías.</p><p>No se copian reseñas ni tarifas sin vigencia. Las fichas sin precio confirmado muestran «Consultar precio». No hay anuncios activos ni posiciones patrocinadas.</p><p>Registro de investigación y licencias: <a href="https://github.com/medinacaj/descubriendovenezuela/blob/main/content/RESEARCH.md">consultar procedencia</a>.</p></article>`;
views["/privacidad"] =
  `<article class="section prose"><h1>Privacidad</h1><p>Este directorio de GitHub Pages no usa cuentas, formularios de contribución, analítica, publicidad ni ubicación del visitante. La búsqueda y los filtros se ejecutan en tu navegador.</p><p>Las imágenes se sirven desde este sitio. Los enlaces a fuentes y licencias abren servicios externos con sus propias políticas. No hay panel administrativo ni datos personales privados de propietarios en esta vista pública.</p></article>`;
views["/admin"] =
  `<section class="section prose"><h1>Administración fuera de esta vista pública</h1><p>GitHub Pages sirve el catálogo de lectura. La administración con base de datos pertenece a la aplicación con servidor y no se ejecuta aquí.</p><a class="button" href="#/explorar">Volver al directorio</a></section>`;
const header = layout.header.replace(
  /DEMO EN DESARROLLO[\s\S]*?<\/div>/,
  "LUGARES REALES · Fuentes visibles · Imágenes con crédito y licencia.</div>",
);
const footer = layout.footer.replace(
  "Demo local, sin publicidad.",
  "Directorio documental, sin publicidad.",
);
const encoded = JSON.stringify(views).replace(/</g, "\\u003c");
const js = `const views=${encoded};
function normalize(value){return value.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLocaleLowerCase('es');}
function render(){if(location.hash==='#contenido'){document.querySelector('main').setAttribute('tabindex','-1');document.querySelector('main').focus();return;}const raw=location.hash.slice(1)||'/';const url=new URL(raw,'https://catalogo.local');const path=url.pathname;document.querySelector('main').innerHTML=views[path]||'<section class="section"><h1>Ficha no encontrada</h1><a href="#/explorar">Volver al directorio</a></section>';if(path==='/explorar'){const q=url.searchParams.get('q')||'';const category=url.searchParams.get('category')||'';const region=url.searchParams.get('region')||'';document.querySelector('#q').value=q;document.querySelector('#category').value=category;document.querySelector('#region').value=region;let count=0;document.querySelectorAll('.place-card').forEach(card=>{const c=card.querySelector('.card-main');const visible=normalize(c.dataset.name).includes(normalize(q))&&(!category||c.dataset.category===category)&&(!region||c.dataset.region===region);card.hidden=!visible;if(visible)count++;});document.querySelector('#count').textContent=count+(count===1?' lugar documentado':' lugares documentados');document.querySelector('#empty').hidden=count>0;}window.scrollTo(0,0);}
document.addEventListener('click',event=>{const a=event.target.closest('a');if(!a)return;const href=a.getAttribute('href');if(!href||!href.startsWith('/'))return;event.preventDefault();location.hash=href;});
document.addEventListener('submit',event=>{if(event.target.id!=='filters')return;event.preventDefault();const params=new URLSearchParams(new FormData(event.target));const route='/explorar?'+params.toString();if(location.hash.slice(1)===route)render();else location.hash=route;});window.addEventListener('hashchange',render);render();`;
const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Venezuela en el Mapa · Directorio de lugares documentados</title><meta name="description" content="Descubre lugares reales de Venezuela con fuentes documentadas y imágenes atribuidas."><style>${css} [hidden]{display:none!important} .cards{grid-template-columns:repeat(3,minmax(0,1fr))}@media(max-width:650px){.cards{grid-template-columns:1fr}}</style></head><body>${header}<main id="contenido">${home}</main>${footer}<script>${js}</script></body></html>`;
await writeFile("docs/index.html", html);
await writeFile("docs/vista-demo.html", html);
console.log(
  `Pages: ${places.length} lugares; ${places.reduce((n, p) => n + p.photos.length, 0)} imágenes con licencia.`,
);

// Generate canonical, crawler-visible pages from the same reviewed source.
await import("./build-directories.mjs");
