import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createGenerator } from "@unocss/core";
import unoConfig from "../uno.config.mjs";

const rootDir = path.dirname(
  fileURLToPath(new URL("../package.json", import.meta.url)),
);
const srcDir = path.join(rootDir, "src");
const outputFile = path.join(srcDir, "theme", "uno.css");

async function collectSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectSourceFiles(fullPath)));
      continue;
    }

    if (/\.(vue|ts|tsx|js|jsx|scss|css)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

const sourceFiles = await collectSourceFiles(srcDir);
const sourceText = (
  await Promise.all(sourceFiles.map((filePath) => readFile(filePath, "utf8")))
).join("\n");

const uno = await createGenerator(unoConfig);
const result = await uno.generate(sourceText, {
  preflights: true,
  minify: false,
});

await writeFile(outputFile, `${result.css}\n`, "utf8");

console.log("BUILD_UNO_OK");
