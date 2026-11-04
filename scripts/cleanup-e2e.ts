process.loadEnvFile(".env");
const { pool } = await import("../src/lib/db");
const { getPlace, savePlace } = await import("../src/lib/repository");
try {
  const actor = (
    await pool.query(
      "SELECT id FROM admin_users WHERE email='editor@demo.local'",
    )
  ).rows[0].id;
  for (const row of (
    await pool.query(
      "SELECT id FROM places WHERE demo=true AND name LIKE 'E2E temporal %' AND published=true",
    )
  ).rows) {
    const p = await getPlace(row.id, true);
    await savePlace({ ...p!, published: false }, actor, row.id);
  }
  console.log("Fichas temporales retiradas con auditoría.");
} finally {
  await pool.end();
}
export {};
