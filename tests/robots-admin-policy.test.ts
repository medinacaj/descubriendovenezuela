import { afterEach, describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import robots from "../src/app/robots";

const previous = {
  SITE_PUBLIC_READY: process.env.SITE_PUBLIC_READY,
  APP_ORIGIN: process.env.APP_ORIGIN,
};

afterEach(() => {
  for (const [key, value] of Object.entries(previous)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

describe("indexación segura para contenido editorial y administrador", () => {
  it("bloquea todo si publicación no fue aprobada", () => {
    delete process.env.SITE_PUBLIC_READY;
    process.env.APP_ORIGIN = "https://ejemplo.org";
    expect(robots()).toEqual({ rules: [{ userAgent: "*", disallow: "/" }] });
  });

  it("no permite indexar con origen inseguro o ausente", () => {
    process.env.SITE_PUBLIC_READY = "true";
    process.env.APP_ORIGIN = "http://localhost:3000";
    expect(robots()).toEqual({ rules: [{ userAgent: "*", disallow: "/" }] });
    delete process.env.APP_ORIGIN;
    expect(robots()).toEqual({ rules: [{ userAgent: "*", disallow: "/" }] });
  });

  it("solo habilita páginas públicas; deshabilita administrador y APIs", () => {
    process.env.SITE_PUBLIC_READY = "true";
    process.env.APP_ORIGIN = "https://ejemplo.org";
    const configured = robots();
    expect(configured.rules).toEqual([{
      userAgent: "*", allow: "/", disallow: ["/admin", "/api/"],
    }]);
    expect(configured.sitemap).toBe("https://ejemplo.org/sitemap.xml");
  });

  it("el administrador no tiene robots index y exige POST para credenciales", async () => {
    const admin = await readFile("src/app/admin/page.tsx", "utf8");
    expect(admin).toMatch(/robots:\s*\{index:false,follow:false\}/);
    expect(admin).toContain('action="/api/admin/login" method="post"');
    const published = await readFile("docs/robots.txt", "utf8");
    expect(published).toContain("Sitemap: https://medinacaj.github.io/descubriendovenezuela/sitemap.xml");
  });
});
