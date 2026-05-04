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
pnpm lint
pnpm build
pnpm cap-sync-android
pnpm cap-sync-ios
```

## `pkg/lander`

Static landing website for the app.

- Main file: `pkg/lander/index.html`
- Assets: `pkg/lander/assets`
- Uses Vite directly; no framework app structure.
- Store CTAs currently send Google Play links to the Play Store in a new tab.
- iOS/App Store links open a styled "Coming Soon" modal.

Common commands:

```bash
pnpm start:lander
pnpm --dir pkg/lander exec vite build
pnpm deploy:lander
```
