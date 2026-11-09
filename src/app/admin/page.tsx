import Link from "next/link";
import { currentUser } from "../../lib/auth";
import { getPlace, searchPlaces, territories } from "../../lib/repository";
import { pool } from "../../lib/db";
import { categories } from "../../lib/domain";
export const metadata = {title:"Acceso editorial",robots:{index:false,follow:false}};
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
                  Selecciona una región o localidad
                </option>
                {ts
                  .filter((t) => t.kind === "locality" || t.kind === "region")
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
            <fieldset>
              <legend>Información comercial opcional</legend>
              <p>El contacto se mantiene privado hasta registrar la autorización de publicación.</p>
              <label>Dirección o referencia de acceso
                <input name="streetAddress" maxLength={300} defaultValue={p?.streetAddress || ""}/>
              </label>
              <label>Teléfono de contacto
                <input name="contactPhone" type="tel" maxLength={40} defaultValue={p?.contactPhone || ""}/>
              </label>
              <label>WhatsApp (prefijo internacional, solo dígitos)
                <input name="whatsappPhone" type="tel" placeholder="+58..." defaultValue={p?.whatsappPhone || ""}/>
              </label>
              <label>Sitio web HTTPS
                <input name="website" type="url" defaultValue={p?.website || ""}/>
              </label>
              <label>Horario comunicado por el titular
                <textarea name="openingHoursNote" rows={2} maxLength={300} defaultValue={p?.openingHoursNote || ""}/>
              </label>
              <label>Evidencia de autorización de publicación (documentar fuente, responsable y fecha)
                <textarea name="contactEvidence" rows={2} maxLength={1000} defaultValue={p?.contactEvidence || ""}/>
              </label>
              <label className="check">
                <input type="checkbox" name="contactAuthorized" defaultChecked={p?.contactAuthorized}/>
                Autorización documentada para publicar estos datos
              </label>
            </fieldset>
            <fieldset>
              <legend>Tarifa documentada (opcional)</legend>
              <p>Sin fuente, unidad y fecha de vigencia no se publicará el precio.</p>
              <label>Monto
                <input name="priceAmount" type="number" min={0} step="0.01" defaultValue={p?.priceAmount ?? ""}/>
              </label>
              <label>Moneda
                <select name="priceCurrency" defaultValue={p?.priceCurrency || ""}>
                  <option value="">Seleccionar</option>
                  <option value="VES">VES</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </label>
              <label>Unidad de cobro
                <select name="priceUnit" defaultValue={p?.priceUnit || ""}>
                  <option value="">Seleccionar</option>
                  <option value="persona">Persona</option>
                  <option value="noche">Noche</option>
                  <option value="entrada">Entrada</option>
                  <option value="servicio">Servicio</option>
                </select>
              </label>
              <label>Vigencia hasta
                <input name="priceValidUntil" type="date" defaultValue={p?.priceValidUntil || ""}/>
              </label>
              <label>Fuente HTTPS de la tarifa
                <input name="priceSource" type="url" defaultValue={p?.priceSource || ""}/>
              </label>
            </fieldset>
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
