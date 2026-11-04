try {
  process.loadEnvFile(".env");
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
}
const { pool } = await import("../src/lib/db");
if (process.env.ALLOW_DEMO_IMPORT !== "yes")
  throw Error(
    "Usa ALLOW_DEMO_IMPORT=yes únicamente para una base de demostración.",
  );
const c = await pool.connect();
try {
  await c.query("BEGIN");
  if (
    (await c.query("SELECT count(*) FROM places WHERE demo=false")).rows[0]
      .count !== "0"
  )
    throw Error("No importar demo junto a registros reales");
  const country =
    (
      await c.query(
        "INSERT INTO territories(name,kind,source) SELECT 'Venezuela · demostración','country','https://example.org/demo' WHERE NOT EXISTS(SELECT 1 FROM territories WHERE name='Venezuela · demostración') RETURNING id",
      )
    ).rows[0] ||
    (
      await c.query(
        "SELECT id FROM territories WHERE name='Venezuela · demostración'",
      )
    ).rows[0];
  const names = [
    "Región piloto · demo",
    "Municipio de ejemplo · demo",
    "Parroquia de ejemplo · demo",
    "Localidad de ejemplo · demo",
  ];
  let parent = country.id;
  for (const [i, kind] of [
    "region",
    "municipality",
    "parish",
    "locality",
  ].entries()) {
    parent = (
      await c.query(
        "INSERT INTO territories(name,kind,parent_id,source) VALUES($1,$2,$3,$4) ON CONFLICT(name,parent_id) DO UPDATE SET name=excluded.name RETURNING id",
        [names[i], kind, parent, "https://example.org/demo"],
      )
    ).rows[0].id;
  }
  for (const [i, category] of [
    "Naturaleza",
    "Hospedaje",
    "Gastronomía",
    "Cultura",
  ].entries())
    await c.query(
      `INSERT INTO places(id,name,category,territory_id,description,source,reviewed_at,status,published,demo) VALUES($1,$2,$3,$4,$5,'https://example.org/demo',CURRENT_DATE,'verified',true,true) ON CONFLICT(id) DO NOTHING`,
      [
        `00000000-0000-4000-8000-00000000000${i}`,
        [
          "Paisaje por descubrir",
          "Una pausa en el camino",
          "Sabores de nuestra tierra",
          "Memoria de un pueblo",
        ][i] + " · DEMO",
        category,
        parent,
        "Registro sintético para explorar la interfaz. No representa un lugar, negocio, recomendación ni verificación real. La ubicación exacta, imágenes y tarifas quedan pendientes.",
      ],
    );
  await c.query("COMMIT");
  console.log("Cuatro fichas DEMO sin fotos ni coordenadas ficticias.");
} catch (e) {
  await c.query("ROLLBACK");
  throw e;
} finally {
  c.release();
  await pool.end();
}

export {};
