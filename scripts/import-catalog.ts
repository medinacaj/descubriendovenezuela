/**
 * Importación única del inventario documental compartido con GitHub Pages.
 * Ejecutar tras db:migrate: npm run catalog:import
 * Nunca borra fichas ni actualiza fichas editadas por un editor.
 * La fuente confirma exclusivamente el alcance declarado en verification_note.
 */
try {
  process.loadEnvFile(".env");
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
}
const { readFile } = await import("node:fs/promises");
const { pool } = await import("../src/lib/db");
const { normaliseCatalogEntry } = await import("../src/lib/catalog");
const { catalogSchema } = await import("../content/schema.mjs");
const raw = JSON.parse(await readFile("content/places.json", "utf8"));
const entries = catalogSchema.parse(raw).map(normaliseCatalogEntry);
const client = await pool.connect();
try {
  await client.query("BEGIN");
  // Fail fast if migration 002 was not applied.
  await client.query("SELECT catalog_id FROM places LIMIT 0");
  const root = await client.query(
    "SELECT id FROM territories WHERE kind='country' AND name='Venezuela' LIMIT 1"
  );
  let countryId: number;
  if (root.rowCount) countryId = Number(root.rows[0].id);
  else {
    countryId = Number((await client.query(
      "INSERT INTO territories(name,kind,source) VALUES('Venezuela','country',$1) RETURNING id",
      ["https://www.iso.org/obp/ui/#iso:code:3166:VE"]
    )).rows[0].id);
  }
  const regionIds = new Map<string, number>();
  let inserted = 0, existing = 0;
  for (const entry of entries) {
    let territoryId = countryId;
    if (entry.region) {
      let regionId = regionIds.get(entry.region);
      if (!regionId) {
        const existingRegion = await client.query(
          "SELECT id FROM territories WHERE name=$1 AND kind='region' AND parent_id=$2 LIMIT 1",
          [entry.region, countryId]
        );
        if (existingRegion.rowCount) regionId = Number(existingRegion.rows[0].id);
        else {
          const created = await client.query(
            "INSERT INTO territories(name,kind,parent_id,source) VALUES($1,'region',$2,$3) RETURNING id",
            [entry.region, countryId, entry.source]
          );
          regionId = Number(created.rows[0].id);
        }
        regionIds.set(entry.region, regionId);
      }
      territoryId = regionId;
    }
    const result = await client.query(
      `INSERT INTO places (
        catalog_id,name,category,territory_id,description,source,reviewed_at,
        status,published,sensitive,demo,verification_note,media_credits
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,'verified',true,true,false,$8,$9::jsonb)
      ON CONFLICT (catalog_id) WHERE catalog_id IS NOT NULL DO NOTHING RETURNING id`,
      [entry.catalogId,entry.name,entry.category,territoryId,entry.description,
       entry.source,entry.reviewedAt,entry.verificationNote,JSON.stringify(entry.mediaCredits)]
    );
    if (result.rowCount) inserted++; else existing++;
  }
  await client.query("COMMIT");
  console.log(`Catálogo documental: ${inserted} nuevos, ${existing} conservados, ${entries.length} totales.`);
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await pool.end();
}
export {};
