# Premium conversion browser review — #30

Branch: `codex/premium-conversion-flow`. Browser iteration precedes native acceptance.

## Audit and design decisions

1. **Locked Test — high-priority defect reproduced.** At 320×568 in Safari, the original illustration and card pushed Go Premium below the initial viewport. The primary action now occupies an IonFooter above the tab bar. Supporting content scrolls; the original oversized icon is replaced by the compact approved car artwork.
2. **Premium Test — browser checks pass.** Start/Continue remains pinned. Tests-passed progress remains visible, and Reset remains in the scrollable content. Start, back-to-Continue and confirmed Reset were exercised.
3. **Purchase sheet — improved, browser design approved.** The original brand heading and large benefit cards left room for only one benefit on the small viewport. The revised sheet leads with the mock-test outcome, uses compact generated illustrations, and explains the one-time purchase. Price, purchase and restore remain together below a scrolling benefit area. Store pricing is still supplied by the purchase service.
4. **Practice results — new conversion opportunity.** The score remains first, followed by an inline premium invitation before answer review. A compact result summary makes the invitation and CTA visible at 320×568. Copy varies for a perfect versus imperfect score without claiming a quiz score predicts an official pass. No automatic offer popup is added.
5. **Quiz landing/Profile — contextual offer entry.** Quiz adds a premium invitation after its existing free quiz controls. Profile retains its entry with improved wording. Premium learners see no new invitations.

Offer entry is intentionally available even if checkout is unavailable, so learners can read the explanation and restore existing access. Actual purchase remains disabled according to service availability/pending state. This is recorded in #30's expanded scope.

## Browser verification

Safari responsive mode: 320×568 (dark and light) and 390×844 (light). Screenshots are retained privately in the local task evidence directory, outside Git.

- Locked Test action is visible without scrolling; scrollable content has its own space above the footer.
- Simulated purchase grants access, dismisses the offer, and shows one success toast.
- Start, Continue and Reset use the existing test flow.
- A five-question practice quiz reaches results; its invitation opens the offer and closing it preserves the score and answer review.
- Price, purchase and restore are visible on the small and larger purchase-sheet layouts.
- Component/service tests cover cancellation/retry, unavailable purchase with available restore, one-time feedback, origin propagation, and pending-close protection.
- Invitation tests exclude premium learners and cached inactive pages, deduplicate visibility within a visit, and count a later visit.

Run `pnpm start` for a browser preview. Purchases/restores are simulated by the existing local purchase service; R25 is a fixture, not a verified live price. Profile → Browser purchase preview → Reset to free allows another run without clearing study/quiz progress. Development browser analytics are printed as `[Analytics preview]` and not sent to Firebase. Preview controls are absent from the production bundle.

## Remaining acceptance

Browser design feedback has been applied. The native simulator pass below covers the primary actions, Test Store checkout, and selected size/theme combinations. Screen-reader/focus behavior, the remaining device/text-size combinations, and native event receipt in DebugView remain unverified. Browser layout evidence is not native store purchase or accessibility compliance evidence. #30 remains open.

See `docs/analytics/purchase-measurement.md` for event definitions and the conversion evaluation plan. Confirmed revenue remains a store/RevenueCat measure, separate from client access-granted events.

## Selected illustration

The product owner selected the Open Road ImageGen artwork (driver in a blue car). The free Test card now displays the exact artwork above its headline, as a transparent 103 KiB WebP. It uses a 96px image slot on short viewports and grows up to 184px on larger ones. The original large test-sheet icon remains removed; premium progress and the persistent footer are unchanged. See the scoped `design-qa.md` for visual evidence and remaining native checks.

## Cohesive artwork update

The 14 generated icons are mapped in `docs/design/icon-inventory.md`. Browser checks covered Study at 320px/390px, light/dark purchase sheets, the Profile premium trophy and a completed Quiz result. Narrow Study tiles now place their percentage beneath the topic label. All decorative assets retain alpha and use empty alt text beside visible labels. Test success/review variants are integrated; completing native Quiz/Test flows remains part of the wider acceptance pass. See root `design-qa.md` for evidence and limits.

## Native simulator pass — 2026-10-07

App code tested: `e33e24f` (PR #33). Debug native builds used RevenueCat **Test Store** keys, with the production service selection and debug diagnostics enabled. An earlier development build selected LocalPurchaseService; its R25 fixture screenshots only establish layout. The later Test Store sheets displayed USD 0.99. Neither price is a verified live store price.

| Configuration | Observed result |
| --- | --- |
| iPhone SE (3rd generation), iOS 26.4.1, 375×667 logical screen | Free Unlock remains visible before and during scrolling. |
| Same iOS simulator, DeviceHub Text Size increased from 3 to 6 | Unlock wraps without clipping. Price, Get Premium and Restore remain visible. Premium Start/Continue stay above navigation while the progress and Reset content scroll. |
| Same iOS simulator, dark appearance | Premium Start action and progress remain readable. Reset confirmation returns Continue to Start. Premium access remains after process termination/relaunch. |
| Pixel 9 emulator, Android 17 / API 37, 1080×2424 at 420dpi (about 411×923dp), light | Free/premium actions, offer price and Restore visible. Start opens a mock test; back returns to Continue. |
| Same Android emulator, 720×1280 at 360dpi (320×569dp), light | Fresh free Unlock and premium Continue visible without scrolling. Continue opens the existing test. Offer price, Get Premium and Restore fit above system navigation. |

Both platforms reached the native RevenueCat Test Store dialog. Each exercised cancel, failed purchase, retry and successful purchase; successful purchase dismissed the offer and unlocked Start Test. Navigating away and back did not reproduce the repeated purchase-success notification. This is Test Store integration evidence, not Apple/Google billing certification.

Android Restore with a fresh anonymous Test Store identity displayed “No Premium purchase was restored” and stayed free, with retry controls available. Restoring an existing Apple/Google purchase after reinstall is **not verified** by this test.

Android native bridge logs for the Test Store run contain one invitation view/tap and offer view, three checkout starts, and one cancellation, error and sandbox access-granted outcome respectively, followed by a mock-test start. The clean-identity restore produced `restore_start` and `restore_outcome: no_entitlement`. These are client dispatch observations; server receipt/deduplication in DebugView still needs checking. iOS logs show native analytics calls, but their complete event payload sequence was not captured. The cold-iOS product attribution regression is covered by the four passing `usePremiumOffer` tests.

QA builds selected `execution_context: production` to exercise RevenueCat; successful test outcomes identify `transaction_environment: sandbox`. Exclude this simulator QA window from organic conversion interpretation, including pre-checkout events with unknown transaction environment. Raw logs, screenshots and the pre-reset Android backup remain private, outside Git, under the local 2026-10-07 issue30 evidence directory.

English is the only selectable language in the current Settings UI; longer translated-label coverage is therefore not claimed. A separate Profile checklist wrapping defect at enlarged iOS text size is tracked in #34 under parent #2. It does not obscure the Test CTA.
