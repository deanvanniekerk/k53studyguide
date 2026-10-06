# iOS analytics association and validation

Tracking: [analytics #5](https://github.com/deanvanniekerk/k53studyguide/issues/5), with checkout baseline gaps from [#9](https://github.com/deanvanniekerk/k53studyguide/issues/9).

## Evidence captured on 6 October 2026

The Firebase console inventory showed the intended `k53-study-guide` project registered for both native apps, while its linked GA4 property exposed only an Android stream. The registered iOS bundle matches `deanvniekerk.k53studyguide.app`. Exact account, property, stream and app identifiers are retained with private audit evidence.

A fresh Firebase configuration download has the matching project and iOS app identity, but `IS_ANALYTICS_ENABLED=false`. This flag alone does **not** prove runtime collection is disabled: the local native run explicitly logged `Analytics collection enabled`. It also does not create the missing GA4 stream. Do not hand-edit the generated configuration as a substitute for repairing the association.

The repository already includes the Analytics CocoaPods subspec and Firebase Analytics 12.7.0. The installed Capacitor Firebase Analytics 8.3.0 plugin calls `FirebaseApp.configure()` when the default app is absent. Xcode includes `GoogleService-Info.plist` in the app resource phase; Azure supplies that file from its existing secure-file entry.

A local build from integration base `6605edd` succeeded with Xcode 27.0 after `pnpm install --frozen-lockfile`, `pnpm build` and `pnpm cap-sync-ios`. The unsigned Debug simulator bundle is version **1.38 (38)**. Its embedded configuration is semantically identical to the fresh download (Xcode converts the plist representation). It installed and launched on iPhone 17 Pro / iOS 26.5.

This is **not evidence of the configuration in the shipped App Store release**. No release archive or Azure secure-file contents were available for comparison. Runtime logs also show Firebase Installations failing with `SecItemCopyMatching (-34018)` in the unsigned simulator environment. Resolve signing/keychain setup before using this simulator as a collection acceptance test; do not attribute this local failure to the production app.

The available computer-control surface could not select Simulator, so no in-app interaction or screenshot-based checkout verification was completed. No Firebase association was changed.

## Association repair

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

Issue #5 remains open until the association is repaired, both platform journeys are observed, processed iOS reporting is verified and release coverage is established.

## Checkout baseline (#9)

The source maps iOS product `deanvniekerk.k53studyguide.premium_access` to RevenueCat entitlement `premium_access` using purchases-capacitor 13.2.0. The configured local build used the existing ignored environment file; key values and configuration files were not committed. No repository StoreKit configuration was found. Source mapping is not proof that App Store Connect and RevenueCat are configured identically.

| Case | Result |
| --- | --- |
| Native build, install and launch | Passed for unsigned simulator 1.38 (38) |
| Store product / entitlement configuration | Source mapping recorded; remote mapping unverified |
| Free offer discovery and localized price | Not exercised; Simulator UI unavailable |
| Cancellation and retry | Not exercised |
| Successful premium unlock and restore | Not exercised; sandbox transaction environment unconfirmed |
| Restart persistence and mock-test access | Not exercised |
| App Store sandbox / device / TestFlight validation | Not performed |

Continue #9 with an accessible simulator and explicit StoreKit test setup, or a supported sandbox device/TestFlight path. Label local StoreKit results separately from store-backed results. Do not infer payment success, restore correctness or production purchase availability from this build.
