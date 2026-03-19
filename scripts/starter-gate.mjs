import { readFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const templateRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const config = JSON.parse(
  readFileSync(path.join(templateRoot, "template.config.json"), "utf8"),
);

function parseTarget(argv) {
  const explicit = argv.find((item) => item.startsWith("--target="));
  if (explicit) {
    return explicit.slice("--target=".length);
  }

  const index = argv.indexOf("--target");
  if (index >= 0 && argv[index + 1]) {
    return argv[index + 1];
  }

  return config.id;
}

const target = parseTarget(process.argv.slice(2));
if (target !== config.id) {
  throw new Error(
    `starter:gate target mismatch for standalone template: expected ${config.id}, got ${target}`,
  );
}

const result = spawnSync(
  process.platform === "win32" ? (process.env.ComSpec ?? "cmd.exe") : "npm",
  process.platform === "win32"
    ? ["/d", "/s", "/c", "npm", "run", "prepublish:check"]
    : ["run", "prepublish:check"],
  {
    cwd: templateRoot,
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
    `starter:gate failed for ${config.id} with exit code ${result.status ?? "unknown"}`,
  );
}
