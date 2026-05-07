# K53 Study Guide ASO & Growth Access Tracker

This document tracks the tools, links, and account access needed for a comprehensive plan to improve K53 Study Guide visibility in Play Store search results. It should be updated as access is granted, links are shared, audits are completed, and actions are implemented.

## Current Access State

MCP service account in use: `mcp-servers@k53-ninja.iam.gserviceaccount.com`

| Area | Current state | Access level | Notes |
| --- | --- | --- | --- |
| Local repository | Available | Read/write | Codex can inspect and edit this repo. |
| App source code | Available | Read/write | Ionic React + Capacitor app under `pkg/app`. |
| Landing website source | Available | Read/write | Static Vite lander under `pkg/lander`. |
| Play Store public listing | Available | Public | https://play.google.com/store/apps/details?id=deanvniekerk.k53studyguide.app&hl=en |
| Play Console | Available with limits | Google Play MCP read access | App info, `en-GB` listing, production release info, and basic ratings endpoint are callable. Detailed installs/crashes require Reports/Vitals APIs or exports. Reviews endpoint currently returns `{}`. |
| GA4 / Firebase Analytics | Available after MCP reload | Google Analytics MCP configured and direct API access verified | OAuth ADC credentials can access GA4 accounts including `K53 Study Guide` property `269952161` and `K53 Ninja` property `225099990`. Current Codex session needs MCP reload before tool calls appear. |
| Firebase Crashlytics / Android vitals | Needed | Crashlytics reports or Play Console Vitals exports required | Use Crashlytics/Play Console exports for crash, ANR, and quality analysis. |
| Website URL | Available | Public | https://k53studyguide.online/ |
| Website analytics | Available after MCP reload | Google Analytics MCP configured and direct API access verified | Use GA4 property `269952161` first for current K53 Study Guide analysis. |
| Google Search Console | Available after MCP reload | OAuth configured and authenticated | OAuth token is created and direct API access sees `sc-domain:k53studyguide.online` with `siteOwner` permission. Current Codex session's GSC MCP transport is closed and needs reload/restart before tool calls work again. |
| Competitor listings | Available | Public links provided | Five primary competitor Play Store listings are recorded below. |
| ASO keyword tool | Optional | Tool access helpful | AppTweak, Sensor Tower, data.ai, MobileAction, AppFollow, App Radar, or similar. |
| Google Ads | Available | Google Ads MCP read access | Customer `7069841878` is accessible. Account is enabled, non-test, currency `ZAR`, timezone `Africa/Johannesburg`. Campaign history is queryable. |
| Support/review channels | Optional | Export or screenshots helpful | Useful for learning user vocabulary and pain points. |

## Links To Collect

| Link | Status | Value |
| --- | --- | --- |
| Play Store listing | Available | https://play.google.com/store/apps/details?id=deanvniekerk.k53studyguide.app&hl=en |
| Landing website | Available | https://k53studyguide.online/ |
| Google Play Console | Available with limits | MCP package access confirmed for `deanvniekerk.k53studyguide.app` |
| Firebase project | Known | `k53-ninja` / project number `959174953477` |
| Google Analytics / GA4 | Available after MCP reload | Current property: `properties/269952161` (`k53-study-guide`); old property: `properties/225099990` (`k53-ninja`) |
| Google Search Console | Available after MCP reload | `sc-domain:k53studyguide.online` with `siteOwner` permission |
| Google Ads customer | Available | `7069841878` |
| Competitor 1 | Available | https://play.google.com/store/apps/details?id=com.pineapplestudio.k53learnerslicensetest |
| Competitor 2 | Available | https://play.google.com/store/apps/details?id=k53.south.africa.learners.test.app.k53learnersapp |
| Competitor 3 | Available | https://play.google.com/store/apps/details?id=uk.co.imagitech.topscore |
| Competitor 4 | Available | https://play.google.com/store/apps/details?id=com.nhlakaniphonkosi.k53southafricam |
| Competitor 5 | Available | https://play.google.com/store/apps/details?id=com.learnersandlicense |

## Access Needed By Workstream

### 1. Play Store ASO Audit

Needed:

- Public Play Store listing URL
- Play Console access or exports/screenshots for:
  - title, short description, full description
  - category, tags, content rating, countries, languages
  - screenshots, feature graphic, app icon, promo video if any
  - store listing experiments
  - store performance by acquisition source
  - search term performance if available
  - ratings and reviews
  - Android vitals
  - release history

Current status: `Public listing and Google Play MCP available. Listing and release data can be audited; detailed stats, vitals, and full review history still need exports or additional API support`.

### 2. Competitor & Keyword Analysis

Needed:

- Public Play Store URLs for top competitors
- Priority keywords, for example:
  - `k53`
  - `k53 learners`
  - `learners test`
  - `learners licence`
  - `learners license south africa`
  - `south africa driving test`
- Optional ASO tool access for keyword volume, difficulty, competitor ranking, and trend data

Current status: `Competitor links available; target keywords and keyword volume/ranking data still needed`.

### 3. Firebase Product Analytics

Needed:

- Firebase / Google Analytics access or exports for:
  - acquisition source and campaign data
  - first open trends
  - active users
  - retention cohorts
  - engagement events
  - quiz/test completion funnels
  - geography, language, and device breakdowns
  - uninstall or churn proxies if available

Current status: `Google Analytics MCP is installed and authenticated. Direct API access works; Codex needs MCP reload before the new tool namespace is callable in-session`.

Observed Firebase project/app details:

- Project ID: `k53-ninja`
- Project number: `959174953477`
- Display name: `K53 Ninja`
- Android Firebase app ID: `1:959174953477:android:0c0e5a614dd69be0586a6c`
- Firebase Android package namespace: `deanvniekerk.k53ninja.app`
- Play Store package namespace: `deanvniekerk.k53studyguide.app`
- Note: the Firebase package namespace differs from the Play Store package namespace because `k53ninja` is the old app name. Still verify that the current shipped app is sending analytics to the intended Firebase app/project.

Observed GA4 access:

| Account | Account ID | Property | Property ID | Notes |
| --- | --- | --- | --- | --- |
| `K53 Study Guide` | `195283836` | `k53-study-guide` | `269952161` | Current property to analyze first. |
| `K53 Ninja` | `160321529` | `k53-ninja` | `225099990` | Old-name property; useful for historical comparison if needed. |

Google Analytics MCP setup:

- Repo: `/Users/dean/_repo/mcp/google-analytics-mcp`
- Command: `/Users/dean/_repo/mcp/google-analytics-mcp/.venv/bin/analytics-mcp`
- ADC credentials: `/Users/dean/Cloud/gcp/adc/google-analytics-mcp-adc.json`
- Project: `k53-ninja`
- Required APIs enabled: `analyticsadmin.googleapis.com`, `analyticsdata.googleapis.com`

### 4. Website SEO & Conversion

Needed:

- Live website URL
- Website analytics access
- Google Search Console access
- Current hosting/deploy details if implementation changes are needed

Current status: `Repo source and live website available; analytics and Search Console data still needed`.

### 5. Review Mining & User Language

Needed:

- Play Console reviews export or access
- Optional support emails/messages/tickets
- Optional app store competitor review exports

Current status: `Google Play reviews endpoint callable but returned empty data; full review export or Play Console review access may still be needed`.

### 6. Implementation & Experimentation

Needed later:

- GitHub access if changes need PRs
- CI visibility if builds fail
- Lander deploy access if website changes are approved
- Play Console release/listing permissions if store listing experiments are approved

Current status: `Local repo changes possible; deployment/account changes need access`.

### 7. Google Ads

Current status: `Google Ads MCP access available for customer 7069841878`.

Observed account details:

- Customer ID: `7069841878`
- Currency: `ZAR`
- Timezone: `Africa/Johannesburg`
- Status: `ENABLED`
- Test account: `false`
- Manager account: `false`

Observed app campaigns:

| Campaign | Status | App ID | Impressions | Clicks | Cost | Conversions |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| `Initial - Low Volume` | Removed | `deanvniekerk.k53ninja.app` | 143,615 | 4,117 | ZAR 1,888.17 | 966 |
| `App Promotion K53 SG` | Paused | `deanvniekerk.k53studyguide.app` | 1,090,030 | 101,493 | ZAR 8,798.84 | 69,824 |

Next useful Ads analysis:

- Break campaign performance down by date, country, device, network, and conversion action.
- Check whether campaign conversions represent installs, first opens, or another conversion event.
- Inspect search term insights where available for app campaign keyword/intent clues.
- Evaluate whether a small controlled app campaign could support ASO experiments without distorting organic measurement.

## First Data Request

Ask the owner for:

- Play Store listing URL
- Website URL
- Top 5 competitor Play Store URLs
- Priority keyword list
- Rough monthly install range
- Current rating and review count
- Access or exports for Play Console, Firebase Analytics, and Google Search Console

## Progress Log

| Date | Update | Owner |
| --- | --- | --- |
| 2026-05-05 | Created initial access tracker. Local repository access confirmed. External links and account access still needed. | Codex |
| 2026-05-05 | Recorded MCP service account: `mcp-servers@k53-ninja.iam.gserviceaccount.com`. | Codex |
| 2026-05-05 | Added public Play Store listing and website links. | Codex |
| 2026-05-05 | Checked tool discovery for Google Play/Play Console MCP access. No callable Google Play tools were exposed; status set to pending. | Codex |
| 2026-05-05 | Google Play MCP became callable. Read-only app info call for `deanvniekerk.k53studyguide.app` failed because Android Publisher API is disabled for project `959174953477`. | Codex |
| 2026-05-05 | Retried after Android Publisher API was enabled. Read-only app info call now fails with `The caller does not have permission`, so Play Console permissions are the remaining blocker. | Codex |
| 2026-05-05 | Play Console service account permissions confirmed. Retrieved app info, `en-GB` store listing, and production release `26 (1.26)`. Reviews endpoint returned `{}`; install and crash statistics require Reports/Vitals API access or exports. | Codex |
| 2026-05-05 | Retried reviews and statistics after permission changes. Reviews still returned `{}`; ratings returned app details only; crashes still require Vitals API; installs call was blocked by tool safety before execution. | Codex |
| 2026-05-05 | Added five primary competitor Play Store listings. Competitor analysis is now partially unblocked. | Codex |
| 2026-05-05 | Firebase project metadata noted for `k53-ninja`. Product analytics should use GA4/Google Analytics data rather than Firebase tooling. | Codex |
| 2026-05-05 | Confirmed with owner that `k53ninja` is the old app name and was updated to `k53studyguide`; namespace mismatch is historical naming, but analytics wiring should still be verified. | Codex |
| 2026-05-05 | Google Ads MCP access confirmed for customer `7069841878`. Retrieved account metadata and two app campaigns, including paused current app campaign `App Promotion K53 SG`. | Codex |
| 2026-05-07 | Reconfigured GSC MCP to use OAuth client secret at `/Users/dean/Cloud/gcp/keys/client_secret_959174953477-j56krilalsdalbtu2h68fkarpo79n4t0.apps.googleusercontent.com.json` with `GSC_SKIP_OAUTH=false`. OAuth sign-in is blocked by Google because the app is in testing and the Gmail account is not an approved test user. | Codex |
| 2026-05-07 | Completed GSC OAuth browser authentication. Direct Search Console API access confirmed for `sc-domain:k53studyguide.online` with `siteOwner` permission. Current MCP tool transport remains closed until Codex/MCP reload. | Codex |
| 2026-05-07 | Cloned and installed Google Analytics MCP at `/Users/dean/_repo/mcp/google-analytics-mcp`, generated OAuth ADC credentials, enabled Analytics Admin/Data APIs, and confirmed direct GA4 API access to current property `269952161` plus old property `225099990`. | Codex |

## Decision Log

| Date | Decision | Reason |
| --- | --- | --- |
| 2026-05-05 | Track ASO/growth access in `docs/aso-growth-access-tracker.md`. | Keeps planning inputs visible before deeper analysis begins. |
