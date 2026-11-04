process.loadEnvFile(".env");
const { hashPassword } = await import("../src/lib/auth");
const { pool } = await import("../src/lib/db");
const email = process.env.ADMIN_EMAIL,
  password = process.env.ADMIN_PASSWORD;
if (!email || !password || password.length < 12)
  throw Error(
    "Define ADMIN_EMAIL y ADMIN_PASSWORD (mínimo 12 caracteres) solo para este comando.",
  );
try {
  await pool.query(
    "INSERT INTO admin_users(email,password_hash) VALUES($1,$2) ON CONFLICT(email) DO NOTHING",
    [email.toLowerCase(), hashPassword(password)],
  );
  console.log("Cuenta editorial preparada; contraseña no mostrada.");
} finally {
  await pool.end();
}

export {};
