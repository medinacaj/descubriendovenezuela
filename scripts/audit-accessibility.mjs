/**
 * Prueba automatizada WCAG con axe-core sobre páginas representativas.
 * No constituye una certificación WCAG ni sustituye pruebas manuales.
 * Se instala axe-core temporalmente en CI para no añadir dependencia de producción.
 */
import {createServer} from "node:http";
import {readFile} from "node:fs/promises";
import {chromium} from "@playwright/test";
const base="/descubriendovenezuela/";
const axe=await readFile("node_modules/axe-core/axe.min.js","utf8");
const server=createServer(async(req,res)=>{
 try{
  const path=new URL(req.url,"http://local").pathname;
  if(!path.startsWith(base)||path.includes("..")){res.writeHead(404);res.end();return;}
  let file=path.slice(base.length);
  if(!file||file.endsWith("/"))file+="index.html";
  if(!/^(index\.html|(estados|explorar|posadas|contribuir|politica-editorial|privacidad)\/index\.html|regiones\/[a-z0-9-]+\/index\.html|lugares\/[a-z0-9-]+\/index\.html|js\/(?:script-[a-z0-9]+-[0-9]+|cinematic-hero)\.js|media\/[a-z0-9-]+\.webp|base\.css|layout-balance\.css|states\.css|cinematic-hero\.css|sw\.js|icon\.svg|manifest\.webmanifest)$/.test(file)){res.writeHead(404);res.end();return;}
  const bytes=await readFile("docs/"+file);
  res.setHeader("Content-Type",file.endsWith(".css")?"text/css":file.endsWith(".js")?"application/javascript":file.endsWith(".webp")?"image/webp":file.endsWith(".svg")?"image/svg+xml":file.endsWith(".webmanifest")?"application/manifest+json":"text/html; charset=utf-8");
  res.end(bytes);
 }catch{res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const origin="http://127.0.0.1:"+server.address().port+base;
const executablePath=process.env.CHROMIUM_PATH;
const browser=await chromium.launch({...(executablePath?{executablePath}:{}),args:["--no-sandbox"]});
let failures=0;
try{
 const entries=[["portada",""],["explorar","explorar/"],["posadas","posadas/"],["territorios","estados/"],["región","regiones/falcon/"],["ficha","lugares/colonia-tovar/"],["privacidad","privacidad/"]];
 for(const [label,url] of entries){
  const page=await browser.newPage({viewport:{width:390,height:844},bypassCSP:true});
  // La CSP productiva se comprueba por separado; aquí axe necesita inyección temporal.
  // CSP se omite solo en este contexto de auditoría, no en la web pública.
  const response=await page.goto(origin+url);
  if(!response?.ok())throw Error("No se cargó "+label);
  await page.addScriptTag({content:axe});
  const results=await page.evaluate(async()=>window.axe.run(document,{
    runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]}
  }));
  const serious=results.violations.filter(item=>["critical","serious"].includes(item.impact));
  console.log(label+": "+results.passes.length+" controles aprobados; "+results.violations.length+" hallazgos axe; "+serious.length+" graves.");
  for(const violation of serious){
    failures++;
    console.error(JSON.stringify({page:label,id:violation.id,impact:violation.impact,description:violation.help,count:violation.nodes.length,example:violation.nodes[0]?.target}));
  }
  await page.close();
 }
}finally{
 await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
if(failures)throw Error("Axe detectó "+failures+" grupos de violaciones serias/críticas.");
