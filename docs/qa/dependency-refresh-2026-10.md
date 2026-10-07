# Compatible dependency refresh — October 2026

Tracking: [#12](https://github.com/deanvanniekerk/k53studyguide/issues/12), alongside scene validation [#26](https://github.com/deanvanniekerk/k53studyguide/issues/26).

The agreed scope is current stable plugin releases and compatible patch/minor updates. Major framework and tooling migrations remain in [#20](https://github.com/deanvanniekerk/k53studyguide/issues/20). Registry versions were checked on 2026-10-07 with `pnpm outdated -r --format json`; exact direct pins, shared peers and the React types override are kept aligned.

## Selected versions

| Package | Before | After |
| --- | --- | --- |
| `@biomejs/biome` | 2.5.1 | 2.5.15 |
| `@capacitor-firebase/analytics` | 8.3.0 | 8.5.2 |
| `@capacitor-firebase/crashlytics` | 8.3.0 | 8.5.2 |
| `@capacitor/browser` | 8.0.3 | 8.0.5 |
| `@capacitor/device` | 8.0.2 | 8.0.3 |
| `@capawesome/capacitor-app-review` | 8.0.1 | 8.1.0 |
| `@ionic/react` | 8.8.12 | 8.8.19 |
| `@ionic/react-router` | 8.8.12 | 8.8.19 |
| `@revenuecat/purchases-capacitor` | 13.2.0 | 13.7.0 |
| `firebase` | 12.15.0 | 12.19.0 |
| `ionicons` | 8.0.13 | 8.1.0 |
| `reselect` | 5.2.0 | 5.3.0 |
| `styled-components` | 6.4.3 | 6.5.3 |
| `uuid` | 14.0.1 | 14.0.2 |
| `@testing-library/dom` | 10.4.1 | 10.4.2 |
| `@testing-library/react` | 16.3.2 | 16.3.3 |
| `@testing-library/user-event` | 14.6.1 | 14.6.7 |
| `@types/node` | 22.19.17 | 22.20.5 |
| `@types/react` | 18.3.28 | 18.3.31 |
| `@vitejs/plugin-react` | 6.0.3 | 6.1.2 |
| `esbuild` | 0.28.1 | 0.28.2 |
| `rollup-plugin-visualizer` | 7.0.1 | 7.1.1 |
| `vite` | 8.1.0 | 8.3.3 |

Capacitor core, Android, iOS and CLI remain aligned at 8.5.2, the registry's latest stable release at the audit. App 8.1.2 and Preferences 8.0.1 also remain current. No deployment target, Android SDK target, signing configuration or pipeline trigger is changed. Node types stay on 22, matching the pipeline runtime.

## Native compatibility and resolution

- RevenueCat 13.7.0 accepts Capacitor >=8.0.0, retains iOS 15 and resolves PurchasesHybridCommon 19.5.0, RevenueCat iOS 5.92.0, Android purchases 10.24.0 and Google Play Billing 8.3.0. Its [release notes](https://github.com/RevenueCat/purchases-capacitor/releases/tag/13.7.0) and [13.6.1 notes](https://github.com/RevenueCat/purchases-capacitor/releases/tag/13.6.1) include native SDK updates and purchase-error payload corrections.
- Firebase plugins 8.5.2 accept Capacitor >=8.0.0 and Firebase JS ^12.6.0. The [Analytics](https://github.com/capawesome-team/capacitor-firebase/blob/main/packages/analytics/CHANGELOG.md) and [Crashlytics](https://github.com/capawesome-team/capacitor-firebase/blob/main/packages/crashlytics/CHANGELOG.md) changelogs include a missing-plist launch-crash fix and wider compatible CocoaPods constraints. Installed iOS Firebase pods resolve to 12.19.0; Android Analytics to 23.0.0 and Crashlytics to 20.0.3. Both native Firebase configuration files are present during builds and remain untracked.
- [App Review 8.1.0](https://github.com/capawesome-team/capacitor-plugins/blob/main/packages/app-review/CHANGELOG.md) accepts Capacitor >=8.0.0; the new Android store-package option is additive. Browser and Device remain in Capacitor's 8.x plugin family.
- Run `pod install --repo-update` if the local spec index cannot resolve PurchasesHybridCommon 19.5.0. The checked-in Podfile.lock fixes the resolved iOS versions. Capacitor sync regenerates pnpm-backed native paths; the custom Firebase Analytics subspec path must match the generated base pod path.
- Firebase ends new CocoaPods releases in October 2026. Existing versions remain available. The separate [SPM migration #31](https://github.com/deanvanniekerk/k53studyguide/issues/31), linked under #12, tracks the supported maintenance path. See [Firebase's migration guidance](https://firebase.google.com/docs/ios/cocoapods-deprecation).

## Deferred migrations

| Package family | Kept | Registry latest | Reason |
| --- | --- | --- | --- |
| Ionic | 8.8.19 | 9.0.6 | Coupled navigation/framework migration in #20 |
| React, React DOM, renderer and types | React 18.3.1 / matching 18.x types | 19.3.0 | Update together with component and native navigation regression coverage |
| React Router / DOM | 5.3.4 | 8.4.0 / 7.18.4 | Independent latest tags are not a compatible pair for this Ionic router; investigate in #20 |
| TypeScript | 5.9.3 | 7.0.2 | Compiler migration, separate from the native fix |
| Vitest / coverage | 4.1.9 | 5.0.3 | Test-runner migration, keep coverage aligned |
| config | 4.4.1 | 5.0.1 | Build configuration API/runtime migration |
| jsdom | 16.7.0 | 30.1.2 | DOM test-environment migration; transitive deprecations remain |
| Node types | 22.20.5 | 26.6.4 | Match deployed Node 22 rather than unrelated latest runtime |

This is a compatibility refresh, not a complete vulnerability audit or a promise that every transitive dependency is latest. Existing deprecation warnings in Gradle and old jsdom transitive packages remain.

## Validation

- Frozen pnpm install succeeds; no peer warnings were emitted during resolution.
- TypeScript and Biome pass; 163 app and 10 website tests pass.
- App and website production web builds pass.
- Android `assembleDebug` passes with Firebase processing enabled using the installed Android SDK and Android Studio JDK.
- Xcode 27 Debug simulator and generic iOS device builds pass with signing disabled. The generic device build is compilation coverage, not an installation or physical runtime test. Runtime and checkout results are recorded in the scene validation document.
- Uninstrumented iOS simulator Test Store cancellation, simulated failure, retry, purchase, premium test entry and restart persistence pass after adding the missing iOS test-catalog identifier. No new explicit restore test is claimed.
- Physical iOS 27 purchase/restore evidence predates this refresh. Fresh Apple sandbox and Google Play baseline acceptance for these new SDK versions remains a release gate under #12/#17. RevenueCat Test Store coverage cannot replace either real-store gate.

## Rollback

Revert the dependency-refresh commit as a whole (manifests, pnpm lockfile, native paths, Podfile.lock and Biome schema), run `pnpm install --frozen-lockfile`, rebuild web assets, and sync both native projects. Retain the already-merged Capacitor 8.5 scene migration; reverting that separately would restore the Xcode 27 launch failure. Do not reuse test-key web assets in a release build.
