/**
 * Transformaciones puras del catálogo documental compartido por Pages y Next.
 * No interpretar un registro de localidad como un negocio activo.
 */
export type CuratedEntry = {
  id: string;
  name: string;
  category: string;
  description: string;
  region?: string;
  country: "Venezuela";
  reviewedAt: string;
  verification: string;
  sourceUrls: string[];
  photos: Array<{
    kind?: string;
    src: string;
    alt: string;
    author: string;
    license: string;
    sourceUrl: string;
    licenseUrl: string;
    changes: string;
  }>;
  demo: false;
};

export const allowedCatalogCategories = [
  "Naturaleza", "Hospedaje", "Gastronomía", "Cultura",
  "Negocios y servicios", "Localidades",
] as const;

export function normaliseCatalogEntry(entry: CuratedEntry) {
  if (!/^[a-z0-9-]+$/.test(entry.id)) throw Error("ID de catálogo inválido");
  if (!allowedCatalogCategories.includes(entry.category as typeof allowedCatalogCategories[number]))
    throw Error("Categoría no admitida: " + entry.category);
  if (!entry.sourceUrls.length || !entry.sourceUrls.every(url => url.startsWith("https://")))
    throw Error("Sin fuente HTTPS para " + entry.id);
  if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(entry.reviewedAt) ||
      Number.isNaN(Date.parse(entry.reviewedAt)))
    throw Error("Fecha documental inválida: " + entry.id);
  if (entry.demo !== false) throw Error("No se importan registros demo");
  if (!entry.verification.trim()) throw Error("Falta alcance de revisión");
  return {
    catalogId: entry.id,
    name: entry.name,
    category: entry.category,
    description: entry.description,
    source: entry.sourceUrls[0],
    reviewedAt: entry.reviewedAt,
    verificationNote: entry.verification,
    region: entry.region || null,
    mediaCredits: entry.photos.map(photo => ({
      kind: photo.kind || "photograph",
      src: photo.src,
      alt: photo.alt,
      author: photo.author,
      license: photo.license,
      licenseUrl: photo.licenseUrl,
      sourceUrl: photo.sourceUrl,
      changes: photo.changes,
    })),
  };
}
