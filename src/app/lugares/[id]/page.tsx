import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPlace } from "../../../lib/repository";

export const dynamic = "force-dynamic";
type Route = { params: Promise<{ id: string }> };
type Credit = { kind: string; src: string; alt: string; author: string; license: string; licenseUrl: string; sourceUrl: string; changes: string };

export async function generateMetadata({ params }: Route): Promise<Metadata> {
  const { id } = await params;
  const place = await getPlace(id).catch(() => null);
  if (!place) return { title: "Lugar no disponible", robots: { index: false } };
  const published = process.env.SITE_PUBLIC_READY === "true" && !place.demo;
  return {
    title: place.name + " — Venezuela en el Mapa",
    description: place.description.slice(0, 155),
    robots: { index: published, follow: published },
    alternates: process.env.APP_ORIGIN
      ? { canonical: process.env.APP_ORIGIN + "/lugares/" + encodeURIComponent(id) }
      : undefined,
    openGraph: { title: place.name, description: place.description.slice(0, 180), type: "article" },
  };
}

export default async function Detail({ params }: Route) {
  const { id } = await params;
  const p = await getPlace(id);
  if (!p) notFound();
  const credits = Array.isArray(p.mediaCredits) ? p.mediaCredits as Credit[] : [];
  return (
    <article className="detail section">
      <Link className="text-link" href="/explorar">← Volver al explorador</Link>
      <div className="detail-grid">
        <div>
          <div className="eyebrow">{p.category}</div>
          <h1>{p.name}</h1>
          <p className="location">⌖ {p.territory}</p>
          {p.demo && <div className="notice">
            DEMO · Registro sintético, no representa un lugar real.
          </div>}
          {!p.demo && p.catalogId && <div className="notice">
            Ficha documental. No confirma horarios, accesos, calidad, disponibilidad ni visita de campo.
          </div>}
          {credits.map((credit) => ((credit.src.startsWith("media/foto-") || credit.src.startsWith("media/mapa-")) && credit.src.endsWith(".webp")) ? (
            <figure className="detail-photo" key={credit.src}>
              <img src={"/" + credit.src} alt={credit.alt} loading="lazy" width={900} height={600}/>
              <figcaption>
                {credit.kind === "map" ? "Cartografía" : "Fotografía"}: {credit.author}.{" "}
                <a href={credit.licenseUrl} rel="noopener noreferrer" target="_blank">{credit.license}</a>.{" "}
                <a href={credit.sourceUrl} rel="noopener noreferrer" target="_blank">Fuente y atribución</a>.
                <small>{credit.changes}</small>
              </figcaption>
            </figure>
          ) : null)}
          <h2>Sobre este lugar</h2>
          <p className="description">{p.description}</p>
          {p.verificationNote && <>
            <h2>Alcance de la documentación</h2>
            <p>{p.verificationNote}</p>
          </>}
          {p.contactAuthorized && (p.contactPhone || p.whatsappPhone || p.website || p.openingHoursNote || p.streetAddress) && (
            <section aria-label="Contacto e información comercial">
              <h2>Información proporcionada con autorización</h2>
              <dl>
                {p.streetAddress && <><dt>Dirección</dt><dd>{p.streetAddress}</dd></>}
                {p.contactPhone && <><dt>Teléfono</dt><dd><a href={"tel:" + p.contactPhone}>{p.contactPhone}</a></dd></>}
                {p.whatsappPhone && <><dt>WhatsApp</dt><dd><a href={"https://wa.me/" + p.whatsappPhone.replace(/[^0-9]/g, "")} rel="noopener noreferrer" target="_blank">Contactar por WhatsApp ↗</a></dd></>}
                {p.website && <><dt>Sitio web</dt><dd><a href={p.website} target="_blank" rel="noopener noreferrer">Visitar sitio oficial ↗</a></dd></>}
                {p.openingHoursNote && <><dt>Horario informado</dt><dd>{p.openingHoursNote}</dd></>}
              </dl>
              <small>Datos comunicados con autorización. Confirma su vigencia antes de visitar o contactar.</small>
            </section>
          )}
          <h2>Ubicación</h2>
          <p>{p.sensitive
            ? "Ubicación exacta no publicada. No se ofrecen indicaciones de llegada."
            : p.lat !== null
              ? `${p.lat}, ${p.lon} · Precisión pendiente de documentación`
              : "Ubicación pendiente de verificación."}</p>
        </div>
        <aside className="facts">
          <span className="eyebrow">ANTES DE TU VISITA</span>
          <h2>Información de la ficha</h2>
          <dl>
            <dt>Precio</dt>
            <dd>{p.priceAmount !== null && p.priceAmount !== undefined && p.priceCurrency && p.priceUnit
              ? `${p.priceAmount} ${p.priceCurrency} / ${p.priceUnit}`
              : "Consultar precio"}</dd>
            {p.priceAmount !== null && p.priceAmount !== undefined && p.priceSource && p.priceValidUntil && <>
              <dt>Tarifa revisada</dt><dd>Vigente según la fuente hasta {p.priceValidUntil}. <a href={p.priceSource} target="_blank" rel="noopener noreferrer">Ver fuente</a></dd>
            </>}
            <dt>Revisión</dt><dd>{p.demo ? "Demostración" : p.catalogId ? "Identificación documental" : p.status === "verified" ? "Revisado editorialmente" : "Pendiente de actualización"}</dd>
            <dt>Última revisión</dt><dd>{p.reviewedAt || "Pendiente"}</dd>
            <dt>Fuente</dt><dd>{p.source ? (
              <a href={p.source} target="_blank" rel="noopener noreferrer">Consultar fuente ↗</a>
            ) : "Pendiente"}</dd>
          </dl>
          <small>Comprueba las condiciones actuales directamente antes de desplazarte. Esta ficha no acredita apertura, seguridad, disponibilidad ni reservas.</small>
        </aside>
      </div>
    </article>
  );
}
