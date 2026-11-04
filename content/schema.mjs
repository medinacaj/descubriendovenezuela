import { z } from "zod";
const https = z
  .string()
  .url()
  .refine((s) => s.startsWith("https://"));
export const photoSchema = z.object({
  kind: z.enum(["photograph", "map"]).default("photograph"),
  src: z.string().regex(/^media\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/),
  alt: z.string().trim().min(12),
  author: z.string().trim().min(2),
  sourceUrl: https,
  license: z.enum([
    "CC0 1.0",
    "CC BY 2.0",
    "CC BY 3.0",
    "CC BY 4.0",
    "CC BY-SA 2.0",
    "CC BY-SA 3.0",
    "CC BY-SA 4.0",
    "Dominio público",
  ]),
  licenseUrl: https,
  changes: z.string().trim().min(2),
});
export const catalogSchema = z
  .array(
    z
      .object({
        id: z.string().regex(/^[a-z0-9-]+$/),
        name: z.string().trim().min(3),
        category: z.enum([
          "Naturaleza",
          "Cultura",
          "Hospedaje",
          "Gastronomía",
          "Negocios y servicios",
          "Localidades",
        ]),
        country: z.literal("Venezuela"),
        description: z.string().min(40),
        reviewedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        verification: z.string().min(20),
        sourceUrls: z.array(https).min(1),
        sourceLabels: z.array(z.string()).optional(),
        primaryUrl: https.optional(),
        primaryConsulted: z.boolean(),
        unescoReference: z.number().optional(),
        inscriptionYear: z.number().optional(),
        region: z.string().optional(),
        locality: z.string().optional(),
        lat: z.null(),
        lon: z.null(),
        price: z.null(),
        photos: z.array(photoSchema),
        demo: z.literal(false),
      })
      .strict(),
  )
  .superRefine((items, c) => {
    if (new Set(items.map((p) => p.id)).size !== items.length)
      c.addIssue({ code: "custom", message: "IDs duplicados" });
  });
