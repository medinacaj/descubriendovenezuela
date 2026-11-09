import { readFile, stat } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import rawPlaces from "../content/places.json";
const places: Array<{id:string; name:string; sourceUrls:string[]; region?:string}> = rawPlaces;
const base="https://medinacaj.github.io/descubriendovenezuela/";
const slug=(s:string)=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
describe("Pages con URLs permanentes",()=>{
 it("jerarquía por estados con protagonismo de atractivos reales",async()=>{
  const home=await readFile("docs/index.html","utf8");
  const index=await readFile("docs/estados/index.html","utf8");
  expect(home).toContain("Explora por estado");
  expect(home).toContain('class="cinematic-hero"');
  expect(home).toContain("cinematic-hero.css");
  expect(home).toContain("js/cinematic-hero.js");
  expect(home).toContain("/descubriendovenezuela/estados/");
  expect(home).toContain("Destinos destacados");
  expect(index).toContain("Estados de Venezuela y Distrito Capital");
  expect(index).toContain("state-query");
  expect(index).toContain('href="/descubriendovenezuela/regiones/falcon/"');
  expect(index).toContain("Foto de");
  const region=await readFile("docs/regiones/falcon/index.html","utf8");
  expect(region).toContain('data-featured-id="parque-nacional-morrocoy"');
  expect(region).toContain("Otros sitios documentados");
  expect(region).toContain("og:image");
  expect(region).toContain("foto-parque-nacional-morrocoy.webp");
  expect(region).toContain('href="/descubriendovenezuela/lugares/cayo-sombrero/"');
  expect(region).not.toContain('data-featured-id="caracas-ciudad"');
  const city=await readFile("docs/regiones/merida/index.html","utf8");
  expect(city).toContain('data-featured-id="parque-nacional-sierra-nevada"');
  expect(city).toContain("og:image");
  expect(city).toContain("Otros sitios documentados");
  const detail=await readFile("docs/lugares/parque-nacional-morrocoy/index.html","utf8");
  expect(detail).toContain('href="/descubriendovenezuela/regiones/falcon/"');
  expect(detail).toContain("Más lugares en Falcón");
  const map=await readFile("docs/sitemap.xml","utf8");
  expect(map).toContain(base+"estados/");
  expect(map).toContain(base+"regiones/falcon/");
  expect(map).toContain(base+"regiones/merida/");
  expect((await stat("docs/states.css")).size).toBeGreaterThan(5000);
 });
 it("colección de posadas y salidas familiares tiene rutas y fuentes independientes",async()=>{
   const guide=await readFile("docs/posadas/index.html","utf8");
   const home=await readFile("docs/index.html","utf8");
   const sitemap=await readFile("docs/sitemap.xml","utf8");
   const catalog=await readFile("docs/explorar/index.html","utf8");
   const ids=[
     "los-ranchos-de-chano","posada-casa-sol-merida",
     "posada-los-cocos-morrocoy","posada-playa-colorada",
     "posada-casa-el-pozo","museo-de-los-ninos-caracas",
     "parque-la-venezuela-de-antier","pueblo-museo-los-aleros"
   ];
   expect(guide).toContain("Posadas y planes para compartir");
   expect(guide).toContain("sin reservas ni disponibilidad asumida"); 
   expect(guide).toContain("verificables");
   expect(home).toContain("Escapadas para compartir");
   expect(home).toContain('href="/descubriendovenezuela/posadas/"');
   expect(sitemap).toContain(base+"posadas/");
   for(const id of ids){
     expect(guide).toContain("/descubriendovenezuela/lugares/"+id+"/");
     expect(catalog).toContain("/descubriendovenezuela/lugares/"+id+"/");
     expect((await stat("docs/lugares/"+id+"/index.html")).size).toBeGreaterThan(1000);
   }
 });
 it("home y estados indexables y enlaces regionales a todas las fichas",async()=>{
  const html=await readFile("docs/index.html","utf8");
  expect(html).toContain('rel="canonical" href="'+base+'"');
  expect(html).toContain("index,follow");
  const states=await readFile("docs/estados/index.html","utf8");
  expect(states).toContain('rel="canonical" href="'+base+'estados/"');
  for(const p of places) {
    const regional=await readFile("docs/regiones/"+slug(p.region!)+"/index.html","utf8");
    expect(regional).toContain("/descubriendovenezuela/lugares/"+p.id+"/");
    expect(states).toContain("/descubriendovenezuela/regiones/"+slug(p.region!)+"/");
  }
 });
 it("cada ficha enlaza fuentes sin precios inventados",async()=>{
  for(const p of places){
   const file="docs/lugares/"+p.id+"/index.html";
   expect((await stat(file)).size).toBeGreaterThan(1000);
   const html=await readFile(file,"utf8");
   expect(html).toContain(p.sourceUrls[0]);
   expect(html).toContain("Alcance de la comprobación");
   expect(html).toContain('class="place-intro"');
   expect(html).toContain("Antes de planificar una visita");
   expect(html).toContain("Fuentes utilizadas");
   expect(html).toContain(base+"lugares/"+p.id+"/");
   expect(html).toContain("Consultar precio");
  }
 });
 it("cada ficha muestra solo su imagen real, mapa propio o una ausencia explícita",async()=>{
   const html=await readFile("docs/explorar/index.html","utf8");
   for(const mode of ["tarjetas","lista","fichas"])expect(html).toContain('data-view-switch="'+mode+'"');
   expect((html.match(/class="card-photo(?: card-photo--pending)?"/g)||[]).length).toBe(places.length);
   expect(html).not.toContain('data-image-scope="referencia"');
   expect(html).toContain('<option value="pendiente">Sin fotografía propia</option>');
   expect(html).toContain('data-experience="playas"');
   expect(html).toContain('name="imagen"');
   expect(html).toContain('src="/descubriendovenezuela/js/explore-experiences.js"');
   expect((html.match(/data-experiences="/g)||[]).length).toBe(places.length);
   for(const p of places){
     const detail=await readFile("docs/lugares/"+p.id+"/index.html","utf8");
     expect(detail).toContain('class="place-cover place-cover--');
     expect(detail).toContain('src="/descubriendovenezuela/js/script-ekptir-180.js"');
     expect(detail).not.toContain('data-image-scope="referencia"');
     const sources=(p as any).photos as Array<{src:string;kind:string}>;
     if(sources.length){
       expect(detail).toContain('data-image-scope="propia"');
       expect(detail).toContain('src="/descubriendovenezuela/media/'+sources[0].src.split("/").pop());
     } else {
       expect(detail).toContain('class="place-cover place-cover--pending"');
       expect(detail).toContain('Fotografía del lugar pendiente');
       const hero=detail.match(/<div class="place-cover place-cover--pending"[\s\S]+?<\/div><\/div>/)?.[0]||"";
       expect(hero).not.toContain('<img');
     }
   }
 });
 it("botón de guardar usa el mismo almacenamiento local que el explorador",async()=>{
  const shared=await readFile("docs/js/script-ekptir-180.js","utf8");
  const explorer=await readFile("docs/js/explore-experiences.js","utf8");
  const generator=await readFile("scripts/build-pages.mjs","utf8");
  expect(shared).toContain("place-save-button");
  expect(shared).toContain("Ver destinos guardados");
  expect(shared).toContain("venezuela-en-el-mapa.guardados.v1");
  expect(explorer).toContain("venezuela-en-el-mapa.guardados.v1");
  expect(explorer).toContain('window.addEventListener("pageshow"');
  expect(generator).toContain('scripts/detail-favorites.js');
  const styles=await readFile("docs/layout-balance.css","utf8");
  expect(styles).toContain(".place-intro__actions");
 });
 it("mapa SVG con enlaces a los territorios del catálogo",async()=>{
  const html=await readFile("docs/mapa/index.html","utf8");
  expect(html).toContain("Mapa de Venezuela por estados");
  expect((html.match(/class="map-area"/g)||[]).length).toBe(new Set(places.map(p=>p.region)).size);
  expect(html).toContain("Natural Earth");
  for(const r of new Set(places.map(p=>p.region)))expect(html).toContain('/descubriendovenezuela/regiones/'+slug(r!)+'/');
  expect(await readFile("docs/sitemap.xml","utf8")).toContain(base+"mapa/");
 });
 it("CSP y scripts autoalojados sin JavaScript inline",async()=>{
  for(const path of ["docs/index.html","docs/explorar/index.html","docs/estados/index.html"]){
    const html=await readFile(path,"utf8");
    expect(html).toContain('http-equiv="Content-Security-Policy"');
    expect(html).toContain("script-src 'self'");
    expect(html).not.toContain("<script>");
    const tags=[...html.matchAll(/src="\/descubriendovenezuela\/js\/(script-[a-z0-9]+-[0-9]+\.js)"/g)];
    expect(tags.length).toBeGreaterThan(0);
    for(const tag of tags)expect((await stat("docs/js/"+tag[1])).size).toBeGreaterThan(15);
  }
  const explore=await readFile("docs/explorar/index.html","utf8");
  expect(explore).toContain(' srcset="/descubriendovenezuela/media/foto-');
  expect(explore).toContain(' sizes="(max-width:');
 });
 it("noticias y carrusel de creadores mantienen enlaces, fechas, CSS y controles locales",async()=>{
  const html=await readFile("docs/index.html","utf8");
  const editorial=JSON.parse(await readFile("content/editorial-highlights.json","utf8")) as {
    news:Array<{id:string;date:string;url:string;title:string;image:{src:string;author:string;license:string;sourceUrl:string;licenseUrl:string}}>;
    creators:Array<{id:string;url:string;name:string;image:{src:string;author:string;license:string;sourceUrl:string;licenseUrl:string}}>;
    reviewedOn:string;
  };
  expect(html).toContain('id="noticias"');
  expect(html).toContain('id="creadores"');
  expect(html).toContain('data-creators-track');
  expect(html).toContain('data-creators-next');
  expect(html).toContain('editorial-highlights.css');
  expect(html).toContain('js/editorial-highlights.js');
  expect(editorial.news).toHaveLength(3);
  expect(editorial.creators).toHaveLength(12);
  expect(editorial.creators.some(person => person.id === "venezuelaenrutas")).toBe(true);
  expect(editorial.creators.some(person => person.id === "unsabiochino")).toBe(true);
  expect(editorial.creators.some(person => person.id === "augustomochila")).toBe(true);
  expect(html.match(/class="editorial-creators__monogram"/g)?.length).toBe(12);
  for(const item of editorial.news) {
    expect(item.url).toMatch(/^https:\/\//);
    expect(item.date).toMatch(/^20\d\d-\d\d-\d\d$/);
    expect(html).toContain(item.title);
    expect(html).toContain(item.url);
    expect(html).toContain(`href="${item.url}" target="_blank" rel="noopener noreferrer" aria-label="Leer noticia original: ${item.title}"`);
    expect(html).toContain(`src="/descubriendovenezuela/${item.image.src}"`);
    expect(html).toContain(item.image.sourceUrl);
    expect((await stat("docs/"+item.image.src)).size).toBeGreaterThan(1000);
  }
  for(const person of editorial.creators) {
    expect(html).toContain(person.name);
    expect(html).toContain(person.url);
    expect(html).toContain(`src="/descubriendovenezuela/${person.image.src}"`);
    expect(html).toContain(person.image.licenseUrl);
    expect((await stat("docs/"+person.image.src)).size).toBeGreaterThan(1000);
  }
  expect(html).toContain("No implica colaboración, respaldo ni afiliación");
  expect(html).not.toContain("<iframe");
  expect(html).not.toContain('class="editorial-image__tag"');
  expect(html).not.toContain("Leer fuente original <span");
  expect(html).toContain('data-news-track');
  expect(html).toContain('data-news-next');
  expect(html).toContain('data-news-prev');
  expect(html).toContain('data-news-counter');
  expect(html).toContain('data-news-toggle');
  expect(html).toContain('data-creators-toggle');
  expect(html).toContain('aria-label="Pausar noticias"');
  expect(html).toContain('aria-label="Pausar creadores"');
  const carouselJS=await readFile("docs/js/editorial-highlights.js","utf8");
  expect(carouselJS).toContain('track.scrollBy({');
  expect(carouselJS).toContain("requestAnimationFrame(frame)");
  expect(carouselJS).toContain('toggle.setAttribute("aria-pressed"');
  expect(carouselJS).toContain('let paused=reduced.matches;');
  expect(carouselJS).toContain('track.addEventListener("pointerdown"');
  expect(carouselJS).toContain("prefers-reduced-motion");
  expect(carouselJS).toContain("IntersectionObserver");
  expect(html).not.toContain("Ver perfil público");
  const carouselCSS=await readFile("docs/editorial-highlights.css","utf8");
  expect(carouselCSS).toContain("scrollbar-width:none");
  const layoutCSS=await readFile("docs/layout-balance.css","utf8");
  expect(layoutCSS).toContain(".place-card .card-bottom,.place-card .card-meta b{display:none}");
  expect(carouselJS).not.toContain('items[index].offsetLeft');
  expect((await stat("docs/editorial-highlights.css")).size).toBeGreaterThan(1500);
  expect((await stat("docs/js/editorial-highlights.js")).size).toBeGreaterThan(500);
  const sw=await readFile("docs/sw.js","utf8");
  expect(sw).toContain('BASE+"editorial-highlights.css"');
  expect(sw).toContain('BASE+"js/editorial-highlights.js"');
  expect(sw).toContain('BASE+"js/trip-planner.js"');
 });
  it("SEO estático y hojas de estilo cacheables",async()=>{
  const home=await readFile("docs/index.html","utf8");
  const explore=await readFile("docs/explorar/index.html","utf8");
  expect(home).toContain('href="/descubriendovenezuela/base.css"');
  expect(home).not.toContain("<style>");
  expect(explore).toContain('id="show-more"');

  expect(explore).toContain('id="trip-planner-toggle"');
  expect(explore).toContain('id="trip-planner"');
  expect(explore).toContain('src="/descubriendovenezuela/js/trip-planner.js"');
  expect(explore).toContain("sin una ruta calculada".replace("sin una ruta calculada","no una ruta calculada"));
  const planner=await readFile("docs/js/trip-planner.js","utf8");
  expect(planner).toContain("venezuela-en-el-mapa.guardados.v1");
  expect(planner).toContain("venezuela-en-el-mapa.plan.v1");
  expect(planner).toContain("Sin asignar");
  expect(planner).toContain("Jornadas asignadas personalmente");

  expect(planner).toContain("venezuela-en-el-mapa.verificaciones.v1");
  expect(planner).toContain("Consultar fuente documental");
  expect(planner).toContain("no certifica que el lugar esté operativo");
  expect(planner).toContain('"merida-ciudad":');
  expect(planner).toContain("Acceso y permisos");
  const plannerGenerator=await readFile("scripts/build-pages.mjs","utf8");
  expect(plannerGenerator).toContain("const tripEvidence =");
  const privacy=await readFile("docs/privacidad/index.html","utf8");
  expect(privacy).toContain("comprobaciones personales de preparación");
  const detailJs=await readFile("docs/js/script-ekptir-180.js","utf8");
  expect(detailJs).toContain("Organizar mi plan");
  expect(detailJs).toContain("guardados=1&plan=1");
  const experienceJS=await readFile("docs/js/explore-experiences.js","utf8");
  expect(experienceJS).toContain("batchSize=30");
  expect(experienceJS).toContain("experiencia");
  expect(experienceJS).toContain("localStorage.setItem");
  expect(experienceJS).toContain("place-favorite");
  expect(experienceJS).toContain("Ordenar por");
  expect(experienceJS).toContain('queryParams.set("guardados","1")');
  expect(experienceJS).toContain('queryParams.set("orden",order)');
  const balance=await readFile("docs/layout-balance.css","utf8");
  expect(balance).toContain(".explorer-saved-toggle");
  expect(balance).toContain(".trip-planner__checks");
  expect(home).toContain('class="experience-shortcuts"');
  expect(home).toContain("Más allá de los destinos conocidos");
  expect((await stat("docs/base.css")).size).toBeGreaterThan(10000);
  const robots=await readFile("docs/robots.txt","utf8");
  expect(robots).toContain("Sitemap: https://medinacaj.github.io/descubriendovenezuela/sitemap.xml");
 });
 it("sitemap, páginas regionales y caché",async()=>{
  const map=await readFile("docs/sitemap.xml","utf8");
  for(const p of places)expect(map).toContain(base+"lugares/"+p.id+"/");
  for(const region of new Set(places.map(p=>p.region).filter((x):x is string=>!!x))){
   expect((await stat("docs/regiones/"+slug(region)+"/index.html")).size).toBeGreaterThan(1000);
  }
  expect((await readFile("docs/manifest.webmanifest","utf8"))).toContain("/descubriendovenezuela/");
  const sw=await readFile("docs/sw.js","utf8");
  expect(sw).toContain("caches.open");
  expect(sw).toContain('BASE+"states.css"');
  expect(sw).toContain('BASE+"cinematic-hero.css"');
  expect(sw).toContain('BASE+"base.css"');
  expect(sw).toContain("Response.error()");
 });
});
