import {
  defineConfig,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";
import { presetUni } from "@uni-helper/unocss-preset-uni";

export default defineConfig({
  presets: [
    presetUni({
      attributify: false,
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  shortcuts: {
    "page-shell": "flex flex-col gap-4 px-4 py-4",
  },
  theme: {
    colors: {
      primary: "var(--theme-brand-default-brand-accent-base)",
      surface: {
        page: "var(--theme-light-color-surface-page)",
        card: "var(--theme-light-color-surface-card)",
      },
      text: {
        primary: "var(--theme-light-color-text-primary)",
        secondary: "var(--theme-light-color-text-secondary)",
      },
    },
  },
});
