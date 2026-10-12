# K53 retrieval reference

Read after resolving report scope. The account map was verified in October 2026; recheck selected accounts and live metadata each run. Credentials are deliberately absent.

## Source map

| Source | Identity / entry point | Role |
| --- | --- | --- |
| GA4 | Account `195283836`, property `269952161`, `k53-study-guide`; https://analytics.google.com/analytics/web/#/p269952161/reports/intelligenthome | Native engagement, Premium journey and errors |
| Google Play | Package `deanvniekerk.k53studyguide.app`; developer `6064119445240465373`, console app `4973648119408109828`; https://play.google.com/console/u/0/developers/6064119445240465373/app/4973648119408109828 | Publication, listing acquisition, Android financial reconciliation |
| App Store Connect | App `6784718443`; https://appstoreconnect.apple.com/apps/6784718443 | Publication, iOS downloads and finance |
| RevenueCat | Project `afba74f9`; https://app.revenuecat.com/projects/afba74f9/overview | Production transactions, entitlements and refunds |
| PostHog | K53 project `491784` | Website only unless mobile collection is independently verified |
| Search Console | `sc-domain:k53studyguide.online` | Website organic visibility |
| Google Ads | Customer `7069841878` | Spend and explicitly defined attributed conversions |

Android product: `premium_access`. iOS product: `deanvniekerk.k53studyguide.premium_access`. RevenueCat entitlement: `premium_access`. Verify current repo `pkg/app/src/services/purchase/productIds.ts`.

## GA4

Discover the available tools and read their current schemas. Previously used:

- `mcp__google_analytics__get_property_details({property_id:269952161})`
- `mcp__google_analytics__get_custom_dimensions_and_metrics({property_id:269952161})`
- `mcp__google_analytics__run_report(...)`
- `mcp__google_analytics__run_funnel_report(...)`

Connector request fields use snake_case protobuf format; dimension names retain GA names such as `appVersion`. The direct REST API uses camelCase request fields instead. Responses may serialize JSON inside a text content block; parse it and retain headers/metadata, not just values.

Example connector query with historical dates/version; replace these for the new brief:

```json
{
  "property_id": 269952161,
  "date_ranges": [{"start_date": "2026-10-10", "end_date": "2026-10-11"}],
  "dimensions": ["eventName"],
  "metrics": ["totalUsers", "eventCount"],
  "dimension_filter": {"and_group": {"expressions": [
    {"filter": {"field_name": "platform", "string_filter": {"match_type": 1, "value": "Android"}}},
    {"filter": {"field_name": "appVersion", "string_filter": {"match_type": 1, "value": "1.40"}}}
  ]}},
  "limit": 10000
}
```

Retrieve independent queries as needed:

| Purpose | Dimensions / filters | Metrics |
| --- | --- | --- |
| Window totals | No dimensions; desired platform/version filters | `totalUsers`, `activeUsers`, `newUsers`, `sessions`, `engagedSessions`, `userEngagementDuration` |
| Daily context | `date` | Same totals; not a deduplication source |
| Adoption | `appVersion`, platform separated | `activeUsers`, `totalUsers`, `sessions`; query all-version denominator independently |
| Features | `eventName` | `totalUsers`, `eventCount` |
| Premium placement | `eventName`, `customEvent:offer_origin` | `totalUsers`, `eventCount` |
| Eligible availability | `customEvent:availability`, `customEvent:eligibility`; filter `eventName=view_promotion` | `totalUsers`, `eventCount` |
| Initialization errors | Filter `eventName=purchase_initialization_error`; `customEvent:failure_reason`, `customEvent:error_code`, optional `customEvent:initialization_stage` | `totalUsers`, `eventCount` |
| Error concentration | Same event filter; `country`, `mobileDeviceModel`, `operatingSystemVersion`, optional `date` | `totalUsers`, `eventCount` |

Request custom fields only after checking metadata. Use `analytics_schema_version=v2` for current assessment completions. Relevant events include study_content_view, quiz_start, quiz_answer, quiz_complete, mock_test_start/complete, premium_invitation_view/tap, view_promotion, begin_checkout, checkout_outcome, purchase_cancel/error/pending/unavailable and restore_outcome. The repo event reference governs semantics.

For a real sequential funnel, pass ordered `funnel_steps` to `run_funnel_report`, with property/date ranges. Example first step:

```json
{
  "name": "Eligible offer",
  "filter_expression": {"and_group": {"expressions": [
    {"funnel_event_filter": {"event_name": "view_promotion"}},
    {"funnel_field_filter": {"field_name": "customEvent:eligibility", "string_filter": {"match_type": 1, "value": "eligible"}}},
    {"funnel_field_filter": {"field_name": "platform", "string_filter": {"match_type": 1, "value": "Android"}}},
    {"funnel_field_filter": {"field_name": "appVersion", "string_filter": {"match_type": 1, "value": "1.40"}}}
  ]}},
  "is_directly_followed_by": false
}
```

Second step: `begin_checkout`, with the same platform/version filters. Permit intervening events and document funnel options. Verify returned counts/header structure before interpretation. Aggregate event-row division is not a substitute.

Fallback: repo `scripts/analytics/snapshot.py` supports an existing private authorized-user credential with `analytics.readonly`. Read `docs/analytics/access.md` for invocation. It saves exact requests, metadata, retention/export settings and diagnostic reports. It includes QA/legacy data, is not a sequential funnel and leaves sales unverified. Apply scope/exclusions separately. Do not broaden permissions to complete a report.

### Purchase diagnostic boundary

On 12 October 2026, event-scoped `failure_reason`, `error_code` and `initialization_stage` were registered and verified. Version 1.40 sends reason/code. Stage detail was added in branch `codex/investigate-purchase-availability`, commit `1830f17`; verify whether it has shipped. Missing stage on 1.40 is expected. Registration is not retroactive; populated breakdowns need processing time. Query after registration and distinguish missing values from success.

The same day's BigQuery links screen showed no links. Recheck if historical raw parameters are needed. `purchase_initialization_error` counts load attempts, including startup/retries, not failed payments. Reasons are missing_api_key, product_unavailable or sdk_error. Diagnostic codes belong in reports; private SDK messages do not.

## RevenueCat: sales verification

Use a read-only connector if available; otherwise Safari. Confirm K53 project and production scope (Sandbox data off). Use a dated transaction view/export covering the entire requested interval. Overview recent transactions are a starting point, not proof of complete sales totals. Paginate/export through the interval or label observations partial.

For ambiguous or sampled records, open Customer profile → transaction → View details / Event details. Verify:

- Actual purchase timestamp/timezone, store and `environment=PRODUCTION`.
- `type=NON_RENEWING_PURCHASE` for the current one-time product, product ID, original currency and price.
- Refund/reversal status, entitlement, and distinction between purchase and restore.
- Deduplicate privately by `(store, environment, transaction_id)`; webhook deliveries need separate event-ID deduplication.

Preserve UTC timestamps and translate to SAST; compare to the exact requested interval. Last-seen app version describes last activity, not necessarily version at purchase. First seen in RevenueCat is not necessarily first install. Delayed purchase timing is an observation, not a cohort conversion rate.

Use `price_in_purchased_currency` with `currency` where available. RevenueCat's USD display is not the customer's ZAR charge. Keep currencies separate unless a documented conversion is used. Label unreconciled production records as RevenueCat-confirmed purchases. Store reconciliation supports stronger financial claims. Do not derive settled net proceeds solely from a displayed take-home percentage. State gross/net/refund/settlement coverage.

One visible new transaction is one observed transaction, not necessarily all sales. A purchase outside the GA window belongs in a separate update, not that window's conversion numerator. Client checkout_outcome, restores, automatic in_app_purchase and RevenueCat/store records are not additive revenue sources.

## Store publication and acquisition

Play `list_releases` can verify production version/status. Inspect Publishing overview / Submission details for publication date; submission, build and approval are different. Full rollout means availability, not universal adoption. If the console timestamp lacks a timezone, say so and prefer subsequent full GA days for release comparison.

Retrieve acquisition/listing metrics from dated Play Statistics/listing exports or App Store Connect Analytics. A prior Play MCP statistics tool returned placeholder text; verify genuine data provenance. Developer Reporting/vitals is not listing acquisition. Retain definitions and timezones. Verify current iOS release status rather than carrying review status forward from chat history.

## Website and broad summaries

When using PostHog tools, consult its installed skill. Count website GA4 and PostHog visitors separately; neither establishes native installs/sales without attribution. Filter production hosts `www.k53studyguide.online` and `k53studyguide.online`; exclude known QA markers (`analytics_test=true`, `utm_source=qa`, `utm_campaign=issue7`) with verified representations. Follow the repo contract for untagged historical events.

Search Console uses the exact domain property, final data and Pacific-time date boundaries. A prior connector identity lacked property access; use existing read-only authorization or Safari rather than expanding OAuth scopes. Ads totals require the actual conversion-action definition: historical install conversions were not Premium buyers. Mark unavailable coverage rather than substituting another source's metric.

## Evidence and output checks

Save a manifest with purpose, exact requested interval, source-specific windows/timezones, exclusions, fetched-at times, release verification, coverage limits and reconciliation status. Keep raw reports with their requests and headers privately. Check pagination, sampling, data_loss_from_other_row and thresholding; absent warning flags do not establish complete measurement.

Derive HTML figures from saved evidence. Useful calculations: engagedSessions/sessions; engagement seconds/activeUsers (label engagement per active user, not session length). Percentage change from zero is undefined: show counts. Use inline CSS, accessible tables and print styling; verify the rendered report and return an absolute path.
