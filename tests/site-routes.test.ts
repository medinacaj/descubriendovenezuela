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
   expect(guide).toContain("Sin reservas"); 
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
 it("todas las fichas cuentan con imagen y leyenda de referencia cuando no es del lugar",async()=>{
   const html=await readFile("docs/explorar/index.html","utf8");
   for(const mode of ["tarjetas","lista","fichas"])expect(html).toContain('data-view-switch="'+mode+'"');
   expect((html.match(/class="card-art"/g)||[])).toHaveLength(0);
   expect((html.match(/class="card-photo"/g)||[]).length).toBe(places.length);
   for(const p of places){
     const detail=await readFile("docs/lugares/"+p.id+"/index.html","utf8");
     expect(detail).toContain('class="place-cover place-cover--');
     expect(detail).toContain('src="/descubriendovenezuela/media/');
     if(!((p as any).photos?.length))expect(detail).toContain("NO corresponde a");
   }
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
 it("SEO estático y hojas de estilo cacheables",async()=>{
  const home=await readFile("docs/index.html","utf8");
  const explore=await readFile("docs/explorar/index.html","utf8");
  expect(home).toContain('href="/descubriendovenezuela/base.css"');
  expect(home).not.toContain("<style>");
  expect(explore).toContain('id="show-more"');
  const jsPaths=[...explore.matchAll(/src="\/descubriendovenezuela\/js\/(script-[a-z0-9]+-[0-9]+\.js)"/g)].map(m=>m[1]);
  const contents=await Promise.all(jsPaths.map(name=>readFile("docs/js/"+name,"utf8")));
  expect(contents.join("\n")).toContain("batchSize=30");
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
