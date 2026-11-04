import { pool } from "../../../lib/db";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    await pool.query({
      text: "SELECT id FROM places LIMIT 1",
    });
    return Response.json(
      { status: "ready" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { status: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
