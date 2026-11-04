import { searchPlaces } from "../../../lib/repository";
export async function GET(req: Request) {
  const s = new URL(req.url).searchParams;
  try {
    return Response.json(
      await searchPlaces({
        q: s.get("q") || "",
        category: s.get("category") || "",
        territory: s.get("territory") || "",
        page: Number(s.get("page")) || 1,
      }),
    );
  } catch {
    return Response.json(
      { error: "Catálogo temporalmente no disponible" },
      { status: 503 },
    );
  }
}
