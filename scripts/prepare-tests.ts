process.loadEnvFile(".env");
const { pool } = await import("../src/lib/db");
try {
  if (
    !(
      await pool.query(
        "SELECT 1 FROM pg_database WHERE datname='venezuela_test'",
      )
    ).rowCount
  )
    await pool.query("CREATE DATABASE venezuela_test");
} finally {
  await pool.end();
}
export {};
