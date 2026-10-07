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

At 17:43–17:44 SAST the app was relaunched with `-FIRDebugDisabled -noFIRAnalyticsDebugEnabled`, then the practice start/answer and premium-offer journey were repeated through the UI. The property had only an Internal Traffic exclusion in **Testing**, with no active developer filter; DebugView still showed no device in the coordinator's check. The build's JavaScript environment was `production` because the default web build uses production mode, even though native signing was Debug. Annotate this validation window in analyses; do not assume native Debug signing sets analytics context. Store-backed tests require the production JavaScript environment to select RevenueCat, as clarified in the physical-device section below.

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

## Simulator sandbox limitation observed

During 18:03:56–18:05:09 SAST on 6 October, the owner entered sandbox credentials in the simulator's purchase sign-in flow. The native trace identifies sandbox authentication: AuthKit completed its authentication step, followed by StoreKit/Apple Media Services failure `AMSErrorDomain 100`, with underlying code `2` (password reuse unavailable for the account) and code `0` (authentication failure). RevenueCat classified the result as cancelled and the app showed **Purchase Cancelled**. This later result does **not** demonstrate that the learner intentionally cancelled, that the password was wrong, or that a production checkout has the same failure. Raw authentication logs remain private.

For this simulator failure, follow [Apple DTS guidance](https://developer.apple.com/forums/thread/768966): simulator product retrieval does not establish sandbox purchase support; perform the store-backed purchase test on a physical device. A [matching error report](https://developer.apple.com/forums/thread/772773) describes the same password-reuse failure. This evidence changes the test setup required; it does not by itself justify an application code fix.

Store-backed success, entitlement, restore and persistence acceptance now requires a connected physical iPhone running a development build with a verified sandbox account, or the supported TestFlight route on a physical device. Signing into the simulator again is insufficient. Local StoreKit configuration can exercise simulated transactions separately, but cannot substitute for App Store sandbox validation. No successful transaction was observed in this window.

## Checkout baseline (#9)

The source maps iOS product `deanvniekerk.k53studyguide.premium_access` to RevenueCat entitlement `premium_access` using purchases-capacitor 13.2.0. The configured local build sourced the existing ignored `.dev.env` into the build process; simply copying this file does not populate the Vite configuration. Key values and configuration files were not committed. The initial local iOS key was a RevenueCat **Test Store** key, as explicitly reported by its SDK. That configuration was replaced for the later validation with a private override containing the existing App Store app's public SDK key. No RevenueCat production settings were changed. Neither local validation build is a release artifact. No repository StoreKit configuration was found. Source mapping is not proof that App Store Connect and RevenueCat are configured identically.

| Case | Result |
| --- | --- |
| Native build, install and launch | Passed for signed simulator 1.38 (38), iOS 26.5 |
| Store product / entitlement configuration | StoreKit returned the configured premium product; entitlement after a transaction remains unverified |
| Free offer discovery and localized price | Test tab → premium modal passed; $1.99 for the simulator storefront |
| Cancellation and retry | Intentional prompt cancellation passed earlier. Later simulator authentication failure also surfaced as cancelled; do not equate that SDK classification with learner intent. Physical-device retry remains unverified |
| Successful premium unlock and restore | No successful transaction; simulator sandbox attempt failed. Physical-device sandbox validation required |
| Restart persistence and mock-test access | Not exercised |
| App Store sandbox / device / TestFlight validation | Simulator sandbox attempt blocked by the documented environment limitation; physical-device/TestFlight validation not performed |

Continue store-backed #9 acceptance on a physical iPhone using a supported development/sandbox or TestFlight path. Keep an explicit local StoreKit simulation as separate supplemental coverage. Device Hub taps and scrolling work when the app binding is refreshed before input (`getApp`); stale focus initially prevented drags. Successful purchase and restore require a supported physical-device setup as well as a verified sandbox account/session; simulator sign-in alone does not satisfy this gate. Label local StoreKit results separately from store-backed results. Do not infer payment success, restore correctness or production purchase availability from this build.


### Physical-device preparation and pause

A Debug build from integration `23eb553` was prepared for the connected iPhone 15 Pro / iOS 26.6.2 with the existing development signing identity. Its JavaScript analytics context was explicitly set to `development`, and its Firebase configuration matched the post-repair download. Before installation, the existing 1.38 (38) app data container was copied successfully to private local backup. The validation build installed in place without uninstalling or resetting the app and launched with Firebase debug logging; console capture began. Initial entitlement and purchase outcomes were not verified. Code inspection subsequently confirmed that `configureStore` selects `LocalPurchaseService` whenever the JavaScript environment is `development`, even on a physical device. This installed build therefore cannot validate RevenueCat or App Store sandbox purchases. Before resuming, rebuild with `environment=production` to select `RevenueCatPurchaseService`, retain the real iOS public SDK key, and verify that service in runtime logs. Keep Firebase debug logging and exclude the documented QA window from production reporting; production JavaScript configuration does not itself establish whether a store transaction is sandbox or production.

The owner then began updating the phone to iOS 27. Device validation stopped at that point, and the local console capture was detached without sending a termination request to the phone. Preserve the build and backup and resume only after the owner confirms the OS update is complete. Device Hub screen sharing was unavailable on the phone's earlier OS version; this UI limitation is separate from purchase support on a physical device. No physical-device purchase or restore acceptance has been completed.


### Physical iOS 27 validation on 7 October

The updated iPhone 15 Pro runs iOS 27.0.1, and Device Hub can now display and control its screen. A fresh private app-data backup completed before installing the validation build in place. The build includes the one-time purchase-feedback fix from #24 and uses the App Store RevenueCat SDK key with the production JavaScript environment. Native logs confirm `RevenueCatPurchaseService`, one matching StoreKit product, and a localized price of $1.99. The embedded Firebase configuration matches the repaired configuration.

An initial Xcode 27 build with Capacitor 8.4.1 terminated twice before rendering with signal 5 in `___UIApplicationEvaluateRuntimeIssueForNoSceneLifecycleAdoption_block_invoke`. Issue #26 tracks the required scene migration under #12. After migrating to Capacitor 8.5.2 and adding the scene manifest, delegate and project registration, the signed build launched on the same device. This comparison concerns locally compiled binaries, not the current App Store release.

The existing RevenueCat customer information contains an active premium entitlement and an App Store transaction marked sandbox. This is evidence of an existing sandbox entitlement, not a purchase completed during this run. Profile shows Premium Purchased, Continue Test opens the mock-test questions, and repeated Test/Profile visits show no purchase-success toast. Background/foreground navigation and a complete process restart preserve access without replaying the thank-you. No history was cleared. Screenshots and raw evidence remain private.

Fresh purchase, cancellation/retry and explicit Restore Purchase still require a clean sandbox buyer state: the current premium UI hides those entry points. Do not count retained access as a fresh purchase or explicit restore test. Physical device sign-in and any sandbox-history reset must be resolved before those cases can run. The release-candidate and analytics receipt gates above remain open.

### GA4 receipt now confirmed

A read-only query on 7 October confirms processed iOS 1.38 events in the repaired stream for 6–7 October: app opens, screen views, study content, quiz start/answer/completion, offer view/selection, checkout start and purchase cancellation. Realtime also contains iOS app opens and a mock-test start during the physical-device validation window. This supersedes the earlier empty-report observation; it does not prove that every event came from this build or from organic learners. Legacy event names coexist with the new events, and the QA windows must be excluded before revenue-funnel analysis. DebugView parameter validation, controlled Android parity, complete purchase/restore journeys and release-archive coverage remain open for #5.
