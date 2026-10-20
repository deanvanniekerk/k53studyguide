# Free web launch

All scope questions and release gates were agreed during the 19 October 2026 design interview, and the owner confirmed the consolidated scope, testing boundaries and ticket breakdown. The [spec (#48)](https://github.com/deanvanniekerk/k53studyguide/issues/48) and seven sub-issues (#49–#55) carry the implementation notes, tests and owner steps. The owner approved the preview and production analytics enablement on 20 October. Free web study launched that morning at <https://www.k53studyguide.online/app/>; the launch record below distinguishes verified coverage from remaining checks.

## Objective

Prioritise useful free study access and organic reach, with mobile sales secondary. Keep Android and iOS Premium pricing unchanged and measure the revenue impact of offering the same features free on web. See the [access decision](../adr/0001-free-web-access-with-paid-mobile-premium.md).

## Agreed first-release scope

- Reuse the existing application and shared content for study progress, practice quizzes, mock tests, history reset, existing languages, and light/dark mode. Make all learner features free on web; omit web purchase and restore screens.
- Save progress in the current browser without registration or cloud sync. Explain that progress does not transfer to another browser, device or mobile app, and can be lost when browser storage is cleared.
- Launch online-first, preserve local progress and handle connectivity loss gracefully. Do not promise offline study or installable web support in this release.
- Keep the website and add the interactive app on the same domain. Provide English search-readable topic pages from shared content at launch, while retaining all existing languages inside the interactive app. Make “Start studying free” the main website action, retaining mobile download links. Support both phone and desktop browsers. Expand searchable translations after the first version is working well.
- Launch without display advertising. Offer optional mobile download links on results screens and in navigation, without popups or interruptions. Explain that mobile Premium is a separate paid unlock wherever platform access is compared; never imply payment is needed to continue on web. Revisit monetisation after observing usage.

## Measurement boundaries

Free web feature access is not paid ownership or a mobile Premium entitlement. Record web study activity separately from mobile purchases. Store referral clicks, attributed installs and confirmed purchases remain distinct measures; do not assume an identity link between them.

## Evaluation

Use completed practice as the primary engagement measure. Returning browser users, search discovery, mobile sales and reliability give context; page views or starts are not completions. Browser identities are not distinct people across devices. There is no agreed numeric growth target or causal attribution from web use to mobile sales.

### Launch record — 20 October 2026

Production website publication finished at **07:40:45 SAST (UTC+02:00)**, or `2026-10-20T05:40:45.603155Z`. The release source is `dfa592b02e380654828608857dc3e0b731b13a17` ([cache fix #66](https://github.com/deanvanniekerk/k53studyguide/pull/66)); [written owner approval](https://github.com/deanvanniekerk/k53studyguide/issues/55#issuecomment-6283938924) preceded publication. `/app/` became available at 07:39:28 SAST, approximately 78 seconds before the homepage switched. Dependencies preceded entry HTML; the app transfer resumed from the same checksummed build using persistent FTP connections. The prior hosted files/rules and the released artifacts/checksums are preserved privately for rollback. No destructive rollback was performed.

Verification: 291 app, 21 lander and 18 translator tests passed, along with lint/typechecks, native/web/lander builds and both translation checks. All three translated locales have 3237/3237 entries with no missing or stale keys. Live checks passed for the homepage CTA into `/app/`, app/result deep links, JavaScript/CSS and sampled images, custom 404s, crawler exclusions and all 45 indexable topic pages with their canonical URLs. The sitemap has 51 unique URLs and was submitted to the verified Search Console domain property at 07:41 SAST; submission was accepted and is pending processing, not proof of indexing. HTML returns `Cache-Control: no-cache` without Expires; fingerprinted JS/CSS retain the host's seven-day cache policy. Existing cached HTML can remain fresh until its former expiry. HTTP and apex hosts still return 200 rather than redirecting to canonical HTTPS `www`; this existing host configuration gap remains recorded for correction.

Analytics: the existing app property `269952161` has the verified Firebase web stream `16161816438` (the `platform=web` reporting population). Browser origin is supported by that stream association and the received `page_location`; no Data API platform row is claimed. The owner's marked preview quiz reached GA4 as 3/10 (30%), `analytics_schema_version=v2`, `premium_status=free`, `analytics_test=true`, with the preview web result page location. GA4 showed one start, ten answers and exactly one completion after the owner revisited/reloaded; no purchase-family events appeared in the marked session. The production build enables the configured collector only under the agreed host/mount rules. A Mac production quiz scored 2/10 and survived reload, but its automated events have not appeared in GA4; the owner's final production phone receipt check is pending. Exact QA windows, raw screenshots and configuration remain private. The reporting connector needs renewed authorization before scorecard queries; do not treat missing data as zero or assume DebugView events are excluded automatically. Apply the QA exclusions below before publishing production counts.

Browser coverage includes the owner's physical iPhone Safari evidence and approval, responsive Safari at 375×812 and 430×932, sampled desktop Safari/Chromium journeys, all four languages across sampled journeys, themes, keyboard/zoom, Slow 4G, reload and recovery checks. The full device/theme/language cross-product was not completed: physical Android Chrome and Firefox coverage remain missing. Native purchase/restore checks were SDK-mocked; no native device store smoke or new TestFlight submission occurred. The owner plans device checks with a separate iOS build. Preview approval authorized this web launch; it does not certify the missing matrix cells or a native release.

Exclude the partial launch day. The first evaluation is **[21 October 2026 00:00, 18 November 2026 00:00) SAST**, with the final review no earlier than **20 November 2026 00:00 SAST** after the processing buffer. The eight-week mobile baseline is **[25 August 2026 00:00, 20 October 2026 00:00) SAST**.

| Week | Complete SAST interval (end exclusive) | Review after 48 hours |
| --- | --- | --- |
| 1 | 21–28 October 2026 | 30 October 2026 |
| 2 | 28 October–4 November 2026 | 6 November 2026 |
| 3 | 4–11 November 2026 | 13 November 2026 |
| 4 | 11–18 November 2026 | 20 November 2026 |

These dates document the weekly hosting/GA/Search Console/mobile-sales checks and final evaluation; no automation was created. Retain `/app-preview/` at least until 27 October 2026 07:40:45 SAST, and remove it only after successful live verification and owner confirmation. Its crawler exclusion remains in place.

### Reporting windows and evidence

Record the actual production launch timestamp `L` in SAST (`UTC+02:00`) after deployment, never the merge date. Let `D` be the next SAST midnight after `L`; exclude the partial launch day. The first evaluation covers `[D, D + 28 days)`, with four seven-day windows. Compare mobile sales with the eight complete seven-day windows ending at the midnight before the partial launch day. Review each closed week after a 48-hour processing buffer; wait 48 hours after day 28 for the final scorecard. The initial launch dates are recorded above. #55 owns recording any requested reminders.

Re-read GA4 property timezone/currency, stream mapping, custom-dimension metadata and retention before reporting. The previous snapshot was UTC+02:00 with two-month event retention and no BigQuery link; it is not a current configuration guarantee. Export weekly aggregate results to a private note. Keep exact requests, responses, filters, fetch timestamps, excluded QA windows and source coverage privately. Search Console uses Pacific date boundaries; retain its own dates rather than pretending they match SAST. Store reports retain their own timezone and settlement coverage.

### GA4: completed practice and returning browsers

Use app property `269952161` only after verifying the new Firebase web stream belongs to it. Substitute the verified numeric `WEB_STREAM_ID` and closed inclusive dates in this Data API request (`POST https://analyticsdata.googleapis.com/v1beta/properties/269952161:runReport`):

```json
{
  "dateRanges": [{"startDate": "START_DATE", "endDate": "END_DATE"}],
  "dimensions": [{"name": "date"}, {"name": "eventName"}],
  "metrics": [{"name": "eventCount"}, {"name": "totalUsers"}],
  "dimensionFilter": {"andGroup": {"expressions": [
    {"filter": {"fieldName": "platform", "stringFilter": {"matchType": "EXACT", "value": "web", "caseSensitive": false}}},
    {"filter": {"fieldName": "streamId", "stringFilter": {"matchType": "EXACT", "value": "WEB_STREAM_ID"}}},
    {"filter": {"fieldName": "customUser:premium_status", "stringFilter": {"matchType": "EXACT", "value": "free"}}},
    {"filter": {"fieldName": "customEvent:analytics_schema_version", "stringFilter": {"matchType": "EXACT", "value": "v2"}}},
    {"filter": {"fieldName": "eventName", "inListFilter": {"values": ["quiz_complete", "mock_test_complete"]}}}
  ]}},
  "limit": "10000"
}
```

Apply the QA exclusion below before treating this as production. Report both event totals and same-window unique users. For the weekly combined-practice total, remove both dimensions and query the whole seven-day range; do not sum daily unique users or users from the two event rows. For returning browsers, retain the stream/platform/free/v2 filters, remove the completion-name filter and add `newVsReturning` EXACT `returning`; query `totalUsers` over the whole window. This describes measured returning browser identities carrying this schema, not installed users. Recheck compatibility and populated values against the [Data API schema](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema) and the property's metadata; missing dimensions or thresholded rows are measurement gaps, not zeros.

QA sessions must start with `?analytics_test=true&utm_source=qa&utm_medium=validation&utm_campaign=web_launch_qa`. The collector persists the marker for that browser tab, sends string parameter/user property `analytics_test=true` and enables DebugView. Close the QA tab afterward. Keep the exact QA window privately. Verify receipt and the property's developer/internal filters; do not assume a debug event is automatically excluded from reports.

If metadata exposes `customEvent:analytics_test` in the app property, append a `notExpression` around its EXACT `true` filter. Otherwise inspect `sessionSource=qa` / `sessionCampaignName=web_launch_qa` and exclude the verified QA sessions through an Exploration segment or validated source/campaign filters. A URL-only QA marker is not a registered report dimension. If QA cannot be reliably isolated, withhold the production count or label the unresolved contamination; `(not set)` does not prove production. No new custom dimension is required for launch.

Web-app `select_store_cta` uses this app stream; lander referrals use the website's existing collectors. Query each separately. Placement breakdowns require optional owner registration of `cta_location` and `store_platform` in the app property; registration does not backfill history. Referral clicks, attributed installs and confirmed transactions remain separate series, without a cross-device identity join.

### Organic discovery

For GA4 organic web-app sessions, retain stream/platform and QA exclusions, use dimensions `sessionSourceMedium`, metrics `sessions`, and filter `sessionDefaultChannelGroup` EXACT `Organic Search`. Do not require a completion or `v2` event to count acquisition sessions. This is the web stream's observed acquisition, not proof that the lander's original search attribution crosses into it.

For Search Console, request `POST https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Ak53studyguide.online/searchAnalytics/query` with:

```json
{
  "startDate": "START_DATE", "endDate": "END_DATE",
  "type": "web", "dataState": "final", "dimensions": ["date", "page"],
  "dimensionFilterGroups": [{"filters": [{
    "dimension": "page", "operator": "includingRegex",
    "expression": "^https://www\\.k53studyguide\\.online/(study/.*)?$"
  }]}],
  "rowLimit": 25000, "startRow": 0
}
```

Paginate `startRow` until a short page; retain clicks/impressions and the returned coverage. The [Search Analytics API](https://developers.google.com/webmaster-tools/v1/searchanalytics/query) returns top rows, not guaranteed exhaustive long-tail data. Report `/study/` and `/` separately. Keep Search Console clicks separate from GA4 sessions; they measure different things.

### Mobile impact

Use reconciled RevenueCat production one-time purchases, split by store and currency. The current product IDs are Android `premium_access` and iOS `deanvniekerk.k53studyguide.premium_access`. Validate actual export fields first: [scheduled exports](https://www.revenuecat.com/docs/integrations/scheduled-data-exports) include store, sandbox status, store transaction identifier, product identifier and purchase price/currency. The SQL below runs against an analyst-normalized private view, not a promised RevenueCat endpoint/schema:

```sql
-- Normalize actual source fields privately into confirmed_one_time_transactions.
-- Include only reconciled, original production purchases of the two products.
WITH deduped AS (
  SELECT *, ROW_NUMBER() OVER (
    PARTITION BY store, environment, transaction_id ORDER BY source_updated_at DESC
  ) AS row_number
  FROM confirmed_one_time_transactions
  WHERE environment = 'production'
    AND product_id IN ('premium_access', 'deanvniekerk.k53studyguide.premium_access')
)
SELECT store, currency, COUNT(*) AS purchases, SUM(gross_price) AS gross_sales
FROM deduped
WHERE row_number = 1 AND purchased_at >= :window_start_utc AND purchased_at < :window_end_utc
GROUP BY store, currency;
```

Run for each closed SAST week and each of eight baseline weeks, converting boundaries to UTC once. Reconcile refunds as separately dated adjustments. Store-confirmed net proceeds need the corresponding store financial reports, exchange treatment and settlement period; purchase price or an estimated take-home percentage is not settled net proceeds. Report unavailable proceeds as unavailable. Never mix currencies or add client `purchase`, restores, access grants and transactions together. Investigate a sales decline alongside rollout, pricing, seasonality and data coverage without assuming web caused it.

### Weekly reliability and decision

In GA4 Explorations create two session segments over the same web-stream/platform/QA-filtered population: denominator sessions containing `app_open`; numerator sessions containing both `app_open` and `screen_view` in the same session. Divide the two session totals. An aggregate `screen_view`/`app_open` event ratio is not this session share. Record missing session/consent coverage. ErrorBoundary currently logs locally, so no central error-rate denominator exists; report it unavailable until evidence is surfaced. Use host 404 logs only if access/coverage is established, separating `/app/` routing from missing static assets.

Record weekly completed practice, returning browsers, organic discovery, mobile transactions/proceeds and reliability with coverage notes. Fewer than roughly 20 completions in a week extends observation by another seven complete days; do not declare success or failure from sparse data. Unavailable credentials or unverified exclusions block a trustworthy scorecard, not studying. Do not publish raw exports or customer/browser/transaction identifiers in this repository.


## Release gates

Provide a working preview for the owner's review before production. Verify:

- Study progress, practice quizzes, mock tests and history reset work across reloads.
- Phone and desktop layouts, existing languages and light/dark themes work.
- Connection loss produces useful feedback without losing saved progress.
- Search-readable pages and direct links work.
- Analytics distinguish free web activity from paid mobile ownership.
- Android and iOS purchase and restore behaviour remain unchanged.

## Implementation decisions

The interactive app is served from `/app/` on the existing host and search-readable topic pages live under `/study/…`; the website keeps `/` and its existing URLs. The remaining implementation decisions from the 19 October 2026 ticket review (access model, web analytics collector, retirement of the website quiz demo, bundle reduction, translation owner steps) are recorded in [#48](https://github.com/deanvanniekerk/k53studyguide/issues/48) and the sub-issues, which stay the single source of truth for implementation detail. These are decisions, not evidence that the release gates have passed.
