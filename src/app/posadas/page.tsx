import Link from "next/link";
import { PlaceCard } from "../../components/cards";
import { searchPlaces } from "../../lib/repository";

export const dynamic = "force-dynamic";

const posadasLocales = new Set([
  "Los Ranchos de Chano", "Posada Casa Sol", "Posada Rafaela y Cristóbal",
  "Posada Los Cocos", "Posada La Ardileña", "Posada Playa Colorada",
  "Posada Neneko", "Posada Los 7 Delfines", "Posada La Guarandinga",
  "Posada El Portal de los Sueños", "Posada Sol, Luna y Estrellas",
  "Estancia Altos de Veracruz", "Finca La Floresta", "Posada Paraíso Guisela",
  "Posada Casa El Pozo", "Posada La Fuente",
]);
const experiencias = [
  "Museo de los Niños de Caracas",
  "Parque La Venezuela de Antier",
  "Parque La Montaña de los Sueños",
  "Pueblo Museo Los Aleros",
];

export default async function FamilyTravel() {
  let stays: Awaited<ReturnType<typeof searchPlaces>>["items"] = [];
  let outings: Awaited<ReturnType<typeof searchPlaces>>["items"] = [];
  let error = false;
  try {
    const lodgingPages = await Promise.all([1, 2, 3].map(page =>
      searchPlaces({ category: "Hospedaje", page })));
    stays = lodgingPages.flatMap(page => page.items).filter(item =>
      posadasLocales.has(item.name));
    const culturalPages = await Promise.all(experiencias.map(name =>
      searchPlaces({category:"Cultura",q:name,page:1})));
    outings = culturalPages.flatMap(page => page.items).filter(item =>
      experiencias.includes(item.name));
  } catch {
    error = true;
  }
  return (
    <div className="section page-width family-guide">
      <nav className="breadcrumbs" aria-label="Ruta de navegación">
        <Link href="/">Inicio</Link><span aria-hidden="true"> / </span>
        <span aria-current="page">Posadas y planes familiares</span>
      </nav>
      <div className="family-guide__intro">
        <span className="eyebrow">VIAJAR CON CALMA, CONOCER DESDE CERCA</span>
        <h1>Posadas y planes para compartir</h1>
        <p>
          Descubre hospedajes pequeños y espacios de interés cultural.
          Estas fichas recopilan información documental, no acreditan
          disponibilidad, apertura, permisos, seguridad ni servicios vigentes
          para niños. Confirma las condiciones con sus responsables.
        </p>
        <div className="family-guide__actions">
          <Link className="button" href="/explorar?category=Hospedaje">
            Explorar todos los hospedajes ↗
          </Link>
          <Link className="text-link" href="/explorar?category=Cultura">
            Conocer planes culturales ↗
          </Link>
        </div>
      </div>
      <div className="section-head">
        <div><span className="eyebrow">PERSONAS, PUEBLOS Y PAISAJES</span>
          <h2>Posadas con identidad local</h2></div>
        <p>Establecimientos documentados, sin reservas desde esta guía.</p>
      </div>
      <div className="cards">
        {stays.map(place => <PlaceCard key={place.id} place={place} />)}
      </div>
      <div className="section-head family-guide__secondary">
        <div><span className="eyebrow">CULTURA PARA TODAS LAS GENERACIONES</span>
          <h2>Ideas para salir en familia</h2></div>
      </div>
      <div className="cards">
        {outings.map(place => <PlaceCard key={place.id} place={place} />)}
      </div>
      {error ? <p className="notice" role="alert">
        El catálogo no está disponible temporalmente.
      </p> : !stays.length && !outings.length ? <p>
        Las fichas documentales aún no se han importado a esta instancia.
      </p> : null}
      <div className="source-box">
        <b>Nota editorial:</b> los servicios, accesos, tarifas y la
        adecuación de las actividades a cada edad requieren confirmación actual.
        Las fotografías de otros destinos se identifican como referenciales.
      </div>
    </div>
  );
}
