# iOS 27 scene migration

Tracking: [#26](https://github.com/deanvanniekerk/k53studyguide/issues/26), child of native compatibility [#12](https://github.com/deanvanniekerk/k53studyguide/issues/12).

Xcode 27 builds using the previous AppDelegate-only project terminate before the first screen on iOS 27.0.1. Two physical-device launches reproduced signal 5 at UIKit's no-scene-lifecycle check. The [Capacitor 8.5 migration](https://capacitorjs.com/docs/updating/8-5) supplies the supported scene lifecycle.

## Change and audit

- Pin core, iOS, Android and CLI together at 8.5.2; update App to 8.1.2. Keep other plugins and platform deployment targets unchanged in this batch.
- Apply the official CLI's UIScene migration routine: SceneDelegate, manifest, AppDelegate configuration hook and Sources registration. Preserve the existing Main and LaunchScreen storyboards.
- AppDelegate has no custom work in its foreground/background stubs. Existing URL and universal-link handlers only forward to Capacitor; the new scene handlers forward through SceneDelegateProxy, including cold connection options.
- App plugin observers use UIApplication notifications, which remain available under scenes. App Review already locates a UIWindowScene. No custom native code references the removed temporary-window APIs. Firebase initialization and RevenueCat product/entitlement retrieval work in the physical run.
- Synchronise both native projects. The manually added Firebase Analytics subspec must use the same updated pnpm path as the generated base pod. Its previous path caused CocoaPods to reject conflicting sources; both now agree. Pod versions for Firebase and RevenueCat remain unchanged.

## Validation and limits

| Check | Result |
| --- | --- |
| Signed Xcode 27 / iPhone 15 Pro / iOS 27.0.1 build and launch | Passed after migration; failed twice before it |
| Existing premium access and mock-test entry | Passed with the real RevenueCat service and existing sandbox entitlement |
| Repeated Test/Profile navigation and full restart | Passed; no repeated purchase-success notification |
| Background / foreground | Original physical run resumed correctly; explicit JavaScript delivery now passes on the iOS 26.4.1 simulator (see follow-up below) |
| Automated suite | 163 app and 10 website tests passed |
| TypeScript and Biome | Passed |
| Android assembleDebug, JDK bundled with Android Studio | Passed; local Firebase configuration absent, so Firebase Gradle processing was skipped. This is compilation coverage, not Android store or analytics acceptance |
| Fresh store purchase, explicit restore, deep-link delivery | Still unverified in this run; no custom URL scheme or associated-domain setup was introduced |

The original physical purchase/restore gaps are covered by [#9](https://github.com/deanvanniekerk/k53studyguide/issues/9#issuecomment-6032463897). Remaining acceptance for the refreshed dependency set must be distinguished from that earlier evidence; see the follow-up below and #12/#17.

## Rollback

Revert this migration and reinstall the prior dependency lockfiles, then resynchronise native projects. An AppDelegate-only rollback must use an older supported Xcode SDK; rebuilding that rollback with Xcode 27 recreates the launch failure. App data was backed up before testing and no app uninstall or history reset was performed.


## Follow-up validation — 2026-10-07

The [compatible dependency refresh](dependency-refresh-2026-10.md) keeps Capacitor core/iOS/Android/CLI at 8.5.2 and App at 8.1.2. It updates other plugins and their native SDKs. At the user's request, all new runtime checks use the booted iPhone 17 Pro simulator on iOS 26.4.1; the physical iPhone was not installed to, reset or used for this follow-up.

### Lifecycle boundary

A temporary local probe subscribed to the public `@capacitor/app` events `appStateChange`, `pause`, and `resume`, plus the bridge's document `pause`/`resume` events. It only logged event names and active state. It was added for a Debug simulator build, then removed from source; it is not part of production code.

After the probe reported ready, Home/background and app/foreground transitions were exercised twice, from Study and the Test purchase screen. Both cycles produced:

```text
appStateChange false
document pause
plugin pause
document resume
plugin resume
appStateChange true
```

The app remained navigable after resumption. This verifies native-to-JavaScript delivery, not a mock of the Capacitor boundary. The original signed iOS 27 physical launch and checkout evidence remains above and in #9; these new simulator results do not assert iOS 27 delivery or fresh store purchases on the refreshed SDKs.

To reproduce, add temporary listeners in a local debug entry point before rendering, wait for their registration, then background/reopen the simulator twice and inspect the console. `SIMCTL_CHILD_NSUnbufferedIO=YES` avoids delayed Swift console output when capturing `simctl launch --console`. Remove the probe and rebuild/copy assets before a normal build; never ship test instrumentation or Test Store keys in a release.

### URL entry-point audit

`Info.plist` declares no `CFBundleURLTypes`; the native project declares no associated-domain entitlement or `CODE_SIGN_ENTITLEMENTS` setting, and the app registers no `appUrlOpen`/`getLaunchUrl` route. Consequently there is no configured custom-scheme or universal-link destination to exercise. Browser/App Store outbound links are not incoming deep links.

The existing AppDelegate forwarding remains intact. SceneDelegate forwards cold connection options, URL contexts and browsing user activities through Capacitor's SceneDelegateProxy. In installed 8.5.2, cold options are deferred until the bridge view appears; warm handlers update the legacy launch URL and notify the App plugin. This is a source/configuration audit, not a claimed end-to-end deep-link test. If an incoming route is added later, add cold/warm route-delivery tests then.

### Build and checkout limits

- Xcode 27 simulator build and launch pass; Android `assembleDebug` passes with the real local Firebase file and Firebase processing enabled, superseding the earlier compile-only Android check.
- Frozen dependency install, TypeScript, Biome, 163 app tests, 10 website tests, and both production web builds pass.
- The iOS Test Store lookup initially returns no product for `deanvniekerk.k53studyguide.premium_access`, so Go Premium is unavailable. This is a test-catalog/configuration gap; a fresh checkout is not claimed from that run. Android's earlier Test Store purchase used `premium_access` and the previous SDK set.
- Physical Apple sandbox and Google Play purchase/restore checks on the refreshed SDKs remain under #12/#17. The iOS 27 scene fix itself already has earlier physical launch, checkout and restoration evidence, while the new callback check is simulator-only.
- Purchase CTA visibility remains a separate issue (#30).

Private run logs and simulator data backup are retained outside the repository. No device or customer identifiers, API keys, receipts or raw logs are committed.
