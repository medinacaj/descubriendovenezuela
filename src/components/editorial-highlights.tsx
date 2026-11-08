"use client";

import { useRef, useState } from "react";
import highlights from "../../content/editorial-highlights.json";

const dateLabel = (iso: string) =>
  new Intl.DateTimeFormat("es-VE", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(iso + "T12:00:00Z"));

export default function EditorialHighlights() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const moveTo = (next: number) => {
    const list = track.current;
    if (!list) return;
    const index = Math.max(0, Math.min(highlights.creators.length - 1, next));
    const first = list.firstElementChild as HTMLElement | null;
    const child = list.children.item(index) as HTMLElement | null;
    if (!first || !child) return;
    list.scrollTo({
      left: child.offsetLeft - first.offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
    setActive(index);
  };

  const sync = () => {
    const list = track.current;
    if (!list || !list.firstElementChild) return;
    const first = list.firstElementChild as HTMLElement;
    let nearest = 0;
    let distance = Infinity;
    Array.from(list.children).forEach((child, i) => {
      const delta = Math.abs((child as HTMLElement).offsetLeft - first.offsetLeft - list.scrollLeft);
      if (delta < distance) { distance = delta; nearest = i; }
    });
    setActive(nearest);
    setCanPrev(list.scrollLeft > 2);
    setCanNext(list.scrollLeft < list.scrollWidth - list.clientWidth - 2);
  };

  return (
    <div className="editorial-highlights">
      <section className="editorial-news section page-width" id="noticias" aria-labelledby="editorial-news-title">
        <div className="section-head editorial-highlight-head">
          <div>
            <span className="eyebrow">ACTUALIDAD QUE INVITA A EXPLORAR</span>
            <h2 id="editorial-news-title">Noticias de nuestra Venezuela.</h2>
          </div>
          <p>Turismo, cultura y comunidades, con fuentes y fecha de publicación.</p>
        </div>
        <div className="editorial-news__grid">
          {highlights.news.map((news, i) => (
            <article className="editorial-news__card" key={news.id}>
              <div className="editorial-news__art" aria-hidden="true">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <small>{news.category}</small>
              </div>
              <div className="editorial-news__body">
                <p className="editorial-news__meta"><time dateTime={news.date}>{dateLabel(news.date)}</time><span>· {news.source}</span></p>
                <h3>{news.title}</h3>
                <p>{news.summary}</p>
                <a href={news.url} target="_blank" rel="noopener noreferrer" aria-label={"Leer noticia original: " + news.title}>
                  Leer fuente original <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
        <p className="editorial-highlights__note">Selección editorial revisada el {dateLabel(highlights.reviewedOn)}. Son noticias enlazadas a sus fuentes; no constituyen un servicio de actualización automática.</p>
      </section>

      <section className="editorial-creators section page-width" id="creadores" aria-labelledby="editorial-creators-title">
        <div className="section-head editorial-highlight-head">
          <div>
            <span className="eyebrow">VOCES QUE NOS HACEN VIAJAR</span>
            <h2 id="editorial-creators-title">Venezuela a través de sus creadores.</h2>
          </div>
          <div className="editorial-creators__controls" aria-label="Controles del carrusel">
            <button type="button" onClick={() => moveTo(active - 1)} disabled={!canPrev} aria-label="Creadores anteriores">←</button>
            <span aria-live="polite" aria-atomic="true">{active + 1} / {highlights.creators.length}</span>
            <button type="button" onClick={() => moveTo(active + 1)} disabled={!canNext} aria-label="Siguientes creadores">→</button>
          </div>
        </div>
        <div className="editorial-creators__track" ref={track} onScroll={sync} aria-label="Perfiles de creadores de viajes" tabIndex={0}>
          {highlights.creators.map((creator, index) => (
            <article className="editorial-creators__card" key={creator.id}>
              <div className={"editorial-creators__portrait editorial-creators__portrait--" + (index % 4 + 1)} aria-hidden="true">
                <span>{creator.initials}</span>
              </div>
              <div className="editorial-creators__body">
                <small>{creator.tag}</small>
                <h3>{creator.name}</h3>
                <p className="editorial-creators__handle">{creator.handle}</p>
                <p>{creator.focus}</p>
                <a href={creator.url} target="_blank" rel="noopener noreferrer" aria-label={"Visitar perfil externo de " + creator.name}>
                  Ver perfil público <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
        <p className="editorial-highlights__note">Selección independiente de perfiles públicos. No implica colaboración, respaldo ni afiliación. Las iniciales son elementos gráficos; no se reutilizan fotos ni videos ajenos.</p>
      </section>
    </div>
  );
}
