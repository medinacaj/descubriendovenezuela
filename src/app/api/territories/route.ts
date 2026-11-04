import { territories } from "../../../lib/repository";
export async function GET() {
  try {
    return Response.json(await territories());
  } catch {
    return Response.json({ error: "No disponible" }, { status: 503 });
  }
}
