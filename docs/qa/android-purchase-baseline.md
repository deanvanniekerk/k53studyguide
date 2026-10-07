# Android purchase baseline

Partial baseline for [#8](https://github.com/deanvanniekerk/k53studyguide/issues/8), recorded 6 October 2026. **This is not a store-billing pass.** The July review remains an unverified symptom; these results do not establish its cause.

## Verified environment

- Runtime source: `1333eaf6595f7df832933c1891349a158843bd9c`; dependency baseline originally captured at `6605eddb1e46aacabb170da862eef58af85d71dc`.
- App: `deanvniekerk.k53studyguide.app`, version `1.38` (`38`), debug APK, minimum API 24, target/compile API 36.
- Device: Pixel 9 AVD, Android 17/API 37, ARM64 Google Play image with 16 KB pages. Play Store is installed.
- Install source: local `adb install -r`, preserving existing app data. The existing app was `1.28` (`28`), with no recorded package installer. This was not a clean free-state install or a Play-distributed release.
- The correct ignored native Firebase configuration was supplied for `k53-study-guide`; the existing Google Play RevenueCat SDK key (`goog_` prefix) was explicitly supplied to the Vite build process. The initially available `test_` key was unsuitable for this store baseline and was replaced locally before the recorded app run. Neither configuration is included in version control.
- Frozen dependency installation, web production build, Capacitor Android sync and Gradle debug APK assembly all succeeded. The web build reports its existing large-chunk warning; Gradle reports deprecated features ahead of Gradle 9.

| Component | Resolved version |
| --- | --- |
| Capacitor Android/core/CLI | 8.4.1 |
| Capacitor Firebase analytics/crashlytics plugins | 8.3.0 |
| RevenueCat Capacitor plugin | 13.2.0 |
| RevenueCat Android SDK | 10.9.1 |
| RevenueCat hybrid common | 18.15.1 |
| Google Play Billing | 8.3.0 |
| Firebase Analytics Android | 23.0.0 |
| Firebase Crashlytics Android | 20.0.3 |

These are the baseline resolutions, not a claim that all dependencies are current. Upgrade work is tracked separately in #12 and #20.

## Observed runtime results

Recorded 6 October 2026, 15:45–15:51 UTC (17:45–17:51 SAST):

| Check | Result |
| --- | --- |
| Play account | Signed-in emulator account matched an existing Play Console license-tester list member by private comparison. List enablement/test-track access was not independently established in this run. |
| Product lookup | Native `getProducts` returned `premium_access`, price `39.99`, currency `ZAR`, localized price `R 39,99`; RevenueCat returned the default lifetime offering. This confirms SDK availability, not the unvisited purchase sheet's price. |
| Initial entitlement | Existing active `premium_access`, store `PLAY_STORE`, `isSandbox=true`, verification `VERIFIED`, no expiration. Its purchase predates this audit. |
| Profile | Displayed **Premium Purchased**. Existing learner progress remained intact. |
| Premium access | Test → Start Test opened the mock-test questions without a paywall. |
| Relaunch | Removed the app from Android Overview, reopened it, and observed **Premium Purchased** again. Native CustomerInfo again returned the same active sandbox entitlement. |
| Native analytics calls | Two `app_open` events with `premium_status=premium`; one `mock_test_start` and legacy `START_TEST`. No purchase or restore events were produced by this session. This is native bridge evidence, not GA4 report ingestion proof. |
| Restore action | Not exercised: the entitled Profile card is static and Test opens directly; the restore action lives inside the purchase modal, which these entitled entry points do not open. |

The SDK metadata reports `productCategory=NON_SUBSCRIPTION` and `productType=CONSUMABLE`, alongside a lifetime offering. Confirm the intended consumption behavior and store/RevenueCat mapping in #12/#14 before drawing a defect conclusion from that metadata.

The web production build used `execution_context=production` despite native debug signing. Firebase debug mode was enabled for the session and cleared afterward. Exclude this QA window from organic analysis; do not infer a new sale from an entitlement already present. For future QA builds explicitly supply `NODE_CONFIG='{"environment":"development"}'` while preserving the store SDK key.

## Remaining store checks

**#8 remains partial.** No fresh purchase, native-sheet cancellation, pending payment, error/retry or user-initiated restore was exercised. No fake purchase was used. The pre-existing sandbox entitlement is not a completed checkout test, and existing learner data was not cleared to manufacture a free state.

1. Use a separate confirmed free sandbox account/environment; confirm license-test enablement and any required test-track access.
2. Find the offer in both Test and Profile, and record the actual displayed price.
3. Verify explicit Google Play test-payment wording before any confirmation. Exercise cancellation, error/retry, pending handling where available, and a confirmed sandbox purchase.
4. Verify premium access after purchase and restart; separately exercise restore from a free local state with an owned sandbox purchase.
5. Reconcile those outcomes with RevenueCat sandbox records and GA4 DebugView. Keep receipts, account/customer identifiers and raw exports outside this public repository.

## Local automation note

Android Studio's **docked** Running Devices panel was targetable through computer-use screenshot coordinates; the detached panel was unreliable and exposed no accessible app child controls. Screenshots must use their original pixel coordinates when the displayed preview is resized. The emulator launched for this run was stopped afterward. A screenshot of the premium state after relaunch and private native logs accompany the local audit evidence.

## Reproduce the build

Supply the ignored native Firebase config and export the existing Google Play Android RevenueCat public SDK key securely in the shell, without printing or committing configuration values. Merely copying `.dev.env` does not load it into Vite; explicitly load/export the required variable. Verify the platform prefix without displaying the key. From the repository root:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm cap-sync-android
cd pkg/app/android
./gradlew :app:assembleDebug :app:dependencies --configuration debugRuntimeClasspath
```

The debug APK is generated at `pkg/app/android/app/build/outputs/apk/debug/app-debug.apk`. Save dependency and build logs privately with the baseline commit and device details. Run Capacitor sync in the checkout opened by Android Studio before Gradle sync; generated Cordova variables are absent from a fresh checkout until that step.
