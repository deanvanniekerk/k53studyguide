# K53 Study Guide ASO & Growth Access Tracker

This document tracks the tools, links, and account access needed for a comprehensive plan to improve K53 Study Guide visibility in Play Store search results. It should be updated as access is granted, links are shared, audits are completed, and actions are implemented.

## Current Access State

| Area | Current state | Access level | Notes |
| --- | --- | --- | --- |
| Local repository | Available | Read/write | Codex can inspect and edit this repo. |
| App source code | Available | Read/write | Ionic React + Capacitor app under `pkg/app`. |
| Landing website source | Available | Read/write | Static Vite lander under `pkg/lander`. |
| Play Store public listing | Available | Public | https://play.google.com/store/apps/details?id=deanvniekerk.k53studyguide.app&hl=en |
| Play Console | Available with limits | Google Play MCP read access | App info, `en-GB` listing, production release info, and basic ratings endpoint are callable. Detailed installs/crashes require Reports/Vitals APIs or exports. Reviews endpoint currently returns `{}`. |
| Firebase Analytics | Needed | Account/tool access required | Needed for acquisition, retention, funnel, event, audience, country, language, and device analysis. |
| Firebase Crashlytics / Android vitals | Needed | Account/tool access required | Needed to check crash, ANR, and quality signals that may affect growth. |
| Website URL | Available | Public | https://k53studyguide.online/ |
| Website analytics | Needed | Account/tool access required | Google Analytics, Plausible, Cloudflare Analytics, or equivalent. |
| Google Search Console | Needed | Account/tool access required | Needed for organic search queries, indexing, pages, and website SEO opportunities. |
| Competitor listings | Needed | Public links required | Need Play Store links for top competing learner/K53 apps. |
| ASO keyword tool | Optional | Tool access helpful | AppTweak, Sensor Tower, data.ai, MobileAction, AppFollow, App Radar, or similar. |
| Google Ads | Optional | Account/tool access helpful | Useful if paid campaigns are used or considered for ranking momentum. |
| Support/review channels | Optional | Export or screenshots helpful | Useful for learning user vocabulary and pain points. |

## Links To Collect

| Link | Status | Value |
| --- | --- | --- |
| Play Store listing | Available | https://play.google.com/store/apps/details?id=deanvniekerk.k53studyguide.app&hl=en |
| Landing website | Available | https://k53studyguide.online/ |
| Google Play Console | Available with limits | MCP package access confirmed for `deanvniekerk.k53studyguide.app` |
| Firebase project | Needed |  |
| Website analytics | Needed |  |
| Google Search Console | Needed |  |
| Competitor 1 | Needed |  |
| Competitor 2 | Needed |  |
| Competitor 3 | Needed |  |
| Competitor 4 | Needed |  |
| Competitor 5 | Needed |  |

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

Current status: `Blocked until competitor links and target keywords are available`.

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

Current status: `Blocked until Firebase data is available`.

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
| 2026-05-05 | Added public Play Store listing and website links. | Codex |
| 2026-05-05 | Checked tool discovery for Google Play/Play Console MCP access. No callable Google Play tools were exposed; status set to pending. | Codex |
| 2026-05-05 | Google Play MCP became callable. Read-only app info call for `deanvniekerk.k53studyguide.app` failed because Android Publisher API is disabled for project `959174953477`. | Codex |
| 2026-05-05 | Retried after Android Publisher API was enabled. Read-only app info call now fails with `The caller does not have permission`, so Play Console permissions are the remaining blocker. | Codex |
| 2026-05-05 | Play Console service account permissions confirmed. Retrieved app info, `en-GB` store listing, and production release `26 (1.26)`. Reviews endpoint returned `{}`; install and crash statistics require Reports/Vitals API access or exports. | Codex |

## Decision Log

| Date | Decision | Reason |
| --- | --- | --- |
| 2026-05-05 | Track ASO/growth access in `docs/aso-growth-access-tracker.md`. | Keeps planning inputs visible before deeper analysis begins. |
