# Premium journey measurement

Implements the client measurement portion of [#10](https://github.com/deanvanniekerk/k53studyguide/issues/10). Store reconciliation remains a release gate; automated tests do not establish a successful store purchase.

## Event contract

| Event | Meaning |
| --- | --- |
| `purchase_initialization_error` | Purchase service initialization failed before premium controls can become available. `failure_reason` is `missing_api_key`, `product_unavailable`, or `sdk_error`; SDK failures include a bounded `error_code`, never diagnostic text. Emitted once per load attempt; concurrent initialization callers share the attempt. Failed loads can be retried within the same service lifecycle. Not an offer impression or checkout attempt. |
| `premium_invitation_view` | A free learner sees an invitation on the active page, once per page visit. Includes `offer_origin` and `product_id`. Cached inactive Ionic pages and premium learners do not count. This is invitation reach, not an offer opening. |
| `premium_invitation_tap` | Learner opens the offer from a measured invitation. Includes the originating surface. |
| `premium_offer_close` | Learner uses the offer close button without a pending operation (`close_reason=close_button`). Not a checkout cancellation, and not emitted for successful automatic dismissal. OS interruption/process death is not counted here. |
| `view_promotion` | One offer opening, after initialization settles and while still open. Includes `offer_origin` (`profile`, `mock_test`, `quiz_home`, or `quiz_results`), product, available local price/currency/value, `availability`, and `eligibility` (`eligible`, `owned`, `unavailable`). Eligibility describes app access/product availability, not a guarantee the store will accept payment. |
| `select_promotion` | Learner taps Get Premium, with the same offer origin. |
| `begin_checkout` | Product is available and the app invokes checkout; not evidence the native sheet appeared. |
| `purchase_unavailable` | A checkout action had no loaded product (no start), or the store rejected it as unavailable after a start. Never a sale. |
| `purchase_cancel` | SDK reports cancellation. |
| `purchase_pending` | SDK reports `PAYMENT_PENDING_ERROR`; never emitted merely because the sheet is in flight. |
| `purchase_error` | SDK failed. A completed SDK response without active premium access waits for entitlement confirmation instead of emitting an error. Not proof that no charge occurred. |
| `checkout_outcome` | SDK response provides active premium access (`outcome=access_granted`). Existing access can satisfy this condition, so this is not a sale counter. |
| `restore_start`, `restore_outcome` | Separate restore action and result (`access_restored`, `no_entitlement`, `error`). Never a new sale. |

Initialization failures have product/build context and unknown transaction environment, but no offer origin or attempt ID: the learner has not taken either action. An explicit retry or new app/service lifecycle can report another failure.

Each native checkout/restore action gets an independent random `attempt_id` shared with its outcome. Native events include `execution_context` from the build environment. `transaction_environment` is `unknown` before an entitlement is returned, then `sandbox` or `production` only when RevenueCat's entitlement `isSandbox` explicitly supplies that value. Build environment is not evidence of store environment. Unknown outcomes must not be silently classified as production. Local simulated purchases are marked `execution_context=local` and sandbox.

The old `PRESENT_OFFER` duplicate is retired. An offer closed before product initialization completes produces no impression. An in-flight operation interrupted by process death may have a start without an outcome; do not impute a cancellation, pending payment or sale. Checkout now distinguishes an in-flight SDK operation (blocking spinner) from a deferred payment or delayed entitlement (inline confirmation message, no spinner). Only `PAYMENT_PENDING_ERROR` emits `purchase_pending`; a completed SDK response without access waits silently for authoritative entitlement confirmation. A later active entitlement emits one correlated `checkout_outcome`, not a revenue event. Pending and access-granted events are different stages of the same attempt, never two sales.

Passive inactive customer updates do not establish that a pending payment was declined. An explicit successful Restore check with no entitlement releases the app's retry block, allowing a learner to retry a declined or expired payment; an offline/failed Restore does not. This check does not declare the original payment cancelled or discard its correlation. Unresolved attempts remain tracked for the service lifetime, including another deferred retry. When authoritative premium access arrives, each retained attempt emits one correlated access outcome; the UI receives one completion for that access update. These outcomes mean access was observed, not that each attempt charged or that any pending transaction has a known financial result. The store remains responsible for outstanding transactions. After restart, access is reconciled normally without replaying a purchase thank-you or fabricating a completion for a lost attempt. [#17](https://github.com/deanvanniekerk/k53studyguide/issues/17) records the final Test Store smoke and accepted real-store billing limitation.

Offer availability requires successful initialization as well as a loaded product. A cached product after customer-info failure does not make an offer eligible; existing premium access can still be reported as owned. Passive updates cannot enable checkout while initialization is unavailable. Retrying initialization can restore availability without configuring the SDK or its listener again.

## Revenue authority and deduplication

Use store-confirmed RevenueCat transaction evidence, reconciled against the platform store, for sales and revenue. The client no longer emits `purchase`. Do not sum `checkout_outcome`, historical client `purchase`, Firebase automatic `in_app_purchase`, RevenueCat-forwarded events and store totals as if they were independent sales. Keep historical reporting before and after this release separate.

For a private confirmed-sales dataset, identify a transaction by `(store, environment, transaction_id)` and count a one-time transaction once. Validate that identity against the actual exports before accepting the dataset. Treat refunds as adjustments to the same transaction, not additional purchases. If webhook delivery is introduced later, deduplicate deliveries by RevenueCat event ID separately; this change does not install a webhook, server or forwarding integration. Keep raw identifiers, receipts, tokens and customer details out of public evidence.

The installed Capacitor SDK 13.2.0 / purchases-typescript-internal-esm 18.15.1 declarations expose `MakePurchaseResult.transaction.transactionIdentifier`. That transaction object also exposes Android receipt/token/signature fields and does not expose `isSandbox`; the environment flag is on the entitlement. Client funnel events deliberately transmit none of the transaction/receipt identifiers. This avoids introducing another financial event source before reconciliation is proven.

## Verification still required

For each platform, use a store-connected sandbox tester and record a private evidence row with app build, store/environment, product, currency, actual transaction identity, RevenueCat event, entitlement, and observed funnel attempt. Verify exactly one confirmed transaction survives deduplication and that repeating restore changes access without adding a sale. Publish only redacted pass/fail results. Also check cancellation, pending, unavailable product, failure and a later reopening of the offer in GA4 DebugView.

A production-build sandbox test can have `execution_context=production` and a sandbox entitlement. Filter confirmed revenue by the authoritative transaction environment. Starts with unknown environment cannot independently identify sandbox testers; use the private test session/time window during reconciliation. Do not use these starts as a verified production-only conversion denominator until the test exclusion procedure is validated.

Inspect existing Firebase automatic purchase collection and any RevenueCat Firebase integration before choosing a single GA4 revenue series. Do not enable forwarding as part of this client change. Register only low-cardinality reporting dimensions as needed; keep `attempt_id` out of standard GA4 custom dimensions.

Android baseline [#8](https://github.com/deanvanniekerk/k53studyguide/issues/8), iOS baseline [#9](https://github.com/deanvanniekerk/k53studyguide/issues/9), iOS analytics [#5](https://github.com/deanvanniekerk/k53studyguide/issues/5), and both sandbox reconciliations must pass before #10 can close.

## Sources checked 2026-10-06

- [RevenueCat error handling](https://www.revenuecat.com/docs/test-and-launch/errors): payment pending requires additional action; some store errors do not establish whether a charge occurred.
- [RevenueCat event fields](https://www.revenuecat.com/docs/integrations/webhooks/event-types-and-fields): transaction ID, store, environment, event ID, currency and one-time purchase events.
- [RevenueCat Firebase integration](https://www.revenuecat.com/docs/integrations/third-party-integrations/firebase-integration): forwarding is separately configured and can emit purchase events.

## Conversion-flow evaluation (#30)

Compare the same app-version, platform and observation window by `offer_origin`. Use unique measured users for invitation reach and offer reach; event counts describe repeated interactions. Keep `view_promotion` as the existing resolved purchase-sheet impression, and `select_promotion` as the actual Get Premium button, so historical definitions remain intact.

Follow invitation view → invitation tap → eligible offer view → begin checkout → checkout outcome. Reconcile confirmed new sales and revenue separately in the stores/RevenueCat; restored or existing access is not a sale. Track free quiz completion and subsequent quiz/study use as guardrails alongside conversion. Low monthly sales need a longer observation window before making uplift claims; this release is a conversion hypothesis, not proof of improvement.

Browser development previews log `[Analytics preview]` to the console instead of calling Firebase. Their price, purchase, restore and reset controls are simulations. Native DebugView and real store sandbox validation remain required after browser design acceptance. Existing `offer_origin` registration supports the new low-cardinality values; no new dimension is needed for the invitation events.
