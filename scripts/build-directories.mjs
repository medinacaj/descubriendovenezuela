import { buildStateMap } from "./build-state-map.mjs";
import { createVisualResolver } from "./place-visuals.mjs";
import { buildRegionViews } from "./region-pages.mjs";
import { renderDetailedPlace } from "./detail-pages.mjs";
import { experienceOptions, experiencesFor } from "./experiences.mjs";
import { renderExplorer } from "./explore-template.mjs";
export function buildDirectories(places, css, rootHtml, geo=null) {
 const base="/descubriendovenezuela/",domain="https://medinacaj.github.io",site=domain+base,out={};
 const h=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const slug=s=>String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
 const url=p=>base+p, area=p=>[p.locality,p.region,"Venezuela"].filter(Boolean).join(" · ");
 const regionNames=[...new Set(places.map(p=>p.region).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"es"));
 const visualFor=createVisualResolver(places);
 const extraCss=`[hidden]{display:none!important}.permalinks{background:#f3f8fa;padding:40px 5.5%}.permalinks ul{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;padding:0;list-style:none}.permalinks a{color:#0058ba;text-decoration:underline}.page-width{max-width:1200px;margin:auto}.directory-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.directory-grid .place-card{min-width:0}.source-box{background:#f0f5f2;border-left:4px solid #2f8064;padding:16px;margin:22px 0;line-height:1.7}.sources li{margin:9px 0}.source-box a,.sources a{color:#0058ba;text-decoration:underline}.contact-note{background:#f3f8fa;padding:18px;margin:20px 0} :focus-visible{outline:3px solid #e1b13c;outline-offset:3px}@media(max-width:840px){.permalinks ul,.directory-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:620px){.permalinks ul,.directory-grid{grid-template-columns:1fr}}`;
 const style=css.replace(/^@import[^;]+;/gm,"")+extraCss;
 out["docs/base.css"]=style;
 const card=p=>{
 const media=visualFor(p).asset;
 const kind=media?.kind||"pending";
 const categorySymbol={"Naturaleza":"◇","Cultura":"✳","Hospedaje":"⌂","Gastronomía":"◉","Negocios y servicios":"⌘","Localidades":"⌖"}[p.category]||"◇";
 const picture=media
   ?`<div class="card-photo" data-kind="${h(kind)}" data-image-scope="propia"><img src="${url(media.src)}" alt="${h(media.alt)}" loading="lazy" decoding="async" width="900" height="600"><span class="card-photo__badge">${media.kind==="map"?"MAPA DOCUMENTAL":"FOTO DEL LUGAR"}</span></div>`
   :`<div class="card-photo card-photo--pending" data-kind="pending" data-image-scope="pendiente" role="img" aria-label="Fotografía de ${h(p.name)} pendiente de documentación"><span class="card-photo__decor" aria-hidden="true">${categorySymbol}</span><span class="card-photo__placeholder-name">${h(p.category)}</span><span class="card-photo__placeholder-label">Fotografía pendiente</span></div>`;
 const caption=media
   ?`<div class="card-credit">${media.kind==="map"?"Cartografía documental":"Fotografía auténtica"} · <a href="${h(media.sourceUrl)}" target="_blank" rel="noopener noreferrer">${h(media.author)}</a> · <a href="${h(media.licenseUrl)}" target="_blank" rel="noopener noreferrer">${h(media.license)}</a></div>`
   :`<div class="card-credit card-credit--pending">Sin imagen propia · <a href="${url("contribuir/")}">Aportar una fuente ↗</a></div>`;
 return `<article class="place-card" data-name="${h(p.name)}" data-description="${h(p.description)}" data-category="${h(p.category)}" data-region="${h(p.region||"")}"><a class="card-main" href="${url("lugares/"+p.id+"/")}">${picture}<div class="card-body"><div class="card-meta"><span>${h(p.category)}</span><b>DOCUMENTADO</b></div><h3>${h(p.name)}</h3><p class="location">${h(area(p))}</p><p class="card-description">${h(p.description)}</p><div class="card-bottom">Ver ficha y fuentes ↗</div></div></a>${caption}</article>`;
 };
 const shell=(title,desc,path,body,{noindex=false,structured=null,socialImage=null}={})=>{
  const imageSocial=socialImage&&/^media\/foto-[a-z0-9-]+\.webp$/.test(socialImage)?`<meta property="og:image" content="${h(site+socialImage)}"><meta name="twitter:image" content="${h(site+socialImage)}">`:"";
  const canonical=site+path,jsonld=structured?`<script type="application/ld+json">${JSON.stringify(structured).replace(/</g,"\\u003c")}</script>`:"";
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${h(desc)}"><meta name="robots" content="${noindex?"noindex,follow":"index,follow"}"><meta name="theme-color" content="#fff8f1"><meta name="referrer" content="strict-origin-when-cross-origin"><meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; worker-src 'self'; manifest-src 'self'; form-action 'self'"><link rel="canonical" href="${h(canonical)}"><link rel="manifest" href="${base}manifest.webmanifest"><link rel="icon" href="${base}icon.svg" type="image/svg+xml"><meta property="og:locale" content="es_VE"><meta property="og:title" content="${h(title)}"><meta property="og:description" content="${h(desc)}"><meta property="og:url" content="${h(canonical)}"><meta property="og:site_name" content="Venezuela en el Mapa"><meta name="twitter:card" content="${imageSocial?'summary_large_image':'summary'}">${imageSocial}<title>${h(title)} | Venezuela en el Mapa</title><link rel="stylesheet" href="${base}base.css"><link rel="stylesheet" href="${base}layout-balance.css"><link rel="stylesheet" href="${base}states.css">${jsonld}</head><body><a class="skip" href="#contenido">Saltar al contenido</a><div class="demo-bar">CATÁLOGO DOCUMENTAL · Información con fuentes · En crecimiento</div><header><a class="brand" href="${base}"><span class="brand-mark">V<span>•</span></span><span>Venezuela<small>EN EL MAPA</small></span></a><nav aria-label="Principal"><a href="${url("estados/")}">Estados</a><a href="${url("mapa/")}">Mapa</a><a href="${url("posadas/")}">Posadas</a><a href="${url("explorar/")}">Explorar</a></nav><a class="nav-cta" href="${url("contribuir/")}">Proponer un lugar ↗</a></header><main id="contenido">${body}</main><footer><a class="footer-brand" href="${base}">Venezuela en el Mapa<span>Un país, miles de historias.</span></a><p>Este directorio no confirma apertura, disponibilidad, horarios, seguridad ni tarifas actuales.</p><div><a href="${url("politica-editorial/")}">Política editorial</a><a href="${url("privacidad/")}">Privacidad</a><a href="${url("posadas/")}">Posadas y familias</a><a href="${url("contribuir/")}">Aportar o corregir</a></div><small>© ${new Date().getFullYear()} Venezuela en el Mapa · Sin anuncios ni reservas activas</small></footer><script>if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("${base}sw.js",{scope:"${base}"}).catch(()=>{}))</script></body></html>`;
 };
 const permanent=`<section class="permalinks"><h2>Fichas con enlace permanente</h2><p>Consulta datos documentados, fuentes y límites de verificación.</p><ul>${places.map(p=>`<li><a href="${url("lugares/"+p.id+"/")}">${h(p.name)}</a></li>`).join("")}</ul><h3>Explorar por región</h3><ul>${regionNames.map(r=>`<li><a href="${url("regiones/"+slug(r)+"/")}">${h(r)}</a></li>`).join("")}</ul><a href="${url("contribuir/")}">Proponer o corregir un lugar ↗</a></section>`;


 const heroStart=rootHtml.indexOf('<section class="cinematic-hero"');
 const heroEnd=rootHtml.indexOf("</section>",heroStart);
 if (heroStart<0 || heroEnd<0) throw Error("Portada cinematográfica no definida");
 const hero=rootHtml.slice(heroStart,heroEnd+10)
   .replaceAll('href="/','href="'+base)
   .replaceAll('src="/','src="'+base);
 const regionViews=buildRegionViews(places,{url,h,slug,card,shell,site,visualFor});
 if(geo)out["docs/mapa/index.html"]=buildStateMap(places,geo,{url,h,slug,shell});
 const home=hero+regionViews.homeSections+`<section class="section page-width territory-map-promo"><span class="eyebrow">DESCUBRE TU PRÓXIMO DESTINO</span><h2>Un país, 25 territorios para explorar</h2><p>Encuentra destinos reales por estado usando un mapa geográfico de referencia, sin inventar rutas ni accesos.</p><a class="button" href="${url("mapa/")}">Abrir mapa por estados ↗</a></section>`;
 out["docs/index.html"]=shell("Descubre Venezuela","Explora los destinos documentados por estado y Distrito Capital, con fichas, fuentes y fotografías acreditadas.","",home,{structured:{"@context":"https://schema.org","@type":"WebSite","name":"Venezuela en el Mapa","url":site,"inLanguage":"es"},socialImage:places.find(p=>p.id==="cayo-sombrero")?.photos.find(p=>p.kind==="photograph")?.src});
 out["docs/index.html"]=out["docs/index.html"].replace(`<link rel="stylesheet" href="${base}states.css">`,`<link rel="stylesheet" href="${base}states.css"><link rel="stylesheet" href="${base}cinematic-hero.css">`);

 const localPosadasIds=[
  "los-ranchos-de-chano","posada-casa-sol-merida","posada-rafaela-y-cristobal",
  "posada-los-cocos-morrocoy","posada-la-ardilena","posada-playa-colorada",
  "posada-neneko-mochima","posada-los-siete-delfines",
  "posada-la-guarandinga","posada-el-portal-de-los-suenos",
  "posada-sol-luna-y-estrellas","estancia-altos-de-veracruz",
  "finca-la-floresta-caripe","posada-paraiso-guisela",
  "posada-casa-el-pozo","posada-la-fuente-margarita"
 ];
 const familyVisitsIds=[
  "museo-de-los-ninos-caracas","parque-la-venezuela-de-antier",
  "parque-la-montana-de-los-suenos","pueblo-museo-los-aleros"
 ];
 const localPosadas=localPosadasIds.map(id=>places.find(p=>p.id===id)).filter(Boolean);
 const familyVisits=familyVisitsIds.map(id=>places.find(p=>p.id===id)).filter(Boolean);
 const familyGuide=`<section class="section page-width family-guide" aria-labelledby="family-title">
   <nav class="breadcrumbs" aria-label="Ruta de navegación"><a href="${url("")}">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">Posadas y planes familiares</span></nav>
   <div class="family-guide__intro"><span class="eyebrow">VIAJAR CON CALMA, CONOCER DESDE CERCA</span>
     <h1 id="family-title">Posadas y planes para compartir</h1>
     <p>Descubre proyectos de alojamiento local y paseos culturales de Venezuela. Este directorio reúne referencias verificables de existencia, no recomendaciones personales ni certificaciones de servicio. Antes de viajar consulta directamente condiciones actuales, edad admitida, horarios, accesibilidad, permisos y disponibilidad.</p>
     <div class="family-guide__actions"><a class="button" href="${url("explorar/")}?category=Hospedaje">Explorar todos los hospedajes ↗</a>
       <a class="text-link" href="${url("estados/")}">Buscar por estado ↗</a></div>
   </div>
   <div class="section-head"><div><span class="eyebrow">PERSONAS, PUEBLOS Y PAISAJES</span>
     <h2>Posadas con identidad local</h2></div><p>${localPosadas.length} alojamientos documentados en esta selección</p></div>
   <p class="catalog-note">Las fuentes identifican los establecimientos; no prueban que operen hoy. Ninguna ficha incluye reservas ni precios sin comprobación. No mostramos imágenes de otros destinos como si fueran propias del establecimiento.</p>
   <div class="directory-grid family-guide__grid">${localPosadas.map(card).join("")}</div>
   <div class="section-head family-guide__secondary"><div><span class="eyebrow">CULTURA PARA TODAS LAS GENERACIONES</span>
     <h2>Ideas para salir en familia</h2></div></div>
   <p class="catalog-note">Museos y parques con valor cultural documentado; confirmar programación, actividades adecuadas para cada edad y condiciones antes de desplazarte.</p>
   <div class="directory-grid">${familyVisits.map(card).join("")}</div>
   <div class="source-box"><b>Sobre la selección:</b> las descripciones son propias y proceden de fuentes consultables. No existe relación comercial, afiliación ni uso de la marca de una guía ajena. Para corregir datos o proponer una posada, <a href="${url("contribuir/")}">envía una propuesta documentada</a>.</div>
 </section>`;
 out["docs/posadas/index.html"]=shell("Posadas y planes para compartir","Explora alojamientos locales y actividades culturales familiares de Venezuela con fuentes documentales, sin reservas ni disponibilidad asumida.","posadas/",familyGuide,{
   structured:{"@context":"https://schema.org","@type":"CollectionPage","name":"Posadas y planes familiares de Venezuela","url":site+"posadas/","mainEntity":{"@type":"ItemList","numberOfItems":localPosadas.length+familyVisits.length,"itemListElement":[...localPosadas,...familyVisits].map((p,i)=>({"@type":"ListItem","position":i+1,"name":p.name,"url":site+"lugares/"+p.id+"/"}))}}
 });

 const filters=renderExplorer({places,card,url,h,regionNames,experiencesFor,experienceOptions});
 out["docs/explorar/index.html"]=shell("Explorar Venezuela","Buscar lugares documentados de Venezuela por nombre, categoría y región.","explorar/",filters);
 for(const p of places){
  const body=renderDetailedPlace(p,{h,url,slug,area,visualFor});
  const structured={"@context":"https://schema.org","@type":p.category==="Localidades"?"City":"Place","name":p.name,"url":site+"lugares/"+p.id+"/","description":p.description,"containedInPlace":{"@type":"Country","name":"Venezuela"}};
  const related=places.filter(x=>x.region===p.region&&x.id!==p.id).sort((a,b)=>(a.category==="Localidades"?1:0)-(b.category==="Localidades"?1:0)).slice(0,3);
  const relatedContent=related.length?'<section class="section page-width related-places" aria-labelledby="related-title"><div class="section-head"><div><span class="eyebrow">CONTINÚA EXPLORANDO</span><h2 id="related-title">Más lugares en '+h(p.region)+'</h2></div><a class="text-link" href="'+url("regiones/"+slug(p.region)+"/")+'">Ver ficha del estado ↗</a></div><div class="directory-grid">'+related.map(card).join("")+'</div></section>':'<section class="section page-width related-places"><a class="text-link" href="'+url("regiones/"+slug(p.region)+"/")+'">← Ver ficha de '+h(p.region)+'</a></section>';
  out[`docs/lugares/${p.id}/index.html`]=shell(p.name,p.description.slice(0,150),`lugares/${p.id}/`,body+relatedContent,{structured,socialImage:p.photos.find(a=>a.kind==="photograph")?.src});
 }
 out["docs/estados/index.html"]=regionViews.statesIndex;
 Object.assign(out,regionViews.regionPages);
 const policy=`<article class="section prose page-width"><h1>Política editorial</h1><p>Publicamos hechos documentales con fuente, fecha y alcance de revisión. La presencia de una ficha no confirma que el lugar esté abierto, sea seguro, tenga servicios operativos o acepte reservas.</p><p>No inventamos horarios, contactos, tarifas, fotografías ni reseñas. Las imágenes exigen autoría, procedencia y licencia compatible o permiso explícito. Se distinguen mapas, ilustraciones y fotografías.</p><p>Las propuestas ciudadanas se moderan antes de publicarse. No incorporamos datos privados, coordenadas de lugares protegidos ni contactos comerciales sin legitimidad y consentimiento. Las solicitudes fundadas de corrección o retirada se pueden presentar por el canal comunitario.</p><p>Sin anuncios, reseñas, pagos ni patrocinios activos. Si se incorporan, las relaciones comerciales se identificarán claramente y no alterarán silenciosamente el orden editorial.</p><p><a href="https://github.com/medinacaj/descubriendovenezuela/blob/main/content/RESEARCH.md" target="_blank" rel="noopener noreferrer">Registro de fuentes, derechos y limitaciones</a>.</p></article>`;
 out["docs/politica-editorial/index.html"]=shell("Política editorial","Cómo documentamos fuentes, permisos de imágenes y límites de verificación.","politica-editorial/",policy);
 const privacy=`<article class="section prose page-width"><h1>Privacidad</h1><p>Esta versión estática no usa cuentas, publicidad, analítica propia ni acceso a la geolocalización. Las búsquedas se procesan en el navegador. Los destinos guardados, las jornadas elegidas y las comprobaciones personales de preparación se almacenan en este dispositivo mediante almacenamiento local del navegador. Estas marcas no son verificaciones realizadas por la plataforma. No se envían a una cuenta ni se sincronizan. Puedes borrarlos eliminando los datos del sitio desde el navegador.</p><p>GitHub Pages puede registrar datos técnicos necesarios para prestar el alojamiento conforme a sus propias políticas. Los enlaces externos redirigen a servicios ajenos.</p><p>Una caché técnica mediante service worker puede almacenar páginas públicas visitadas. Puedes retirar esos datos desde el navegador.</p><p>Las propuestas de lugares se realizan en GitHub Issues, donde son públicas. No compartas documentos de identidad, teléfonos privados, domicilios ni coordenadas sensibles. No disponemos todavía de un formulario privado de registro ni de un sistema de eliminación de cuentas.</p><p>Antes de activar cuentas, formularios directos o analítica se publicará una política completa de datos y un canal responsable de derechos.</p></article>`;
 out["docs/privacidad/index.html"]=shell("Privacidad","Tratamiento de datos y límites de esta guía estática.","privacidad/",privacy);
 const contribute=`<section class="section prose page-width"><h1>Proponer o corregir un lugar</h1><p>Este catálogo está abierto a aportaciones documentadas sobre destinos, pueblos, posadas y servicios reales. Todas las solicitudes deben revisarse antes de aparecer en la guía.</p><div class="contact-note"><b>Canal disponible:</b> GitHub Issues. Necesitas una cuenta de GitHub; no hay todavía formulario anónimo ni registro automático de negocios.</div><p><a class="button" href="https://github.com/medinacaj/descubriendovenezuela/issues/new/choose" target="_blank" rel="noopener noreferrer">Enviar propuesta o corrección ↗</a></p><h2>Qué datos ayudan</h2><ul class="sources"><li>Nombre oficial o comercial y categoría</li><li>Estado, municipio y localidad conocida</li><li>Fuente pública o evidencia que puedas compartir legítimamente</li><li>Qué dato requiere incorporación, actualización o retirada</li><li>Fotografías únicamente con licencia o permiso del titular</li></ul><p>No compartas datos privados ni materiales protegidos sin autorización. Las contribuciones no son verificaciones automáticas.</p></section>`;
 out["docs/contribuir/index.html"]=shell("Aportar al directorio","Enviar propuestas y correcciones sobre lugares y negocios de Venezuela.","contribuir/",contribute);
 const last=places.map(p=>p.reviewedAt).sort().at(-1);
 out["docs/robots.txt"]="User-agent: *\\nAllow: /descubriendovenezuela/\\nDisallow: /descubriendovenezuela/404.html\\nSitemap: https://medinacaj.github.io/descubriendovenezuela/sitemap.xml\\n";
 out["docs/sitemap.xml"]=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${["","estados/","mapa/","explorar/","posadas/","politica-editorial/","contribuir/",...regionViews.indexableRegionPaths,...places.map(p=>"lugares/"+p.id+"/")].map(s=>`<url><loc>${site+s}</loc><lastmod>${last}</lastmod></url>`).join("\n")}\n</urlset>\n`;
 out["docs/icon.svg"]=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" rx="32" fill="#183f35"/><text x="96" y="131" text-anchor="middle" font-family="Georgia,serif" font-size="128" fill="#fff6d6">V</text><circle cx="148" cy="49" r="13" fill="#f2c344"/></svg>`;
 out["docs/manifest.webmanifest"]=JSON.stringify({name:"Venezuela en el Mapa",short_name:"Venezuela",lang:"es-VE",start_url:base,scope:base,display:"standalone",background_color:"#f9faf7",theme_color:"#183f35",icons:[{src:base+"icon.svg",sizes:"any",type:"image/svg+xml"}]},null,2);

 out["docs/404.html"]=shell("Página no encontrada","Este lugar o página no se encontró.","404.html",`<section class="section"><h1>Página no encontrada</h1><a href="${base}">Volver al inicio</a></section>`,{noindex:true});
 // Extraer a /js/ el JavaScript propio; JSON-LD es datos, no JavaScript ejecutable.
 const embeddedScripts=new Map();
 const jsHash=s=>{let v=2166136261;for(const char of s)v=Math.imul(v^char.charCodeAt(0),16777619);return(v>>>0).toString(36)};
 for(const [path,markup] of Object.entries(out)){
  if(!path.endsWith(".html"))continue;
  let next=markup.replace(/<script>([\s\S]*?)<\/script>/g,(_,code)=>{
    const name="script-"+jsHash(code)+"-"+code.length+".js";
    embeddedScripts.set(name,code);
    return '<script src="'+url("js/"+name)+'" defer></script>';
  });
  next=next.replace(/<img\b[^>]*src="\/descubriendovenezuela\/media\/foto-([a-z0-9-]+)\.webp"[^>]*>/g,(tag,id)=>{
    if(tag.includes(" srcset="))return tag;
    const prefix=url("media/foto-"+id);
    const sizes=tag.includes('width="1200"')?"(max-width: 700px) 100vw, (max-width: 1200px) 80vw, 1200px":"(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw";
    return tag.slice(0,-1)+' srcset="'+prefix+'-480.webp 480w, '+prefix+'-800.webp 800w, '+prefix+'.webp 1200w" sizes="'+sizes+'">';
  });
  out[path]=next;
 }
 for(const [name,code] of embeddedScripts)out["docs/js/"+name]=code;
 const jsForCache=[...embeddedScripts.keys()].map(name=>'BASE+"js/'+name+'"').join(",");
 const stable=v=>v===null||typeof v!=="object"?JSON.stringify(v):Array.isArray(v)?"["+v.map(stable).join(",")+"]":"{"+Object.keys(v).sort().map(k=>JSON.stringify(k)+":"+stable(v[k])).join(",")+"}";
 let key=2166136261;for(const x of stable(places)+out["docs/index.html"]+out["docs/estados/index.html"])key=Math.imul(key^x.charCodeAt(0),16777619);
 out["docs/sw.js"]=`const BASE="${base}",CACHE="vzla-${(key>>>0).toString(16)}";const SHELL=[BASE,BASE+"estados/",BASE+"mapa/",BASE+"explorar/",BASE+"posadas/",BASE+"icon.svg",BASE+"base.css",BASE+"layout-balance.css",BASE+"states.css",BASE+"cinematic-hero.css",BASE+"js/cinematic-hero.js",${jsForCache}];self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("vzla-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));self.addEventListener("fetch",e=>{const r=e.request,u=new URL(r.url);if(r.method!=="GET"||u.origin!==self.location.origin||!u.pathname.startsWith(BASE))return;e.respondWith(fetch(r).then(res=>{if(res.ok){const copy=res.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(r,copy)))}return res}).catch(async()=>{const hit=await caches.match(r);if(hit)return hit;if(r.mode==="navigate")return(await caches.match(BASE))||Response.error();return Response.error()}))});`;

 return out;
}
