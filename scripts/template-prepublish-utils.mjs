import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

export function ensurePathExists(rootDir, relativePath) {
  const targetPath = path.join(rootDir, relativePath);
  if (!fs.existsSync(targetPath)) {
    throw new Error(`Missing required path: ${relativePath}`);
  }
  return targetPath;
}

export function readTextFile(rootDir, relativePath) {
  const targetPath = ensurePathExists(rootDir, relativePath);
  return fs.readFileSync(targetPath, "utf8");
}

export function readJsonFile(rootDir, relativePath) {
  const content = readTextFile(rootDir, relativePath);
  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(
      `Failed to parse ${relativePath}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

function stripComments(input) {
  return input
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/^\s*#.*$/gm, "")
    .trim();
}

export function ensureMeaningfulText(rootDir, relativePath, markers) {
  const content = readTextFile(rootDir, relativePath);
  if (!stripComments(content)) {
    throw new Error(`${relativePath} is empty or comment-only`);
  }

  if (
    markers.length > 0 &&
    !markers.some((marker) => content.includes(marker))
  ) {
    throw new Error(
      `${relativePath} does not contain any expected markers: ${markers.join(", ")}`,
    );
  }
}

export function ensureDirectoryHasFiles(rootDir, relativeDir, matcher) {
  const targetDir = ensurePathExists(rootDir, relativeDir);
  const entries = fs
    .readdirSync(targetDir)
    .filter((entry) => matcher(entry, path.join(targetDir, entry)));
  if (entries.length === 0) {
    throw new Error(`${relativeDir} does not contain any matching assets`);
  }
}

export function ensureNoForbiddenImportPatterns(
  rootDir,
  relativeDirectories,
  forbiddenPatterns,
) {
  const violations = [];

  function visitDirectory(targetDir) {
    if (!fs.existsSync(targetDir)) {
      return;
    }

    for (const entry of fs.readdirSync(targetDir, { withFileTypes: true })) {
      const absolutePath = path.join(targetDir, entry.name);
      if (entry.isDirectory()) {
        visitDirectory(absolutePath);
        continue;
      }

      if (!/\.(?:[cm]?[jt]sx?|vue)$/i.test(entry.name)) {
        continue;
      }

      const relativePath = path
        .relative(rootDir, absolutePath)
        .replaceAll("\\", "/");
      const content = fs.readFileSync(absolutePath, "utf8");

      for (const { pattern, label } of forbiddenPatterns) {
        if (pattern.test(content)) {
          violations.push(`${relativePath}: ${label}`);
        }
      }
    }
  }

  for (const relativeDirectory of relativeDirectories) {
    visitDirectory(path.join(rootDir, relativeDirectory));
  }

  if (violations.length > 0) {
    throw new Error(
      `Forbidden runtime token-source imports detected:\n${violations.join("\n")}`,
    );
  }
}

export function ensureTemplateConfigShape(config, expected) {
  const requiredStringFields = [
    "id",
    "label",
    "title",
    "description",
    "framework",
    "runtime",
    "sourceType",
    "templatePath",
    "promptProfile",
    "themeProfile",
    "validatorProfile",
  ];

  for (const field of requiredStringFields) {
    if (
      typeof config[field] !== "string" ||
      config[field].trim().length === 0
    ) {
      throw new Error(
        `template.config.json has empty or missing field: ${field}`,
      );
    }
  }

  if (!Array.isArray(config.stack) || config.stack.length === 0) {
    throw new Error("template.config.json must declare a non-empty stack");
  }

  if (
    !Array.isArray(config.targetPlatforms) ||
    config.targetPlatforms.length === 0
  ) {
    throw new Error("template.config.json must declare targetPlatforms");
  }

  if (
    !Array.isArray(config.protectedFiles) ||
    config.protectedFiles.length === 0
  ) {
    throw new Error("template.config.json must declare protectedFiles");
  }

  if (!config.defaultCommands?.typecheck || !config.defaultCommands?.build) {
    throw new Error(
      "template.config.json must declare defaultCommands.typecheck and defaultCommands.build",
    );
  }

  if (!config.capabilities || typeof config.capabilities !== "object") {
    throw new Error("template.config.json must declare capabilities");
  }

  if (!config.validation || typeof config.validation !== "object") {
    throw new Error("template.config.json must declare validation");
  }

  if (config.id !== expected.id) {
    throw new Error(
      `template.config.json id mismatch: expected ${expected.id}, got ${config.id}`,
    );
  }

  if (config.templatePath !== expected.templatePath) {
    throw new Error(
      `template.config.json templatePath mismatch: expected ${expected.templatePath}, got ${config.templatePath}`,
    );
  }
}

function collectMatches(input, pattern) {
  return Array.from(input.matchAll(pattern), (match) => match[1]);
}

export function ensureCssVariableStructure(rootDir, relativePath, options) {
  const {
    requiredScopeMarkers = [],
    requiredVariablePrefixes = [],
    allowedVariablePrefixes = [],
  } = options;
  const content = readTextFile(rootDir, relativePath);
  const normalized = stripComments(content);

  if (!normalized) {
    throw new Error(`${relativePath} is empty or comment-only`);
  }

  for (const marker of requiredScopeMarkers) {
    if (!content.includes(marker)) {
      throw new Error(
        `${relativePath} is missing required scope marker: ${marker}`,
      );
    }
  }

  const variableNames = collectMatches(content, /--([a-z0-9-]+)\s*:/g);
  if (variableNames.length === 0) {
    throw new Error(`${relativePath} does not declare any CSS variables`);
  }

  for (const prefix of requiredVariablePrefixes) {
    if (!variableNames.some((name) => name.startsWith(prefix))) {
      throw new Error(
        `${relativePath} is missing variables with prefix: ${prefix}`,
      );
    }
  }

  if (allowedVariablePrefixes.length > 0) {
    const invalidNames = variableNames.filter(
      (name) =>
        !allowedVariablePrefixes.some((prefix) => name.startsWith(prefix)),
    );

    if (invalidNames.length > 0) {
      throw new Error(
        `${relativePath} contains out-of-contract variable names: ${invalidNames.join(", ")}`,
      );
    }
  }
}

export function ensureScssTokenStructure(rootDir, relativePath, options) {
  const { requiredVariablePrefixes = [], requiredMapName = "$tokens" } =
    options;
  const content = readTextFile(rootDir, relativePath);
  const normalized = stripComments(content);

  if (!normalized) {
    throw new Error(`${relativePath} is empty or comment-only`);
  }

  const variableNames = collectMatches(content, /\$([a-z0-9-]+)\s*:/g);
  if (variableNames.length === 0) {
    throw new Error(
      `${relativePath} does not declare any SCSS token variables`,
    );
  }

  for (const prefix of requiredVariablePrefixes) {
    if (!variableNames.some((name) => name.startsWith(prefix))) {
      throw new Error(
        `${relativePath} is missing SCSS variables with prefix: ${prefix}`,
      );
    }
  }

  if (!content.includes(`${requiredMapName}: (`)) {
    throw new Error(
      `${relativePath} is missing the ${requiredMapName} token map`,
    );
  }
}

export function ensureTsTokenStructure(rootDir, relativePath, options) {
  const { requiredTopLevelKeys = [], requiredNestedMarkers = [] } = options;
  const content = readTextFile(rootDir, relativePath);
  const normalized = stripComments(content);

  if (!normalized) {
    throw new Error(`${relativePath} is empty or comment-only`);
  }

  if (!content.includes("export const tokens =")) {
    throw new Error(`${relativePath} is missing the tokens export`);
  }

  if (!content.includes("export type Tokens = typeof tokens")) {
    throw new Error(`${relativePath} is missing the Tokens type export`);
  }

  for (const key of requiredTopLevelKeys) {
    if (!new RegExp(`["']?${key}["']?\\s*:`).test(content)) {
      throw new Error(`${relativePath} is missing top-level token key: ${key}`);
    }
  }

  for (const marker of requiredNestedMarkers) {
    if (!content.includes(marker)) {
      throw new Error(`${relativePath} is missing token marker: ${marker}`);
    }
  }
}

export function ensureThemeFileStructure(rootDir, relativePath, options) {
  const { requiredScopeMarkers = [], requiredVariablePrefixes = [] } = options;
  const content = readTextFile(rootDir, relativePath);
  const normalized = stripComments(content);

  if (!normalized) {
    throw new Error(`${relativePath} is empty or comment-only`);
  }

  for (const marker of requiredScopeMarkers) {
    if (!content.includes(marker)) {
      throw new Error(
        `${relativePath} is missing required theme scope: ${marker}`,
      );
    }
  }

  const variableNames = collectMatches(content, /--([a-z0-9-]+)\s*:/g);
  if (variableNames.length === 0) {
    throw new Error(`${relativePath} does not declare any theme variables`);
  }

  for (const prefix of requiredVariablePrefixes) {
    if (!variableNames.some((name) => name.startsWith(prefix))) {
      throw new Error(
        `${relativePath} is missing theme variables with prefix: ${prefix}`,
      );
    }
  }
}

export function ensureStructuredMapping(rootDir, relativePath, options) {
  const {
    requiredMarkers = [],
    minimumVarUsages = 1,
    variableNeedle = "var(--theme-",
  } = options;
  const content = readTextFile(rootDir, relativePath);
  const normalized = stripComments(content);

  if (!normalized) {
    throw new Error(`${relativePath} is empty or comment-only`);
  }

  for (const marker of requiredMarkers) {
    if (!content.includes(marker)) {
      throw new Error(`${relativePath} is missing mapping marker: ${marker}`);
    }
  }

  const usageCount = content.split(variableNeedle).length - 1;
  if (usageCount < minimumVarUsages) {
    throw new Error(
      `${relativePath} does not contain enough theme variable mappings (${usageCount}/${minimumVarUsages})`,
    );
  }
}

export function ensureStructuredObjectMapping(rootDir, relativePath, options) {
  const {
    requiredMarkers = [],
    minimumTokenReferences = 1,
    tokenNeedle = "tokens.",
  } = options;
  const content = readTextFile(rootDir, relativePath);
  const normalized = stripComments(content);

  if (!normalized) {
    throw new Error(`${relativePath} is empty or comment-only`);
  }

  for (const marker of requiredMarkers) {
    if (!content.includes(marker)) {
      throw new Error(`${relativePath} is missing mapping marker: ${marker}`);
    }
  }

  const referenceCount = content.split(tokenNeedle).length - 1;
  if (referenceCount < minimumTokenReferences) {
    throw new Error(
      `${relativePath} does not contain enough token references (${referenceCount}/${minimumTokenReferences})`,
    );
  }
}

export function runNpmStep(label, args, cwd) {
  console.log(`\n> ${label}`);
  const result =
    process.platform === "win32"
      ? spawnSync(
          process.env.ComSpec ?? "cmd.exe",
          ["/d", "/s", "/c", "npm", ...args],
          {
            cwd,
            stdio: "inherit",
            shell: false,
            env: process.env,
          },
        )
      : spawnSync("npm", args, {
          cwd,
          stdio: "inherit",
          shell: false,
          env: process.env,
        });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      `${label} failed with exit code ${result.status ?? "unknown"}`,
    );
  }
}

export function runNodeStep(label, scriptPath, cwd) {
  console.log(`\n> ${label}`);
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd,
    stdio: "inherit",
    shell: false,
    env: process.env,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      `${label} failed with exit code ${result.status ?? "unknown"}`,
    );
  }
}
