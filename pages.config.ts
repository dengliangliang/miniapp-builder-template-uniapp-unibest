import { defineUniPages } from "@uni-helper/vite-plugin-uni-pages";
import { uniWindowTheme } from "./src/theme/platform-theme";

export default defineUniPages({
  pages: [
    {
      path: "pages/index/index",
      style: {
        navigationBarTitleText: "Miniapp Builder",
      },
    },
  ],
  globalStyle: {
    navigationBarTitleText: "Miniapp Builder",
    ...uniWindowTheme,
  },
  easycom: {
    autoscan: true,
    custom: {
      "^wd-(.*)": "wot-design-uni/components/wd-$1/wd-$1.vue",
    },
  },
});
