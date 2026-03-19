export const tokens = {
  global: {
    color: {
      palette: {
        brand: {
          "50": "#eef9ff",
          "100": "#d7eeff",
          "500": "#2f6fed",
          "600": "#2459bf",
          "700": "#1d478f",
        },
        neutral: {
          "0": "#ffffff",
          "50": "#f7f9fc",
          "100": "#edf2f7",
          "700": "#334155",
          "900": "#0f172a",
        },
        success: {
          "500": "#16a34a",
        },
      },
    },
    space: {
      page: "32rpx",
      sectionGap: "24rpx",
      heroPaddingVertical: "40rpx",
      heroPaddingHorizontal: "32rpx",
      heroGap: "16rpx",
      cardListGap: "20rpx",
      cardPaddingVertical: "28rpx",
      cardPaddingHorizontal: "24rpx",
      cardGap: "12rpx",
    },
    radius: {
      card: "24rpx",
      pill: "999rpx",
    },
    shadow: {
      card: "0 16px 40px rgba(15, 23, 42, 0.08)",
    },
    typography: {
      family: {
        sans: '"Inter", "PingFang SC", "Microsoft YaHei", sans-serif',
      },
      size: {
        eyebrow: "24rpx",
        title: "40rpx",
        heading: "28rpx",
        body: "28rpx",
        bodySm: "24rpx",
      },
      lineHeight: {
        tight: "1.2",
        body: "1.6",
      },
      weight: {
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      letterSpacing: {
        tight: "-0.01em",
        wide: "0.04em",
      },
    },
    motion: {
      easeStandard: "cubic-bezier(0.2, 0, 0, 1)",
    },
    icon: {
      size: {
        sm: "28rpx",
        md: "36rpx",
        lg: "48rpx",
      },
    },
  },
  theme: {
    brandDefault: {
      brand: {
        accent: {
          base: "#2f6fed",
          emphasis: "#2459bf",
          soft: "#d7eeff",
        },
      },
      icon: {
        default: "#0f172a",
        brand: "#2f6fed",
      },
      component: {
        wot: {
          theme: "#2f6fed",
          themeText: "#ffffff",
          success: "#16a34a",
        },
      },
    },
    dark: {
      color: {
        surface: {
          page: "#08111f",
          card: "#102033",
        },
        text: {
          primary: "#f8fafc",
          secondary: "#cbd5e1",
        },
        border: {
          subtle: "#1e293b",
        },
      },
    },
    light: {
      color: {
        surface: {
          page: "#f7f9fc",
          card: "#ffffff",
        },
        text: {
          primary: "#0f172a",
          secondary: "#334155",
        },
        border: {
          subtle: "#edf2f7",
        },
      },
    },
  },
} as const;
export type Tokens = typeof tokens;
