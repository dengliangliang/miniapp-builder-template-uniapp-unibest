# miniapp-builder unibest-core

This starter is the default mini-program template used by miniapp-builder.

## Stack

- uni-app
- Vue 3
- TypeScript
- Vite
- UnoCSS
- Wot Design Uni
- Pinia
- Request wrapper + interceptor
- Style Dictionary token pipeline
- Tokens Studio compatible token sources
- Iconify subset pipeline with a single AppIcon wrapper

## What stayed from unibest

- uni-helper pages and manifest configuration flow
- UnoCSS-ready Vite chain
- stable `src/pages`, `src/store`, `src/http` structure
- Pinia bootstrap
- request interceptor entry point

## What was intentionally trimmed

- demo pages and tabbar examples
- i18n defaults
- upload / publish scripts
- non-H5 / non-mp-weixin scripts
- auto-opening developer tools side effects

## Commands

- `npm install`
- `npm run dev:h5`
- `npm run dev:mp-weixin`
- `npm run build:h5`
- `npm run build:mp-weixin`
- `npm run typecheck`
- `npm run tokens:build`
- `npm run icons:build`
- `npm run design:build`
- `npm run prepublish:check`
- `npm run starter:ci-gate -- --target uniapp-unibest`

## Gate

This starter is designed to work with the reusable gate workflow hosted in:

- `dengliangliang/miniapp-builder-workflows`

If you publish this starter as its own repository, keep these files:

- `template.config.json`
- `AI_RULES.md`
- `tokens/*`
- `src/theme/*`
- `.github/workflows/gate.yml`

The gate entrypoint is:

- `npm run starter:ci-gate -- --target uniapp-unibest`
