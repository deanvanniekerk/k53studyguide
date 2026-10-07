# Premium checkout final sign-off

Issue [#17](https://github.com/deanvanniekerk/k53studyguide/issues/17), parent [#2](https://github.com/deanvanniekerk/k53studyguide/issues/2). Tested 7 October 2026, approximately 13:27–13:57 SAST (UTC+2).

Candidate: GitHub main `61b9e1f2ba36e5d457b479c62258baa33cd0e691`, the same source tree as verified [#35](https://github.com/deanvanniekerk/k53studyguide/pull/35) head `ecb60117bb8a2674bdd987a8484c9291456df5c2`. App version 1.38 (38). This sign-off adds evidence only; it changes no app code.

The owner chose a final RevenueCat Test Store smoke and accepted real-store billing as a limitation. These purchases used the native RevenueCat service with Test Store keys, not the browser's simulated purchase service. The USD 0.99 offer is a test fixture, not the live store price. No Google account reset or charged purchase was performed.

## Environments

| Platform | Configuration |
| --- | --- |
| iOS | iPhone SE (3rd generation) simulator, iOS 26.4.1, 375×667, dark appearance, DeviceHub text size 6 (XXXL); signed Debug build with production web assets |
| Android | Pixel 9 Google Play emulator, Android 17 / API 37, 1080×2424 at 420dpi (about 411×923dp), light appearance; Debug APK with production web assets |

Both native builds passed. Ignored local environment/configuration files supplied the Test Store keys and Firebase configuration; no secrets or generated artifacts are included here.

## Results

PASS means observed in this final native smoke. REUSED means earlier evidence or unchanged automated regression coverage, not a fresh native execution. NOT RUN identifies remaining verification limits.

| Check | iOS | Android | Evidence / limit |
| --- | --- | --- | --- |
| Free Test → offer; price and one-time wording; Purchase and Restore reachable | PASS | PASS | Unlock stayed above navigation; Test Store offer displayed USD 0.99 |
| Cancel → usable retry → successful Test Store purchase | PASS | PASS | Cancellation feedback, enabled retry, then Premium Start Test |
| Initial success feedback appears once | REUSED | PASS | Android toast captured once. The initial iOS toast expired before capture; #13 feedback regressions and earlier native evidence are reused, without claiming a fresh count |
| Premium Start opens mock questions | PASS | PASS | Real mock-test screen opened |
| Profile and Test navigation do not replay purchase feedback or show the purchase invitation | PASS | PASS | Profile checklist remained readable; returning Premium screen retained Start/Continue |
| Background/foreground and process relaunch retain Premium and active mock test | PASS | PASS | Resume retained questions; relaunch offered Continue Test |
| Existing-purchase restore and distinct restore outcome | REUSED | REUSED | Physical Apple sandbox purchase/reinstall/restore in #9; #13 service/modal regressions separate restore from purchase. Fresh owned Google Play/Test Store restore was not executed |
| Unavailable product/customer loading → retry; preserve existing access | REUSED | REUSED | Shared native service regressions in #13 cover failed loading, retry without duplicate setup, offline paid access and legacy reconciliation. Earlier #33 native failed-purchase/retry passed. No fresh airplane-mode recovery was run |
| Small/enlarged-text layout and Profile fix | PASS | REUSED | Current iOS XXXL smoke; earlier Android 320×569 and browser 320/430 checks in #33/#35 |
| Quiz/results entry points and premium invitation suppression | REUSED | REUSED | #33 browser journey and #13 regressions; not another full quiz in this pass |
| Accessible labels/focus | REUSED | REUSED | Existing browser checks and #13 coverage only; native VoiceOver/TalkBack traversal NOT RUN, no accessibility compliance claim |
| Analytics invitation → offer → checkout → access outcome received | PASS | PASS | GA4 server receipt plus native parameter inspection; details below |
| Fresh App Store / Google Play billing integration | NOT RUN | NOT RUN | Accepted real-store limitation; previous physical Apple sandbox baseline remains supporting evidence |

No app defect was found in this pass. Android emulator input stopped responding, including system controls; reboot restored it. The first Android APK lacked the ignored Firebase configuration, so checkout passed but Analytics was disabled. Restoring the existing local configuration and rebuilding fixed receipt. Only that affected analytics journey was rerun on fresh simulator data; it was not counted as a new checkout defect.

## Analytics receipt

GA4 Realtime confirmed the following counts by platform in the QA window. iOS was also visible in DebugView. Android counts below are from the isolated, correctly configured rerun; its earlier cancelled/retried journey was not received by GA4 and is not represented as server evidence.

| Event | iOS | Android |
| --- | --- | --- |
| `premium_invitation_view` | 1 | 1 |
| `premium_invitation_tap` | 1 | 1 |
| `view_promotion` | 1 | 1 |
| `select_promotion` | 2 | 1 |
| `begin_checkout` | 2 | 1 |
| `purchase_cancel` | 1 | — |
| `checkout_outcome` | 1 | 1 |

iOS's two checkout starts correspond to cancel and retry. Neither navigation nor relaunch added another successful outcome. Native parameters showed `offer_origin=mock_test`, `currency=USD`, `value=0.99`, and the platform product (`deanvniekerk.k53studyguide.premium_access` on iOS; `premium_access` on Android). Successful outcomes were `outcome=access_granted`, `transaction_environment=sandbox`; checkout-start environment was `unknown` before a transaction existed.

These are access/funnel events, not proof of financial revenue. Restore-versus-sale semantics are reused from #13; no fresh restore analytics chain is claimed. Exclude this QA window and sandbox outcomes from revenue/conversion analysis, including pre-transaction events labelled `unknown`. This pass did not change production reporting filters or prove automatic exclusion. Firebase debug mode was disabled on both test devices afterward.

Raw simulator captures, customer/transaction identifiers and debug logs remain outside the public repository. This record contains only sanitized observations and aggregate event counts.

## Reused evidence and completion scope

- [#9 Apple baseline](https://github.com/deanvanniekerk/k53studyguide/issues/9): physical iPhone sandbox purchase, cancellation/retry, reinstall/restore and persistent access.
- [#8 Android baseline](https://github.com/deanvanniekerk/k53studyguide/issues/8): existing Google tester already owns Premium; Test Store failure/retry/access evidence, without a fresh Google billing purchase.
- [#33 native and browser QA](https://github.com/deanvanniekerk/k53studyguide/pull/33), [premium conversion browser record](premium-conversion-browser.md): small layouts, purchase failure/retry, fresh no-entitlement restore, quiz results and Premium Start/Continue/Reset.
- [#32 dependency validation](https://github.com/deanvanniekerk/k53studyguide/pull/32) and [#35 final fixes](https://github.com/deanvanniekerk/k53studyguide/pull/35): 177 app tests plus 10 landing-site tests, lint/typecheck, production web and both native Debug builds passed. Shared recovery, pending/concurrent outcomes, entitlement reconciliation and one-time feedback are regression-covered. Final Codex review of #35 completed without findings.

Judgment under #17's instruction to reuse evidence: unchanged recovery, restore, quiz and accessibility-label checks use the evidence above rather than repeating the audit. Native screen-reader traversal and current real-store billing remain unverified; the latter is explicitly accepted by the owner. This closes the focused Test Store sign-off, not a claim that every original manual matrix row was freshly executed. Parent #2 can close once this evidence PR is accepted and merged.
