import { expect, it } from "vitest";
import { readFile } from "node:fs/promises";
it("robots se genera con líneas reales para que los buscadores lean sitemap y reglas", async () => {
  const robots = await readFile("docs/robots.txt", "utf8");
  expect(robots.split("\n")).toContain("User-agent: *");
  expect(robots.split("\n")).toContain(
    "Sitemap: https://medinacaj.github.io/descubriendovenezuela/sitemap.xml",
  );
  expect(robots).not.toContain("\\n");
});
it("el artefacto incluye todas las fichas y excluye datos privados y documentación operativa", async () => {
  const { execFileSync } = await import("node:child_process");
  const { readdir, stat } = await import("node:fs/promises");
  execFileSync(process.execPath, ["scripts/stage-pages.mjs"], {
    stdio: "pipe",
  });
  const entries = await readdir("work/pages");
  for (const privateName of [
    ".env",
    ".data",
    "operations.md",
    "progress.md",
    "README.md",
  ])
    expect(entries).not.toContain(privateName);
  const places = JSON.parse(await readFile("content/places.json", "utf8"));
  for (const place of places)
    expect(
      (await stat(`work/pages/lugares/${place.id}/index.html`)).size,
    ).toBeGreaterThan(1000);
  expect(await readFile("work/pages/robots.txt", "utf8")).toBe(
    await readFile("docs/robots.txt", "utf8"),
  );
});
