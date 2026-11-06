import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const base = process.env.APP_ORIGIN;
  const ready = process.env.SITE_PUBLIC_READY === "true" && !!base?.startsWith("https://");
  return {
    rules: ready
      ? [{ userAgent: "*", allow: "/", disallow: "/admin" }]
      : [{ userAgent: "*", disallow: "/" }],
    ...(ready ? { sitemap: base + "/sitemap.xml" } : {}),
  };
}
