import { rm, mkdir, cp, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
// Only this disposable artifact is cleaned. Never remove the checked-in docs or data.
const destination = "work/pages";
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
execFileSync(process.execPath, ["scripts/build-pages.mjs"], {
  stdio: "inherit",
  env: { ...process.env, PAGES_OUTPUT_DIR: destination },
});
await cp("docs/media", destination + "/media", { recursive: true });
await writeFile(destination + "/.nojekyll", "");
