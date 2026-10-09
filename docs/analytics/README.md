# Analytics reporting

## Sources and authority

| Source | Use it for | Do not substitute it for |
| --- | --- | --- |
| Play Console / App Store Connect | Store discovery, listing interaction, acquisitions/downloads | GA users or Premium buyers |
| Firebase / GA4 | App engagement and invitation-to-access behavior | Confirmed financial transactions |
| RevenueCat reconciled with platform store reports | Production purchases, entitlements and refunds | Unreconciled client “purchase” totals |
| GA4 / PostHog website collection | Website visits and store referrals | Downstream installs without verified attribution |
| Search Console | Website search visibility | App-store keyword rankings |
| Google Ads | Spend and explicitly identified attributed conversion actions | Incremental buyers or net profit |

The [event reference](events.md) defines the boundaries. The [access guide](access.md) identifies the intended accounts and the diagnostic snapshot tool.

## What is established, and what to verify next

Recorded evidence confirms repaired iOS GA4 association, processed iOS events, and received native Premium journey events on both platforms during QA. Twelve custom dimensions were registered on 6 October 2026. This establishes collection capability, not a production-only sales funnel for the new release.

Before the first post-release scorecard:

- Verify each released platform/version in received and processed events, including parameters and populated custom dimensions.
- Record Android rollout, iOS rollout, website deployment and first usable reporting dates separately. Do not backdate these to merge or submission.
- Validate internal/test exclusions across the whole journey, including starts whose transaction environment is unknown.
- Reconcile confirmed transactions and refunds with store records. Verify any identity join before reporting buyer conversion by origin or cohort.
- Re-read retention/export settings. The last recorded snapshot had two-month event retention, 14-month user retention, renewal on activity enabled and no BigQuery link. Do not treat that snapshot as current configuration.

## Reporting rules

Use explicit inclusive dates and the timezone returned by each source. The last verified GA4 property timezone was UTC+02:00 and its reporting currency USD; PostHog used UTC, Search Console Pacific time. Store reports retain their own boundaries and metric definitions. Equal date labels are not identical time intervals.

Split app reports by platform, released version and relevant geography/source. Report unknown values separately. Use observed `premium_status` for context, not immutable cohort membership: users can move from free to Premium within a window. Do not sum those segments or daily unique users into a new unique-user denominator.

Exclude known local/development activity, private QA sessions and authoritative sandbox transactions. `execution_context=production` describes the JavaScript build, not proof of a production payment. Checkout starts normally have `transaction_environment=unknown`; excluding only sandbox outcomes leaves test starts in the denominator. Not all app events carry execution context, so a blanket filter on it would lose valid engagement users. Validate a consistent user/session exclusion first.

Inspect thresholding, sampling, pagination, `(other)` and `(not set)` before interpreting reports. A missing event row may mean missing coverage, delay or filtering. Preserve request, fetch time, filters and source metadata privately alongside each report.

## Funnel definitions

| Measure | Definition |
| --- | --- |
| Invitation reach | Unique measured free learners viewing an invitation, reported with the same-window measured free audience; event totals show repeat views separately |
| Offer reach | Unique `view_promotion` users / unique users with received native activity, same platform/window/exclusions |
| Eligible offer → checkout | Eligible offer viewers who subsequently start checkout / eligible offer viewers; requires a sequential user-level funnel |
| Attempt outcomes | Distinct started `attempt_id`s with each outcome / distinct started attempts; state the outcome cutoff and retain unresolved starts |
| Confirmed buyer conversion | Eligible viewers linked to a reconciled production purchase / eligible viewers; unavailable until the private identity join is verified |
| Website → store referral rate | Unique `select_store_cta` visitors / unique page-view visitors in the same collector and filtered population |

Aggregate event/user row division does not prove a sequential funnel. Retries and deferred outcomes can overlap; do not force them into mutually exclusive user populations. Attribute attempts to their origin at start. An attempt may finish outside its start window. Offers have no attempt ID, so there is no unique offer-opening-to-attempt join.

### Sales and revenue

Deduplicate confirmed one-time transactions by `(store, environment, transaction_id)`, after validating those fields in the actual exports. Treat refunds as adjustments. If webhooks are later added, deduplicate deliveries by RevenueCat event ID separately.

`checkout_outcome=access_granted` and restores are not new sales. Never add client outcomes, legacy client `purchase`, Firebase automatic `in_app_purchase`, RevenueCat-forwarded events and store totals together. Inspect any existing forwarding before selecting a financial series. Keep transaction/customer IDs, receipts and raw exports private; preserve currencies and document any currency conversion.

## Cohorts and retention

Define D0 as the first observed app-use date in the property's timezone, with a fixed cohort window and platform. This is an analytics identity cohort, not a unique-person install cohort. Use first-user source/medium/campaign where available; unknown stays unknown.

Cumulative N-day outcomes cover **D0 through D(N−1)** for N = 7, 30, 60 or 90, divided by the original cohort. D7/D30/D60/D90 retention instead measures activity on that exact day. Compare only mature cohorts with a processing buffer. Do not infer retention by adding daily users or infer paid reach without a verified buyer join.

Decide retention before promising 60/90-day event-sequence analysis. The previous proposal was 14-month event/user retention with renewal off; it has no recorded implementation here. Longer retention cannot recover deleted data. Raw export, if needed, needs a concrete purpose, owner, cost/access controls and deletion policy; it is not a prerequisite for simple aggregate reporting.

## Reporting dimensions

Previously registered; verify usable values on the released build instead of creating duplicates:

| Scope | Parameters |
| --- | --- |
| User | `premium_status` |
| Event: offer | `offer_origin`, `availability`, `eligibility` |
| Event: purchase | `outcome`, `execution_context`, `transaction_environment` |
| Event: assessment | `analytics_schema_version` (`v2`) |
| Event: website | `store_platform`, `cta_location`, `analytics_environment`, `analytics_test` |

Use built-in platform, app version, event name and acquisition fields. Keep attempt IDs and other high-cardinality identifiers out of ordinary GA4 custom dimensions. Registration does not backfill old breakdowns; retain separate measurement periods for legacy events and `v2` assessments.
