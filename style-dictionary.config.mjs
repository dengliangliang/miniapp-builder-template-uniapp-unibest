import StyleDictionary from "style-dictionary";
import { register } from "@tokens-studio/sd-transforms";

await register(StyleDictionary);

function createTokenValueTree(allTokens) {
  const tree = {};

  for (const token of allTokens) {
    let current = tree;
    for (const segment of token.path.slice(0, -1)) {
      if (!(segment in current)) {
        current[segment] = {};
      }
      current = current[segment];
    }

    current[token.path[token.path.length - 1]] = token.value;
  }

  return tree;
}

StyleDictionary.registerFormat({
  name: "miniapp/typescript-esm",
  format({ dictionary }) {
    return [
      `export const tokens = ${JSON.stringify(createTokenValueTree(dictionary.allTokens), null, 2)} as const;`,
      "export type Tokens = typeof tokens;",
      "",
    ].join("\n");
  },
});

StyleDictionary.registerFormat({
  name: "miniapp/css-variables",
  format({ dictionary, options }) {
    const selector = options?.selector ?? ":root, page";
    return [
      `${selector} {`,
      ...dictionary.allTokens.map(
        (token) => `  --${token.name}: ${token.value};`,
      ),
      "}",
      "",
    ].join("\n");
  },
});

StyleDictionary.registerFormat({
  name: "miniapp/scss-variables",
  format({ dictionary }) {
    const variables = dictionary.allTokens.map(
      (token) => `$${token.name}: ${token.value};`,
    );
    const map = dictionary.allTokens.map(
      (token) => `  "${token.name}": $${token.name},`,
    );

    return [...variables, "", "$tokens: (", ...map, ");", ""].join("\n");
  },
});

export default {
  source: ["tokens/*.json"],
  preprocessors: ["tokens-studio"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "src/theme/",
      files: [
        {
          destination: "tokens.css",
          format: "miniapp/css-variables",
        },
      ],
    },
    scss: {
      transformGroup: "scss",
      buildPath: "src/theme/",
      files: [
        {
          destination: "tokens.scss",
          format: "miniapp/scss-variables",
        },
      ],
    },
    ts: {
      transformGroup: "js",
      buildPath: "src/theme/",
      files: [
        {
          destination: "tokens.ts",
          format: "miniapp/typescript-esm",
        },
      ],
    },
    lightTheme: {
      transformGroup: "css",
      buildPath: "src/theme/themes/",
      files: [
        {
          destination: "light.css",
          format: "miniapp/css-variables",
          filter: (token) =>
            token.path[0] === "theme" && token.path[1] === "light",
          options: { selector: ':root, page, [data-theme="light"]' },
        },
      ],
    },
    darkTheme: {
      transformGroup: "css",
      buildPath: "src/theme/themes/",
      files: [
        {
          destination: "dark.css",
          format: "miniapp/css-variables",
          filter: (token) =>
            token.path[0] === "theme" && token.path[1] === "dark",
          options: { selector: '[data-theme="dark"]' },
        },
      ],
    },
    brandTheme: {
      transformGroup: "css",
      buildPath: "src/theme/themes/",
      files: [
        {
          destination: "brand-default.css",
          format: "miniapp/css-variables",
          filter: (token) =>
            token.path[0] === "theme" && token.path[1] === "brandDefault",
          options: { selector: ':root, page, [data-brand="default"]' },
        },
      ],
    },
  },
};
