import { describe, expect, it } from "vitest";
import { FormBodyError, readLimitedFormData } from "../src/lib/limited-form-data";

const url = "https://example.test/api/admin/login";
const form = (content: string) => new Request(url, {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: content,
});

describe("límites de formularios administrativos", () => {
  it("acepta una credencial urlencoded pequeña", async () => {
    const result = await readLimitedFormData(form("email=demo%40example.test&password=demo"), 1024);
    expect(result.get("email")).toBe("demo@example.test");
    expect(result.get("password")).toBe("demo");
  });
  it("acepta multipart y preserva todos los campos válidos", async () => {
    const data = new FormData();
    data.set("name", "Lugar de prueba");
    data.set("source", "https://example.org/registro");
    const result = await readLimitedFormData(new Request(url, { method: "POST", body: data }), 4096);
    expect(result.get("name")).toBe("Lugar de prueba");
    expect(result.get("source")).toBe("https://example.org/registro");
  });
  it("rechaza un cuerpo grande aunque el Content-Length sea falso", async () => {
    const request = form("email=" + "x".repeat(5000));
    request.headers.set("content-length", "1");
    await expect(readLimitedFormData(request, 128)).rejects.toMatchObject({ status: 413 });
  });
  it("rechaza un Content-Length grande antes de leer", async () => {
    const request = form("email=demo");
    request.headers.set("content-length", "99999");
    await expect(readLimitedFormData(request, 128)).rejects.toMatchObject({ status: 413 });
  });
  it("rechaza tipos inesperados y multipart malformado", async () => {
    const json = new Request(url, {
      method: "POST", headers: { "content-type": "application/json" }, body: "{}",
    });
    await expect(readLimitedFormData(json, 100)).rejects.toMatchObject({ status: 415 });
    const bad = new Request(url, {
      method: "POST", headers: { "content-type": "multipart/form-data; boundary=abc" }, body: "not a multipart request",
    });
    await expect(readLimitedFormData(bad, 100)).rejects.toMatchObject({ status: 400 });
  });
});
