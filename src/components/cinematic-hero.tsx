"use client";

import { useState } from "react";
import Link from "next/link";

/* Fotografías ya presentes y acreditadas en el catálogo del proyecto.
   No se inventan paisajes, accesos, precios ni servicios disponibles. */
const slides = [
  {
    key: "morrocoy",
    name: "Cayo Sombrero",
    region: "Falcón · Parque Nacional Morrocoy",
    kicker: "DESCUBRIENDO VENEZUELA",
    title: "Venezuela",
    secondLine: "natural, diversa y auténtica",
    description: "Playas caribeñas, montañas imponentes, selvas y una cultura llena de historias. Descubre destinos documentados de nuestro país.",
    image: "/media/foto-cayo-sombrero.webp",
    link: "/lugares/cayo-sombrero",
    credit: "AndreaC11",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Cayo_Sombrero.JPG",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
  {
    key: "canaima",
    name: "Parque Nacional Canaima",
    region: "Bolívar · Parque Nacional Canaima",
    kicker: "NATURALEZA EXTRAORDINARIA",
    title: "CANAIMA",
    secondLine: "paisajes que inspiran",
    description: "Tepuyes, grandes saltos de agua y una riqueza natural singular. Explora las fichas y sus fuentes documentales.",
    image: "/media/foto-701.webp",
    link: "/lugares/701",
    credit: "Rafael Estrella",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Salto_Angel_from_above.jpg",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    key: "roques",
    name: "Cayo de Agua",
    region: "Dependencias Federales · Archipiélago de Los Roques",
    kicker: "CARIBE VENEZOLANO",
    title: "LOS ROQUES",
    secondLine: "un paraíso por conocer",
    description: "Descubre paisajes insulares, arenas claras y mares turquesa a través de imágenes acreditadas y datos con fuentes.",
    image: "/media/foto-cayo-de-agua.webp",
    link: "/lugares/cayo-de-agua",
    credit: "Tucanrecords",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Cayo_de_Agua_in_Los_Roques.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
] as const;

const shortcuts = [
  { icon: "☀", label: "Playas", href: "/explorar?q=cayo" },
  { icon: "△", label: "Montañas", href: "/explorar?q=tepuy" },
  { icon: "♧", label: "Parques", href: "/explorar?q=parque" },
  { icon: "⌘", label: "Cultura", href: "/explorar?category=Cultura" },
  { icon: "◉", label: "Gastronomía", href: "/explorar?category=Gastronomía" },
] as const;

export default function CinematicHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = slides[activeIndex];
  const move = (direction: number) =>
    setActiveIndex(index => (index + direction + slides.length) % slides.length);

  return (
    <section className="cinematic-hero" aria-label="Destinos destacados de Venezuela">
      <div className="cinematic-hero__backdrop" aria-hidden="true">
        <img key={active.key} src={active.image} alt="" width={1200} height={800}
          fetchPriority={activeIndex === 0 ? "high" : "auto"} />
      </div>
      <nav className="cinematic-hero__timeline" aria-label="Seleccionar destino destacado">
        {slides.map((slide, index) => (
          <button type="button" key={slide.key}
            aria-label={"Mostrar " + slide.name}
            aria-current={index === activeIndex ? "true" : undefined}
            aria-pressed={index === activeIndex}
            onClick={() => setActiveIndex(index)} />
        ))}
      </nav>
      <div className="cinematic-hero__copy">
        <p className="cinematic-hero__eyebrow">{active.kicker}</p>
        <h1 aria-live="polite">{active.title}<span>{active.secondLine}</span></h1>
        <p className="cinematic-hero__description">{active.description}</p>
        <div className="cinematic-hero__actions">
          <Link className="cinematic-hero__primary" href="/explorar">
            Explorar destinos <span aria-hidden="true">→</span>
          </Link>
          <Link className="cinematic-hero__secondary" href={active.link}>
            Conocer {active.name} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
      <nav className="cinematic-hero__categories" aria-label="Descubrir por tipo de experiencia">
        {shortcuts.map(shortcut => (
          <Link key={shortcut.label} href={shortcut.href} className="cinematic-hero__category">
            <span aria-hidden="true">{shortcut.icon}</span>
            <b>{shortcut.label}</b>
          </Link>
        ))}
      </nav>
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
