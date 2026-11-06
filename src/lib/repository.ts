import { pool } from "./db";
import { Place, PlaceInput, publicPlace, validatePlace } from "./domain";
const projection = `p.id,p.catalog_id AS "catalogId",p.verification_note AS "verificationNote",p.media_credits AS "mediaCredits",p.name,p.category,p.description,p.source,p.reviewed_at::text AS "reviewedAt",p.status,p.published,p.sensitive,p.demo,p.catalog_id AS "catalogId",p.verification_note AS "verificationNote",p.territory_id AS "territoryId",CASE WHEN p.sensitive THEN NULL ELSE ST_Y(p.location) END AS lat,CASE WHEN p.sensitive THEN NULL ELSE ST_X(p.location) END AS lon,p.updated_at::text AS "updatedAt",t.name AS territory,CASE WHEN t.kind='region' THEN t.name ELSE COALESCE(r.name,t.name) END AS region`;
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
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const row = (
    await pool.query(
      `SELECT ${admin ? projection.replace("CASE WHEN p.sensitive THEN NULL ELSE ST_Y(p.location) END", "ST_Y(p.location)").replace("CASE WHEN p.sensitive THEN NULL ELSE ST_X(p.location) END", "ST_X(p.location)") : projection} ${join} WHERE p.id=$1 ${admin ? "" : "AND p.published=true"}`,
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
    ];
    const fields =
      "name,category,territory_id,description,source,reviewed_at,status,published,sensitive,location,demo";
    const expr =
      "$1,$2,$3,$4,$5,$6,$7,$8,$9,CASE WHEN $10::float8 IS NULL THEN NULL ELSE ST_SetSRID(ST_MakePoint($10,$11),4326) END,$12";
    const result = id
      ? await client.query(
          `UPDATE places SET (${fields})=(${expr}),updated_at=now() WHERE id=$13 RETURNING *`,
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
