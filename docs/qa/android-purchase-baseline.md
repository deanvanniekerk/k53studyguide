# Android purchase baseline

Partial baseline for [#8](https://github.com/deanvanniekerk/k53studyguide/issues/8), recorded 6 October 2026. **This is not a store-billing pass.** The July review remains an unverified symptom; these results do not establish its cause.

## Verified environment

- Source baseline: `6605eddb1e46aacabb170da862eef58af85d71dc`.
- App: `deanvniekerk.k53studyguide.app`, version `1.38` (`38`), debug APK, minimum API 24, target/compile API 36.
- Device: Pixel 9 AVD, Android 17/API 37, ARM64 Google Play image with 16 KB pages. Play Store is installed.
- Install source: local `adb install -r`, preserving existing app data. The existing app was `1.28` (`28`), with no recorded package installer. This was not a clean free-state install or a Play-distributed release.
- The correct ignored native Firebase configuration was supplied for `k53-study-guide`; the Android RevenueCat build variable was present. Neither configuration is included in version control.
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

## Remaining store checks

The source requests the Android `premium_access` product as a non-subscription product and checks the RevenueCat `premium_access` entitlement. The live product's availability, non-consumable configuration and entitlement mapping have not yet been verified against Play Console and RevenueCat.

Before continuing, identify an existing Play license tester, confirm that account is signed in on the emulator, confirm suitable test-track access where used, and verify the product mapping. A Play-enabled image or a side-loaded debug build alone does not demonstrate sandbox access.

1. Record the actual starting premium state without deleting existing learner data. Use a confirmed free test account/environment for the free-state scenario.
2. In Test and Profile, find the premium offer; record availability, displayed price and currency.
3. Open the Google Play purchase sheet and verify its test-payment indication before proceeding. Cancel, retry, and complete only a confirmed sandbox purchase.
4. Verify premium mock-test access, restart the app, and verify the entitlement persists.
5. Match the result to a RevenueCat sandbox transaction and entitlement. Keep identifiers, receipts and transaction exports outside this public repository; attach sanitized evidence only.

No purchase sheet, cancellation, completed purchase, restored entitlement or post-purchase restart was exercised in this baseline. No fake purchase was used. Initial premium/free state and tester eligibility remain unverified.

## Local automation note

The standalone Android emulator was not addressable through the computer-use app API. Launching it through Android Studio's Running Devices panel made its launcher visible, but the embedded screen had no accessible child controls and coordinate interaction did not reliably target the detached device window. Continue through a reliably targetable emulator UI or have a human perform the store steps. Both emulator sessions launched for this baseline were stopped after inspection.

## Reproduce the build

Supply the ignored native Firebase config and export the existing Android RevenueCat public SDK key securely in the shell, without printing or committing configuration values. From the repository root:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm cap-sync-android
cd pkg/app/android
./gradlew :app:assembleDebug :app:dependencies --configuration debugRuntimeClasspath
```

The debug APK is generated at `pkg/app/android/app/build/outputs/apk/debug/app-debug.apk`. Save dependency and build logs privately with the baseline commit and device details. Run Capacitor sync in the checkout opened by Android Studio before Gradle sync; generated Cordova variables are absent from a fresh checkout until that step.
