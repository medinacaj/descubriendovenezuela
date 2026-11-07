"use client";

import { useState } from "react";
import Link from "next/link";

const slides = [
  {
    key: "morrocoy",
    name: "Cayo Sombrero",
    region: "Falcón · Caribe venezolano",
    kicker: "Mar, naturaleza y cultura",
    title: "VENEZUELA",
    secondLine: "POR DESCUBRIR",
    description: "Un país de paisajes extraordinarios, historias y rincones por conocer. Explora lugares documentados de cada región.",
    image: "/media/foto-cayo-sombrero.webp",
    photoAlt: "Palmeras y arena clara en Cayo Sombrero, Parque Nacional Morrocoy",
    link: "/lugares/cayo-sombrero",
    credit: "AndreaC11",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Cayo_Sombrero.JPG",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
  {
    key: "canaima",
    name: "Canaima",
    region: "Bolívar · Gran Sabana",
    kicker: "Naturaleza monumental",
    title: "CANAIMA",
    secondLine: "SIN LÍMITES",
    description: "Tepuyes, cascadas y paisajes que invitan a descubrir el sur de Venezuela a través de sus lugares y sus historias.",
    image: "/media/foto-701.webp",
    photoAlt: "Vista aérea del Salto Ángel en el Parque Nacional Canaima",
    link: "/lugares/701",
    credit: "Rafael Estrella",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Salto_Angel_from_above.jpg",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    key: "los-roques",
    name: "Cayo de Agua",
    region: "Dependencias Federales · Los Roques",
    kicker: "Horizontes del Caribe",
    title: "LOS ROQUES",
    secondLine: "POR EXPLORAR",
    description: "Islas, arena y horizontes azules forman parte de la diversidad de destinos venezolanos reunidos en esta guía.",
    image: "/media/foto-cayo-de-agua.webp",
    photoAlt: "Cayo de Agua, archipiélago de Los Roques",
    link: "/lugares/cayo-de-agua",
    credit: "Tucanrecords",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Cayo_de_Agua_in_Los_Roques.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
] as const;

export default function CinematicHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = slides[activeIndex];
  const previews = [1, 2].map((offset) => ({
    index: (activeIndex + offset) % slides.length,
    slide: slides[(activeIndex + offset) % slides.length],
  }));
  const move = (direction: number) =>
    setActiveIndex((index) => (index + direction + slides.length) % slides.length);

  return (
    <section className="cinematic-hero" aria-label="Destinos destacados de Venezuela">
      <div className="cinematic-hero__backdrop" aria-hidden="true">
        <img key={active.key} src={active.image} alt="" width={1200} height={800}
          fetchPriority={activeIndex === 0 ? "high" : "auto"} />
      </div>
      <nav className="cinematic-hero__timeline" aria-label="Seleccionar destino destacado">
        {slides.map((slide, index) => (
          <button
            type="button"
            key={slide.key}
            aria-label={"Mostrar " + slide.name}
            aria-current={index === activeIndex ? "true" : undefined}
            aria-pressed={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </nav>
      <div className="cinematic-hero__copy">
        <p className="cinematic-hero__eyebrow">{active.kicker}</p>
        <h1 aria-live="polite">{active.title}<span>{active.secondLine}</span></h1>
        <p className="cinematic-hero__description">{active.description}</p>
        <div className="cinematic-hero__actions">
          <Link className="cinematic-hero__primary" href="/explorar">
            Explorar destinos <span aria-hidden="true">↗</span>
          </Link>
          <Link className="cinematic-hero__secondary" href={active.link}>
            Conocer {active.name} ↗
          </Link>
        </div>
      </div>
      <div className="cinematic-hero__preview-list" aria-label="Cambiar destino destacado">
        {previews.map(({ index, slide }) => (
          <button key={slide.key} className="cinematic-hero__preview"
            type="button" onClick={() => setActiveIndex(index)}
            aria-label={"Mostrar " + slide.name}>
            <img src={slide.image} alt="" width={420} height={660} loading="lazy" />
            <span className="cinematic-hero__preview-kicker">{slide.region}</span>
            <span className="cinematic-hero__preview-name">{slide.name}</span>
          </button>
        ))}
      </div>
      <div className="cinematic-hero__bottom">
        <div className="cinematic-hero__credit" aria-live="polite">
          Foto: <a href={active.creditUrl} target="_blank" rel="noopener noreferrer">{active.credit}</a>
          {" · "}<a href={active.licenseUrl} target="_blank" rel="noopener noreferrer">{active.license}</a>
        </div>
        <div className="cinematic-hero__controls">
          <span className="cinematic-hero__counter" aria-live="polite">
            {String(activeIndex + 1).padStart(2, "0")} <span>/ {String(slides.length).padStart(2, "0")}</span>
          </span>
          <button type="button" className="cinematic-hero__step"
            onClick={() => move(-1)} aria-label="Destino anterior">←</button>
          <button type="button" className="cinematic-hero__step"
            onClick={() => move(1)} aria-label="Siguiente destino">→</button>
        </div>
      </div>
    </section>
  );
}
