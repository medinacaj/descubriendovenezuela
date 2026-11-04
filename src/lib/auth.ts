import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { cookies } from "next/headers";
import { pool } from "./db";
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return salt + ":" + scryptSync(password, salt, 64).toString("hex");
}
export function checkPassword(password: string, stored: string) {
  const [salt, key] = stored.split(":");
  const value = scryptSync(password, salt, 64);
  return key.length === 128 && timingSafeEqual(value, Buffer.from(key, "hex"));
}
export const digest = (s: string) =>
  createHash("sha256").update(s).digest("hex");
export async function currentUser() {
  const token = (await cookies()).get("vem_session")?.value;
  if (!token) return null;
  return (
    (
      await pool.query(
        "SELECT u.id,u.email FROM sessions s JOIN admin_users u ON u.id=s.user_id WHERE token_hash=$1 AND expires_at>now()",
        [digest(token)],
      )
    ).rows[0] || null
  );
}
export function validOrigin(request: Request) {
  return (
    request.headers.get("origin") ===
    (process.env.APP_ORIGIN || "http://localhost:3000")
  );
}
export async function login(email: string, password: string, ip: string) {
  const attempt = await pool.query(
    `INSERT INTO login_attempts(ip) VALUES($1) ON CONFLICT(ip) DO UPDATE SET attempts=CASE WHEN login_attempts.window_start<now()-interval '15 minutes' THEN 1 ELSE login_attempts.attempts+1 END,window_start=CASE WHEN login_attempts.window_start<now()-interval '15 minutes' THEN now() ELSE login_attempts.window_start END RETURNING attempts`,
    [ip],
  );
  if (attempt.rows[0].attempts > 10)
    throw Error("Demasiados intentos. Espera 15 minutos.");
  const user = (
    await pool.query("SELECT * FROM admin_users WHERE email=$1", [
      email.toLowerCase().trim(),
    ])
  ).rows[0];
  const dummy = "00000000000000000000000000000000:" + "00".repeat(64);
  const valid = checkPassword(password, user?.password_hash || dummy);
  if (!user || !valid) throw Error("Credenciales incorrectas");
  await pool.query("DELETE FROM login_attempts WHERE ip=$1", [ip]);
  const token = randomBytes(32).toString("hex");
  await pool.query(
    "INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '8 hours')",
    [digest(token), user.id],
  );
  return token;
}
