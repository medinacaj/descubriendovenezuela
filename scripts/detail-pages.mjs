export function renderDetailedPlace(p,{h,url,slug,area}){
  const media=Array.isArray(p.photos)?p.photos:[];
  const lead=media.find(m=>m.kind==="photograph")||media[0];
  const secondary=media.filter(m=>m!==lead);
  const photoCopy=lead?.kind==="photograph"?"Fotografía real del lugar":"Cartografía de referencia";
  const hero=lead?`<figure class="place-cover place-cover--${lead.kind==="map"?"map":"photo"}">
    <img src="${url(lead.src)}" alt="${h(lead.alt)}" decoding="async" fetchpriority="high" width="1200" height="800">
    <figcaption><b>${photoCopy}:</b> ${h(lead.author)} · <a href="${h(lead.licenseUrl)}" target="_blank" rel="noopener noreferrer">${h(lead.license)}</a> · <a href="${h(lead.sourceUrl)}" target="_blank" rel="noopener noreferrer">Ver archivo original</a>${lead.changes?`<small>${h(lead.changes)}</small>`:""}</figcaption>
  </figure>`:`<div class="place-cover place-cover--pending" role="note"><div><span aria-hidden="true">◎</span><h2>Fotografía pendiente</h2><p>No publicamos imágenes sin procedencia y licencia verificadas. Puedes consultar el lugar a través de las fuentes.</p></div></div>`;
  const gallery=secondary.length?`<section class="place-secondary-gallery"><h2>Más imágenes y referencias gráficas</h2><div class="place-secondary-gallery__grid">${secondary.map(m=>`<figure><img src="${url(m.src)}" alt="${h(m.alt)}" loading="lazy" decoding="async" width="900" height="600"><figcaption>${m.kind==="map"?"Cartografía":"Fotografía"} · ${h(m.author)} · <a href="${h(m.licenseUrl)}" target="_blank" rel="noopener noreferrer">${h(m.license)}</a> · <a href="${h(m.sourceUrl)}" target="_blank" rel="noopener noreferrer">Fuente</a></figcaption></figure>`).join("")}</div></section>`:"";
  const sources=p.sourceUrls.map((u,i)=>`<li><a href="${h(u)}" target="_blank" rel="noopener noreferrer">${h(p.sourceLabels?.[i]||"Fuente documental "+(i+1))}</a></li>`).join("");
  const locality=p.locality?`<span class="place-intro__locality">Localidad: ${h(p.locality)}</span>`:"";
  const firstSentence=p.description.split(". ")[0].slice(0,250);
  const summary=firstSentence+(p.description.length>firstSentence.length?".":"");
  return `<article class="section page-width detail place-detail">
    <nav class="breadcrumbs" aria-label="Ruta de navegación"><a href="${url("")}">Inicio</a><span aria-hidden="true">/</span><a href="${url("estados/")}">Estados</a><span aria-hidden="true">/</span><a href="${url("regiones/"+slug(p.region)+"/")}">${h(p.region)}</a><span aria-hidden="true">/</span><span aria-current="page">${h(p.name)}</span></nav>
    <div class="place-intro"><span class="eyebrow">${h(p.category)} · ${h(p.region)}</span>
      <h1>${h(p.name)}</h1>
      <p class="place-intro__summary">${h(summary)}</p>
      <div class="place-intro__meta"><span>Ficha documental con fuentes</span><span>Revisada: ${h(p.reviewedAt)}</span>${locality}</div>
    </div>
    ${hero}
    <div class="place-info-grid">
      <div class="place-story"><div class="place-section-heading"><span class="eyebrow">CONOCE ESTE LUGAR</span><h2>Sobre ${h(p.name)}</h2></div>
        <p class="description">${h(p.description)}</p>
        ${gallery}
        <section class="place-documentation" aria-labelledby="documentation-title"><h2 id="documentation-title">¿Qué información se comprobó?</h2>
          <p>${h(p.verification)}</p>
          <p class="place-evidence-note">La identificación del destino y la documentación de sus características no equivalen a una visita de campo ni a la confirmación de servicios actuales.</p>
        </section>
        <section class="place-visit" aria-labelledby="visit-title"><h2 id="visit-title">Antes de planificar una visita</h2>
          <dl><div><dt>Acceso y permisos</dt><dd>Confirmar con la administración o las autoridades correspondientes.</dd></div>
          <div><dt>Horarios y servicios</dt><dd>Sin verificación operativa actual.</dd></div>
          <div><dt>Tarifas</dt><dd>Consultar precio directamente con una fuente responsable; no hay tarifa vigente verificada.</dd></div></dl>
        </section>
        <p class="place-contribute"><a href="${url("contribuir/")}">¿Tienes una corrección o información verificable? Proponer actualización ↗</a></p>
      </div>
      <aside class="place-facts" aria-labelledby="facts-title"><span class="eyebrow">DATOS DOCUMENTADOS</span><h2 id="facts-title">Información del lugar</h2>
        <dl><div><dt>Territorio</dt><dd><a href="${url("regiones/"+slug(p.region)+"/")}">${h(p.region)} ↗</a></dd></div>
          <div><dt>Tipo de lugar</dt><dd>${h(p.category)}</dd></div>
          ${p.locality?`<div><dt>Localidad</dt><dd>${h(p.locality)}</dd></div>`:""}
          <div><dt>Última revisión documental</dt><dd><time datetime="${h(p.reviewedAt)}">${h(p.reviewedAt)}</time></dd></div>
          <div><dt>Imagen del lugar</dt><dd>${lead?.kind==="photograph"?"Fotografía real con licencia":lead?.kind==="map"?"Mapa de referencia identificado":"Sin fotografía autorizada"}</dd></div>
          ${p.inscriptionYear?`<div><dt>Año de inscripción patrimonial</dt><dd>${h(p.inscriptionYear)}</dd></div>`:""}
        </dl>
        <h3>Fuentes utilizadas</h3><ul class="sources">${sources}</ul>
        ${p.primaryUrl?`<a class="place-facts__primary" href="${h(p.primaryUrl)}" target="_blank" rel="noopener noreferrer">${p.primaryConsulted?"Consultar fuente principal ↗":"Abrir referencia institucional ↗"}</a>`:""}
        <small>La ficha no garantiza disponibilidad, seguridad, horarios ni autorización de acceso.</small>
      </aside>
    </div>
  </article>`;
}
