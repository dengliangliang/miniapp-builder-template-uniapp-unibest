import fs from "node:fs";
import path from "node:path";
import lucideCollection from "@iconify-json/lucide/icons.json" with { type: "json" };

const projectRoot = process.cwd();
const assetsDir = path.join(projectRoot, "src/static/icons");
const manifestPath = path.join(projectRoot, "src/theme/icons/manifest.ts");
const brandTokensPath = path.join(projectRoot, "tokens/brand-default.json");

const iconNames = ["sparkles", "arrow-right", "layout-grid", "package-search"];
const aliases = lucideCollection.aliases ?? {};

fs.mkdirSync(assetsDir, { recursive: true });

const brandTokens = JSON.parse(fs.readFileSync(brandTokensPath, "utf8"));
const iconColors = {
  default: brandTokens.theme.brandDefault.icon.default.value ?? "#0f172a",
  brand: brandTokens.theme.brandDefault.icon.brand.value ?? "#2f6fed",
};

function resolveIconData(name) {
  if (lucideCollection.icons[name]) {
    return lucideCollection.icons[name];
  }

  const alias = aliases[name];
  if (alias?.parent && lucideCollection.icons[alias.parent]) {
    return lucideCollection.icons[alias.parent];
  }

  throw new Error(`Unknown icon: ${name}`);
}

function createSvgMarkup(name, tone) {
  const iconData = resolveIconData(name);
  const width = iconData.width ?? 24;
  const height = iconData.height ?? 24;

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" fill="none" stroke="${iconColors[tone]}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`,
    iconData.body,
    "</svg>",
    "",
  ].join("");
}

for (const name of iconNames) {
  for (const tone of ["default", "brand"]) {
    const fileName = `${name}-${tone}.svg`;
    fs.writeFileSync(
      path.join(assetsDir, fileName),
      createSvgMarkup(name, tone),
      "utf8",
    );
  }
}

const manifestSource = `export type AppIconName = ${iconNames.map((name) => `"${name}"`).join(" | ")};
export type AppIconTone = "default" | "brand";

export const iconManifest = {
${iconNames
  .map(
    (name) => `  "${name}": {
    default: { src: "/static/icons/${name}-default.svg" },
    brand: { src: "/static/icons/${name}-brand.svg" }
  }`,
  )
  .join(",\n")}
} as const;
`;

fs.writeFileSync(manifestPath, manifestSource, "utf8");
