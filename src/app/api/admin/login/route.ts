import { login, validOrigin } from "../../../../lib/auth";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  if (!validOrigin(req))
    return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
  const f = await req.formData();
  try {
    const email = String(f.get("email") || "").slice(0, 200),
      password = String(f.get("password") || "").slice(0, 200);
    const token = await login(
      email,
      password,
      "account:" + email.toLowerCase().trim(),
    );
    const res = NextResponse.redirect(
      new URL("/admin", process.env.APP_ORIGIN || "http://localhost:3000"),
      303,
    );
    res.cookies.set("vem_session", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.APP_ORIGIN?.startsWith("https://"),
      path: "/",
      maxAge: 28800,
    });
    return res;
  } catch (e) {
    const res = NextResponse.redirect(
      new URL(
        "/admin?error=login",
        process.env.APP_ORIGIN || "http://localhost:3000",
      ),
      303,
    );
    return res;
  }
}
