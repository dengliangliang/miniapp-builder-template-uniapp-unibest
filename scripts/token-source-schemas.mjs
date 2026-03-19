function tokenPath(path) {
  return path.split(".");
}

const baseRequiredCategories = [
  tokenPath("global.color"),
  tokenPath("global.space"),
  tokenPath("global.radius"),
  tokenPath("global.shadow"),
  tokenPath("global.typography"),
  tokenPath("global.icon"),
];

const optionalBaseCategories = [tokenPath("global.motion")];

const lightThemeCategories = [
  tokenPath("theme.light.color.surface"),
  tokenPath("theme.light.color.text"),
  tokenPath("theme.light.color.border"),
];

const darkThemeCategories = [
  tokenPath("theme.dark.color.surface"),
  tokenPath("theme.dark.color.text"),
  tokenPath("theme.dark.color.border"),
];

const brandThemeCategories = [
  tokenPath("theme.brandDefault.brand.accent"),
  tokenPath("theme.brandDefault.icon"),
];

const sharedSourceFiles = {
  base: "tokens/base.json",
  light: "tokens/light.json",
  dark: "tokens/dark.json",
  brandDefault: "tokens/brand-default.json",
};

const sharedRequiredBaseLeafGroups = [
  { file: "base", path: tokenPath("global.icon.size") },
  { file: "base", path: tokenPath("global.typography.family") },
  { file: "base", path: tokenPath("global.typography.size") },
  { file: "base", path: tokenPath("global.typography.lineHeight") },
  { file: "base", path: tokenPath("global.typography.weight") },
  { file: "base", path: tokenPath("global.typography.letterSpacing") },
];

const sharedCategoryRules = {
  requiredBaseCategories: baseRequiredCategories,
  optionalBaseCategories,
  themeFiles: {
    light: {
      rootPath: tokenPath("theme.light"),
      requiredCategories: lightThemeCategories,
    },
    dark: {
      rootPath: tokenPath("theme.dark"),
      requiredCategories: darkThemeCategories,
    },
    brandDefault: {
      rootPath: tokenPath("theme.brandDefault"),
      requiredCategories: brandThemeCategories,
    },
  },
  comparableThemeGroups: [
    {
      leftFile: "light",
      leftPath: tokenPath("theme.light.color"),
      rightFile: "dark",
      rightPath: tokenPath("theme.dark.color"),
    },
  ],
  sourceArtifactBridges: [
    {
      sourcePaths: [tokenPath("global.typography")],
      artifactChecks: [
        {
          file: "src/theme/tokens.css",
          markers: ["--global-typography-family-", "--global-typography-size-"],
        },
        {
          file: "src/theme/tokens.scss",
          markers: ["$global-typography-family-", "$global-typography-size-"],
        },
        {
          file: "src/theme/tokens.ts",
          markers: ['"typography"', '"family"', '"size"'],
        },
      ],
    },
    {
      sourcePaths: [tokenPath("global.space")],
      artifactChecks: [
        { file: "src/theme/tokens.css", markers: ["--global-space-"] },
        { file: "src/theme/tokens.scss", markers: ["$global-space-"] },
        { file: "src/theme/tokens.ts", markers: ['"space"'] },
      ],
    },
    {
      sourcePaths: [tokenPath("global.radius")],
      artifactChecks: [
        { file: "src/theme/tokens.css", markers: ["--global-radius-"] },
        { file: "src/theme/tokens.scss", markers: ["$global-radius-"] },
        { file: "src/theme/tokens.ts", markers: ['"radius"'] },
      ],
    },
    {
      sourcePaths: [tokenPath("global.shadow")],
      artifactChecks: [
        { file: "src/theme/tokens.css", markers: ["--global-shadow-"] },
        { file: "src/theme/tokens.scss", markers: ["$global-shadow-"] },
        { file: "src/theme/tokens.ts", markers: ['"shadow"'] },
      ],
    },
    {
      sourcePaths: [tokenPath("theme.light.color")],
      artifactChecks: [
        { file: "src/theme/tokens.css", markers: ["--theme-light-color-"] },
        {
          file: "src/theme/themes/light.css",
          markers: ["--theme-light-color-"],
        },
      ],
    },
    {
      sourcePaths: [tokenPath("theme.dark.color")],
      artifactChecks: [
        { file: "src/theme/tokens.css", markers: ["--theme-dark-color-"] },
        { file: "src/theme/themes/dark.css", markers: ["--theme-dark-color-"] },
      ],
    },
    {
      sourcePaths: [tokenPath("theme.brandDefault.brand.accent")],
      artifactChecks: [
        {
          file: "src/theme/tokens.css",
          markers: ["--theme-brand-default-brand-accent-"],
        },
        {
          file: "src/theme/themes/brand-default.css",
          markers: ["--theme-brand-default-brand-accent-"],
        },
      ],
    },
  ],
};

export const templateTokenSchemas = {
  "uniapp-unibest": {
    sourceFiles: sharedSourceFiles,
    ...sharedCategoryRules,
    requiredLeafGroups: [
      ...sharedRequiredBaseLeafGroups,
      { file: "brandDefault", path: tokenPath("theme.brandDefault.icon") },
      {
        file: "brandDefault",
        path: tokenPath("theme.brandDefault.component.wot"),
      },
    ],
    artifactMarkers: {
      tokensCss: ["--global-color-", "--global-space-", "--theme-light-"],
      tokensScss: [
        "$global-color-",
        "$global-space-",
        "$global-typography-",
        "$theme-brand-default-",
      ],
      tokensTs: ['"global"', '"theme"', '"radius"', '"shadow"', '"typography"'],
      lightTheme: ["--theme-light-color-"],
      darkTheme: ["--theme-dark-color-"],
      brandTheme: ["--theme-brand-default-"],
      componentMapping: [
        "--wot-color-theme",
        "var(--theme-brand-default-component-wot-theme)",
      ],
    },
    componentMappingFile: "src/theme/wot-theme.scss",
    componentMappingMarkers: [
      "--wot-color-theme",
      "--wot-button-primary-bg-color",
      "var(--theme-brand-default-component-wot-theme)",
    ],
  },
  "taro-react-taroify-tailwind": {
    sourceFiles: sharedSourceFiles,
    ...sharedCategoryRules,
    requiredLeafGroups: [
      ...sharedRequiredBaseLeafGroups,
      { file: "brandDefault", path: tokenPath("theme.brandDefault.icon") },
      {
        file: "brandDefault",
        path: tokenPath("theme.brandDefault.component.taroify"),
      },
    ],
    artifactMarkers: {
      tokensCss: ["--global-color-", "--global-space-", "--theme-light-"],
      tokensScss: [
        "$global-color-",
        "$global-space-",
        "$global-typography-",
        "$theme-brand-default-",
      ],
      tokensTs: ['"global"', '"theme"', '"radius"', '"shadow"', '"typography"'],
      lightTheme: ["--theme-light-color-"],
      darkTheme: ["--theme-dark-color-"],
      brandTheme: ["--theme-brand-default-"],
      componentMapping: [
        "export const taroifyTheme",
        "tokens.theme.brandDefault.component.taroify",
      ],
    },
    componentMappingFile: "src/theme/taroify-theme.ts",
    componentMappingMarkers: [
      "export const taroifyTheme",
      "tokens.theme.brandDefault.component.taroify",
    ],
  },
};
