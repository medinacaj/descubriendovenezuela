try {
  process.loadEnvFile(".env");
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
}
const { pool } = await import("../src/lib/db");
const { readFile, readdir } = await import("node:fs/promises");
try {
  const files = (await readdir("db/migrations")).filter((file) => /^\d+_[\w-]+\.sql$/.test(file)).sort();
  for (const file of files) await pool.query(await readFile(`db/migrations/${file}`, "utf8"));
  console.log(
    "Migración aplicada; PostGIS:",
    (await pool.query("SELECT postgis_version()")).rows[0],
  );
} finally {
  await pool.end();
}

export {};
