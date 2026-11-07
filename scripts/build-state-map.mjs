/** Navegación territorial SVG, sin rutas ni coordenadas falsas de destinos. */
export function buildStateMap(places,geo,{url,h,slug,shell}){
 if(!geo?.features?.length)throw Error("Cartografía territorial ausente");
 const mapNames=new Set(places.map(p=>p.region).filter(Boolean));
 const normalize=n=>n==="Vargas"?"La Guaira":n;
 const features=geo.features.filter(f=>mapNames.has(normalize(f.properties?.name)));
 if(features.length!==mapNames.size)throw Error("La cartografía y el catálogo territorial no coinciden: "+features.length+" de "+mapNames.size);
 const rings=geometry=>geometry.type==="Polygon"?geometry.coordinates:geometry.type==="MultiPolygon"?geometry.coordinates.flat(1):[];
 let minX=999,minY=999,maxX=-999,maxY=-999;
 for(const feature of features)for(const ring of rings(feature.geometry))for(const point of ring){
   minX=Math.min(minX,point[0]);maxX=Math.max(maxX,point[0]);
   minY=Math.min(minY,point[1]);maxY=Math.max(maxY,point[1]);
 }
 const width=930,height=625,pad=20;
 const dx=maxX-minX,dy=maxY-minY,scale=Math.min((width-2*pad)/dx,(height-2*pad)/dy);
 const ox=(width-dx*scale)/2,oy=(height-dy*scale)/2;
 const project=(x,y)=>[(ox+(x-minX)*scale).toFixed(1),(height-oy-(y-minY)*scale).toFixed(1)];
 const statePath=g=>rings(g).map(r=>{
   const parts=r.map(([x,y])=>project(x,y).join(","));
   return parts.length?"M"+parts.join("L")+"Z":"";
 }).join("");
 const territories=[...mapNames].sort((a,b)=>a.localeCompare(b,"es"));
 const counts=Object.fromEntries(territories.map(name=>[name,places.filter(p=>p.region===name).length]));
 const polygons=features.map(feature=>{
   const name=normalize(feature.properties.name);
   return '<a class="map-area" href="'+url("regiones/"+slug(name)+"/")+'" aria-label="Explorar '+h(name)+': '+counts[name]+' lugares documentados"><title>'+h(name)+'</title><path d="'+statePath(feature.geometry)+'" fill-rule="evenodd"></path></a>';
 }).join("");
 const list=territories.map(name=>'<a class="map-state-link" data-name="'+h(name)+'" href="'+url("regiones/"+slug(name)+"/")+'"><span>'+h(name)+'</span><small>'+counts[name]+' '+(counts[name]===1?"lugar":"lugares")+'</small></a>').join("");
 const body='<section class="section page-width territory-map"><nav class="breadcrumbs" aria-label="Ruta de navegación"><a href="'+url("")+'">Inicio</a><span aria-hidden="true">/</span><a href="'+url("estados/")+'">Estados</a><span aria-hidden="true">/</span>Mapa</nav><span class="eyebrow">TURISMO · ORGANIZACIÓN TERRITORIAL</span><h1>Mapa de Venezuela por estados</h1><p class="territory-map__intro">Selecciona un estado o territorio para explorar sus lugares documentados. Es un mapa territorial aproximado, no un mapa de rutas, accesos ni ubicaciones exactas de cada destino.</p><div class="territory-map__layout"><div class="territory-map__canvas"><svg viewBox="0 0 '+width+' '+height+'" xmlns="http://www.w3.org/2000/svg" aria-labelledby="vzMapTitle vzMapDesc"><title id="vzMapTitle">Mapa navegable de Venezuela</title><desc id="vzMapDesc">Veinticinco territorios representados. También puedes utilizar la lista accesible de enlaces por nombre.</desc>'+polygons+'</svg><p>Geometrías de referencia de Natural Earth. Delimitaciones aproximadas y no oficiales. <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer">Fuente cartográfica</a>.</p></div><aside class="territory-map__sidebar" aria-labelledby="mapTerritories"><h2 id="mapTerritories">Explorar territorios</h2><label for="mapQuery">Buscar territorio</label><input id="mapQuery" type="search" placeholder="Escribe un estado o territorio" autocomplete="off"><p id="mapCount" role="status" aria-live="polite">'+territories.length+' territorios</p><div id="mapTerritoryList">'+list+'</div><p id="mapEmpty" hidden>No hay territorios con ese nombre.</p></aside></div></section><script>(function(){const q=document.getElementById("mapQuery"),rows=[...document.querySelectorAll(".map-state-link")],count=document.getElementById("mapCount"),empty=document.getElementById("mapEmpty");const norm=s=>s.normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").toLowerCase();q.addEventListener("input",()=>{let n=0;for(const a of rows){const ok=norm(a.dataset.name).includes(norm(q.value.trim()));a.hidden=!ok;if(ok)n++}count.textContent=n+(n===1?" territorio":" territorios");empty.hidden=n!==0})})();</script>';
 return shell("Mapa por estados","Explora 25 estados y territorios de Venezuela mediante un mapa vectorial y enlaces accesibles.","mapa/",body,{structured:{"@context":"https://schema.org","@type":"CollectionPage","name":"Mapa por estados de Venezuela","url":"https://medinacaj.github.io/descubriendovenezuela/mapa/","inLanguage":"es"}});
}
