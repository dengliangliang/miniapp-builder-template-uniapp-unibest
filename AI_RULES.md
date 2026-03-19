# unibest-core Rules

- This template is governed by `docs/constitution/uni-app-unibest-core.md`.
- This project targets uni-app + Vue 3 + TypeScript with a trimmed unibest-core structure.
- Always use `<script setup lang="ts">` and Composition API.
- Keep pages in `src/pages/` and register routes in `pages.config.ts`; build scripts sync it into `src/pages.json`.
- Keep app-wide configuration in `manifest.config.ts`, `pages.config.ts`, `vite.config.mjs`, `uno.config.mjs`, `style-dictionary.config.mjs`, and `template.config.json`.
- Theme tokens under `tokens/*.json` are the only source of truth. Runtime code must consume compiled outputs from `src/theme/`.
- Use `Style Dictionary` as the only official token compiler. `Tokens Studio` files feed the compiler; they are not runtime theme files.
- `Radix Colors` and `Open Props` may only influence token source files. Do not reference them directly in components or styles.
- Prefer `wd-*` Wot Design Uni components before creating custom mini-program UI primitives.
- Prefer UnoCSS utility classes for layout and spacing, but do not turn UnoCSS into the theme source.
- Use `AppIcon` from `src/components/AppIcon.vue` for icons. Do not add other icon systems.
- Use the request wrapper under `src/http/` instead of calling `uni.request` directly in page components.
- Keep global state in Pinia stores under `src/store/`.
- Do not introduce React, Next.js, React Router, shadcn/ui, framer-motion, or browser-only DOM APIs.
- Keep the WeChat mini-program target and H5 preview both runnable.
- Do not scatter color literals into pages or components when an existing token already fits.
