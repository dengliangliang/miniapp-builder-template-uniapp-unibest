import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const rootDir = path.dirname(
  fileURLToPath(new URL("../package.json", import.meta.url)),
);
const viteChunkDir = path.join(
  rootDir,
  "node_modules",
  "vite",
  "dist",
  "node",
  "chunks",
);
const viteChunkFiles = (await readdir(viteChunkDir))
  .filter((fileName) => /^dep-.*\.js$/.test(fileName))
  .map((fileName) => path.join(viteChunkDir, fileName));

if (viteChunkFiles.length === 0) {
  throw new Error("Could not find Vite dep chunk to patch.");
}

const shimImport = pathToFileURL(
  path.join(rootDir, "scripts", "esbuild-shim.mjs"),
).href;
const shimRequire = JSON.stringify(
  path.join(rootDir, "scripts", "esbuild-shim.cjs"),
);
const uniCliCssFile = path.join(
  rootDir,
  "node_modules",
  "@dcloudio",
  "uni-cli-shared",
  "dist",
  "vite",
  "plugins",
  "vitejs",
  "plugins",
  "css.js",
);

for (const viteChunkFile of viteChunkFiles) {
  const source = await readFile(viteChunkFile, "utf8");
  let nextSource = source.replace("from 'esbuild';", `from '${shimImport}';`);

  nextSource = nextSource.replace(
    /const requireResolveFromRootWithFallback = \(root, id\) => \{[\s\S]*?return _require\$1\.resolve\(id, \{ paths: \[root, _dirname\] \}\);\n\};/,
    `const requireResolveFromRootWithFallback = (root, id) => {
    const candidateRoots = [...new Set([
        root,
        typeof root === 'string' ? root.replace(/\\\\/g, '/') : root,
        _dirname,
    ].filter(Boolean))];
    for (const candidateRoot of candidateRoots) {
        try {
            return _require$1.resolve(id, { paths: [candidateRoot, _dirname] });
        }
        catch (error) {
            if (error?.code !== 'MODULE_NOT_FOUND') {
                throw error;
            }
        }
    }
    const found = candidateRoots
        .map((candidateRoot) => resolvePackageData(id, candidateRoot))
        .find(Boolean) || resolvePackageData(id, _dirname);
    if (!found) {
        const error = new Error(\`\${JSON.stringify(id)} not found.\`);
        error.code = 'MODULE_NOT_FOUND';
        throw error;
    }
    return _require$1.resolve(id, { paths: candidateRoots });
};`,
  );

  if (source === nextSource) {
    continue;
  }

  await writeFile(viteChunkFile, nextSource, "utf8");
}

const uniCliCssSource = await readFile(uniCliCssFile, "utf8");
const patchedUniCliCssSource = uniCliCssSource.replaceAll(
  "require('esbuild')",
  `require(${shimRequire})`,
);

if (patchedUniCliCssSource !== uniCliCssSource) {
  await writeFile(uniCliCssFile, patchedUniCliCssSource, "utf8");
}
