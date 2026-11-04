import { notFound } from "next/navigation";
import Link from "next/link";
import { getPlace } from "../../../lib/repository";
export const dynamic = "force-dynamic";
export default async function Detail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await getPlace(id);
  if (!p) notFound();
  return (
    <article className="detail section">
      <Link className="text-link" href="/explorar">
        ← Volver al explorador
      </Link>
      <div className="detail-grid">
        <div>
          <div className="eyebrow">{p.category}</div>
          <h1>{p.name}</h1>
          <p className="location">⌖ {p.territory}</p>
          {p.demo && (
            <div className="notice">
              DEMO · Este registro es sintético. No representa un lugar ni una
              verificación real.
            </div>
          )}
          <h2>Sobre este lugar</h2>
          <p className="description">{p.description}</p>
          <h2>Ubicación</h2>
          <p>
            {p.sensitive
              ? "Ubicación protegida. No se divulgan coordenadas."
              : p.lat !== null
                ? `${p.lat}, ${p.lon} · Precisión pendiente de documentación`
                : "Ubicación pendiente de verificación. No se ofrecen indicaciones de llegada."}
          </p>
        </div>
        <aside className="facts">
          <span className="eyebrow">ANTES DE TU VISITA</span>
          <h2>Información de la ficha</h2>
          <dl>
            <dt>Precio</dt>
            <dd>Consultar precio</dd>
            <dt>Estado</dt>
            <dd>
              {p.demo
                ? "Ejemplo de verificación"
                : p.status === "verified"
                  ? "Revisado"
                  : "Requiere actualización"}
            </dd>
            <dt>Última revisión</dt>
            <dd>{p.reviewedAt || "Pendiente"}</dd>
            <dt>Fuente</dt>
            <dd>
              {p.source ? (
                <a href={p.source} target="_blank" rel="noopener noreferrer">
                  {p.demo ? "Referencia de demostración" : "Consultar fuente"} ↗
                </a>
              ) : (
                "Pendiente"
              )}
            </dd>
          </dl>
          <small>
            Consulta directamente las condiciones actuales antes de viajar. Esta
            ficha no confirma disponibilidad, seguridad ni reservas.
          </small>
        </aside>
      </div>
    </article>
  );
}
