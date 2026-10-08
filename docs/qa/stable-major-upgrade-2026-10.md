# Stable major dependency upgrade — 7 October 2026

Issue [#41](https://github.com/deanvanniekerk/k53studyguide/issues/41). Baseline `bfd28ba`. Inventory checked against npm `latest` tags and stable Google Maven/Maven Central metadata on 2026-10-07. Pre-release versions are excluded. Verification and owner exception status appear below. Latest means the supported direct dependency graph, not an arbitrary override of every child package.

## JavaScript manifests

A = `pkg/app`, L = `pkg/lander`, S = `pkg/shared`, R = root, T = separate `tools/translator`. Shared peers and the React override move together; Router 6 supplies its own types.

| Dependency | Surface / baseline | Selected target | Registry latest | Peer / runtime constraint |
| --- | --- | --- | --- | --- |
| @biomejs/biome | R 2.5.15 | 2.5.15 | 2.5.15 | {"engines":{"node":">=14.21.3"}} |
| @capacitor-firebase/analytics | A 8.5.2 | 8.5.2 | 8.5.2 | {"peers":{"firebase":"^12.6.0","@capacitor/core":">=8.0.0"}} |
| @capacitor-firebase/crashlytics | A 8.5.2 | 8.5.2 | 8.5.2 | {"peers":{"@capacitor/core":">=8.0.0"}} |
| @capacitor/android | A 8.5.2 | 8.5.2 | 8.5.2 | {"peers":{"@capacitor/core":"^8.5.0"}} |
| @capacitor/app | A 8.1.2 | 8.1.2 | 8.1.2 | {"peers":{"@capacitor/core":">=8.0.0"}} |
| @capacitor/browser | A 8.0.5 | 8.0.5 | 8.0.5 | {"peers":{"@capacitor/core":">=8.0.0"}} |
| @capacitor/core | A 8.5.2 | 8.5.2 | 8.5.2 | No declared constraint |
| @capacitor/device | A 8.0.3 | 8.0.3 | 8.0.3 | {"peers":{"@capacitor/core":">=8.0.0"}} |
| @capacitor/ios | A 8.5.2 | 8.5.2 | 8.5.2 | {"peers":{"@capacitor/core":"^8.5.0"}} |
| @capacitor/preferences | A 8.0.1 | 8.0.1 | 8.0.1 | {"peers":{"@capacitor/core":">=8.0.0"}} |
| @capawesome/capacitor-app-review | A 8.1.0 | 8.1.0 | 8.1.0 | {"peers":{"@capacitor/core":">=8.0.0"}} |
| @ionic/react | A 8.8.19; L 8.8.19; S 8.8.19 | 9.0.6 | 9.0.6 | {"peers":{"react":"^18 \|\| ^19","react-dom":"^18 \|\| ^19"}} |
| @ionic/react-router | A 8.8.19 | 9.0.6 | 9.0.6 | {"peers":{"react":"^18 \|\| ^19","react-dom":"^18 \|\| ^19","react-router":">=6.4.0 <7","react-router-dom":">=6.4.0 <7"}} |
| @revenuecat/purchases-capacitor | A 13.7.0 | 13.7.0 | 13.7.0 | {"peers":{"@capacitor/core":">=8.0.0"}} |
| firebase | A 12.19.0 | 12.19.0 | 12.19.0 | No declared constraint |
| immutability-helper | A 3.1.1 | 3.1.1 | 3.1.1 | No declared constraint |
| ionicons | A 8.1.0; L 8.1.0; S 8.1.0 | 8.1.0 | 8.1.0 | No declared constraint |
| react | A 18.3.1; L 18.3.1; S 18.3.1 | 19.3.0 | 19.3.0 | {"engines":{"node":">=0.10.0"}} |
| react-dom | A 18.3.1; L 18.3.1 | 19.3.0 | 19.3.0 | {"peers":{"react":"^19.3.0"}} |
| react-redux | A 9.3.0 | 9.3.0 | 9.3.0 | {"peers":{"react":"^18.0 \|\| ^19","redux":"^5.0.0","@types/react":"^18.2.25 \|\| ^19"}} |
| react-router | A 5.3.4 | 6.30.6 | 8.4.0 | {"engines":{"node":">=22.22.0"},"peers":{"react":">=19.2.7","react-dom":">=19.2.7"}} |
| react-router-dom | A 5.3.4 | 6.30.6 | 7.18.4 | {"engines":{"node":">=20.0.0"},"peers":{"react":">=18","react-dom":">=18"}} |
| react-translated | A 2.5.0; L 2.5.0; S 2.5.0 | removed | 2.5.0 | {"peers":{"react":">=16.0.0"}} |
| react-visibility-sensor | A 5.1.1 | removed | 5.1.1 | {"peers":{"react":">=16.0.0","react-dom":">=16.0.0"}} |
| redux | A 5.0.1 | 5.0.1 | 5.0.1 | No declared constraint |
| redux-persist | A 6.0.0 | 6.0.0 | 6.0.0 | {"peers":{"redux":">4.0.0"}} |
| redux-thunk | A 3.1.0 | 3.1.0 | 3.1.0 | {"peers":{"redux":"^5.0.0"}} |
| reselect | A 5.3.0 | 5.3.0 | 5.3.0 | No declared constraint |
| rxjs | A ^7.8.2 | ^7.8.2 | 7.8.2 | No declared constraint |
| styled-components | A 6.5.3; L 6.5.3; S 6.5.3 | 6.5.3 | 6.5.3 | {"engines":{"node":">= 16"},"peers":{"react":">= 16.8.0","react-dom":">= 16.8.0","react-native":">= 0.68.0","css-to-react-native":">= 3.2.0"}} |
| uuid | A 14.0.2 | 14.0.2 | 14.0.2 | No declared constraint |
| @capacitor/cli | A 8.5.2 | 8.5.2 | 8.5.2 | {"engines":{"node":">=22.0.0"}} |
| @svgr/cli | A 8.1.0 | 8.1.0 | 8.1.0 | {"engines":{"node":">=14"}} |
| @testing-library/dom | A 10.4.2 | 10.4.2 | 10.4.2 | {"engines":{"node":">=18"}} |
| @testing-library/react | A 16.3.3; L 16.3.3 | 16.3.3 | 16.3.3 | {"engines":{"node":">=18"},"peers":{"react":"^18.0.0 \|\| ^19.0.0","react-dom":"^18.0.0 \|\| ^19.0.0","@types/react":"^18.0.0 \|\| ^19.0.0","@types/react-dom":"^18.0.0 \|\| ^19.0.0","@testing-library/dom":"^10.0.0"}} |
| @testing-library/user-event | A 14.6.7 | 14.6.7 | 14.6.7 | {"engines":{"npm":">=6","node":">=12"},"peers":{"@testing-library/dom":">=7.21.4"}} |
| @types/node | A 22.20.5; L 22.20.5 | 26.6.4 | 26.6.4 | {"peers":{}} |
| @types/react | A 18.3.31; L 18.3.31; S 18.3.31 | 19.3.0 | 19.3.0 | {"peers":{}} |
| @types/react-dom | A 18.3.7; L 18.3.7 | 19.3.0 | 19.3.0 | {"peers":{"@types/react":"^19.3.0"}} |
| @types/react-router | A 5.1.20 | removed | 5.1.20 | No declared constraint |
| @types/react-router-dom | A 5.3.3 | removed | 5.3.3 | No declared constraint |
| @types/redux-mock-store | A 1.5.0 | 1.5.0 | 1.5.0 | {"peers":{}} |
| @vitejs/plugin-react | A 6.1.2; L 6.1.2 | 6.1.2 | 6.1.2 | {"engines":{"node":"^20.19.0 \|\| >=22.12.0"},"peers":{"vite":"^8.0.0","oxc-transform-react":"^0.152.0","@rolldown/plugin-babel":"^0.1.7 \|\| ^0.2.0","babel-plugin-react-compiler":"^1.0.0"}} |
| @vitest/coverage-v8 | A 4.1.9 | 5.0.3 | 5.0.3 | {"peers":{"vitest":"5.0.3","@vitest/browser":"5.0.3"}} |
| config | A 4.4.1 | 5.0.1 | 5.0.1 | {"engines":{"node":">= 20.11.0"}} |
| esbuild | A 0.28.2 | 0.28.2 | 0.28.2 | {"engines":{"node":">=18"}} |
| react-test-renderer | A 18.3.1 | 19.3.0 | 19.3.0 | {"peers":{"react":"^19.3.0"}} |
| redux-mock-store | A 1.5.5 | 1.5.5 | 1.5.5 | {"peers":{"redux":"*"}} |
| rollup-plugin-visualizer | A 7.1.1 | 7.1.1 | 7.1.1 | {"engines":{"node":">=22"},"peers":{"rollup":"2.x \|\| 3.x \|\| 4.x","rolldown":"1.x \|\| ^1.0.0-beta \|\| ^1.0.0-rc"}} |
| typescript | A 5.9.3; L 5.9.3 | 7.0.2 | 7.0.2 | {"engines":{"node":">=16.20.0"}} |
| vite | A 8.3.3; L 8.3.3 | 8.3.3 | 8.3.3 | {"engines":{"node":"^20.19.0 \|\| >=22.12.0"},"peers":{"tsx":"^4.8.1","jiti":">=1.21.0","less":"^4.0.0","sass":"^1.70.0","yaml":"^2.4.2","stylus":">=0.54.8","terser":"^5.16.0","esbuild":"^0.27.0 \|\| ^0.28.0","sugarss":"^5.0.0","@types/node":"^20.19.0 \|\| >=22.12.0","sass-embedded":"^1.70.0","@vitejs/devtools":"^0.7.1"}} |
| vitest | A 4.1.9; L 4.1.9 | 5.0.3 | 5.0.3 | {"engines":{"node":"^22.12.0 \|\| ^24.0.0 \|\| >=26.0.0"},"peers":{"vite":"^6.4.0 \|\| ^7.0.0 \|\| ^8.0.0","jsdom":"*","happy-dom":"*","@vitest/ui":"5.0.3","@types/node":"^22.0.0 \|\| >=24.0.0","@edge-runtime/vm":"*","@opentelemetry/api":"^1.9.0","@vitest/coverage-v8":"5.0.3","@vitest/browser-preview":"5.0.3","@vitest/coverage-istanbul":"5.0.3","@vitest/browser-playwright":"5.0.3","@vitest/browser-webdriverio":"^5.0.0-beta.5 \|\| >=5.0.0"}} |
| jsdom | L 16.7.0; A absent | 30.1.2 | 30.1.2 | {"engines":{"node":"^22.22.2 \|\| ^24.15.0 \|\| >=26.0.0"},"peers":{"canvas":"^3.2.3"}} |
| @google-cloud/translate | T ^5.1.6 | 10.1.1 | 10.1.1 | {"engines":{"node":">=22"}} |
| pnpm | R 11.7.0; T no lock | 12.9.1 | 12.9.1 | Explicit dependency build permissions; standalone translator lock |
| Node | CI 22.x; local 24.15.0 | 26.10.0 | 26.10.0 | Stable Current release; match types 26.6.4 |

## Upgrade order and breaking changes

1. Runtime and tooling: Node 26.10.0 / pnpm 12.9.1; TypeScript 7 removes `baseUrl` (paths become relative to tsconfig). Vitest/coverage move together to 5.0.3; jsdom 30 requires Node >=26 or specific recent Node 22/24 patches. Config 5 retains the `get`/`has` interface used by Vite. Translator 10 retains the v2 Translate API; its check constructs a client without credentials or paid API calls.
2. Ionic 9 / React 19 / types and renderer 19 / Router 6.30.6. Route `component`/`render` become `element`, Redirect becomes Navigate with replace, useHistory becomes useNavigate. React 19 removes findDOMNode: replace the obsolete visibility sensor with IntersectionObserver and preserve seen-content and analytics semantics. React 19 also removes legacy context: replace react-translated with the shared modern-context Provider, Translate and Translator interface used by both packages. Preserve string/function templates, literal fallback, interpolation (including zero), and HTML strings consumed by Translator; unused legacy markdown/renderMap APIs are not carried forward. Ionic 9 requires iOS 16+, raising the native deployment floor.
3. Native Android toolchain/library graph; test latest AGP/Gradle before choosing supported targets. Plugin-managed dependencies remain in their supported graphs.
4. CocoaPods to Capacitor SPM, retaining scene lifecycle/signing/Firebase configuration, Analytics default IDFA trait, and Crashlytics dSYM upload. Commit Package.resolved and use locked resolution for builds.
5. Clean frozen installations, complete tests/coverage/type/lint, both web and native Release configurations, browser/simulator and RevenueCat Test Store regressions.

## Native resolution surfaces

| Surface | Baseline | Selected target / constraint |
| --- | --- | --- |
| Android Gradle plugin | 8.13.2 | 9.4.1, stable Google Maven; supports API 37 |
| Gradle wrapper | 8.13 | 9.8.0, required by AGP 9.4; official SHA-256 recorded |
| Google Services Gradle plugin | 4.4.4 | 4.5.0 |
| Crashlytics Gradle plugin | 3.0.7 | 3.0.8 |
| JDK | CI/local 21 | 21 retained as supported build runtime, not an application dependency; local Android Studio JBR |
| Android compile/target SDK | 36 / 36 | 37 / 37; minimum API 24 retained; AGP default Build Tools 36.0.0 |
| AndroidX Activity | 1.9.3 | 1.13.0 |
| AndroidX AppCompat | 1.7.1 | 1.8.0 |
| AndroidX Core | 1.15.0 | 1.19.1 |
| AndroidX Fragment | 1.8.5 | 1.9.1 |
| AndroidX WebKit | 1.12.1 | 1.17.1 |
| Coordinator / SplashScreen | 1.3.0 / 1.2.0 | same stable releases |
| JUnit / AndroidX JUnit / Espresso | 4.13.2 / 1.3.0 / 3.7.0 | same stable releases |
| Cordova Android framework | 10.1.1 | 15.1.0 |
| Firebase Android Analytics / Crashlytics | plugin defaults 23.0.0 / 20.0.3 | 23.2.0 / 20.1.1 via supported plugin variables |
| RevenueCat Android hybrid / SDK / Billing | 19.5.0 / 10.24.0 / 8.3.0 | retained exact graph of latest Capacitor parent 13.7.0; separately tagged 19.6.0 / 10.25.0 / 9.1.0 are not independent app targets |
| iOS manager | CocoaPods 1.17.0, Podfile.lock | Capacitor SPM, generated CapApp-SPM + checked-in Package.resolved; CocoaPods removed |
| iOS deployment / Swift package tools | 15.0 / no SPM | 16.0 / 6.1 (traits support); source Swift language mode remains 5 |
| Local Xcode / SDK / Swift compiler | Xcode 27 already installed | 27.0 (27A266a) / iOS 27.0 / Swift 6.4 verified |
| Azure Apple runtime | macOS-26, Xcode 26+ SDK gate | retained supported hosted image and SDK gate; Node/pnpm updated; no Azure run launched |
| Firebase Apple | 12.19.0 CocoaPods | 12.19.2 SPM, Analytics trait retains former IDFA integration |
| RevenueCat Apple hybrid / SDK | 19.5.0 / 5.92.0 | 19.5.0 / 5.92.0 exact latest Capacitor parent's supported graph |

The app Gradle lock captures resolved application configurations, including plugin transitives. AGP supplies Kotlin 2.2.10; no forced Kotlin/compiler override is added. Gradle's generated locks omitted kotlin-stdlib-common from three runtime configurations that are introduced by locked resolution. The checked-in lock adds its **same resolved 2.2.10** to debug/release and debug-unit-test runtime configurations, then validates with a normal `gradlew build` without `--write-locks`. Future regeneration must finish with that normal build; a successful lock-writing build alone is insufficient. [Gradle locking](https://docs.gradle.org/current/userguide/dependency_locking.html), [upstream Kotlin lock-resolution issue](https://github.com/gradle/gradle/issues/10697).

Remote Swift graph (local plugin package versions are in the JavaScript table and generated Package.swift):

| Swift package | Locked version |
| --- | --- |
| abseil-cpp-binary | 1.2024072200.0 |
| app-check | 11.3.2 |
| capacitor-swift-pm | 8.5.2 |
| firebase-ios-sdk | 12.19.2 |
| google-ads-on-device-conversion-ios-sdk | 3.7.0 |
| googleappmeasurement | 12.19.2 |
| googledatatransport | 10.1.1 |
| googleutilities | 8.1.4 |
| grpc-binary | 1.69.1 |
| gtm-session-fetcher | 5.3.1 |
| interop-ios-for-google-sdks | 101.0.0 |
| leveldb | 1.22.5 |
| nanopb | 2.30910.1 |
| promises | 2.4.1 |
| purchases-hybrid-common | 19.5.0 |
| purchases-ios-spm | 5.92.0 |

All remote revisions are recorded in Package.resolved. The old Podfile.lock's Firebase/Core/Installations/Sessions/RemoteConfigInterop families were 12.19.0, GoogleAppMeasurement 12.19.0, GoogleDataTransport 10.1.1, GoogleUtilities 8.1.4, PromisesObjC 2.4.0, PromisesSwift 2.4.0 and nanopb 3.30910.0. SPM introduces supported Firebase package-level helpers (including gRPC/abseil/leveldb/SwiftProtobuf declarations); do not independently override their versions. Firebase and RevenueCat remote minimum/exact requirements come from the unchanged latest plugin Package.swift manifests.

## Compatibility and security review

- **Pending owner acceptance:** Ionic 9.0.6 requires both Router packages >=6.4.0 <7. Use their 6.30.6 pair; registry latest 8.4.0/7.18.4 violates those peers. No incompatible peer override.
- Root/workspace audit after refreshing supported child ranges: **5 advisories, 0 critical, 1 high, 3 moderate, 1 low**, reduced from 58 baseline advisories. Translator audit: **0**.
- Router 6.30.6: GHSA-wrjc-x8rr-h8h6 (backslash redirects through Link/useNavigate) and GHSA-337j-9hxr-rhxg (SSR deserializeErrors). Fixed in 7.18+, beyond Ionic's supported peer. App destinations are fixed internal routes and the app has no SSR. Review is scoped to these call sites, not a blanket safety claim.
- Capacitor CLI 8.5.2 → xcode 3.0.1 → uuid 7.0.3: GHSA-w5hq-g745-h8pq (buffer bounds), patched >=11.1.1. This is CLI tooling, not browser/native application code. Parent's ^7 range cannot take 11 without a compatibility override.
- Firebase 12.19.0 → Firestore 4.17.2 → @grpc/grpc-js ~1.9: GHSA-m9gg-hp2v-232j (certificate authorization, high) and GHSA-f596-whhp-79r4 (server error detail, low), patched >=1.13.6. This is the Node Firestore graph; app code imports Firebase app/analytics, not Firestore or its Node gRPC transport. Parent remains latest; do not force a version outside ~1.9.
- Deprecated glob 8/inflight come from latest SVGR CLI 8.1.0, retained for the documented SVG conversion tool. Deprecated uuid 7 is CLI-only above; node-domexception 1 comes from latest Google translation tooling. React renderer 19 is latest but deprecated; existing behavioral tests still pass with warnings. The new translation and visibility regressions use actual DOM rendering.
- Native parent graphs can trail standalone child tags, as shown in the table. This follows the issue's explicit supported-parent rule; no claim that every transitive is latest.
- The existing [checkout sign-off](premium-checkout-signoff.md) owner acceptance covers real Apple/Google billing limitations. The fresh Test Store smoke below covers this SPM migration; Test Store does not validate real receipts, refunds, pending/deferred payments or store account/signing configuration.

## Verification and readiness

Completed locally on 2026-10-07:

- Clean local clone at the two implementation commits: root and standalone translator frozen installs pass with Node 26.10.0 / pnpm 12.9.1; translator client/syntax/input check passes without credentials/API calls.
- Repository lint (Biome + app and lander TypeScript), app **180 tests / 44 files** after pruning two cases, lander **10 tests / 1 file**, app V8 coverage and both production web builds pass. The React 19 visibility and translation regressions were reproduced red before replacement and now pass.
- Android `:app:assembleRelease :app:assembleDebug` and complete CI-equivalent `gradlew build` pass against the committed lock without lock updates. Existing Android lint baseline filters six pre-existing errors; no new errors. Current plugin Gradle deprecation warnings concern Gradle 10, not selected 9.8.
- iOS SPM locked Release builds pass for generic iOS device and SE simulator, with signing disabled for compile checks; Debug simulator build passes. Crashlytics device run phase executes with dSYM inputs. Signed archive/export/upload and server-side crash ingestion have not been performed.
- Browser: Study/article visibility and progress, a 10-question quiz scored 7/10, saved points (33 to next level) survive reload, Profile/history controls, dark appearance persists, English language picker works. Browser preview purchase unlocks mock tests; answers in all three sections submit to results. All seven legacy route aliases redirect correctly. The lander demo advances questions; store CTAs retain their destinations. A 375×667 Profile check keeps tabs and Premium status visible.


- Android Pixel 9 / API 37: installed Debug over the existing QA app, retained Premium, Study controls reach 100%, quiz answer/continue reaches question 2, hardware Back returns to a resumable quiz, and a mock test ends with three-section results. Profile/history controls work. Dark appearance and Study progress survive background/resume and a cold launch; language remains English (the baseline UI only offers English).
- iOS SE / iOS 26.4.1: installed Debug over the existing QA app. Study, Profile and the paused mock test remain accessible. Before/after preference comparison preserves Study/quiz/mock histories, sessions, navigation, settings and owned Premium. A separate fresh SE with XXXL text keeps onboarding, Unlock, GET PREMIUM and RESTORE CTAs visible.
- Fresh iOS RevenueCat Test Store: restore on a free account returns to the available offer; cancellation and a failed payment leave the offer retryable; a valid retry unlocks START TEST. Premium survives terminate/relaunch. The baseline owned UI hides Restore, so this native smoke does not prove an owned-account restore; the real service/modal regression suite covers positive restore feedback and entitlement handling. Existing real-store sign-off still applies.
- Lifecycle/deep links: Android background/resume and cold launch pass; its existing `app://profile` intent opens/delivers to the app. The baseline has no JavaScript deep-link route handler and no registered iOS URL scheme; iOS opening that scheme fails with LaunchServices 115 both before and after this migration. SceneDelegate proxy code is unchanged; no new deep-link feature is claimed.
- Native telemetry: Android plugin logs show screen/events/properties and preference/RevenueCat calls; fresh iOS logs initialize Analytics 12.19.2 and Crashlytics 12.19.2 without a fatal launch. Server-side crash ingestion was not exercised. Purchase/restore event names, sandbox/internal exclusions and schemas are unchanged and covered by the existing service tests.
- Standards review: no documented breaches. Spec review: one finding fixed—Azure install/build scripts now use `set -euo pipefail`, so a failed earlier check cannot be hidden by a successful later command.

Delivery status: implementation, Standards/Spec review and pruning are complete. GitHub publication failed on 2026-10-07 with server errors, then succeeded on 2026-10-08. [PR #42](https://github.com/deanvanniekerk/k53studyguide/pull/42) is ready for review. Claude review and PR checks are in progress.

Release remains blocked on explicit owner acceptance of the Router peer constraint and five upstream advisories above. Publishing the review PR does not accept those exceptions or authorize a release.

### Branch test pruning

Scope: the six added/modified test files (32 expanded cases); no other changed component has an adjacent test file. Keep decisions exercise the real hook/component/service/translation boundary. Native SDKs are external observation ports; the app analytics module is no longer mocked in invitation tests.

| Case | Verdict and deciding rubric |
| --- | --- |
| Invitation visible once, counted again on return | Keep: Behavior; real hook + analytics event contract |
| Invitation excludes cached pages and owned Premium | Keep: Behavior; route/entitlement transition |
| Offer opens and closes on route leave | Keep: Behavior |
| Cold iOS invitation product attribution | Keep: Contract; real analytics path |
| Saved finished order does not replay thanks | Keep: Regression pin; real modal state |
| Initiating checkout thanked once | Keep: Behavior; real purchase service and modal |
| Restore message without purchase thanks | Keep: Behavior |
| Uninitiated Premium refresh stays silent | Keep: Behavior |
| Cancelled checkout feedback and retry | Keep: Behavior |
| Failed checkout feedback and retry | Keep: Behavior |
| Quiz-results origin through checkout | Keep: Contract; modal-to-real-service attribution |
| Restore while purchasing unavailable | Keep: Behavior; conditional UI |
| Pending payment prevents close | Keep: Behavior |
| Offline store retry retains Restore | Keep: Behavior |
| Deferred payment consumes late access once | Keep: Behavior |
| Deferred payment close/restore feedback | Keep: Behavior |
| Closed modal silently grants late access | Keep: Behavior |
| Declined deferred payment can retry after Restore | Keep: Behavior |
| Invisible/visible Study card changes seen progress once | Keep: Regression pin; DOM, real Redux and analytics |
| Language changes, HTML, fallback and zero interpolation | Keep: Regression pin; actual shared DOM renderer |
| Localhost store links suppress collectors | Keep: Behavior; actual page links/collector gate |
| Preview-host store links suppress collectors | Keep: Behavior |
| Apex production links and referrals | Keep: Contract; actual destinations/event schemas |
| www production links and referrals | Keep: Contract |
| analytics_test query marks referrals | Keep: Behavior |
| QA source query marks referrals | Keep: Behavior |
| QA campaign query marks referrals | Keep: Behavior |
| Production demo links and referrals | Keep: Behavior; real interactive dialog |
| Test-labelled production demo referrals | Keep: Behavior |
| Local demo links suppress collection | Keep: Behavior |
| Historical results render without completion calls | Prune: render-only absence check; completion ownership is covered by state submission tests |
| Fresh Checklist displays Level 0 | Prune: Prop echo / Duplicate altitude; level selectors and actual shared interpolation regression pin this value |

**30 kept, 2 pruned.** Removed the historical-results case from `assessmentAnalytics.test.jsx` and the single-case `Checklist.test.jsx`. The retained Study regression now also asserts real persisted seen-state; invitation tests traverse real app analytics instead of an app-service mock. Complete suites, lint and types are rerun after pruning.

No release or upload is authorized by this record. Azure remains `trigger: none` / `pr: none`; signing team, profile and secure-file names are preserved. Native version remains 1.39 (39), with final upload-history validation still required before packaging. Local Test Store bundles are QA-only and must be replaced with production platform-key bundles before release.

## Primary migration references

[Ionic 9 migration](https://ionicframework.com/docs/updating/9-0), [React 19 migration](https://react.dev/blog/2024/04/25/react-19-upgrade-guide), [Vitest migration](https://vitest.dev/guide/migration), [AGP 9.4 compatibility](https://developer.android.com/build/releases/agp-9-4-0-release-notes), [Capacitor SPM](https://capacitorjs.com/docs/ios/spm), [Firebase CocoaPods deprecation](https://firebase.google.com/docs/ios/cocoapods-deprecation), [Crashlytics symbol inputs](https://firebase.google.com/docs/crashlytics/ios/get-deobfuscated-reports?platform=ios), [hosted macOS-26 software](https://github.com/actions/runner-images/blob/main/images/macos/macos-26-Readme.md).

## Rollback

Revert each coupled stage in full, including manifests and lockfiles. Restore baseline Node/pnpm when reverting tooling. For framework rollback restore route source, all React/Ionic/router pins, peers/types/override together; no persisted Redux format is changed. For Android rollback restore Gradle wrapper/build plugins/library variables together then rebuild. For SPM rollback restore the Xcode project, Podfile and Podfile.lock, remove CapApp-SPM and resolve CocoaPods with the baseline lock. Preserve scene code and signing assets. Never downgrade an already-uploaded store build number; 1.39 (39) is retained pending final upload-history checks.
