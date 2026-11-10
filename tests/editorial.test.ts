import { expect, it } from "vitest";
import data from "../content/editorial-highlights.json";
import places from "../content/places.json";
import {
  validateEditorial,
  editorialFreshness,
} from "../content/editorial-schema.mjs";
it("noticias documentadas conservan evidencia, fechas, créditos e imágenes licenciadas", () => {
  expect(validateEditorial(data, places).news.length).toBeGreaterThanOrEqual(6);
});
it("rechaza enlaces peligrosos, fechas imposibles y noticias duplicadas", () => {
  const p = structuredClone(data);
  p.news[0].url = "javascript:alert(1)";
  expect(() => validateEditorial(p, places)).toThrow();
  const d = structuredClone(data);
  d.news[0].date = "2026-02-30";
  expect(() => validateEditorial(d, places)).toThrow();
  expect(() =>
    validateEditorial({ ...data, news: [...data.news, data.news[0]] }, places),
  ).toThrow();
});
it("detecta una selección editorial sin revisar y no altera su fecha automáticamente", () => {
  const fixture = { ...data, reviewedOn: "2026-11-09" };
  expect(editorialFreshness(fixture, "2026-11-09").stale).toBe(false);
  expect(editorialFreshness(fixture, "2026-12-09").stale).toBe(true);
  expect(fixture.reviewedOn).toBe("2026-11-09");
});
it("renovar la fecha general no oculta noticias sin revisar ni agendas vencidas", () => {
  const fixture = { ...data, reviewedOn: "2026-12-09" };
  expect(editorialFreshness(fixture, "2026-12-09").stale).toBe(true);
  expect(editorialFreshness(fixture, "2026-12-09").staleEntries.length).toBe(
    data.news.length,
  );
  expect(
    editorialFreshness(fixture, "2026-12-09").expiredAgendas.length,
  ).toBeGreaterThan(0);
});
