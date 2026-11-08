/* Misma selección editorial para GitHub Pages, sin copiar imágenes de terceros. */
const h = value => String(value).replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[char]);
const dateLabel = value => {
  const [year, month, day] = value.split("-").map(Number);
  return day + " " + ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"][month - 1] + " " + year;
};

export function renderEditorialHighlights(data) {
  const news = data.news.map((n, index) => `<article class="editorial-news__card">
    <div class="editorial-news__art" aria-hidden="true"><span>${String(index+1).padStart(2,"0")}</span><small>${h(n.category)}</small></div>
    <div class="editorial-news__body">
      <p class="editorial-news__meta"><time datetime="${h(n.date)}">${h(dateLabel(n.date))}</time><span>· ${h(n.source)}</span></p>
      <h3>${h(n.title)}</h3><p>${h(n.summary)}</p>
      <a href="${h(n.url)}" target="_blank" rel="noopener noreferrer" aria-label="Leer noticia original: ${h(n.title)}">Leer fuente original <span aria-hidden="true">↗</span></a>
    </div>
  </article>`).join("");
  const creators = data.creators.map((c, index) => `<article class="editorial-creators__card">
    <div class="editorial-creators__portrait editorial-creators__portrait--${index%4+1}" aria-hidden="true"><span>${h(c.initials)}</span></div>
    <div class="editorial-creators__body"><small>${h(c.tag)}</small><h3>${h(c.name)}</h3>
      <p class="editorial-creators__handle">${h(c.handle)}</p><p>${h(c.focus)}</p>
      <a href="${h(c.url)}" target="_blank" rel="noopener noreferrer" aria-label="Visitar perfil externo de ${h(c.name)}">Ver perfil público <span aria-hidden="true">↗</span></a>
    </div>
  </article>`).join("");
  return `<div class="editorial-highlights">
  <section class="editorial-news section page-width" id="noticias" aria-labelledby="editorial-news-title">
    <div class="section-head editorial-highlight-head"><div><span class="eyebrow">ACTUALIDAD QUE INVITA A EXPLORAR</span>
    <h2 id="editorial-news-title">Noticias de nuestra Venezuela.</h2></div><p>Turismo, cultura y comunidades, con fuentes y fecha de publicación.</p></div>
    <div class="editorial-news__grid">${news}</div>
    <p class="editorial-highlights__note">Selección editorial revisada el ${h(dateLabel(data.reviewedOn))}. Son noticias enlazadas a sus fuentes; no constituyen un servicio de actualización automática.</p>
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
    <p class="editorial-highlights__note">Selección independiente de perfiles públicos. No implica colaboración, respaldo ni afiliación. Las iniciales son elementos gráficos; no se reutilizan fotos ni videos ajenos.</p>
  </section></div>`;
}
