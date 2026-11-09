import type { Metadata } from "next";

/** Public IDs are shared with Pages; editorial UUIDs remain stable. */
export function placePath(place: { id: string; catalogId?: string | null }) {
  return "/lugares/" + encodeURIComponent(place.catalogId || place.id);
}
export function publicBase(): string | null {
  try {
    const url = new URL(process.env.APP_ORIGIN || "");
    return url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      url.pathname === "/"
      ? url.origin
      : null;
  } catch {
    return null;
  }
}
export function publicMetadata(
  path: string,
  title: string,
  description: string,
  indexable = true,
) {
  const base = publicBase();
  const ready = indexable && !!base && process.env.SITE_PUBLIC_READY === "true";
  const canonical = base ? base + path : undefined;
  return {
    title,
    description,
    robots: { index: ready, follow: ready },
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title,
      description,
      type: "website" as const,
      locale: "es_VE",
      ...(canonical ? { url: canonical } : {}),
    },
    twitter: { card: "summary" as const, title, description },
  } satisfies Metadata;
}
