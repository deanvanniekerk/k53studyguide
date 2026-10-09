# Analytics access

Use read-only access for reporting. Authenticate through Safari when a signed-in console is needed. Keep credentials and raw exports outside this public repository; never put refresh tokens, transaction/customer identifiers or private financial reports in docs or issues.

## Intended sources

| Service | Identity | Retrieval |
| --- | --- | --- |
| GA4 | Account `195283836`, property `269952161`, `k53-study-guide` | Read-only connector/Data API; re-read property metadata and a dated report |
| Firebase | Native package/bundle `deanvniekerk.k53studyguide.app` | Verify app-to-property/stream mapping; do not use obsolete project aliases as authority |
| Google Play | Package `deanvniekerk.k53studyguide.app` | Console Statistics/listing reports or their CSV exports |
| App Store Connect | App `6784718443` | Analytics for discovery/downloads; store reports for sales/proceeds |
| RevenueCat | Entitlement `premium_access` | Transactions and environment reconciled against the corresponding store |
| PostHog | K53 project `491784` | Website only unless mobile collection is independently verified |
| Search Console | `sc-domain:k53studyguide.online` | Read-only Search Analytics API or signed-in console |
| Google Ads | Customer `7069841878` | Verify account, campaign, action definitions, dates and currency before analysis |

Product IDs are defined in [productIds.ts](../../pkg/app/src/services/purchase/productIds.ts): Android `premium_access`; iOS `deanvniekerk.k53studyguide.premium_access`.

## Repeatable diagnostic snapshot

Use a Python environment with `google-auth` and `requests`, plus the existing private authorized-user credential with `analytics.readonly` scope. Replace these illustrative dates/paths with a closed window and private destination:

```bash
python scripts/analytics/snapshot.py \
  --credentials /absolute/private/analytics-readonly.json \
  --start 2026-10-01 --end 2026-10-05 \
  --output /absolute/private/k53-diagnostic
```

The [script](../../scripts/analytics/snapshot.py) saves metadata, dimensions, retention/export settings, exact requests, responses and a manifest with private permissions. It reads platform/user totals, event/version coverage and origin/Premium breakdowns where dimensions exist.

**This is a diagnostic snapshot, not the weekly production scorecard.** It excludes no QA, sandbox, legacy version or hostname traffic, does not create a sequential funnel, and leaves confirmed sales null. Apply the [reporting contract](README.md) in a separate verified analysis. An installed connector or a successful empty response does not establish complete coverage.

## Known retrieval limitations

- The previously inspected Play MCP statistics tool returned placeholder install/crash text. Use genuine console exports; the Play Developer Reporting API supplies vitals, not acquisition reports.
- The previously configured Search Console MCP identity could not see the property and its OAuth flow requested write-capable `webmasters`. Use the verified read-only API identity with `webmasters.readonly` or Safari. Do not expand permissions to solve a reporting task. Recheck tool capabilities before trusting a later installation.
- Search Console daily reporting uses Pacific time. Request final data and preserve the exact property, dates and filters. A missing site is an access problem, not zero demand.
- For Play Cloud Storage exports, copy the exact bucket/object from the console; do not guess it. Keep the CSV and its metric definition, timezone, filters and fetch timestamp together privately.

If authorization expires, renew only the necessary read-only scopes with the existing authorized account, keep credentials private, and verify metadata plus a small dated report before using the connection. Do not recreate streams/properties as an authentication workaround.
