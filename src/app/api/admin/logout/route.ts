import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { validOrigin, digest } from "../../../../lib/auth";
import { pool } from "../../../../lib/db";
export async function POST(req: Request) {
  if (!validOrigin(req))
    return new Response("Origen no permitido", { status: 403 });
  const token = (await cookies()).get("vem_session")?.value;
  if (token)
    await pool.query("DELETE FROM sessions WHERE token_hash=$1", [
      digest(token),
    ]);
  const r = NextResponse.redirect(
    new URL("/admin", process.env.APP_ORIGIN || "http://localhost:3000"),
    303,
  );
  r.cookies.delete("vem_session");
  return r;
}
