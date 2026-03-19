import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

const rootDir = path.dirname(
  fileURLToPath(new URL("../package.json", import.meta.url)),
);
const srcDir = path.join(rootDir, "src");
const jiti = createJiti(import.meta.url, {
  interopDefault: true,
  moduleCache: false,
});

async function loadConfigModule(relativePath) {
  const absolutePath = path.join(rootDir, relativePath);
  const loaded = await jiti.import(absolutePath, { default: true });
  return loaded?.default ?? loaded;
}

async function writeJson(relativePath, config) {
  const absolutePath = path.join(srcDir, relativePath);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

const pagesConfig = await loadConfigModule("pages.config.ts");
const manifestConfig = await loadConfigModule("manifest.config.ts");
const compiledTokensModule = await loadConfigModule("src/theme/tokens.ts");
const compiledTokens = compiledTokensModule.tokens ?? compiledTokensModule;

pagesConfig.globalStyle = {
  ...pagesConfig.globalStyle,
  navigationBarBackgroundColor: compiledTokens.theme.light.color.surface.card,
  backgroundColor: compiledTokens.theme.light.color.surface.page,
};

await writeJson("pages.json", pagesConfig);
await writeJson("manifest.json", manifestConfig);

console.log("SYNC_UNI_CONFIG_OK");
