import { readFile, appendFile } from "node:fs/promises";
import {
  validateEditorial,
  editorialFreshness,
} from "../content/editorial-schema.mjs";
const data = validateEditorial(
  JSON.parse(await readFile("content/editorial-highlights.json", "utf8")),
  JSON.parse(await readFile("content/places.json", "utf8")),
);
const freshness = editorialFreshness(data);
const summary = `Noticias: ${data.news.length}; perfiles: ${data.creators.length}. Revisión documental: ${data.reviewedOn}. Antigüedad: ${freshness.ageDays} días. ${freshness.stale ? "Revisión editorial requerida." : "Selección dentro del intervalo de revisión."}`;
console.log(summary);
if (freshness.staleEntries.length)
  console.log(
    "Noticias sin revisión reciente: " + freshness.staleEntries.join(", "),
  );
if (freshness.expiredAgendas.length)
  console.log("Agendas vencidas: " + freshness.expiredAgendas.join(", "));
if (process.env.GITHUB_STEP_SUMMARY)
  await appendFile(process.env.GITHUB_STEP_SUMMARY, summary + "\n");
if (process.argv.includes("--freshness") && freshness.stale)
  process.exitCode = 1;
