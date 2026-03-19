# uni-app + unibest-core Constitution

## 1. Technical line positioning

- Target platforms: `mp-weixin` first, `h5` second.
- Platform role: this is the default and highest-quality miniapp-builder line.
- Typical use cases: business mini-programs, internal tools, content pages, commerce pages, account flows, data-entry flows.
- Why this line exists: `uni-app + unibest-core` gives the best balance of mini-program compatibility, Vue developer ergonomics, and template stability for a Dyad-derived local/cloud builder.
- Relationship to the secondary line: this line is the default operational baseline. The Taro line exists for React teams and React-specific migration paths, not to replace this line.

## 2. Stack list

- `uni-app`
- `unibest-core` (trimmed base)
- `Vue 3`
- `TypeScript`
- `Vite`
- `UnoCSS`
- `Wot Design Uni`
- `Pinia`
- request wrapper and interceptor layer under `src/http/`
- `Style Dictionary`
- `Tokens Studio`
- `@tokens-studio/sd-transforms`
- `Iconify`
- `Radix Colors`
- `Open Props`

## 3. Directory and file responsibilities

Stable skeleton:

- `src/main.ts`: app bootstrap
- `src/App.vue`: app root shell
- `src/pages/`: page entry files
- `pages.config.ts`: canonical page registration source
- `manifest.config.ts`: canonical manifest source
- `src/http/`: request wrapper, interceptors, transport helpers
- `src/store/`: Pinia entry and stores
- `src/theme/`: compiled token outputs, theme CSS, icon manifest, Wot mapping
- `tokens/`: token source truth
- `scripts/`: config sync, token build, icon asset build
- `style-dictionary.config.mjs`: official token compiler config
- `uno.config.mjs`: UnoCSS productivity config only
- `template.config.json`: template metadata contract for builder/runtime/validator

AI-editable areas:

- `src/pages/**`
- `src/components/**`
- `src/store/**`
- `src/http/**` within existing abstractions
- `src/utils/**` or `src/services/**` when required

Protected-file candidates:

- `pages.config.ts`
- `manifest.config.ts`
- `package.json`
- `vite.config.mjs`
- `uno.config.mjs`
- `tsconfig.json`
- `style-dictionary.config.mjs`
- `tokens/base.json`
- `tokens/light.json`
- `tokens/dark.json`
- `tokens/brand-default.json`
- `scripts/build-icons.mjs`
- `src/theme/wot-theme.scss`
- `src/theme/icons/manifest.ts`
- `template.config.json`

## 4. Theme system constitution

- Tokens are the only theme source of truth.
- Token edits take priority over direct component style edits.
- Theme truth must not be written directly into component literals, inline style values, `uno.config.mjs`, or config files unless the value is read from token source.
- `Style Dictionary` is the only official token compiler.
- `Tokens Studio` is a design input source. It is not the runtime theme engine.
- `Radix Colors` is only an inspiration/reference palette and supplemental token source.
- `Open Props` is only a spacing/radius/shadow/easing inspiration source and supplemental token source.
- Reference snapshots for those upstream libraries may be refreshed with `npm run tokens:references`, but platform token source files remain curated and authoritative.
- `Wot Design Uni` and `UnoCSS` must consume mapped platform tokens.
- Runtime code only consumes compiled outputs from `src/theme/`, not raw design-source metadata.

## 5. Icon constitution

- Official icon source: `Iconify`.
- Official icon runtime strategy: prebuilt local SVG assets plus generated manifest.
- Official component entry: `src/components/AppIcon.vue`.
- Business code must use `AppIcon`; it must not import alternative icon libraries directly.
- Icon assets are generated offline by `scripts/build-icons.mjs`.
- Icon sets must be subsetted. Do not pull an uncontrolled icon corpus into runtime.
- Iconify is the source chain; runtime uses generated local assets for mini-program compatibility.

## 6. Styling rules

- Layout and utility composition may use `UnoCSS`.
- Semantic colors, spacing, radius, shadow, motion, and component theme values must come from tokens.
- Direct literal values are acceptable only for exceptional one-off layout fixes where no token category exists yet. If repeated, promote to token.
- Color values must come from semantic or palette tokens.
- Spacing values should map to token outputs first, then be used via CSS variables or utilities.
- Radius and shadow must come from compiled token variables.
- `UnoCSS` cannot become the theme source. It can only point to token-backed variables.
- `Wot Design Uni` theme variables must map to compiled token variables in `src/theme/wot-theme.scss`.
- Radix Colors may influence palette token values, but only after being converted into platform tokens.
- Open Props may influence spacing/radius/shadow/motion token values, but only after being converted into platform tokens.
- Direct scattered references to Radix Colors or Open Props are forbidden.

## 7. Builder constraints

- Do not break `pages.config.ts`, `manifest.config.ts`, `style-dictionary.config.mjs`, `scripts/build-icons.mjs`, or `template.config.json`.
- New pages must be created under `src/pages/<name>/index.vue` and registered in `pages.config.ts`.
- New reusable UI should prefer `Wot Design Uni` first, then local components.
- Do not introduce `React`, `Next.js`, `React Router`, `shadcn/ui`, `framer-motion`, or browser-only DOM dependencies.
- Theme changes must start at `tokens/*.json` and flow through compiled outputs.
- Icons must use `AppIcon`.
- New components and pages should use lower-case directory names and descriptive file names.

## 8. Diagnostics and repair contract

Typecheck must validate:

- Vue SFC syntax
- TypeScript correctness
- required imports for token/icon/theme files

Template integrity must validate:

- required files exist
- required directories exist
- token outputs exist
- icon manifest exists
- required page routes are registered
- forbidden imports and dependencies are absent

Build must validate:

- `mp-weixin` build succeeds
- `h5` preview entry remains compatible

Preview health must validate:

- preview renders non-default content
- no obvious build-error overlay
- token theme outputs are present

Priority auto-fix classes:

- missing page registration
- missing token outputs
- broken icon imports
- missing theme imports
- safe config drift in page/component files

## 9. Prohibited actions

- Do not treat `UnoCSS` as theme truth.
- Do not import `lucide-react`, `@iconify/*` runtime packages, `react-router-dom`, `next-themes`, `framer-motion`, or `@radix-ui/react-*`.
- Do not write scattered hard-coded theme literals when a token exists.
- Do not bypass `AppIcon`.
- Do not write new theme systems parallel to Style Dictionary.
- Do not edit generated icon manifest or compiled token outputs manually unless regeneration is impossible and explicitly required.
