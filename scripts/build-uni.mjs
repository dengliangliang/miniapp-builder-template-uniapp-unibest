await import("./patch-vite-esbuild.mjs");

const { initEnv } = await import("@dcloudio/vite-plugin-uni/dist/cli/utils.js");

const platform = process.argv[2] ?? "h5";
const logLevel = "info";
const mode = "production";

const options = {
  platform,
  mode,
  logLevel,
  clearScreen: false,
  watch: false,
  minify: false,
  sourcemap: false,
  emptyOutDir: true,
};

initEnv("build", options);

const [{ build }, viteConfigModule] = await Promise.all([
  import("vite"),
  import("../vite.config.mjs"),
]);

const viteConfig =
  viteConfigModule.default && typeof viteConfigModule.default === "object"
    ? viteConfigModule.default
    : {};

await build({
  ...viteConfig,
  root: process.env.VITE_ROOT_DIR,
  configFile: false,
  mode,
  logLevel,
  clearScreen: false,
  build: {
    ...viteConfig.build,
    minify: false,
  },
});
