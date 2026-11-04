import { currentUser, validOrigin } from "../../../../lib/auth";
import { savePlace } from "../../../../lib/repository";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  if (!validOrigin(req))
    return new Response("Origen no permitido", { status: 403 });
  const user = await currentUser();
  if (!user) return new Response("Sesión requerida", { status: 401 });
  const f = await req.formData();
  const id = String(f.get("id") || "");
  if (id && !/^[0-9a-f-]{36}$/i.test(id))
    return new Response("ID inválido", { status: 400 });
  try {
    await savePlace(
      {
        name: String(f.get("name") || ""),
        description: String(f.get("description") || ""),
        category: String(f.get("category")) as any,
        territoryId: Number(f.get("territoryId")),
        source: String(f.get("source") || ""),
        reviewedAt: String(f.get("reviewedAt") || ""),
        status: String(f.get("status")) as any,
        published: f.get("published") === "on",
        sensitive: f.get("sensitive") === "on",
        lat: f.get("lat") ? Number(f.get("lat")) : null,
        lon: f.get("lon") ? Number(f.get("lon")) : null,
        demo: f.get("demo") === "on",
      },
      user.id,
      id || undefined,
    );
    return NextResponse.redirect(
      new URL(
        "/admin?saved=1",
        process.env.APP_ORIGIN || "http://localhost:3000",
      ),
      303,
    );
  } catch {
    return NextResponse.redirect(
      new URL(
        "/admin?error=validation" + (id ? "&edit=" + id : ""),
        process.env.APP_ORIGIN || "http://localhost:3000",
      ),
      303,
    );
  }
}
