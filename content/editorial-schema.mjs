import { z } from "zod";
const https = z
  .string()
  .url()
  .refine((value) => {
    const u = new URL(value);
    return u.protocol === "https:" && !u.username && !u.password;
  }, "Fuente HTTPS sin credenciales requerida");
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const d = new Date(value + "T00:00:00Z");
    return (
      Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === value
    );
  }, "Fecha imposible");
const image = z.object({
  src: z.string().regex(/^media\/foto-[a-z0-9-]+\.webp$/),
  alt: z.string().min(12),
  caption: z.string().min(5),
  author: z.string().min(2),
  sourceUrl: https,
  license: z.string().min(3),
  licenseUrl: https,
});
const news = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    category: z.string().min(3),
    date,
    source: z.string().min(3),
    title: z.string().min(15),
    summary: z.string().min(40),
    url: https,
    image,
    kind: z.enum(["news", "agenda"]),
    checkedOn: date,
    evidenceNote: z.string().min(25),
    startsOn: date.optional(),
    endsOn: date.optional(),
    corroborationUrls: z.array(https).optional(),
  })
  .superRefine((item, ctx) => {
    if (item.checkedOn < item.date)
      ctx.addIssue({
        code: "custom",
        message: "La revisión no puede preceder a la publicación",
      });
    if (
      item.kind === "agenda" &&
      (!item.startsOn || !item.endsOn || item.endsOn < item.startsOn)
    )
      ctx.addIssue({ code: "custom", message: "Agenda sin intervalo válido" });
  });
const schema = z
  .object({
    reviewedOn: date,
    news: z.array(news).min(3),
    creators: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          handle: z.string(),
          initials: z.string(),
          focus: z.string(),
          tag: z.string(),
          url: https,
          reference: https,
          image,
        }),
      )
      .min(1),
  })
  .superRefine((data, ctx) => {
    for (const items of [data.news, data.creators])
      if (new Set(items.map((i) => i.id)).size !== items.length)
        ctx.addIssue({ code: "custom", message: "IDs editoriales duplicados" });
    for (const n of data.news)
      if (n.checkedOn > data.reviewedOn)
        ctx.addIssue({
          code: "custom",
          message: "Revisión de noticia posterior a la selección",
        });
  });
export function validateEditorial(input, places) {
  const data = schema.parse(input);
  const photos = places
    .flatMap((p) => p.photos)
    .filter((p) => p.kind === "photograph");
  for (const item of [...data.news, ...data.creators]) {
    if (
      !photos.some((p) =>
        ["src", "author", "sourceUrl", "license", "licenseUrl"].every(
          (key) => p[key] === item.image[key],
        ),
      )
    )
      throw Error("Imagen sin crédito de catálogo acreditado: " + item.id);
  }
  return data;
}
export function editorialFreshness(
  data,
  today = new Date().toISOString().slice(0, 10),
) {
  date.parse(today);
  const ageDays = Math.floor(
    (Date.parse(today + "T00:00:00Z") -
      Date.parse(data.reviewedOn + "T00:00:00Z")) /
      86400000,
  );
  if (ageDays < 0) throw Error("La fecha de revisión está en el futuro");
  const staleEntries = data.news
    .filter(
      (item) =>
        (Date.parse(today + "T00:00:00Z") -
          Date.parse(item.checkedOn + "T00:00:00Z")) /
          86400000 >
        14,
    )
    .map((item) => item.id);
  const expiredAgendas = data.news
    .filter((item) => item.kind === "agenda" && item.endsOn < today)
    .map((item) => item.id);
  return {
    reviewedOn: data.reviewedOn,
    ageDays,
    staleEntries,
    expiredAgendas,
    stale: ageDays > 14 || staleEntries.length > 0 || expiredAgendas.length > 0,
  };
}
