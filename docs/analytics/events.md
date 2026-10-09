# Event reference

Current implementation: [analytics adapter](../../pkg/app/src/services/analytics/index.ts), [purchase service](../../pkg/app/src/services/purchase/RevenueCatPurchaseService.ts), [app pages](../../pkg/app/src/app/pages), and [website](../../pkg/lander/index.html). Update this contract when those boundaries change.

## Engagement

| Event | Meaning |
| --- | --- |
| `first_open` | Firebase's first observed opening for an installation identity; not a store install or unique person |
| `app_open`, `screen_view` | App startup and centrally tracked route views |
| `study_content_view` | A content card became at least partly visible, once per mounted card; not read/understood/completed learning |
| `quiz_start`, `mock_test_start` | New or continued session; distinguish `quiz_mode=new` / `continue` |
| `quiz_answer` | Answer selection in a quiz or mock test; not a completed attempt |
| `quiz_complete`, `mock_test_complete` | Non-empty, fully answered submitted assessment with `analytics_schema_version=v2` |

Completion includes actual question/correct counts and score percentage; quizzes include experience gained, mock tests include section counts/pass results. Both passing and failing complete attempts count. An incomplete ended test can show results without a completion event. A submission guard prevents result revisits or repeated submission from awarding/emitting completion again; a new attempt resets it. This is not an exactly-once delivery guarantee across crashes or storage resets.

Do not count `study_section_complete`, historical `QUIZ_RESULT` / `TEST_RESULT`, or unversioned result-screen events as current completions. Old builds can continue sending old semantics. Existing saved completed attempts are not backfilled into `v2`.

## Premium journey

Origins: `profile`, `mock_test`, `quiz_home`, `quiz_results`. Local price/currency/value describe the offer, not collected revenue.

| Event | Meaning |
| --- | --- |
| `purchase_initialization_error` | Setup/load failure, once per load attempt; `failure_reason` is `missing_api_key`, `product_unavailable` or `sdk_error`; no learner checkout implied |
| `premium_invitation_view` | Free learner sees an invitation on an active page, once per visit; cached inactive pages do not count |
| `premium_invitation_tap` | Opens the offer from that invitation |
| `view_promotion` | Offer remains open after initialization settles; includes origin, availability and `eligibility=eligible/owned/unavailable` |
| `premium_offer_close` | Explicit close button while no operation is pending; excludes successful automatic dismissal and process death |
| `select_promotion` | Get Premium tapped |
| `begin_checkout` | Product available and app invokes checkout; does not prove the native sheet appeared |
| `purchase_unavailable` | No available product or store rejects availability; may occur before or after a checkout start |
| `purchase_cancel` | SDK reports cancellation |
| `purchase_pending` | SDK reports `PAYMENT_PENDING_ERROR`; not merely an in-flight sheet |
| `purchase_error` | SDK failure; not proof that no charge occurred |
| `checkout_outcome` | Active Premium observed, `outcome=access_granted`; existing access can satisfy it, so not a sale counter |
| `restore_start`, `restore_outcome` | Explicit restore, with `access_restored`, `no_entitlement` or `error`; never a new sale |

Availability requires initialized service plus loaded product. A stale cached product after customer-info failure cannot make an offer eligible. An offer closed before initialization settles has no offer impression. The legacy `PRESENT_OFFER` duplicate and client revenue `purchase` emission are retired.

Native checkout and restore actions receive independent random `attempt_id`s shared with their outcomes. Initialization failures have no attempt or origin. `execution_context` is the build environment; `transaction_environment` stays `unknown` until an entitlement explicitly identifies sandbox/production. Local simulations are local/sandbox. No transaction identifiers, receipts or payment tokens are sent in these client funnel events.

Pending or delayed access can resolve later. Empty successful Restore permits retry without discarding unresolved correlations; a failed Restore does not. Later access can resolve multiple retained attempts, which still does not mean multiple charges. Process death can leave an unresolved start; do not invent a cancellation or replay a lost completion after restart. The [reporting contract](README.md) defines financial authority and exclusions.

## Website referrals

Count `select_store_cta` separately in each collector. Do not add it to legacy store-click events, GA enhanced-measurement `click`, PostHog `$autocapture`, or the other collector's total.

| Placement | `cta_location` | `store_platform` |
| --- | --- | --- |
| Navigation | `nav_cta` | `android` |
| Hero | `hero_cta`, `hero_ios_cta` | `android`, `ios` |
| Footer | `footer_cta`, `footer_ios_cta` | `android`, `ios` |
| Demo locked tabs | `quiz_demo_locked_{study,test,profile}_{android,ios}` | Matching destination |

These are 11 combinations; navigation has no iOS CTA. Links open the actual store in a new tab. A referral is not an install.

Collectors initialize only on `k53studyguide.online` and `www.k53studyguide.online`. Custom events carry `analytics_environment=production` and `analytics_test`. QA markers are `analytics_test=true`, `utm_source=qa` or `utm_campaign=issue7`. Filter exact hostnames and exclude QA URLs/campaigns even for historical or automatic events without these properties. Verify the received boolean representation before filtering. Choose GA `page_view` or PostHog `$pageview` for its own visitor denominator, not a sum with `landing_page_view`.
