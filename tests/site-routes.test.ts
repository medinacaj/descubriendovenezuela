import { readFile, stat } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import rawPlaces from "../content/places.json";
const places: Array<{id:string; name:string; sourceUrls:string[]; region?:string}> = rawPlaces;
const base="https://medinacaj.github.io/descubriendovenezuela/";
const slug=(s:string)=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
describe("Pages con URLs permanentes",()=>{
 it("home indexable con enlaces a todas las fichas",async()=>{
  const html=await readFile("docs/index.html","utf8");
  expect(html).toContain('rel="canonical" href="'+base+'"');
  expect(html).toContain("index,follow");
  for(const p of places)expect(html).toContain("/descubriendovenezuela/lugares/"+p.id+"/");
 });
 it("cada ficha enlaza fuentes sin precios inventados",async()=>{
  for(const p of places){
   const file="docs/lugares/"+p.id+"/index.html";
   expect((await stat(file)).size).toBeGreaterThan(1000);
   const html=await readFile(file,"utf8");
   expect(html).toContain(p.sourceUrls[0]);
   expect(html).toContain("Alcance de la comprobación");
   expect(html).toContain(base+"lugares/"+p.id+"/");
   expect(html).toContain("Consultar precio");
  }
 });
 it("sitemap, páginas regionales y caché",async()=>{
  const map=await readFile("docs/sitemap.xml","utf8");
  for(const p of places)expect(map).toContain(base+"lugares/"+p.id+"/");
  for(const region of new Set(places.map(p=>p.region).filter((x):x is string=>!!x))){
   expect((await stat("docs/regiones/"+slug(region)+"/index.html")).size).toBeGreaterThan(1000);
  }
  expect((await readFile("docs/manifest.webmanifest","utf8"))).toContain("/descubriendovenezuela/");
  expect((await readFile("docs/sw.js","utf8"))).toContain("caches.open");
 });
});
