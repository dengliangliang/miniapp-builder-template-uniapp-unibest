import { templateTokenSchemas } from "./token-source-schemas.mjs";
import { readJsonFile, readTextFile } from "./template-prepublish-utils.mjs";
import {
  collectTopLevelCategories,
  compareShape,
  ensureLeafGroup,
  ensureNonEmptyObject,
  ensurePathShape,
  getByPath,
  hasAnyPath,
} from "./token-source-shape-utils.mjs";

function buildWarning(message) {
  return { severity: "warning", message };
}

function assertContains(text, needle, label) {
  if (!text.includes(needle)) {
    throw new Error(`${label} is missing expected marker: ${needle}`);
  }
}

function readTokenSources(templateRoot, schema) {
  const sources = {
    base: readJsonFile(templateRoot, schema.sourceFiles.base),
    light: readJsonFile(templateRoot, schema.sourceFiles.light),
    dark: readJsonFile(templateRoot, schema.sourceFiles.dark),
    brandDefault: readJsonFile(templateRoot, schema.sourceFiles.brandDefault),
  };

  for (const [name, source] of Object.entries(sources)) {
    ensureNonEmptyObject(source, schema.sourceFiles[name]);
  }

  return sources;
}

function validateSourceCategories(sources, schema) {
  const warnings = [];

  for (const tokenPath of schema.requiredBaseCategories) {
    ensurePathShape(sources.base, tokenPath, schema.sourceFiles.base);
  }

  for (const tokenPath of schema.optionalBaseCategories) {
    if (getByPath(sources.base, tokenPath) === undefined) {
      warnings.push(
        buildWarning(
          `${schema.sourceFiles.base} is missing optional category ${tokenPath.join(".")}`,
        ),
      );
    }
  }

  for (const [themeName, rule] of Object.entries(schema.themeFiles)) {
    const source = sources[themeName];
    ensurePathShape(source, rule.rootPath, schema.sourceFiles[themeName]);

    for (const tokenPath of rule.requiredCategories) {
      ensurePathShape(source, tokenPath, schema.sourceFiles[themeName]);
    }
  }

  for (const { file, path } of schema.requiredLeafGroups) {
    ensureLeafGroup(
      ensurePathShape(sources[file], path, schema.sourceFiles[file]),
      `${schema.sourceFiles[file]}.${path.join(".")}`,
    );
  }

  return warnings;
}

function validateThemeConsistency(sources, schema) {
  for (const comparableGroup of schema.comparableThemeGroups) {
    const left = ensurePathShape(
      sources[comparableGroup.leftFile],
      comparableGroup.leftPath,
      schema.sourceFiles[comparableGroup.leftFile],
    );
    const right = ensurePathShape(
      sources[comparableGroup.rightFile],
      comparableGroup.rightPath,
      schema.sourceFiles[comparableGroup.rightFile],
    );

    compareShape(
      left,
      right,
      `${schema.sourceFiles[comparableGroup.leftFile]}.${comparableGroup.leftPath.join(".")}`,
      `${schema.sourceFiles[comparableGroup.rightFile]}.${comparableGroup.rightPath.join(".")}`,
    );
  }
}

function validateCategoryCoverage(sources) {
  const categories = collectTopLevelCategories(sources.base, {
    light: sources.light,
    dark: sources.dark,
    brandDefault: sources.brandDefault,
  });

  const requiredCategorySet = [
    "color",
    "space",
    "radius",
    "shadow",
    "typography",
  ];
  for (const category of requiredCategorySet) {
    if (!categories.has(category)) {
      throw new Error(
        `Token sources must expose the ${category} category across base/theme files`,
      );
    }
  }

  const warnings = [];
  for (const optionalCategory of ["motion"]) {
    if (!categories.has(optionalCategory)) {
      warnings.push(
        buildWarning(
          `Token sources do not currently expose the optional ${optionalCategory} category`,
        ),
      );
    }
  }

  return warnings;
}

function validateArtifacts(templateRoot, sources, schema) {
  const artifactFiles = new Map([
    [
      "src/theme/tokens.css",
      readTextFile(templateRoot, "src/theme/tokens.css"),
    ],
    [
      "src/theme/tokens.scss",
      readTextFile(templateRoot, "src/theme/tokens.scss"),
    ],
    ["src/theme/tokens.ts", readTextFile(templateRoot, "src/theme/tokens.ts")],
    [
      "src/theme/themes/light.css",
      readTextFile(templateRoot, "src/theme/themes/light.css"),
    ],
    [
      "src/theme/themes/dark.css",
      readTextFile(templateRoot, "src/theme/themes/dark.css"),
    ],
    [
      "src/theme/themes/brand-default.css",
      readTextFile(templateRoot, "src/theme/themes/brand-default.css"),
    ],
    [
      schema.componentMappingFile,
      readTextFile(templateRoot, schema.componentMappingFile),
    ],
  ]);

  for (const [file, markers] of [
    ["src/theme/tokens.css", schema.artifactMarkers.tokensCss],
    ["src/theme/tokens.scss", schema.artifactMarkers.tokensScss],
    ["src/theme/tokens.ts", schema.artifactMarkers.tokensTs],
    ["src/theme/themes/light.css", schema.artifactMarkers.lightTheme],
    ["src/theme/themes/dark.css", schema.artifactMarkers.darkTheme],
    ["src/theme/themes/brand-default.css", schema.artifactMarkers.brandTheme],
    [schema.componentMappingFile, schema.artifactMarkers.componentMapping],
  ]) {
    const text = artifactFiles.get(file);
    if (!text) {
      throw new Error(`Missing artifact content for ${file}`);
    }

    for (const marker of markers) {
      assertContains(text, marker, file);
    }
  }

  for (const bridge of schema.sourceArtifactBridges) {
    const shouldCheck =
      hasAnyPath(sources.base, bridge.sourcePaths) ||
      hasAnyPath(sources.light, bridge.sourcePaths) ||
      hasAnyPath(sources.dark, bridge.sourcePaths) ||
      hasAnyPath(sources.brandDefault, bridge.sourcePaths);

    if (!shouldCheck) {
      continue;
    }

    for (const artifactCheck of bridge.artifactChecks) {
      const text =
        artifactFiles.get(artifactCheck.file) ??
        readTextFile(templateRoot, artifactCheck.file);
      for (const marker of artifactCheck.markers) {
        assertContains(text, marker, artifactCheck.file);
      }
    }
  }
}

export function validateTokenSources(templateRoot, templateId) {
  const schema = templateTokenSchemas[templateId];
  if (!schema) {
    throw new Error(`No token schema registered for template: ${templateId}`);
  }

  const sources = readTokenSources(templateRoot, schema);
  const warnings = [
    ...validateSourceCategories(sources, schema),
    ...validateCategoryCoverage(sources),
  ];

  validateThemeConsistency(sources, schema);
  validateArtifacts(templateRoot, sources, schema);

  return warnings;
}
