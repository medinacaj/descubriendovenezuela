/** Bound untrusted form bytes before parsing multipart or urlencoded content.
 * Request.formData() itself reads the entire body before validation.
 */
export class FormBodyError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "FormBodyError";
  }
}

export async function readLimitedFormData(request: Request, maxBytes: number): Promise<FormData> {
  if (!Number.isSafeInteger(maxBytes) || maxBytes <= 0) throw new RangeError("Límite inválido");
  const type = request.headers.get("content-type") || "";
  if (!/^(application\/x-www-form-urlencoded|multipart\/form-data)(?:;|$)/i.test(type)) {
    throw new FormBodyError("Tipo de formulario no admitido", 415);
  }
  const declared = request.headers.get("content-length");
  if (declared !== null && /^\d+$/.test(declared) && Number(declared) > maxBytes) {
    throw new FormBodyError("Formulario demasiado grande", 413);
  }
  if (!request.body) throw new FormBodyError("Formulario vacío", 400);

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  let oversized = false;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        oversized = true;
        throw new FormBodyError("Formulario demasiado grande", 413);
      }
      chunks.push(value);
    }
  } finally {
    if (oversized) await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
  const buffer = new Uint8Array(size);
  let offset = 0;
  for (const part of chunks) {
    buffer.set(part, offset);
    offset += part.byteLength;
  }
  try {
    return await new Request(request.url, {
      method: "POST",
      headers: { "content-type": type },
      body: buffer,
    }).formData();
  } catch {
    throw new FormBodyError("Formulario malformado", 400);
  }
}
