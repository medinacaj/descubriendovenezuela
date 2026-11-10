import { pool } from "./db";
import { Place, PlaceInput, publicPlace, validatePlace } from "./domain";
const projection = `p.id,p.catalog_id AS "catalogId",p.verification_note AS "verificationNote",p.media_credits AS "mediaCredits",
CASE WHEN p.contact_authorized THEN NULLIF(p.street_address,'') ELSE NULL END AS "streetAddress",
CASE WHEN p.contact_authorized THEN NULLIF(p.contact_phone,'') ELSE NULL END AS "contactPhone",
CASE WHEN p.contact_authorized THEN NULLIF(p.whatsapp_phone,'') ELSE NULL END AS "whatsappPhone",
CASE WHEN p.contact_authorized THEN NULLIF(p.website,'') ELSE NULL END AS "website",
CASE WHEN p.contact_authorized THEN NULLIF(p.opening_hours_note,'') ELSE NULL END AS "openingHoursNote",
p.contact_authorized AS "contactAuthorized",
CASE WHEN p.price_valid_until >= CURRENT_DATE AND p.price_source LIKE 'https://%' THEN p.price_amount::float8 ELSE NULL END AS "priceAmount",
p.price_currency AS "priceCurrency",p.price_unit AS "priceUnit",p.price_valid_until::text AS "priceValidUntil",
CASE WHEN p.price_valid_until >= CURRENT_DATE AND p.price_source LIKE 'https://%' THEN p.price_source ELSE NULL END AS "priceSource",p.name,p.category,p.description,p.source,p.reviewed_at::text AS "reviewedAt",p.status,p.published,p.sensitive,p.demo,p.territory_id AS "territoryId",CASE WHEN p.sensitive THEN NULL ELSE ST_Y(p.location) END AS lat,CASE WHEN p.sensitive THEN NULL ELSE ST_X(p.location) END AS lon,p.updated_at::text AS "updatedAt",t.name AS territory,CASE WHEN t.kind='region' THEN t.name ELSE COALESCE(r.name,t.name) END AS region`;
const adminProjection = projection
  .replace("CASE WHEN p.price_valid_until >= CURRENT_DATE AND p.price_source LIKE 'https://%' THEN p.price_amount::float8 ELSE NULL END", "p.price_amount::float8")
  .replace("CASE WHEN p.price_valid_until >= CURRENT_DATE AND p.price_source LIKE 'https://%' THEN p.price_source ELSE NULL END", "p.price_source")
  .replace("CASE WHEN p.contact_authorized THEN NULLIF(p.street_address,'') ELSE NULL END", "p.street_address")
  .replace("CASE WHEN p.contact_authorized THEN NULLIF(p.contact_phone,'') ELSE NULL END", "p.contact_phone")
  .replace("CASE WHEN p.contact_authorized THEN NULLIF(p.whatsapp_phone,'') ELSE NULL END", "p.whatsapp_phone")
  .replace("CASE WHEN p.contact_authorized THEN NULLIF(p.website,'') ELSE NULL END", "p.website")
  .replace("CASE WHEN p.contact_authorized THEN NULLIF(p.opening_hours_note,'') ELSE NULL END", "p.opening_hours_note")
  .replace("CASE WHEN p.sensitive THEN NULL ELSE ST_Y(p.location) END", "ST_Y(p.location)")
  .replace("CASE WHEN p.sensitive THEN NULL ELSE ST_X(p.location) END", "ST_X(p.location)")
  + ',p.contact_evidence AS "contactEvidence"';
const join = `FROM places p JOIN territories t ON t.id=p.territory_id LEFT JOIN territories r ON r.id=t.parent_id`;
export async function territories() {
  return (
    await pool.query(
      "SELECT id,name,kind,parent_id FROM territories ORDER BY name",
    )
  ).rows;
}
export async function searchPlaces(
  f: { q?: string; category?: string; territory?: string; page?: number },
  admin = false,
) {
  const page = Number.isFinite(f.page)
    ? Math.max(1, Math.min(1000, Math.floor(f.page!)))
    : 1;
  const where = `WHERE ($1='' OR p.name ILIKE '%'||$1||'%' OR p.description ILIKE '%'||$1||'%') AND ($2='' OR p.category=$2) AND ($3='' OR p.territory_id IN (WITH RECURSIVE tree AS (SELECT id FROM territories WHERE id::text=$3 UNION ALL SELECT t.id FROM territories t JOIN tree ON t.parent_id=tree.id) SELECT id FROM tree)) ${admin ? "" : "AND p.published=true"}`;
  const args = [(f.q || "").slice(0, 120), f.category || "", f.territory || ""];
  const count = Number(
    (await pool.query(`SELECT count(*) ${join} ${where}`, args)).rows[0].count,
  );
  const rows = (
    await pool.query(
      `SELECT ${projection} ${join} ${where} ORDER BY p.updated_at DESC,p.id LIMIT 12 OFFSET $4`,
      [...args, (page - 1) * 12],
    )
  ).rows as Place[];
  return { items: rows, total: count, page, pages: Math.ceil(count / 12) };
}
export async function getPlace(id: string, admin = false) {
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if ((!uuid && admin) || (!uuid && !/^[a-z0-9-]{1,160}$/.test(id))) return null;
  const row = (
    await pool.query(
      `SELECT ${admin ? adminProjection : projection} ${join} WHERE ${uuid ? "p.id" : "p.catalog_id"}=$1 ${admin ? "" : "AND p.published=true"}`,
      [id],
    )
  ).rows[0] as Place;
  return row ? (admin ? row : publicPlace(row)) : null;
}
export async function savePlace(input: PlaceInput, actor: string, id?: string) {
  const p = validatePlace(input);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    let before = null;
    if (id) {
      const old = await client.query(
        "SELECT * FROM places WHERE id=$1 FOR UPDATE",
        [id],
      );
      if (!old.rowCount) throw Error("Ficha inexistente");
      before = old.rows[0];
      if (before.catalog_id) throw Error("Ficha versionada: editar content/places.json y reconstruir el catálogo");
    }
    const values = [
      p.name,
      p.category,
      p.territoryId,
      p.description,
      p.source,
      p.reviewedAt || null,
      p.status,
      p.published,
      p.sensitive,
      p.lon,
      p.lat,
      p.demo,
      p.streetAddress || "",
      p.contactPhone || "",
      p.whatsappPhone || "",
      p.website || "",
      p.openingHoursNote || "",
      p.contactAuthorized === true,
      p.contactEvidence || "",
      p.priceAmount ?? null,
      p.priceCurrency || "",
      p.priceUnit || "",
      p.priceValidUntil || null,
      p.priceSource || "",
    ];
    const fields =
      "name,category,territory_id,description,source,reviewed_at,status,published,sensitive,location,demo,street_address,contact_phone,whatsapp_phone,website,opening_hours_note,contact_authorized,contact_evidence,price_amount,price_currency,price_unit,price_valid_until,price_source";
    const expr =
      "$1,$2,$3,$4,$5,$6,$7,$8,$9,CASE WHEN $10::float8 IS NULL THEN NULL ELSE ST_SetSRID(ST_MakePoint($10,$11),4326) END,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24";
    const result = id
      ? await client.query(
          `UPDATE places SET (${fields})=(${expr}),updated_at=now() WHERE id=$25 RETURNING *`,
          [...values, id],
        )
      : await client.query(
          `INSERT INTO places (${fields}) VALUES (${expr}) RETURNING *`,
          values,
        );
    const after = result.rows[0];
    await client.query(
      "INSERT INTO change_log(place_id,actor,action,before_data,after_data) VALUES($1,$2,$3,$4,$5)",
      [after.id, actor, id ? "update" : "create", before, after],
    );
    await client.query("COMMIT");
    return after.id as string;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
