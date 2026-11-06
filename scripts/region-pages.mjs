export function buildRegionViews(places, {url,h,slug,card,shell,site}) {
  const names=[...new Set(places.map(p=>p.region).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"es"));
  const subset=r=>places.filter(p=>p.region===r);
  const primary=p=>p?.photos?.find(m=>m.kind==="photograph") || p?.photos?.find(m=>m.kind==="map") || null;
  const hasPhoto=p=>p?.photos?.some(m=>m.kind==="photograph")||false;
  const attractions=list=>list.filter(p=>p.category!=="Localidades");
  const localities=list=>list.filter(p=>p.category==="Localidades");
  const scoreIds=["parque-nacional-morrocoy","701","parque-nacional-mochima","parque-nacional-henri-pittier","parque-nacional-waraira-repano","cueva-del-guacharo","parque-francisco-de-miranda","morros-de-san-juan"];
  const mainPlace=list=>{
    const items=attractions(list),towns=localities(list);
    return scoreIds.map(id=>items.find(p=>p.id===id)).find(Boolean)
      || items.find(hasPhoto) || towns.find(hasPhoto) || items[0] || towns[0];
  };
  const stateUrl=r=>url("regiones/"+slug(r)+"/");
  const summary=r=>{
    const p=subset(r), a=attractions(p), l=localities(p);
    return {name:r,places:p,sites:a,towns:l,featured:mainPlace(p)};
  };
  const imageForState=r=>{
    const p=subset(r), withPhoto=p.find(x=>x.category!=="Localidades"&&hasPhoto(x))
        || p.find(hasPhoto) || p.find(x=>primary(x));
    return p ? {p:withPhoto,photo:primary(withPhoto)} : {p:null,photo:null};
  };
  const mediaCredit=m=>m?`<a href="${h(m.sourceUrl)}" target="_blank" rel="noopener noreferrer">Original</a> · <a href="${h(m.licenseUrl)}" target="_blank" rel="noopener noreferrer">${h(m.license)}</a>`:"";
  const stateTile=r=>{
    const info=summary(r), cover=imageForState(r), asset=cover.photo;
    const kind=asset?.kind==="photograph"?"photo":asset?.kind==="map"?"map":"empty";
    const art=asset?`<img src="${url(asset.src)}" alt="${h(asset.alt)}" loading="lazy" decoding="async" width="900" height="600">`
      :`<span class="state-tile__absence">Sin fotografía verificada</span>`;
    return `<article class="state-tile state-tile--${kind}" data-state-name="${h(r)}">
      <a class="state-tile__main" href="${stateUrl(r)}" aria-label="Explorar ${h(r)}: ${info.sites.length} sitios, ${info.towns.length} localidades">
        <div class="state-tile__visual">${art}</div>
        <div class="state-tile__body"><span>${r==="Distrito Capital"?"DISTRITO CAPITAL":"ESTADO · VENEZUELA"}</span>
          <h3>${h(r)}</h3><p>${info.sites.length} ${info.sites.length===1?"atractivo":"atractivos"} · ${info.towns.length} ${info.towns.length===1?"localidad":"localidades"}</p><b>Descubrir sus lugares <span aria-hidden="true">↗</span></b>
        </div>
      </a>
      ${asset?`<div class="state-tile__credit">${asset.kind==="map"?"Mapa de":"Foto de"} ${h(cover.p.name)} · ${h(asset.author)} · ${mediaCredit(asset)}</div>`:""}
    </article>`;
  };
  const intro=`<p class="catalog-note">Una selección documental de lugares reales, organizada por estados y Distrito Capital. Las fichas no garantizan acceso ni servicios vigentes.</p>`;
  const homeRegions=["Falcón","Bolívar","Anzoátegui","Carabobo","Delta Amacuro","Lara","Zulia","Aragua"].filter(r=>names.includes(r));
  const spotlightIds=["isla-de-plata-mochima","parque-nacional-morrocoy","701","parque-nacional-san-esteban","parque-nacional-yacambu","relampago-del-catatumbo"];
  const spotlight=spotlightIds.map(id=>places.find(p=>p.id===id)).filter(p=>p && hasPhoto(p)).slice(0,6);
  const homeSections=`
    <section class="section page-width editorial-states" aria-labelledby="state-home-title">
      <div class="section-head"><div><span class="eyebrow">UN PAÍS, MUCHOS TERRITORIOS</span><h2 id="state-home-title">Descubre Venezuela por estado</h2></div>
      <a class="text-link" href="${url("estados/")}">Ver los ${names.length} territorios documentados ↗</a></div>
      ${intro}
      <div class="state-grid state-grid--home">${homeRegions.map(stateTile).join("")}</div>
      <p class="state-more-link"><a class="button" href="${url("estados/")}">Explorar todos los estados <span aria-hidden="true">↗</span></a></p>
    </section>
    <section class="section page-width editor-picks" aria-labelledby="spotlight-title">
      <div class="section-head"><div><span class="eyebrow">DESTINOS CON FUENTES E IMÁGENES REALES</span><h2 id="spotlight-title">Sitios que merecen conocerse</h2></div>
      <a class="text-link" href="${url("explorar/")}">Buscar entre los ${places.length} lugares ↗</a></div>
      <p class="catalog-note">Fotografías auténticas con atribución y fichas documentales. Son ejemplos del inventario, no recomendaciones de viaje ni comprobación de apertura.</p>
      <div class="directory-grid editorial-featured-grid">${spotlight.map(card).join("")}</div>
    </section>
    <section class="editorial-contribute" aria-labelledby="editorial-contribute-title">
      <div class="page-width"><span class="eyebrow">AYÚDANOS A DOCUMENTAR MEJOR</span><h2 id="editorial-contribute-title">Cada estado tiene más historias por descubrir.</h2>
      <p>También buscamos fotografías autorizadas e información comprobable de pueblos, pequeños negocios y atractivos locales.</p>
      <a class="button" href="${url("contribuir/")}">Proponer un lugar o corregir datos ↗</a></div>
    </section>`;
  const indexBody=`<section class="section page-width states-directory">
    <nav class="breadcrumbs" aria-label="Ruta de navegación"><a href="${url("")}">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">Estados y Distrito Capital</span></nav>
    <div class="states-heading"><span class="eyebrow">EXPLORA EL TERRITORIO</span><h1>Estados de Venezuela y Distrito Capital</h1>
      <p>Explora los ${names.length} territorios con registros documentados. Selecciona uno para ver sus atractivos principales y localidades por separado. Esta selección no equivale a la cobertura completa del país.</p>
      <div class="states-count"><strong>${names.length}</strong><span>territorios en el directorio</span><strong>${places.length}</strong><span>fichas con fuentes</span></div>
    </div>
    <div class="state-search"><label for="state-query">Buscar estado o Distrito Capital</label><input id="state-query" type="search" placeholder="Ej. Falcón, Monagas o Mérida…" autocomplete="off" maxlength="80"></div>
    <p class="catalog-note" id="state-count" role="status" aria-live="polite">${names.length} territorios documentados</p>
    <div class="state-grid" id="state-results">${names.map(stateTile).join("")}</div>
    <p id="state-empty" class="empty" hidden>No encontramos ese estado entre los territorios documentados.</p>
    <div class="source-box"><b>Cobertura en crecimiento:</b> no todos los estados cuentan todavía con fichas. Los lugares de conservación pueden requerir permisos especiales. Consulta siempre las fuentes y las condiciones actuales.</div>
  </section>
  <script>(function(){const input=document.getElementById("state-query"),tiles=[...document.querySelectorAll("#state-results .state-tile")],count=document.getElementById("state-count"),empty=document.getElementById("state-empty");const norm=s=>String(s||"").normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").toLowerCase();input.addEventListener("input",()=>{const q=norm(input.value.trim());let n=0;for(const tile of tiles){const match=norm(tile.dataset.stateName).includes(q);tile.hidden=!match;if(match)n++}count.textContent=n+(n===1?" territorio documentado":" territorios documentados");empty.hidden=n>0;});})();</script>`;
  const statesIndex=shell("Estados de Venezuela","Explora estados y Distrito Capital con fichas documentadas, fotografías acreditadas, atractivos y localidades.","estados/",indexBody,{structured:{"@context":"https://schema.org","@type":"CollectionPage","name":"Estados documentados de Venezuela","url":site+"estados/"}});
  const regionPages={};
  const indexableRegionPaths=[];
  for(const r of names) {
    const info=summary(r), featured=info.featured, otherSites=info.sites.filter(p=>p.id!==featured?.id),
      otherTowns=info.towns.filter(p=>p.id!==featured?.id), visual=primary(featured);
    const path="regiones/"+slug(r)+"/";
    const regionWord=r==="Distrito Capital"?"Distrito Capital":"Estado";
    const sentence=`${info.sites.length} ${info.sites.length===1?"sitio de interés":"sitios de interés"} y ${info.towns.length} ${info.towns.length===1?"localidad documentada":"localidades documentadas"}`;
    const introduction=info.sites.length
      ?`Explora una selección de ${info.sites.length} ${info.sites.length===1?"atractivo":"atractivos"} documentados en ${r}, con referencias a sus fuentes y a sus límites de verificación.`
      :`Por ahora disponemos de ${info.towns.length} ${info.towns.length===1?"localidad documentada":"localidades documentadas"} de ${r}. Los atractivos concretos de este territorio siguen pendientes de investigación.`;
    const img=visual
      ?`<figure class="state-feature__media ${visual.kind==="map"?"state-feature__media--map":""}"><img src="${url(visual.src)}" alt="${h(visual.alt)}" loading="lazy" decoding="async" width="1200" height="750"><figcaption>${visual.kind==="map"?"Cartografía":"Fotografía"} de ${h(featured.name)} · ${h(visual.author)} · ${mediaCredit(visual)}</figcaption></figure>`
      :`<div class="state-feature__media state-feature__media--empty" role="note"><span aria-hidden="true">◌</span><p>Fotografía del lugar pendiente de documentación</p></div>`;
    const featuredBlock=featured?`<section id="principal" class="state-main-spotlight" aria-labelledby="featured-state-title">
      <div class="section-head"><div><span class="eyebrow">LUGAR EN PRIMER PLANO</span><h2 id="featured-state-title">${featured.category==="Localidades"?"Localidad documentada":"Un sitio para descubrir"}</h2></div></div>
      <article class="state-feature" data-featured-id="${h(featured.id)}">
        ${img}
        <div class="state-feature__content"><span class="eyebrow">${h(featured.category)} · ${h(r)}</span><h3>${h(featured.name)}</h3><p>${h(featured.description)}</p>
          <p class="state-feature__source">Fuente documental: ${featured.primaryUrl?`<a href="${h(featured.primaryUrl)}" target="_blank" rel="noopener noreferrer">Consultar fuente oficial ↗</a>`:"Enlace en la ficha"}</p>
          <a class="button" href="${url("lugares/"+featured.id+"/")}">Conocer este lugar <span aria-hidden="true">↗</span></a>
        </div>
      </article>
    </section>`:"";
    const otherBlock=otherSites.length?`<section id="sitios" class="state-more-sites" aria-labelledby="other-state-title">
      <div class="section-head"><div><span class="eyebrow">NATURALEZA Y PATRIMONIO</span><h2 id="other-state-title">Otros sitios documentados</h2></div>
      <a class="text-link" href="${url("explorar/?region="+encodeURIComponent(r))}">Ver listado filtrado ↗</a></div>
      <div class="directory-grid">${otherSites.map(card).join("")}</div>
    </section>`:"";
    const townsBlock=otherTowns.length?`<section id="localidades" class="state-towns" aria-labelledby="state-towns-title">
      <div class="section-head"><div><span class="eyebrow">PUEBLOS Y CIUDADES</span><h2 id="state-towns-title">Localidades documentadas</h2></div></div>
      <p>No son establecimientos turísticos confirmados. Son referencias de localidad para seguir ampliando la guía.</p>
      <div class="state-town-list">${otherTowns.map(p=>`<a class="state-town" href="${url("lugares/"+p.id+"/")}"><span class="state-town__mark" aria-hidden="true">⌖</span><span><strong>${h(p.name)}</strong><small>${h(p.locality&&p.locality!==p.name?p.locality+", "+r:r)}</small></span><b aria-hidden="true">↗</b></a>`).join("")}</div>
    </section>`:"";
    const links=[featured?`<a href="#principal">En primer plano</a>`:"",otherSites.length?`<a href="#sitios">Otros sitios (${otherSites.length})</a>`:"",otherTowns.length?`<a href="#localidades">Localidades (${otherTowns.length})</a>`:""].filter(Boolean).join("");
    const body=`<section class="section page-width region-page">
      <nav class="breadcrumbs" aria-label="Ruta de navegación"><a href="${url("")}">Inicio</a><span aria-hidden="true">/</span><a href="${url("estados/")}">Estados</a><span aria-hidden="true">/</span><span aria-current="page">${h(r)}</span></nav>
      <header class="region-heading"><div><span class="eyebrow">${h(regionWord.toUpperCase())} · VENEZUELA</span><h1>${h(r)}</h1>
          <p>${h(introduction)}</p>
        </div>
        <div class="region-heading__facts"><strong>${info.sites.length}</strong><span>${info.sites.length===1?"sitio de interés":"sitios de interés"}</span>
          <strong>${info.towns.length}</strong><span>${info.towns.length===1?"localidad":"localidades"}</span></div>
      </header>
      <nav class="state-jump" aria-label="Secciones de ${h(r)}">${links}</nav>
      ${featuredBlock}${otherBlock}${townsBlock}
      <div class="region-disclaimer"><b>Información documental, no guía de acceso operativo.</b> ${h(sentence)} en esta selección. No se han comprobado apertura, transporte, tarifas ni condiciones de seguridad. <a href="${url("contribuir/")}">Proponer otro lugar o una corrección ↗</a></div>
      <div class="region-back"><a href="${url("estados/")}">← Explorar otros estados</a><a href="${url("explorar/?region="+encodeURIComponent(r))}">Ver todas las fichas de ${h(r)} ↗</a></div>
    </section>`;
    const desc=info.sites.length?`Descubre lugares de ${r}: ${info.sites.slice(0,3).map(p=>p.name).join(", ")}. Fichas y fotografías documentadas cuando existen.`:`Conoce las localidades documentadas de ${r}, Venezuela. Una guía con fuentes en crecimiento.`;
    const eligible=info.sites.length>0;
    regionPages["docs/"+path+"index.html"]=shell(`Descubre ${r}: lugares y atractivos`,desc,path,body,{socialImage:imageForState(r).photo?.kind==="photograph"?imageForState(r).photo.src:null,noindex:!eligible,structured:eligible?{"@context":"https://schema.org","@type":"CollectionPage","name":"Lugares de "+r,"url":site+path,"mainEntity":{"@type":"ItemList","numberOfItems":info.sites.length,"itemListElement":info.sites.map((p,i)=>({"@type":"ListItem","position":i+1,"name":p.name,"url":site+"lugares/"+p.id+"/"}))}}:null});
    if(eligible)indexableRegionPaths.push(path);
  }
  return {homeSections,statesIndex,regionPages,indexableRegionPaths,names};
}
