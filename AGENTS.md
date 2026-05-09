# Agent Notes

Brief repo orientation for coding agents.

## Repo Shape

- pnpm monorepo; packages are declared in `pnpm-workspace.yaml` as `pkg/*`.
- Root scripts mostly proxy into package scripts.
- Keep secrets in `.dev.env`; it is ignored by git. Commit `.dev.env.example` only.

## `pkg/app`

Ionic React + Capacitor mobile app for K53 Study Guide.

- Entry point: `pkg/app/src/index.tsx`
- App shell: `pkg/app/src/App.tsx`
- Startup side effects and app rating setup: `pkg/app/src/app/Startup.tsx`
- Routing: `pkg/app/src/app/Router.tsx`
- State: Redux reducers/selectors/actions under `pkg/app/src/state`
- Content/data: `pkg/app/src/data`
- Native projects: `pkg/app/android` and `pkg/app/ios`
- Capacitor config: `pkg/app/capacitor.config.ts`
- Vite config: `pkg/app/vite.config.mts`

Common commands:

```bash
pnpm start
pnpm test
pnpm test:watch
pnpm test:coverage
pnpm lint
pnpm lint-fix
pnpm build
pnpm tsc
pnpm bump:native
pnpm cap-sync-android
pnpm cap-copy-android
pnpm cap-open-android
pnpm cap-sync-ios
pnpm cap-copy-ios
pnpm cap-open-ios
```

## `pkg/lander`

Static landing website for the app.

- Main file: `pkg/lander/index.html`
- Assets: `pkg/lander/assets`
- Uses Vite directly; no framework app structure.
- Store CTAs currently send Google Play links to the Play Store in a new tab.
- iOS/App Store links open a styled "Coming Soon" modal.
- Root scripts use the `lander:*` namespace. `pnpm lander:build` currently expects a `build` script in `pkg/lander`, so use the direct Vite build command below unless that package script is added.

Common commands:

```bash
pnpm lander:start
pnpm --dir pkg/lander exec vite build
pnpm lander:deploy
```
