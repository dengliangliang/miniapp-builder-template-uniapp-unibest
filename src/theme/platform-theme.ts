import { tokens } from "./tokens";

export const uniWindowTheme = {
  navigationBarBackgroundColor: tokens.theme.light.color.surface.card,
  backgroundColor: tokens.theme.light.color.surface.page,
  navigationBarTextStyle: "black" as const,
  backgroundTextStyle: "light" as const,
} as const;
