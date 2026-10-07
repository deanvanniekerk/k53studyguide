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
| Background / foreground | App resumes and navigation works; JavaScript pause/resume event delivery not separately asserted |
| Automated suite | 163 app and 10 website tests passed |
| TypeScript and Biome | Passed |
| Android assembleDebug, JDK bundled with Android Studio | Passed; local Firebase configuration absent, so Firebase Gradle processing was skipped. This is compilation coverage, not Android store or analytics acceptance |
| Fresh store purchase, explicit restore, deep-link delivery | Still unverified in this run; no custom URL scheme or associated-domain setup was introduced |

Keep #26 open until remaining lifecycle and store regression gates are verified. Broader dependency audit and release-candidate acceptance remain in #12 and #17.

## Rollback

Revert this migration and reinstall the prior dependency lockfiles, then resynchronise native projects. An AppDelegate-only rollback must use an older supported Xcode SDK; rebuilding that rollback with Xcode 27 recreates the launch failure. App data was backed up before testing and no app uninstall or history reset was performed.
