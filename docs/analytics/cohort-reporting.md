# Funnel and acquired-cohort reporting

Dated contract: **2026-10-06**, [#11](https://github.com/deanvanniekerk/k53studyguide/issues/11), GA4 property `269952161`. This defines reporting inputs and recipes; it does not establish a production conversion rate or close the sandbox reconciliation gate.

## Verified baseline and reproduction

The read-only Admin API confirmed no registered custom dimensions and no BigQuery export links at the initial audit. Retention was `eventDataRetention=TWO_MONTHS`, `userDataRetention=FOURTEEN_MONTHS`, `resetUserDataOnNewActivity=true`. Re-run the snapshot after any administrative change; the saved audit is a timestamped observation, not desired configuration.

A real Data API snapshot for **2026-09-08 through 2026-10-03 inclusive** returned Android/web user totals and Android offer, checkout and outcome rows. No iOS rows occurred in that historical window. Offer origin and premium breakdowns were unavailable because their dimensions were unregistered. The query returned no purchase rows, which does **not** establish zero sales. Client events have not been reconciled with store transactions. The existing production RevenueCat record inspected separately exposes a one-time purchase, store, environment, entitlement and transaction identity; store-side reconciliation remains pending. No financial amounts or raw transaction records belong here.

Use Python with `google-auth` and `requests`, and the read-only credential described in [access.md](access.md):

```bash
python scripts/analytics/snapshot.py \
  --credentials /absolute/private/analytics-readonly.json \
  --start 2026-09-08 --end 2026-10-03 \
  --output /absolute/private/k53-report-2026-10-06
```

This read-only tool saves exact request bodies, responses, pagination metadata, current settings and a manifest outside the repository, with private file permissions. It never emits raw report rows to the terminal. It retrieves denominators separately rather than adding users across event rows. If the premium/origin dimensions exist, it additionally requests their breakdown. Registration may precede usable values; `(not set)` is a coverage gap. Inspect response metadata for thresholding, sampling and the `(other)` bucket before interpreting results. Repeat with an end date at least three days old for a stable diagnostic comparison; this is an operating buffer, not a guarantee of final data.

These snapshots deliberately include all received traffic, with **no QA, sandbox, version or host exclusions**, to expose collection gaps. The manifest labels them diagnostic. Never present them as a production funnel. A missing row can mean no observed event, unavailable collection, processing delay or filtering; it is not a verified behavioural zero. Confirmed sales are explicitly `null` pending private reconciliation.

## Required dimensions and availability ledger

All 12 dimensions below were registered in property `269952161` on **2026-10-06, approximately 17:46–17:50 SAST**. A subsequent live Admin API read verified every parameter and scope: `premium_status` is user-scoped and the other 11 are event-scoped. The private `dimensions-after.json` snapshot records verification. First usable processed values remain pending; registration is not evidence of populated reports and does not backfill earlier events. Retention and export settings remain unchanged.

| Scope | Parameter | Purpose and values |
| --- | --- | --- |
| User | `premium_status` | Observed access state: `free`, `premium`. Not purchase confirmation or status at acquisition. |
| Event | `offer_origin` | Offer entry point: `profile`, `mock_test`, `quiz_home`, `quiz_results`. |
| Event | `availability` | Product available/unavailable when the offer is measured. |
| Event | `eligibility` | `eligible`, `owned`, `unavailable`; app state, not store eligibility. |
| Event | `outcome` | Restore result or `access_granted`; not sale confirmation. |
| Event | `execution_context` | Build environment; excludes known local/development activity, but cannot identify every sandbox tester. |
| Event | `transaction_environment` | `production`, `sandbox`, `unknown`; unknown is not production. |
| Event | `analytics_schema_version` | Corrected assessment semantics: **`v2`**, an alphanumeric string. |
| Event | `store_platform` | Website destination: `android`, `ios`. |
| Event | `cta_location` | Website referral placement. |
| Event | `analytics_environment` | Website production collection guard. |
| Event | `analytics_test` | Website QA marker. Verify received true/false representation before filtering. |

Use built-in platform, app version, event name, hostname and acquisition dimensions. Event names already distinguish cancellation, pending and error; do not register a duplicate purchase-state dimension. Keep attempt IDs, transaction IDs, user IDs, receipts and unbounded error messages out of ordinary custom dimensions. Keep technical error detail in private diagnostic evidence until a specific report requires a bounded category.

Google notes that integer-valued custom event dimensions are not parsed for apps. The `v2` string therefore replaces the numeric schema marker in both assessment events; the internal persisted completion guard remains numeric. Allow 24–48 hours after registration and receipt of new data before expecting custom values in reports. [Google event-scoped dimensions](https://support.google.com/analytics/answer/14239696), [user-scoped dimensions](https://support.google.com/analytics/answer/14239618).

Maintain these independent start dates: dimension registration, first processed value, Android release, iOS release, website deployment, iOS stream association, and any future export activation. Do not choose a single global rollout date. Unregistered historical breakdowns cannot be reconstructed from aggregate reports; raw parameters can help only where a contemporaneous private export exists. The newly repaired iOS stream does not reconstruct missing historical iOS activity. Retired duplicate events and pre-v2 completion events cannot be reliably deduplicated into assessments.

## Dated event dictionary

The source of truth for exact payloads and boundaries is [assessment completion](assessment-completion.md), [premium journey](purchase-measurement.md), and [website referrals](website-referrals.md). As of this contract:

| Observation | Use | Do not interpret as |
| --- | --- | --- |
| `first_open` | First observed app opening per installation identity | Store install, unique person or paid acquisition |
| `study_content_view` | Study content became visible | Learning completion |
| `quiz_complete`, `mock_test_complete` with `v2` | Completed non-empty submitted assessment | Legacy result-screen views |
| `purchase_initialization_error` | Purchase setup/load failure before controls become available | Offer view, learner checkout action or sale |
| `view_promotion` | One opening with resolved product state | Unique person, checkout or guaranteed available product |
| `begin_checkout` | App invoked checkout | Sheet visible or payment pending |
| `purchase_cancel`, `purchase_pending`, `purchase_error`, `purchase_unavailable` | Distinct SDK/action outcomes under the new contract | Historical pending semantics or mutually exclusive user populations |
| `checkout_outcome` | SDK returned active premium access | New sale |
| `restore_start`, `restore_outcome` | Existing access recovery | New sale |
| `select_store_cta` | Canonical website referral | Install or acquisition |
| Reconciled RevenueCat/store transaction | Confirmed sale, deduplicated by store/environment/transaction | A sum of all GA and purchase-system events |

## Funnel denominators and exclusions

Use **Etc/GMT-2 (UTC+02:00)**, the property timezone, for inclusive calendar dates. Convert source transaction timestamps before comparing days. Preserve transaction currency; the GA property currency is USD and an offer's displayed value is not collected revenue. Do not combine currencies without a documented conversion source/date. Search Console uses its own Pacific-time reporting days and needs separate boundaries.

For a released, verified measurement window, split Android/iOS, app version and then free/premium state. Report unknown status separately. `premium_status` is observed user-property state, not immutable cohort membership; a learner can appear in both segments during a window. Never sum those segments to recover unique users. Prefer offer-time `eligibility=eligible` for the purchase opportunity denominator.

| Measure | Numerator / denominator |
| --- | --- |
| Observed offer reach | Unique GA users with `view_promotion` / unique GA users with any received native event, same platform/window/exclusions. This is reach among measured users, not all installs or people. Use `totalUsers` in separate queries, never event count divided by users. |
| Eligible offer-to-attempt conversion | Distinct eligible offer viewers who later start checkout in the window / distinct eligible offer viewers in the window. Requires a sequential user-level funnel; dividing aggregate event/user rows does not prove that relationship. |
| Attempt outcome distribution | Distinct started `attempt_id`s with each outcome / distinct started attempts, classified by origin at start. Join privately in retained raw data or controlled sandbox evidence. Keep unresolved starts separate; allow asynchronous resolution and report the observation cutoff. |
| Confirmed purchase conversion | Distinct eligible offer viewers with a linked, reconciled production transaction / eligible offer viewers. No verified identity join currently exists for this report: show unavailable, not a guessed conversion. |
| Confirmed sales/revenue | Deduplicated production transactions and their documented refund adjustments; authoritative dataset separate from GA funnel. Restores and access-granted outcomes add no sales. |

Outcome users overlap when a learner retries; totals can exceed unique checkout users. Do not force aggregate counts into a waterfall. The SDK may start just before the reporting boundary and finish afterward; a user-level or attempt-level window must state how these cases are included. No attempt IDs are transmitted with offers, so do not claim a unique offer-opening-to-attempt join.

Exclude development/local execution, known internal/test sessions and store-confirmed sandbox transactions. An outcome with `transaction_environment=unknown` stays unknown. Pre-outcome checkout events have unknown store environment even in a production build; use a validated private tester/session exclusion procedure or withhold production-only funnel rates. The current diagnostic script intentionally does neither. App-wide acquisition/assessment events do not all carry `execution_context`, so filtering that property across the entire funnel would incorrectly drop its denominator. A consistent user/session exclusion or future collection policy is required before production rates are accepted. Keep old app versions separate; they can continue sending old meanings after rollout.

Website referrals use exact apex/www hostnames, QA exclusions and separate collector denominators described in [website referrals](website-referrals.md). Do not add GA4 and PostHog observations together or join referral clicks to installs without independently verified attribution.

## Acquired cohorts: 7 / 30 / 60 / 90 days

Define a cohort as first observed app users (`first_open`/first session) within a fixed acquisition date range and platform, excluding verified test identities. Use first-user source/medium/campaign if captured; unknown stays unknown. Reinstalls, device changes and analytics consent can change identity, so label this an observed acquisition cohort, not a unique-person install cohort.

Define D0 as the first-observed date in UTC+02:00. Cumulative N-day windows are **D0 through D(N−1)** for N = 7, 30, 60, 90. Denominator is the original observed cohort. Measure cumulative offer reach, submitted-v2 assessment reach, and confirmed purchase reach within that window only where a supported private join exists. Distinguish these from **D7/D30/D60/D90 retention**, whose numerator is cohort members active on that exact day; do not label a cumulative purchase rate retention. For delayed results, show elapsed observation days and mark immature cohorts unavailable. Compare only cohorts with the full window plus the chosen processing buffer.

A GA Data API cohort report uses `firstSessionDate` and cohort metrics; Google requires `cohort` in dimensions and does not permit ordinary `dateRanges` alongside `cohortSpec`. A standard aggregate event report grouped by date is not a cohort report, and summing daily active users does not count retained people. [Data API cohort specification](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/CohortSpec).

## Retention/export decision awaiting approval

**Recommendation:** set event retention to 14 months for future exploration, keep user retention at 14 months, and disable renewal on new activity to bound retention. Do not enable BigQuery yet. This is a proposal; no retention, renewal or export configuration has been changed by this work.

Two calendar months of event retention cannot reliably support 60-day exploration with a processing buffer and cannot support 90-day evaluation. Standard aggregate reports are unaffected by this setting, but they cannot recreate arbitrary user/event sequences or deleted cohort inputs. Increasing retention does not recover already deleted data. The reset option extends a user's expiry with activity, which is why bounded retention is recommended. [Google retention guidance](https://support.google.com/analytics/answer/7667196).

Before approval, confirm that the longer purpose/retention is covered by the app's privacy notice and consent practice, which owner is accountable for access/deletion, and who requires Viewer versus Editor access. Keep report credentials read-only and downloaded snapshots private; define deletion of local exports separately because GA retention does not delete local copies.

If exact attempt joins or long-term acquired-cohort revenue analysis justify raw export, approve a separate concrete BigQuery configuration: project and billing owner, supported location, daily-only selected streams, restricted dataset access, table expiration matching the approved purpose, query-cost limits/budget alerts, consent and deletion handling, and an activation timestamp. Streaming adds cost and is unnecessary for this weekly decision cycle. Native GA4 export does not backfill pre-link events; standard-property daily export is limited to one million events/day, and raw export differs from processed reports. A manually exported aggregate report is not raw event preservation. [Google BigQuery export](https://support.google.com/analytics/answer/9358801).

## Remaining acceptance gates

Record first usable processed dimension values following the verified registration; approve/apply the retention choice; verify both native release streams and QA exclusions; reconcile sandbox purchase/restore against store evidence; then produce a production-filtered, sequential example with confirmed purchase. Until those pass, #11 remains open. The dated diagnostic example and repeatable requests expose what is known without manufacturing a sale count or conversion rate.
