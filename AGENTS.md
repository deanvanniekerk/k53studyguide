# Agent Notes

Brief repo orientation for coding agents.

## Repo Shape

- pnpm monorepo; packages are declared in `pnpm-workspace.yaml` as `pkg/*`.
- Root scripts mostly proxy into package scripts.
- Public GitHub repo on `main`; keep portfolio-facing docs concise and accurate.
- No license is granted for use. Do not add a `LICENSE` file unless explicitly asked.
- Keep secrets in `.dev.env`; it is ignored by git. Commit `.dev.env.example` only.
- Do not commit generated/local artifacts such as `node_modules`, build output, `.gradle`, or `.codex-screenshots`.

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
- Native Firebase config files are intentionally ignored:
  - `pkg/app/android/app/google-services.json`
  - `pkg/app/ios/App/App/GoogleService-Info.plist`
- Azure Pipelines restores Firebase config and signing assets from secure files. Keep these names stable when editing `azure-pipelines.yml`: `google-services.json`, `GoogleService-Info.plist`, `upload-keystore.jks`, `K53StudyGuide_AppleDistribution.p12`, and `K53StudyGuide_AppStore.mobileprovision`.

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
- Store CTAs send Google Play and App Store links to the live store listings in a new tab.
- Root scripts use the `lander:*` namespace.
- Default deploy skips the large quiz image asset tree; use the full deploy only when those assets need to be uploaded.

Common commands:

```bash
pnpm lander:start
pnpm lander:build
pnpm lander:deploy
pnpm lander:deploy:full
```
