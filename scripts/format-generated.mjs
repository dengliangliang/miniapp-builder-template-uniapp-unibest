import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const templateRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const helperPath = path.resolve(
  templateRoot,
  "..",
  "scripts",
  "format-template-generated.mjs",
);

if (!fs.existsSync(helperPath)) {
  process.exit(0);
}

const result = spawnSync(
  process.execPath,
  [
    helperPath,
    "--template-root",
    "scaffold",
    "--files",
    "src/theme/tokens.css",
    "src/theme/tokens.scss",
    "src/theme/tokens.ts",
    "src/theme/themes/light.css",
    "src/theme/themes/dark.css",
    "src/theme/themes/brand-default.css",
    "src/theme/icons/manifest.ts",
    "src/theme/uno.css",
  ],
  {
    cwd: path.resolve(templateRoot, ".."),
    stdio: "inherit",
    shell: false,
    env: process.env,
  },
);

if (result.error) {
  throw result.error;
}

if (result.status !== 0) {
  throw new Error(
    `format-generated failed with exit code ${result.status ?? "unknown"}`,
  );
}
