try {
  process.loadEnvFile(".env");
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
}
const { pool } = await import("../src/lib/db");
const { readFile } = await import("node:fs/promises");
try {
  await pool.query(await readFile("db/migrations/001_core.sql", "utf8"));
  console.log(
    "Migración aplicada; PostGIS:",
    (await pool.query("SELECT postgis_version()")).rows[0],
  );
} finally {
  await pool.end();
}

export {};
