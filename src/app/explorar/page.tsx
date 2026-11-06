import Link from "next/link";
import { categories } from "../../lib/domain";
import { searchPlaces, territories } from "../../lib/repository";
import { PlaceCard } from "../../components/cards";
import PlaceMap from "../../components/place-map";
export const dynamic = "force-dynamic";
export default async function Explorer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const s = await searchParams;
  let data, ts;
  try {
    [data, ts] = await Promise.all([
      searchPlaces({ ...s, page: Number(s.page) || 1 }),
      territories(),
    ]);
  } catch {}
  return (
    <div className="explorer section">
      <div className="eyebrow">EL PAÍS, MÁS CERCA</div>
      <h1>Encuentra tu próximo lugar</h1>
      <p className="intro">
        Naturaleza, sabores e historias. Empieza por lo que te mueve.
      </p>
      <form className="filter-bar">
        <div>
          <label htmlFor="q">Buscar lugar</label>
          <input
            id="q"
            name="q"
            defaultValue={s.q}
            placeholder="Nombre o palabra clave"
            maxLength={120}
          />
        </div>
        <div>
          <label htmlFor="territory">Territorio</label>
          <select id="territory" name="territory" defaultValue={s.territory}>
            <option value="">Todos los territorios</option>
            {ts?.map((t) => (
              <option key={t.id} value={t.id}>
                {"— ".repeat(
                  [
                    "country",
                    "region",
                    "municipality",
                    "parish",
                    "locality",
                  ].indexOf(t.kind),
                )}
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="category">Categoría</label>
          <select id="category" name="category" defaultValue={s.category}>
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <button className="button">Buscar</button>
        <Link className="reset" href="/explorar">
          Limpiar
        </Link>
      </form>
      {!data ? (
        <div className="empty" role="alert">
          <h2>Catálogo temporalmente no disponible</h2>
          <p>
            La conexión con los datos no responde. Intenta de nuevo más tarde.
          </p>
        </div>
      ) : (
        <>
          <div className="results-head">
            <b>
              {data.total} {data.total === 1 ? "lugar" : "lugares"}
            </b>
            <span>Los registros DEMO son sintéticos; los documentados indican sus fuentes.</span>
          </div>
          <div className="explorer-grid">
            <div>
              {data.total ? (
                <div className="cards two">
                  {data.items.map((p) => (
                    <PlaceCard key={p.id} place={p} />
                  ))}
                </div>
              ) : (
                <div className="empty">
                  <span>⌖</span>
                  <h2>No encontramos lugares con estos filtros.</h2>
                  <p>Prueba otra categoría o borra tu búsqueda.</p>
                  <Link href="/explorar" className="text-link">
                    Ver todos los lugares ↗
                  </Link>
                </div>
              )}
              {data.pages > 1 && (
                <nav aria-label="Páginas" className="pagination">
                  {Array.from({ length: data.pages }, (_, i) => (
                    <Link
                      aria-current={i + 1 === data.page ? "page" : undefined}
                      key={i}
                      href={
                        "?" + new URLSearchParams({ ...s, page: String(i + 1) })
                      }
                    >
                      {i + 1}
                    </Link>
                  ))}
                </nav>
              )}
            </div>
            <PlaceMap places={data.items} />
          </div>
        </>
      )}
    </div>
  );
}
