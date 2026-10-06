# Website store referral measurement

A referral click means a learner activated a website link to a platform store. It is **not an install**, a premium entitlement or a purchase. Report installations from store acquisition data, and sales from the store/purchase system.

## Canonical event

Count only `select_store_cta` in each collector. Never add GA4 and PostHog totals together: they observe the same interaction with different consent, blocking and processing behaviour. Do not add `play_store_referral_click`, `app_store_referral_click`, GA4 enhanced-measurement `click`, or PostHog `$autocapture`; these are overlapping observations.

| Placement | `cta_location` | `store_platform` |
| --- | --- | --- |
| Navigation | `nav_cta` | `android` |
| Hero | `hero_cta` / `hero_ios_cta` | `android` / `ios` |
| Footer | `footer_cta` / `footer_ios_cta` | `android` / `ios` |
| Demo Study tab | `quiz_demo_locked_study_android` / `quiz_demo_locked_study_ios` | `android` / `ios` |
| Demo Test tab | `quiz_demo_locked_test_android` / `quiz_demo_locked_test_ios` | `android` / `ios` |
| Demo Profile tab | `quiz_demo_locked_profile_android` / `quiz_demo_locked_profile_ios` | `android` / `ios` |

There is currently no iOS navigation CTA. Preserve the existing store destinations and new-tab behaviour when changing measurement.

## Reporting recipe

Use the same inclusive date range and timezone for both collectors, then:

1. Filter event name to `select_store_cta`.
2. Include **exactly** `k53studyguide.online` and `www.k53studyguide.online` as hostnames. Keep an apex/www breakdown for diagnosis; combine them only after filtering. Exclude localhost, preview domains and unrelated sites even when they use the same project token.
3. For new custom events, require `analytics_environment=production` and exclude `analytics_test=true`; these explicit properties supplement hostname and URL filters. Exclude test traffic: any page URL containing `analytics_test=true`, campaign `issue7`, or source `qa`. Historical events without environment/test properties still require these URL/campaign filters. Never treat a missing property as evidence that the visit was production.
4. Break down by `store_platform` and `cta_location`. In GA4 register these as event-scoped custom dimensions before expecting report breakdowns; registration does not backfill historical values. PostHog event properties are available on received records.
5. For a visitor conversion rate, use unique visitors who sent the canonical referral event divided by unique visitors who sent the chosen website page-view event under the same filters/window. Choose either GA4 `page_view` or PostHog `$pageview` as the denominator; do not sum the custom `landing_page_view` with automatic page views. Label the result website-to-store referral rate, not install conversion.

In PostHog use `$host`, `$current_url`, `utm_source` and `utm_campaign`; in GA4 use hostname, page location and session campaign/source. Verify properties in the actual project first. Missing registered dimensions, consent denial and blocked requests are coverage limitations, not zero demand.

## Validation and release gate

For each of the 11 placement/platform combinations above, open a new QA visit with `?analytics_test=true&utm_source=qa&utm_medium=validation&utm_campaign=issue7`, click once, and check:

- The Android link contains package `deanvniekerk.k53studyguide.app`, or the iOS link contains `id6784718443`.
- The link opens in a new tab and the source page stays available.
- GA4 and PostHog each receive one `select_store_cta` with the expected placement/platform. Check received records, not just a local SDK queue. Allow processing time before declaring a failure.
- Excluding the QA marker removes the validation session from the production report.

Capture only event name, test marker, hostname, placement, platform, timestamp and build revision as evidence. Keep raw exports, client identifiers and session recordings outside the public repository. Do not install or purchase to validate this boundary.

Baseline production audit on 2026-10-06 confirmed delivery of all 11 canonical events to PostHog, one per interaction, with the expected placement/platform. All destination anchors were inspected; the navigation CTA's loaded Play listing was observed. GA4 ingestion was not confirmed because the analytics connector required reauthentication. The baseline source sends no explicit environment/test properties and enables PostHog on development hosts. Repeat the complete gate after any measurement changes are deployed; local tests alone do not establish production delivery.


## Collection guard and local checks

GA4 and PostHog initialize only on the two production hostnames above. Preview and localhost visits do not start either collector; store links still work. Custom events carry `analytics_environment=production` and an `analytics_test` boolean. A visit is marked as QA when its URL has `analytics_test=true`, `utm_source=qa` or `utm_campaign=issue7`. Preserve these parameters for each validation visit. GA4 also receives the properties before its configuration/page-view command. Continue filtering automatic PostHog events and historical traffic by hostname and URL, because they need not contain custom-event properties.

Run `pnpm --filter lander test` (also included in root `pnpm test`) for the approved link-activation boundary. The integration suite executes the real HTML handlers and rendered demo, checks all 11 destination/placement/platform pairs and observes each external collector SDK boundary. It covers apex/www, QA markers and collector suppression on development hosts. It does not send data to either service, prove ingestion, or launch store applications. Run `pnpm lander:build` and then repeat the received-event release gate after deployment. No collection repair is claimed from the baseline evidence: PostHog already delivered all 11 canonical referrals.
