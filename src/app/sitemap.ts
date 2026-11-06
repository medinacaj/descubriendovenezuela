import type { MetadataRoute } from "next";
import { pool } from "../lib/db";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.APP_ORIGIN;
  if (process.env.SITE_PUBLIC_READY !== "true" || !base || !base.startsWith("https://")) return [];
  const rows = await pool.query(
    "SELECT id,updated_at FROM places WHERE published=true AND demo=false ORDER BY id"
  );
  const pages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: base + "/explorar", changeFrequency: "weekly", priority: 0.8 },
  ];
  for (const row of rows.rows) pages.push({
    url: base + "/lugares/" + row.id,
    lastModified: row.updated_at,
    changeFrequency: "monthly",
    priority: 0.6,
  });
  return pages;
}
