# K53 Study Guide ASO & Growth Tracker

This document tracks the access, source data, and current analysis state for improving K53 Study Guide visibility in Play Store search and related acquisition channels.

Last verified: `2026-05-08`

## Current Goal

Improve Play Store search visibility for K53 Study Guide by combining:

- Play Store listing and ASO work
- competitor and keyword analysis
- GA4 acquisition/product analytics
- Search Console website SEO data
- Google Ads historical campaign learnings
- app quality, ratings, and review signals

## Verified Access

| Area | Status | Verified details | Notes |
| --- | --- | --- | --- |
| Local repo | Available | `/Users/dean/_repo/deanvanniekerk/k53studyguide` | Read/write access available. |
| Play Store public listing | Available | https://play.google.com/store/apps/details?id=deanvniekerk.k53studyguide.app&hl=en | Public listing available. |
| Google Play MCP | Available with limits | Package `deanvniekerk.k53studyguide.app`; default language `en-GB` | Listing, app info, and production release data work. Reviews endpoint returns empty data; detailed installs/crashes need Play reports, Vitals API, or exports. |
| Website | Available | https://k53studyguide.online/ | Source lives under `pkg/lander`. |
| Google Search Console MCP | Available | Property `sc-domain:k53studyguide.online`; permission `siteOwner` | Search query call works; last 28 days currently returned no rows. |
| Google Analytics MCP | Available | Current GA4 property `properties/269952161`; old property `properties/225099990` | Account/property and report tooling are callable. App analytics are active; landing-site web stream has been created and is configured through `.dev.env`. |
| Google Ads MCP | Available | Customer `7069841878` | Account is enabled, non-test, `ZAR`, timezone `Africa/Johannesburg`; campaign history is queryable. |
| Competitor links | Available | Five primary Play Store competitors listed below | Enough to begin public competitor audit. |

MCP service account used for service-account based tools:

`mcp-servers@k53-ninja.iam.gserviceaccount.com`

## Key Properties And IDs

| Item | Value |
| --- | --- |
| Current Play package | `deanvniekerk.k53studyguide.app` |
| Old app/package naming | `k53ninja` / `deanvniekerk.k53ninja.app` |
| Firebase/GCP project | `k53-ninja` |
| GCP project number | `959174953477` |
| Current GA4 account | `accounts/195283836` / `K53 Study Guide` |
| Current GA4 property | `properties/269952161` / `k53-study-guide` |
| Landing page GA4 web stream | Configured via `.dev.env` `VITE_GA_MEASUREMENT_ID` |
| Old GA4 account | `accounts/160321529` / `K53 Ninja` |
| Old GA4 property | `properties/225099990` / `k53-ninja` |
| Google Ads customer | `7069841878` |
| Search Console property | `sc-domain:k53studyguide.online` |

## Current Play Listing

| Field | Value |
| --- | --- |
| Title | `K53 Learners Licence Test SA` |
| Short description | `Study K53 rules, road signs and mock tests for South Africa's learner's licence.` |
| Default language | `en-GB` |
| Contact website | `https://k53studyguide.online` |
| Contact email | `info@k53studyguide.online` |
| Latest production release | `26 (1.26)` |
| Latest release note | `Handle notched phones correctly` |

## Changes Applied On 2026-05-07

| Area | Change |
| --- | --- |
| Play Store listing | Updated `en-GB` title, short description, and full description to target South African K53 learner's licence search terms, including road signs, rules of the road, vehicle controls, quizzes, and mock tests. |
| Website SEO | Added homepage title, meta description, canonical URL, robots meta, Open Graph/Twitter metadata, and `MobileApplication` JSON-LD structured data. |
| Website canonicalization | Set canonical URLs to `https://www.k53studyguide.online/` because GSC reported Google-selected canonical as the `www` host. |
| Website discovery | Added `pkg/lander/public/robots.txt` and `pkg/lander/public/sitemap.xml`; Vite build now emits them at the site root. |
| Attribution | Added Google Play install referrer parameters to website CTAs for nav, hero, premium, footer, and iOS coming soon modal links. |
| Legal pages | Added meta descriptions, canonical URLs, robots meta, and Open Graph metadata to `privacy.html` and `terms.html`. |

## Changes Applied On 2026-05-08

| Area | Change |
| --- | --- |
| App analytics | Added typed canonical GA4-style analytics adapter in `pkg/app/src/services/analytics`; legacy uppercase events remain for continuity. |
| Screen tracking | Centralized Firebase screen tracking in the app router and added user properties for language, theme, and premium status where plugin support allows. |
| Product analytics | Added canonical events for app open, onboarding info views, study content visibility/completion, quiz start/answer/complete, mock test start/complete, history clearing, and rate-app CTA taps. |
| Purchase funnel | Added premium offer, promotion selection, checkout start, pending, cancel, error, and completed purchase tracking across the modal and purchase services. |
| Landing analytics | Added GA4 `gtag` support to the landing site, using `VITE_GA_MEASUREMENT_ID` from `.dev.env`. |
| Website CTA tracking | Added `landing_page_view`, `select_store_cta`, `play_store_referral_click`, and `ios_interest` events while preserving Play Store install-referrer URLs. |
| Documentation | Added implementation reference at `docs/analytics-growth-setup.md`, including Measurement ID retrieval steps and GA4 admin setup recommendations. |

## Competitors

| Competitor | Play Store URL |
| --- | --- |
| Pineapple Studio K53 Learners Licence Test | https://play.google.com/store/apps/details?id=com.pineapplestudio.k53learnerslicensetest |
| K53 Learners App | https://play.google.com/store/apps/details?id=k53.south.africa.learners.test.app.k53learnersapp |
| TopScore | https://play.google.com/store/apps/details?id=uk.co.imagitech.topscore |
| K53 South Africa | https://play.google.com/store/apps/details?id=com.nhlakaniphonkosi.k53southafricam |
| Learners and License | https://play.google.com/store/apps/details?id=com.learnersandlicense |

## Google Ads Snapshot

| Campaign | Status | App ID | Impressions | Clicks | Cost | Conversions |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| `Initial - Low Volume` | Removed | `deanvniekerk.k53ninja.app` | 143,615 | 4,117 | ZAR 1,888.17 | 966 |
| `App Promotion K53 SG` | Paused | `deanvniekerk.k53studyguide.app` | 1,090,030 | 101,493 | ZAR 8,798.84 | 69,824 |

Important follow-up: confirm what the Google Ads conversions represent: installs, first opens, or another app event.

## Remaining Gaps

| Gap | Why it matters | Preferred source |
| --- | --- | --- |
| Play Store acquisition/search performance | Needed to understand impressions, store listing visitors, installs, conversion rate, and query-level visibility. | Play Console reports/export or expanded MCP/API support. |
| Play reviews history | Needed for review mining, user language, objections, and trust signals. | Play Console review export or API paging if available. |
| Android vitals / Crashlytics issue data | Quality issues can suppress growth and hurt conversion. | Play Console Vitals export, Crashlytics reports, or direct console screenshots. |
| Keyword volume/ranking data | Needed to prioritize ASO terms by demand and difficulty. | ASO tool such as AppTweak, Sensor Tower, MobileAction, AppFollow, App Radar, or manual SERP sampling. |
| Screenshot and creative assets audit | Listing conversion often depends on screenshot messaging and visual proof. | Play Console listing assets or local asset source. |

## Analysis Workstreams

### 1. ASO Listing Audit

Use the current Play listing, competitor listings, and priority keywords to evaluate:

- title and short description keyword coverage
- full description structure and repetition
- screenshot messaging and first-impression clarity
- category/tag positioning
- trust signals from rating, review count, and update cadence

### 2. Competitor And Keyword Research

Seed keywords:

- `k53`
- `k53 learners`
- `learners test`
- `learners licence`
- `learners license south africa`
- `south africa driving test`

Add actual ranking and volume data when available.

### 3. GA4 Acquisition And Product Analytics

Use `properties/269952161` first. Compare with `properties/225099990` only if historical continuity is needed.

Current instrumentation reference:

- `docs/analytics-growth-setup.md`
- App events: `app_open`, `quiz_start`, `quiz_answer`, `quiz_complete`, `mock_test_start`, `mock_test_complete`, `view_promotion`, `select_promotion`, `begin_checkout`, `purchase_pending`, `purchase_cancel`, `purchase_error`, `purchase`
- Landing events: `landing_page_view`, `select_store_cta`, `play_store_referral_click`, `ios_interest`
- Key params: `cta_location`, `offer_surface`, `product_id`, `premium_status`, `quiz_mode`, `score_percent`, `passed`, `purchase_state`, `store_platform`

Reports to pull after the next deployed release has collected data:

- active users, new users, sessions, first opens
- traffic source / medium / campaign
- country, device category, operating system
- key events and event counts for the canonical funnel events
- retention and engagement proxies
- app/web split across the Android app stream and landing-site web stream
- funnel from website CTA click to first app open where GA4 attribution supports it
- funnel from offer view to checkout start to purchase, cancel, or error

### 4. Website SEO

Use GSC property `sc-domain:k53studyguide.online` and website source under `pkg/lander`.

Initial checks:

- indexed pages and sitemap status
- query/page/device/country performance
- branded vs non-branded search demand
- landing page metadata and structured data
- Play Store CTA tracking and attribution

### 5. Paid Acquisition Learnings

Use Google Ads customer `7069841878`.

Initial checks:

- campaign performance by date, country, network, and device
- conversion action definitions
- app campaign search term insights if available
- paid-to-organic measurement risk if future campaigns are used to support ASO tests

## Next Actions

1. Deploy the app and landing-site analytics changes.
2. In GA4, create the recommended custom dimensions, custom metrics, and key events from `docs/analytics-growth-setup.md`.
3. Add a GA annotation for the analytics release date.
4. After 7-14 days of data, pull a canonical funnel baseline for website CTA clicks, first opens, quiz completion, premium offer views, checkout starts, purchase cancels/errors, and purchases.
5. Pull GSC coverage/sitemap details and expand query lookback beyond 28 days.
6. Publicly audit the five competitor listings.
7. Draft an ASO hypothesis list for title, short description, full description, screenshots, and review prompts.
8. Decide whether to get a Play Console export for acquisition/search terms, reviews, and Android vitals.
