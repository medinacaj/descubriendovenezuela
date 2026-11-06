import Link from "next/link";
import { currentUser } from "../../lib/auth";
import { getPlace, searchPlaces, territories } from "../../lib/repository";
import { pool } from "../../lib/db";
import { categories } from "../../lib/domain";
export const dynamic = "force-dynamic";
export default async function Admin({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const s = await searchParams,
    user = await currentUser();
  if (!user)
    return (
      <section className="login section">
        <span className="eyebrow">CUIDAR LA INFORMACIÓN</span>
        <h1>Acceso editorial</h1>
        <p>Panel local para administrar y revisar fichas.</p>
        {s.error && (
          <p role="alert" className="notice">
            No pudimos iniciar sesión. Revisa tus credenciales o espera si hubo
            demasiados intentos.
          </p>
        )}
        <form action="/api/admin/login" method="post">
          <label>
            Correo
            <input name="email" type="email" autoComplete="username" required />
          </label>
          <label>
            Contraseña
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={200}
            />
          </label>
          <button className="button">Entrar al panel ↗</button>
        </form>
        <small>
          No hay credenciales predeterminadas. Consulta README para crear una
          cuenta local.
        </small>
      </section>
    );
  const [data, ts, p, log] = await Promise.all([
    searchPlaces({ page: Number(s.page) || 1 }, true),
    territories(),
    s.edit ? getPlace(s.edit, true) : null,
    pool.query(
      "SELECT action,place_id,created_at FROM change_log ORDER BY id DESC LIMIT 10",
    ),
  ]);
  return (
    <section className="section admin">
      <div className="section-head">
        <div>
          <div className="eyebrow">PANEL EDITORIAL</div>
          <h1>El mapa se construye con confianza.</h1>
          <p>{user.email}</p>
        </div>
        <form method="post" action="/api/admin/logout">
          <button className="secondary">Cerrar sesión</button>
        </form>
      </div>
      {s.saved && (
        <p role="status" className="success">
          Ficha guardada. Cambio registrado en auditoría.
        </p>
      )}
      {s.error && (
        <p role="alert" className="notice">
          No se guardó la ficha. Publicar exige fuente HTTPS, fecha y estado
          verificado. Revisa también coordenadas y campos obligatorios.
        </p>
      )}
      <div className="admin-grid">
        <div>
          <h2>{p ? "Editar ficha" : "Nueva ficha"}</h2>
          <form
            key={p?.id || "new"}
            method="post"
            action="/api/admin/places"
            className="editor"
          >
            <input type="hidden" name="id" value={p?.id || ""} />
            <label>
              Nombre
              <input
                name="name"
                required
                minLength={3}
                maxLength={120}
                defaultValue={p?.name}
              />
            </label>
            <label>
              Categoría
              <select
                aria-label="Categoría"
                name="category"
                defaultValue={p?.category}
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              Territorio
              <select
                aria-label="Territorio"
                name="territoryId"
                required
                defaultValue={p?.territoryId || ""}
              >
                <option value="" disabled>
                  Selecciona una localidad
                </option>
                {ts
                  .filter((t) => t.kind === "locality")
                  .map((t) => (
                    <option value={t.id} key={t.id}>
                      {t.name}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              Descripción
              <textarea
                name="description"
                minLength={10}
                maxLength={5000}
                rows={5}
                required
                defaultValue={p?.description}
              />
            </label>
            <label>
              Fuente HTTPS
              <input name="source" type="url" defaultValue={p?.source} />
            </label>
            <label>
              Fecha de revisión
              <input
                type="date"
                name="reviewedAt"
                defaultValue={p?.reviewedAt || ""}
              />
            </label>
            <label>
              Estado de verificación
              <select
                aria-label="Estado de verificación"
                name="status"
                defaultValue={p?.status || "proposed"}
              >
                <option value="proposed">Propuesto</option>
                <option value="verified">Verificado</option>
                <option value="outdated">Requiere actualización</option>
                <option value="closed">Cerrado</option>
              </select>
            </label>
            <div className="coordinate-fields">
              <label>
                Latitud
                <input
                  name="lat"
                  type="number"
                  step="any"
                  min={-90}
                  max={90}
                  defaultValue={p?.lat ?? ""}
                />
              </label>
              <label>
                Longitud
                <input
                  name="lon"
                  type="number"
                  step="any"
                  min={-180}
                  max={180}
                  defaultValue={p?.lon ?? ""}
                />
              </label>
            </div>
            <label className="check">
              <input
                type="checkbox"
                name="sensitive"
                defaultChecked={p?.sensitive}
              />
              Proteger ubicación exacta
            </label>
            <label className="check">
              <input
                type="checkbox"
                name="demo"
                defaultChecked={p?.demo ?? true}
              />
              Registro de demostración
            </label>
            <label className="check">
              <input
                type="checkbox"
                name="published"
                defaultChecked={p?.published}
              />
              Publicar ficha
            </label>
            <button className="button">Guardar ficha</button>
            {p && <Link href="/admin">Cancelar edición</Link>}
          </form>
        </div>
        <div>
          <h2>Fichas ({data.total})</h2>
          <div className="admin-list">
            {data.items.map((item) => (
              <Link key={item.id} href={item.catalogId ? "https://github.com/medinacaj/descubriendovenezuela/blob/main/content/places.json" : "/admin?edit=" + item.id}>
                <b>{item.name}</b>
                <span>
                  {item.published ? "Publicada" : "Borrador"} ·{" "}
                  {item.demo ? "DEMO" : item.status} <em>{item.catalogId ? "Ficha versionada ↗" : "Editar ↗"}</em>
                </span>
              </Link>
            ))}
          </div>
          {data.pages > 1 && (
            <nav className="pagination" aria-label="Páginas administrativas">
              {Array.from({ length: data.pages }, (_, i) => (
                <Link key={i} href={"/admin?page=" + (i + 1)}>
                  {i + 1}
                </Link>
              ))}
            </nav>
          )}
          <h2>Últimos cambios</h2>
          <ul className="audit">
            {log.rows.map((r, i) => (
              <li key={i}>
                <b>{r.action === "create" ? "Creación" : "Edición"}</b> ·{" "}
                {new Date(r.created_at).toISOString()}
                <small>{r.place_id}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
