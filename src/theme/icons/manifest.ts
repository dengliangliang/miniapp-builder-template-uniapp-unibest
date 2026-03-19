export type AppIconName =
  | "sparkles"
  | "arrow-right"
  | "layout-grid"
  | "package-search";
export type AppIconTone = "default" | "brand";

export const iconManifest = {
  sparkles: {
    default: { src: "/static/icons/sparkles-default.svg" },
    brand: { src: "/static/icons/sparkles-brand.svg" },
  },
  "arrow-right": {
    default: { src: "/static/icons/arrow-right-default.svg" },
    brand: { src: "/static/icons/arrow-right-brand.svg" },
  },
  "layout-grid": {
    default: { src: "/static/icons/layout-grid-default.svg" },
    brand: { src: "/static/icons/layout-grid-brand.svg" },
  },
  "package-search": {
    default: { src: "/static/icons/package-search-default.svg" },
    brand: { src: "/static/icons/package-search-brand.svg" },
  },
} as const;
