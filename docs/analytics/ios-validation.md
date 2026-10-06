# iOS analytics association and validation

Tracking: [analytics #5](https://github.com/deanvanniekerk/k53studyguide/issues/5), with checkout baseline gaps from [#9](https://github.com/deanvanniekerk/k53studyguide/issues/9).

## Evidence captured on 6 October 2026

The Firebase console inventory showed the intended `k53-study-guide` project registered for both native apps, while its linked GA4 property exposed only an Android stream. The registered iOS bundle matches `deanvniekerk.k53studyguide.app`. Exact account, property, stream and app identifiers are retained with private audit evidence.

A fresh Firebase configuration download has the matching project and iOS app identity, but `IS_ANALYTICS_ENABLED=false`. This flag alone does **not** prove runtime collection is disabled: the local native run explicitly logged `Analytics collection enabled`. It also does not create the missing GA4 stream. Do not hand-edit the generated configuration as a substitute for repairing the association.

The repository already includes the Analytics CocoaPods subspec and Firebase Analytics 12.7.0. The installed Capacitor Firebase Analytics 8.3.0 plugin calls `FirebaseApp.configure()` when the default app is absent. Xcode includes `GoogleService-Info.plist` in the app resource phase; Azure supplies that file from its existing secure-file entry.

A local build from integration base `6605edd` succeeded with Xcode 27.0 after `pnpm install --frozen-lockfile`, `pnpm build` and `pnpm cap-sync-ios`. The unsigned Debug simulator bundle is version **1.38 (38)**. Its embedded configuration is semantically identical to the fresh download (Xcode converts the plist representation). It installed and launched on iPhone 17 Pro / iOS 26.5.

This is **not evidence of the configuration in the shipped App Store release**. No release archive or Azure secure-file contents were available for comparison. Runtime logs also show Firebase Installations failing with `SecItemCopyMatching (-34018)` in the unsigned simulator environment. Resolve signing/keychain setup before using this simulator as a collection acceptance test; do not attribute this local failure to the production app.

That earlier unsigned run is superseded by the signed validation below. In Xcode 27, the simulator UI is **Device Hub**, at `/Applications/Xcode.app/Contents/Applications/DeviceHub.app`; the old `Simulator.app` path is absent.

### Association repaired and signed validation

With explicit owner approval, the existing-property association operation completed on 6 October at 17:21 SAST. Re-reading Firebase and GA4 confirmed a new iOS stream mapped to the registered bundle and Firebase app. Existing Android and web stream identifiers were preserved; no streams were unlinked or deleted. The temporary administrative credential was deleted after verification. Reporting continues with the separate read-only credential.

The fresh configuration still has `IS_ANALYTICS_ENABLED=false`. The signed simulator logs explicitly confirm runtime collection enabled, so the generated flag was not hand-edited. Release-archive comparison remains outstanding.

Integration base `c87f17d` built and ran on iPhone 17 Pro / iOS 26.5 as version **1.38 (38)**, with normal simulator code signing enabled. Place DerivedData outside synced Documents: the first signed build there failed with a resource-fork metadata error; a `/tmp` DerivedData build succeeded. The embedded Firebase configuration is semantically identical to the post-repair download. No additional keychain permissions were granted. The signed run did not reproduce the unsigned run's Firebase Installations keychain error.

Actual UI taps opened Study, Quiz, a practice question, Test and Profile. In the debug run, starting a quiz and selecting an answer produced `app_open`, `quiz_start`, `quiz_answer` and `screen_view` in the native Analytics logs, followed by successful HTTP 204 uploads. Parameters included quiz mode and question/answer identifiers. These are UI-originated SDK observations, not proof of receipt in GA4 DebugView or processed reporting. The live log capture used both `-FIRDebugEnabled` and `-FIRAnalyticsDebugEnabled`. No `firebase_error` was observed in that captured journey.

A read-only processed report for 6 October, grouped by platform, app version, stream and event, confirmed the existing Android stream still has version 1.38 `app_open`, `screen_view`, `quiz_start`, `quiz_answer` and `view_promotion` activity. This is live Android collection evidence, not a controlled Android regression run. The corresponding iOS processed and Realtime observations were still empty at 17:45 SAST; the newly repaired stream must not yet be treated as accepted. Raw requests, timestamps and responses remain in private audit evidence.

A later build incorporating integration `1333eaf` used the existing App Store app's public RevenueCat SDK key as a private local override. StoreKit returned the premium product, and the UI showed **$1.99** for this simulator storefront. Opening the modal emitted `view_promotion`; tapping Get Premium emitted `select_promotion` and `begin_checkout`. The native Apple Account sign-in prompt was cancelled without entering credentials. The app displayed **Purchase Cancelled**, re-enabled Get Premium, and emitted `purchase_cancel` with the same attempt ID, `currency=USD`, `value=1.99`, `offer_origin=mock_test`, `purchase_state=cancelled` and `transaction_environment=unknown`. No purchase-success event or premium entitlement was claimed.

At 17:43–17:44 SAST the app was relaunched with `-FIRDebugDisabled -noFIRAnalyticsDebugEnabled`, then the practice start/answer and premium-offer journey were repeated through the UI. The property had only an Internal Traffic exclusion in **Testing**, with no active developer filter; DebugView still showed no device in the coordinator's check. The build's JavaScript environment was `production` because the default web build uses production mode, even though native signing was Debug. Annotate this validation window in analyses; use an explicit development environment for future test builds rather than assuming native Debug signing sets analytics context.

## Association repair procedure

The completed repair followed this procedure. Retain it for diagnosis; do not rerun it merely because reporting has not processed yet.

1. With an existing authorized administrative session, read Firebase Analytics details and GA4 streams; record the current Android stream, any web streams and all registered Firebase apps. Confirm the intended property before modifying it.
2. Use the existing-property association operation only after confirming its impact. Firebase's [Management API](https://firebase.google.com/docs/reference/firebase-management/rest/v1beta1/projects/addGoogleAnalytics) supports `projects.addGoogleAnalytics` with the **same** `analyticsPropertyId`: it associates matching native streams by package/bundle ID and provisions missing ones. It rejects a different property when one is already linked. The operation requires Firebase project Owner and Analytics Edit permissions; a reporting-only credential cannot perform it.
3. Do not unlink/relink the property, delete streams, or pass `analyticsAccountId` (which creates a property). If Firebase web apps exist, account for the documented creation of new web streams before using this operation. The inspected inventory contained Android and iOS apps only; recheck it at execution time.
4. Wait for the returned operation to finish successfully. Re-read both inventories and confirm the new iOS stream maps to the registered iOS app and the existing Android/web stream identities remain intact.
5. Download the iOS configuration again. Compare its identity and collection-related fields with the actual release archive and Azure secure file. Preserve the secure-file name `GoogleService-Info.plist`. Build and release if the shipped binary needs configuration or code changes; backend association alone does not establish which installed versions work.

## Acceptance validation still required

Use a correctly signed simulator build or development device and record build number, OS, platform, Firebase app and GA4 stream for each run. Keep raw logs, user/device identifiers, Firebase files and transaction records outside the public repository.

- Enable iOS debug mode with `-FIRDebugEnabled`; verify `app_open`, `screen_view`, practice `quiz_start` / `quiz_answer`, and premium offer `view_promotion` in the intended property's DebugView. Check parameters and `firebase_error`, not only event names. Navigate through actual app flows; a direct SDK call cannot prove the UI emits an event.
- Follow the same journey on Android and verify its existing stream still receives events.
- Disable debug mode with `-FIRDebugDisabled` before a separately labelled processed-report validation. Inspect property filters first: [Firebase's DebugView guidance](https://firebase.google.com/docs/analytics/debugview) states debug events can reach reports/BigQuery unless developer traffic is filtered. Never assume debug mode automatically prevents report contamination.
- Query processed reporting after processing completes, grouped by platform, app version, stream and event. Record the observation window and the first verified version. Distinguish unavailable/pending data from zero activity.
- Compare a released archive's embedded plist, bundle identity and Analytics dependencies with the validated build. State explicitly whether existing installations or only a new release are covered.

Issue #5 remains open: the association is repaired, but GA4 receipt of the complete iOS journey, a controlled Android regression journey, processed iOS reporting and release coverage still need verification.

## Checkout baseline (#9)

The source maps iOS product `deanvniekerk.k53studyguide.premium_access` to RevenueCat entitlement `premium_access` using purchases-capacitor 13.2.0. The configured local build sourced the existing ignored `.dev.env` into the build process; simply copying this file does not populate the Vite configuration. Key values and configuration files were not committed. The initial local iOS key was a RevenueCat **Test Store** key, as explicitly reported by its SDK. That configuration was replaced for the later validation with a private override containing the existing App Store app's public SDK key. No RevenueCat production settings were changed. Neither local validation build is a release artifact. No repository StoreKit configuration was found. Source mapping is not proof that App Store Connect and RevenueCat are configured identically.

| Case | Result |
| --- | --- |
| Native build, install and launch | Passed for signed simulator 1.38 (38), iOS 26.5 |
| Store product / entitlement configuration | StoreKit returned the configured premium product; entitlement after a transaction remains unverified |
| Free offer discovery and localized price | Test tab → premium modal passed; $1.99 for the simulator storefront |
| Cancellation and retry | Native account prompt cancelled; cancellation toast and re-enabled CTA observed; full transaction retry unverified |
| Successful premium unlock and restore | Not exercised; sandbox transaction environment unconfirmed |
| Restart persistence and mock-test access | Not exercised |
| App Store sandbox / device / TestFlight validation | Not performed |

Continue #9 with an explicit StoreKit test setup or a supported sandbox device/TestFlight path. Device Hub taps and scrolling work when the app binding is refreshed before input (`getApp`); stale focus initially prevented drags. Successful purchase and restore still require a verified sandbox account/session. The generic Apple Account sign-in prompt alone does not establish a sandbox transaction environment. Label local StoreKit results separately from store-backed results. Do not infer payment success, restore correctness or production purchase availability from this build.
