import { copyFileSync } from "node:fs";
for (const name of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"])
  copyFileSync("node_modules/maplibre-gl/dist/" + name, "public/" + name);
