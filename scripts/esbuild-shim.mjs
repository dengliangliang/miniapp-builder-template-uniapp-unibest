import ts from "typescript";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyDefines(code, define = {}) {
  const entries = Object.entries(define).sort(
    ([leftKey], [rightKey]) => rightKey.length - leftKey.length,
  );

  let nextCode = code;
  for (const [key, rawValue] of entries) {
    const value =
      typeof rawValue === "string" ? rawValue : JSON.stringify(rawValue);
    nextCode = nextCode.replace(
      new RegExp(`\\b${escapeRegExp(key)}\\b`, "g"),
      value,
    );
  }

  return nextCode;
}

function toScriptTarget(target) {
  const normalized = Array.isArray(target) ? target[0] : target;
  switch ((normalized ?? "").toString().toLowerCase()) {
    case "es2022":
      return ts.ScriptTarget.ES2022;
    case "es2021":
      return ts.ScriptTarget.ES2021;
    case "es2020":
      return ts.ScriptTarget.ES2020;
    case "es2019":
      return ts.ScriptTarget.ES2019;
    case "esnext":
    default:
      return ts.ScriptTarget.ESNext;
  }
}

function toJsxEmit(jsx) {
  switch (jsx) {
    case "preserve":
      return ts.JsxEmit.Preserve;
    case "react-jsx":
      return ts.JsxEmit.ReactJSX;
    case "react-jsxdev":
      return ts.JsxEmit.ReactJSXDev;
    case "react-native":
      return ts.JsxEmit.ReactNative;
    case "react":
      return ts.JsxEmit.React;
    default:
      return ts.JsxEmit.Preserve;
  }
}

function transformViaTypescript(input, options = {}) {
  const loader = options.loader ?? "js";
  const needsTsTranspile = ["ts", "tsx", "js", "jsx"].includes(loader);
  const sourceText = applyDefines(String(input), options.define);

  if (!needsTsTranspile) {
    return {
      code: sourceText,
      map: "",
      warnings: [],
      mangleCache: options.mangleCache,
      legalComments: [],
    };
  }

  const transpileResult = ts.transpileModule(sourceText, {
    fileName: options.sourcefile ?? options.sourceFile ?? "inline.ts",
    compilerOptions: {
      allowJs: loader === "js" || loader === "jsx",
      sourceMap: Boolean(options.sourcemap),
      inlineSources: Boolean(options.sourcemap),
      inlineSourceMap: false,
      target: toScriptTarget(options.target),
      module: ts.ModuleKind.ESNext,
      jsx: toJsxEmit(options.jsx),
      jsxFactory: options.jsxFactory,
      jsxFragmentFactory: options.jsxFragment,
      jsxImportSource: options.jsxImportSource,
      preserveConstEnums: true,
      useDefineForClassFields: false,
      importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Preserve,
    },
    reportDiagnostics: false,
  });

  return {
    code: transpileResult.outputText,
    map: transpileResult.sourceMapText ?? "",
    warnings: [],
    mangleCache: options.mangleCache,
    legalComments: [],
  };
}

function formatMessagesViaShim(messages) {
  return messages.map((message) => {
    if (typeof message === "string") {
      return message;
    }

    const location = message.location
      ? `${message.location.file}:${message.location.line}:${message.location.column}`
      : "";
    const notes = Array.isArray(message.notes)
      ? message.notes
          .map((note) => note.text)
          .filter(Boolean)
          .join("\n")
      : "";

    return [location, message.text, notes].filter(Boolean).join("\n");
  });
}

export async function transform(input, options) {
  return transformViaTypescript(input, options);
}

export function transformSync(input, options) {
  return transformViaTypescript(input, options);
}

export async function formatMessages(messages, options) {
  return formatMessagesViaShim(messages, options);
}

export function formatMessagesSync(messages, options) {
  return formatMessagesViaShim(messages, options);
}

export async function build() {
  throw new Error(
    "miniapp-builder esbuild shim does not implement build(). The uni-app build path must import Vite config directly instead of using Vite config bundling.",
  );
}

export function buildSync() {
  throw new Error(
    "miniapp-builder esbuild shim does not implement buildSync().",
  );
}

export async function context() {
  throw new Error("miniapp-builder esbuild shim does not implement context().");
}

export async function analyzeMetafile() {
  return "";
}

export function analyzeMetafileSync() {
  return "";
}

export async function initialize() {}

export async function stop() {}

export const version = `miniapp-builder-ts-shim:${ts.version}`;

const defaultExport = {
  transform,
  transformSync,
  formatMessages,
  formatMessagesSync,
  build,
  buildSync,
  context,
  analyzeMetafile,
  analyzeMetafileSync,
  initialize,
  stop,
  version,
};

export default defaultExport;
