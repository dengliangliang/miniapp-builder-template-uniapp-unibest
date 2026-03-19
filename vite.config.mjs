import { fileURLToPath, URL } from "node:url";
import UniPluginModule from "@dcloudio/vite-plugin-uni";
import { defineConfig } from "vite";

const uniPluginFactory =
  typeof UniPluginModule === "function"
    ? UniPluginModule
    : UniPluginModule.default;

const uniPlugins = uniPluginFactory();

export default defineConfig({
  plugins: [...uniPlugins],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
