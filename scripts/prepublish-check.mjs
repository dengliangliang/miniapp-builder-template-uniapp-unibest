import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateTokenSources } from "../../scripts/token-source-validator.mjs";
import {
  ensureCssVariableStructure,
  ensureDirectoryHasFiles,
  ensureNoForbiddenImportPatterns,
  ensurePathExists,
  ensureScssTokenStructure,
  ensureStructuredMapping,
  ensureStructuredObjectMapping,
  ensureThemeFileStructure,
  ensureTemplateConfigShape,
  ensureTsTokenStructure,
  readJsonFile,
  runNodeStep,
  runNpmStep,
} from "../../scripts/template-prepublish-utils.mjs";

const templateRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const repoRoot = path.resolve(templateRoot, "..");

const expectedTemplate = {
  id: "uniapp-unibest",
  templatePath: "scaffold",
};

const config = readJsonFile(templateRoot, "template.config.json");

console.log("Running uniapp-unibest prepublish checks...");

runNodeStep(
  "template contract",
  path.join(repoRoot, "scripts", "check-template-contract.mjs"),
  repoRoot,
);

ensureTemplateConfigShape(config, expectedTemplate);
ensurePathExists(templateRoot, "style-dictionary.config.mjs");
ensurePathExists(templateRoot, "package.json");
ensurePathExists(templateRoot, "src/components/AppIcon.vue");
ensurePathExists(templateRoot, "src/theme/platform-theme.ts");
ensurePathExists(templateRoot, "src/theme/wot-theme.scss");

ensureNoForbiddenImportPatterns(
  templateRoot,
  ["src"],
  [
    {
      pattern:
        /from\s+["'][^"']*tokens\/(?:base|light|dark|brand-default)\.json["']/,
      label: "runtime code must not import source token JSON",
    },
    {
      pattern:
        /require\(\s*["'][^"']*tokens\/(?:base|light|dark|brand-default)\.json["']\s*\)/,
      label: "runtime code must not require source token JSON",
    },
  ],
);

runNpmStep("typecheck", ["run", "typecheck"], templateRoot);
runNpmStep("build:h5", ["run", "build:h5"], templateRoot);
runNpmStep("build:mp-weixin", ["run", "build:mp-weixin"], templateRoot);

const tokenWarnings = validateTokenSources(templateRoot, expectedTemplate.id);
for (const warning of tokenWarnings) {
  console.warn(`[token warning] ${warning.message}`);
}

ensureCssVariableStructure(templateRoot, "src/theme/tokens.css", {
  requiredScopeMarkers: [":root", "page"],
  requiredVariablePrefixes: ["global-color-", "global-space-", "theme-"],
  allowedVariablePrefixes: ["global-", "theme-"],
});
ensureScssTokenStructure(templateRoot, "src/theme/tokens.scss", {
  requiredVariablePrefixes: [
    "global-color-",
    "global-space-",
    "global-typography-",
    "theme-",
  ],
});
ensureTsTokenStructure(templateRoot, "src/theme/tokens.ts", {
  requiredTopLevelKeys: ["global", "theme"],
  requiredNestedMarkers: [
    "color:",
    "space:",
    "radius:",
    "shadow:",
    "typography:",
    "brandDefault:",
  ],
});
ensureStructuredMapping(templateRoot, "src/theme/wot-theme.scss", {
  requiredMarkers: ["--wot-color-theme", "--wot-button-primary-bg-color"],
  minimumVarUsages: 5,
});
ensureStructuredObjectMapping(templateRoot, "src/theme/platform-theme.ts", {
  requiredMarkers: [
    'from "./tokens"',
    "export const uniWindowTheme",
    "tokens.theme.light.color.surface.card",
    "tokens.theme.light.color.surface.page",
    'backgroundTextStyle: "light"',
  ],
  minimumTokenReferences: 2,
});
ensureStructuredMapping(templateRoot, "pages.config.ts", {
  requiredMarkers: [
    'import { uniWindowTheme } from "./src/theme/platform-theme"',
    "...uniWindowTheme",
  ],
  minimumVarUsages: 0,
  variableNeedle: "uniWindowTheme",
});
ensureStructuredMapping(templateRoot, "src/theme/icons/manifest.ts", {
  requiredMarkers: ["iconManifest", "src:"],
  minimumVarUsages: 0,
  variableNeedle: "src:",
});
ensureStructuredMapping(templateRoot, "src/components/AppIcon.vue", {
  requiredMarkers: ["@/theme/icons/manifest", "iconManifest"],
  minimumVarUsages: 0,
  variableNeedle: "iconManifest",
});
ensureThemeFileStructure(templateRoot, "src/theme/themes/light.css", {
  requiredScopeMarkers: [":root", '[data-theme="light"]'],
  requiredVariablePrefixes: ["theme-light-"],
});
ensureThemeFileStructure(templateRoot, "src/theme/themes/dark.css", {
  requiredScopeMarkers: ['[data-theme="dark"]'],
  requiredVariablePrefixes: ["theme-dark-"],
});
ensureThemeFileStructure(templateRoot, "src/theme/themes/brand-default.css", {
  requiredScopeMarkers: [":root", '[data-brand="default"]'],
  requiredVariablePrefixes: ["theme-brand-default-"],
});
ensureDirectoryHasFiles(templateRoot, "src/static/icons", (entry) =>
  entry.endsWith(".svg"),
);

console.log("\nuniapp-unibest prepublish checks passed.");
