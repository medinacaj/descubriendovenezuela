/* Noticias y creadores comparten fotografías reales, con licencia y contexto verificado. */
const h = value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const dateLabel = value=>{const [year,month,day]=value.split("-").map(Number);return day+" "+["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"][month-1]+" "+year;};
function visual(item,kind){
 const prefix=kind==="news"?"editorial-news":"editorial-creators";
 const img=item.image;
 return `<figure class="${prefix}__visual"><div class="${prefix==="editorial-news"?"editorial-news__art":"editorial-creators__portrait"}">
    <img src="/descubriendovenezuela/${h(img.src)}" alt="${h(img.alt)}" loading="lazy" decoding="async" width="900" height="600">
    <span class="editorial-image__tag">${kind==="news"?"IMAGEN DE CONTEXTO":"DESTINO ILUSTRATIVO"}</span>
    </div><figcaption class="editorial-image__credit">${h(img.caption)} · Foto: <a href="${h(img.sourceUrl)}" target="_blank" rel="noopener noreferrer">${h(img.author)}</a> · <a href="${h(img.licenseUrl)}" target="_blank" rel="noopener noreferrer">${h(img.license)}</a> · Encuadre adaptado</figcaption></figure>`;
}
export function renderEditorialHighlights(data){
 const news=data.news.map(n=>`<article class="editorial-news__card">
    ${visual(n,"news")}
    <div class="editorial-news__body">
      <p class="editorial-news__meta"><time datetime="${h(n.date)}">${h(dateLabel(n.date))}</time><span>· ${h(n.source)}</span></p>
      <h3>${h(n.title)}</h3><p>${h(n.summary)}</p>
      <a href="${h(n.url)}" target="_blank" rel="noopener noreferrer" aria-label="Leer noticia original: ${h(n.title)}">Leer fuente original <span aria-hidden="true">↗</span></a>
    </div></article>`).join("");
 const creators=data.creators.map(c=>`<article class="editorial-creators__card">
    ${visual(c,"creators")}
    <div class="editorial-creators__body"><small>${h(c.tag)}</small><h3>${h(c.name)}</h3>
      <p class="editorial-creators__handle">${h(c.handle)}</p><p>${h(c.focus)}</p>
      <a href="${h(c.url)}" target="_blank" rel="noopener noreferrer" aria-label="Visitar perfil externo de ${h(c.name)}">Ver perfil público <span aria-hidden="true">↗</span></a>
    </div></article>`).join("");
 return `<div class="editorial-highlights">
  <section class="editorial-news section page-width" id="noticias" aria-labelledby="editorial-news-title">
    <div class="section-head editorial-highlight-head"><div><span class="eyebrow">ACTUALIDAD QUE INVITA A EXPLORAR</span>
    <h2 id="editorial-news-title">Noticias de nuestra Venezuela.</h2></div><p>Turismo, cultura y comunidades, con fuentes y fecha de publicación.</p></div>
    <div class="editorial-news__grid">${news}</div>
    <p class="editorial-highlights__note">Selección editorial revisada el ${h(dateLabel(data.reviewedOn))}. Las fotos son ilustrativas y no documentan los eventos citados. Noticias enlazadas a sus fuentes; no hay actualización automática.</p>
  </section>
  <section class="editorial-creators section page-width" id="creadores" aria-labelledby="editorial-creators-title">
    <div class="section-head editorial-highlight-head"><div><span class="eyebrow">VOCES QUE NOS HACEN VIAJAR</span>
    <h2 id="editorial-creators-title">Venezuela a través de sus creadores.</h2></div>
      <div class="editorial-creators__controls" aria-label="Controles del carrusel">
        <button type="button" data-creators-prev disabled aria-label="Creadores anteriores">←</button>
        <span data-creators-counter aria-live="polite" aria-atomic="true">1 / ${data.creators.length}</span>
        <button type="button" data-creators-next aria-label="Siguientes creadores">→</button>
      </div>
    </div>
    <div class="editorial-creators__track" data-creators-track aria-label="Perfiles de creadores de viajes" tabindex="0">${creators}</div>
    <p class="editorial-highlights__note">Selección independiente de perfiles públicos. No implica colaboración, respaldo ni afiliación. Las imágenes ilustran destinos y no son retratos de las personas mencionadas. Fotografías con fuente y licencia, sin reutilizar contenido ajeno no autorizado.</p>
  </section></div>`;
}
