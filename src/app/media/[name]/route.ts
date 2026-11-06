import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import licensedPhotos from "../../../../content/licensed-photographs.json";

// Lista cerrada de mapas y fotografías auditadas. Sin rutas arbitrarias.
const allowed = new Set([
  "mapa-caracas-ciudad.webp", "mapa-ciudad-bolivar.webp",
  "mapa-cumana-ciudad.webp", "mapa-merida-ciudad.webp",
  "mapa-porlamar.webp", "mapa-san-cristobal.webp",
  ...licensedPhotos.map(photo => photo.output),
]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  if (!allowed.has(name)) return new Response("No encontrado", { status: 404 });
  try {
    const data = await readFile(join(process.cwd(), "docs", "media", name));
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("No disponible", { status: 503 });
  }
}
