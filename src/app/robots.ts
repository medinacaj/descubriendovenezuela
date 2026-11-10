import { publicBase } from "../lib/public-urls";
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const base = publicBase();
  const ready =
    process.env.SITE_PUBLIC_READY === "true" && !!base?.startsWith("https://");
  return {
    rules: ready
      ? [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }]
      : [{ userAgent: "*", disallow: "/" }],
    ...(ready ? { sitemap: base + "/sitemap.xml" } : {}),
  };
}
