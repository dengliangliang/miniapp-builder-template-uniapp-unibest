import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const templateRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const expectedTemplate = {
  id: "uniapp-unibest",
  templatePath: "scaffold",
  constitutionPath: "docs/constitution/uni-app-unibest-core.md",
};

const configPath = path.join(templateRoot, "template.config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

const requiredFields = [
  "id",
  "label",
  "title",
  "description",
  "framework",
  "runtime",
  "stack",
  "targetPlatforms",
  "sourceType",
  "templatePath",
  "defaultCommands",
  "promptProfile",
  "protectedFiles",
  "themeProfile",
  "validatorProfile",
  "capabilities",
  "validation",
];

for (const field of requiredFields) {
  if (!(field in config)) {
    throw new Error(`template.config.json is missing required field: ${field}`);
  }
}

if (config.id !== expectedTemplate.id) {
  throw new Error(`Expected template id ${expectedTemplate.id}, got ${config.id}`);
}

if (config.templatePath !== expectedTemplate.templatePath) {
  throw new Error(
    `Expected templatePath ${expectedTemplate.templatePath}, got ${config.templatePath}`,
  );
}

if (!Array.isArray(config.protectedFiles) || !config.protectedFiles.includes("template.config.json")) {
  throw new Error("protectedFiles must include template.config.json");
}

if (config.constitutionPath !== expectedTemplate.constitutionPath) {
  throw new Error(
    `Expected constitutionPath ${expectedTemplate.constitutionPath}, got ${config.constitutionPath}`,
  );
}

const constitutionPath = path.join(templateRoot, config.constitutionPath);
if (!fs.existsSync(constitutionPath)) {
  throw new Error(`Missing constitution file: ${config.constitutionPath}`);
}

console.log("Standalone template contract check passed.");
