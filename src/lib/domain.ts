import { z } from "zod";
const https = z
  .string()
  .url()
  .refine((s) => s.startsWith("https://"), "Usa una fuente HTTPS");
export const categories = [
  "Naturaleza",
  "Hospedaje",
  "Gastronomía",
  "Cultura",
  "Negocios y servicios",
] as const;
export const placeSchema = z
  .object({
    name: z.string().trim().min(3).max(120),
    category: z.enum(categories),
    territoryId: z.coerce.number().int().positive(),
    description: z.string().trim().min(10).max(5000),
    source: z.union([z.literal(""), https]),
    reviewedAt: z
      .string()
      .refine(
        (s) =>
          s === "" || (/^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s))),
      ),
    status: z.enum(["proposed", "verified", "outdated", "closed"]),
    published: z.boolean(),
    sensitive: z.boolean(),
    lat: z.number().min(-90).max(90).nullable(),
    lon: z.number().min(-180).max(180).nullable(),
    demo: z.boolean().default(false),
  })
  .superRefine((p, c) => {
    if (p.published && (!p.source || !p.reviewedAt || p.status !== "verified"))
      c.addIssue({
        code: "custom",
        message: "Publicar exige fuente, fecha de revisión y estado verificado",
      });
    if ((p.lat === null) !== (p.lon === null))
      c.addIssue({
        code: "custom",
        message: "Indica ambas coordenadas o ninguna",
      });
  });
export type PlaceInput = z.infer<typeof placeSchema>;
export type Place = PlaceInput & {
  id: string;
  territory: string;
  region: string;
  updatedAt: string;
};
export function validatePlace(p: unknown) {
  return placeSchema.parse(p);
}
export function publicPlace(p: Place) {
  if (!p.published) return null;
  return {
    ...p,
    lat: p.sensitive ? null : p.lat,
    lon: p.sensitive ? null : p.lon,
  };
}
export type Price = {
  amount: number;
  currency: string;
  unit: string;
  source: string;
  validUntil: string;
};
export function priceLabel(p: Price | null, now = new Date()) {
  return !p || !p.source || new Date(p.validUntil + "T23:59:59Z") < now
    ? "Consultar precio"
    : `${p.amount} ${p.currency} / ${p.unit}`;
}
