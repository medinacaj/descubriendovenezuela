import Link from "next/link";
import CinematicHero from "../components/cinematic-hero";
import { PlaceCard } from "../components/cards";
import { searchPlaces } from "../lib/repository";
import { categories } from "../lib/domain";
export const dynamic = "force-dynamic";
export default async function Home() {
  let data;
  try {
    data = await searchPlaces({});
  } catch {}
  return (
    <>
      <CinematicHero />

      <section className="search-section">
        <form action="/explorar" className="search-bar">
          <div>
            <label htmlFor="home-search">
              ¿A dónde te lleva la curiosidad?
            </label>
            <input
              id="home-search"
              name="q"
              placeholder="Busca un destino, pueblo o lugar…"
            />
          </div>
          <div className="search-category">
            <label htmlFor="home-category">Tu tipo de viaje</label>
            <select name="category" id="home-category">
              <option value="">Todas las categorías</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <button className="button">
            Buscar <span>↗</span>
          </button>
        </form>
      </section>
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">A TU MANERA</span>
            <h2>Hay una Venezuela para ti.</h2>
          </div>
          <p>Elige por dónde quieres empezar.</p>
        </div>
        <div className="categories">
          {categories.map((c, i) => (
            <Link key={c} href={"/explorar?category=" + encodeURIComponent(c)}>
              <span>{["↟", "⌂", "◒", "▥", "◇", "⌖"][i]}</span>
              <b>{c}</b>
              <small>Explorar ↗</small>
            </Link>
          ))}
        </div>
      </section>
      <section className="section discoveries">
        <div className="section-head">
          <div>
            <span className="eyebrow">UN PRIMER VISTAZO</span>
            <h2>Pequeñas ventanas a un gran país.</h2>
          </div>
          <Link className="text-link" href="/explorar">
            Ver el explorador ↗
          </Link>
        </div>
        <div className="notice">
          {data?.items.some((p) => p.demo)
            ? "Las fichas DEMO son sintéticas. Las demás fichas identifican hechos documentados, no servicios actuales comprobados."
            : "Catálogo documental en construcción: verificar horarios, acceso y disponibilidad antes de viajar."}
        </div>
        <div className="cards">
          {data?.items.slice(0, 4).map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
        {!data ? (
          <p role="alert">El catálogo no está disponible temporalmente.</p>
        ) : !data.total ? (
          <p>Aún no hay lugares publicados.</p>
        ) : null}
      </section>
      <section className="section family-escapes">
        <div className="section-head">
          <div>
            <span className="eyebrow">POSADAS Y TURISMO DE CERCANÍA</span>
            <h2>Escapadas para compartir.</h2>
          </div>
          <Link className="text-link" href="/posadas">
            Conocer posadas y planes familiares ↗
          </Link>
        </div>
        <p className="catalog-note">
          Alojamiento local y propuestas culturales con fuentes. Sin reservas,
          disponibilidad o servicios actuales certificados.
        </p>
        <Link className="button" href="/posadas">
          Ver la guía de posadas y familias ↗
        </Link>
      </section>
      <section className="manifesto">
        <span className="eyebrow">MÁS QUE UN PUNTO EN EL MAPA</span>
        <h2>
          Detrás de cada lugar,
          <br />
          hay una historia que merece contarse.
        </h2>
        <p>
          Estamos construyendo una guía de Venezuela con información
          verificable,
          <br />
          respeto por sus comunidades y espacio para los pequeños negocios.
        </p>
        <div>
          <span>
            01 <b>Información con fuente</b>
          </span>
          <span>
            02 <b>Una mirada local</b>
          </span>
          <span>
            03 <b>Descubrir es gratuito</b>
          </span>
        </div>
      </section>
    </>
  );
}
