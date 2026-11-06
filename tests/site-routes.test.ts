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
  expect(home).toContain("Descubre Venezuela por estado");
  expect(home).toContain("/descubriendovenezuela/estados/");
  expect(home).toContain("Sitios que merecen conocerse");
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
 it("176 fichas cuentan con imagen y leyenda de referencia cuando no es del lugar",async()=>{
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
  expect(sw).toContain("Response.error()");
 });
});
