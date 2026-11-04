process.loadEnvFile(".env");
const { randomBytes } = await import("node:crypto");
const { writeFile, chmod } = await import("node:fs/promises");
const { hashPassword } = await import("../src/lib/auth");
const { pool } = await import("../src/lib/db");
try {
  if (
    (
      await pool.query(
        "SELECT 1 FROM admin_users WHERE email='editor@demo.local'",
      )
    ).rowCount
  ) {
    console.log("Cuenta existente, se conserva.");
  } else {
    const password = randomBytes(18).toString("base64url");
    await pool.query(
      "INSERT INTO admin_users(email,password_hash) VALUES($1,$2)",
      ["editor@demo.local", hashPassword(password)],
    );
    await writeFile(
      ".data/demo-access.json",
      JSON.stringify({ email: "editor@demo.local", password }),
    );
    await chmod(".data/demo-access.json", 0o600);
    await writeFile(
      ".data/ACCESO.md",
      `# Acceso editorial local\n\nCorreo: editor@demo.local\n\nContraseña: ${password}\n\nSolo para la demo local. No compartir ni publicar este archivo.\n`,
    );
    await chmod(".data/ACCESO.md", 0o600);
    console.log("Acceso generado en .data/ACCESO.md (ignorado por Git).");
  }
} finally {
  await pool.end();
}
export {};
