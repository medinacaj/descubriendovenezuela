import Link from "next/link";
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
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span /> TERRITORIO DE HISTORIAS
          </div>
          <h1>
            Venezuela tiene
            <br />
            mucho por <em>descubrir.</em>
          </h1>
          <p>
            Del mar a la montaña, del pueblo a su gente.
            <br />
            Encuentra ese rincón que todavía no conoces.
          </p>
          <Link href="/explorar" className="button">
            Explorar el mapa <span aria-hidden="true">↗</span>
          </Link>
          <div className="hero-note">
            <span className="note-line" />
            Un país extraordinario. Una mirada más cercana.
          </div>
        </div>
        <div className="landscape photo-hero">
          <img src="/media/foto-cayo-sombrero.webp" alt="Playa y palmeras de Cayo Sombrero, Morrocoy"
            width={1200} height={800} fetchPriority="high" />
          <div className="landscape-label">
            <span>CAYO SOMBRERO · FALCÓN</span>
            <b>La aventura empieza<br />con la curiosidad.</b>
            <small>Foto: <a href="https://commons.wikimedia.org/wiki/File:Cayo_Sombrero.JPG"
              target="_blank" rel="noopener noreferrer">AndreaC11</a> · <a href="https://creativecommons.org/licenses/by-sa/3.0/"
              target="_blank" rel="noopener noreferrer">CC BY-SA 3.0</a></small>
          </div>
          <div className="vertical-label">NATURALEZA · CULTURA · GENTE</div>
        </div>
      </section>
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
