# Acquisition diagnosis — 7 October 2026

Decision input for [#18](https://github.com/deanvanniekerk/k53studyguide/issues/18), under [#3](https://github.com/deanvanniekerk/k53studyguide/issues/3). This is a dated diagnosis, not campaign launch approval or a claim of profitable acquisition.

## Finding

Android acquisition declined in the matched reporting windows. The evidence points to reduced listing traffic rather than a worsening listing click-through rate. Broad `k53` query traffic deserves attention, but these reports do not distinguish lower demand from ranking, competition or traffic-mix changes. GA4's nearly flat worldwide total conceals a decline in South African acquisition and substantial older-version traffic elsewhere.

Prior period: **9 August–5 September 2026**. Recent period: **6 September–3 October 2026**. Both contain 28 complete calendar days with matching weekdays. Retrieved 7 October. Preserve each source's timezone: Play installation statistics use Pacific time; GA4 uses UTC+02:00; Apple Analytics uses UTC. Cross-source calendar ranges therefore do not describe identical clock intervals. The October checkout QA window is outside these dates, but historical internal traffic has not been conclusively excluded.

## Android: discovery and completed acquisitions

Package: `deanvniekerk.k53studyguide.app`. Counts below were read from authenticated Play Console reports, including all 56 daily device-acquisition rows. Prior values were read explicitly, not reverse-calculated from rounded dashboard deltas.

| Play measure | Prior | Recent | Change |
| --- | ---: | ---: | ---: |
| All device acquisitions, all countries | 761 | 582 | −23.5% |
| All device acquisitions, South Africa | 753 | 580 | −23.0% |
| Listing visitors, all sources | 573 | 464 | −19.0% |
| Unique user install clicks, all sources | 360 | 302 | −16.1% |
| Listing visitor-to-install-click ratio | 62.8% | 65.1% | +2.3 percentage points |
| Explore visitors | 475 | 406 | −14.5% |
| Explore install clicks | 300 | 262 | −12.7% |
| Ads and referrals visitors | 98 | 58 | −40.8% |
| Ads and referrals install clicks | 60 | 40 | −33.3% |

Explore accounts for **38 of the 58 fewer listing install clicks**; Ads and referrals accounts for 20. Ads and referrals is a mixed source, not proof of paid traffic. No separate Search row was returned; do not interpret that as no query-driven discovery. Google's current classification includes category searches and autocomplete under Explore.

The current listing report measures **unique user install clicks**, not completed installs. Some row labels still say “All store listing acquisitions”; the selected metric and the `STORE_INSTALL_BUTTON_CLICKS` drill-down identify what is being measured. The default-listing management card also shows a different visitor/conversion snapshot; it was excluded from this dated comparison. Google documents a mid-2026 report migration, so do not splice old acquisition/conversion reports into the new click series. [Listing report definitions](https://support.google.com/googleplay/android-developer/answer/9859173).

| Query-associated install clicks | Prior | Recent | Change |
| --- | ---: | ---: | ---: |
| `k53` | 60 | 21 | −65.0% |
| `k53 rsa learners license` | 90 | 93 | +3.3% |
| Other | 161 | 161 | 0% |
| All search terms | 311 | 275 | −11.6% |

These are the search-term view's own totals. They are not an additive decomposition of the traffic-source view: **do not add the query decline to the Explore decline**. “Other” hides small terms. This does not measure keyword search volume, impressions, rankings or lost premium buyers.

## GA4: platform, geography, source and version

Property `269952161`, Android stream `2438737068`. Read-only Data API reports used the same two named date ranges. Returned metadata showed no sampling and no `(other)` data-loss flag; no thresholding flag was returned. Rows were below the requested limits. These are diagnostic aggregates with no verified production-only user exclusion.

| GA4 measure | Prior | Recent | Interpretation |
| --- | ---: | ---: | --- |
| Android new users | 800 | 820 | +2.5%; not Play installs |
| Android first_open events | 800 | 820 | Coincidentally equals newUsers here; different metric |
| Android users with first_open | 791 | 814 | Separate event-filtered totalUsers result |
| Android total users | 2,379 | 2,414 | Window users, not newly acquired cohort |
| Android sessions | 4,094 | 3,934 | −3.9%; no retention claim |
| South Africa Android new users | 352 | 326 | −7.4% |
| Nigeria Android new users | 275 | 287 | All observed on 1.29, direct/none |
| Android new users, first-user google-play / organic | 294 | 279 | −5.1% |
| Android new users, first-user google / organic | 27 | 14 | Small absolute count |
| Android new users, first-user direct / none | 478 | 527 | Attribution is unknown; not proof of intentional direct discovery |
| Android new users, version 1.38 | 336 | 309 | −8.0% |
| Android new users, version 1.29 | 442 | 487 | +10.2%; largely outside South Africa |
| Web new users | 13 | 6 | Too small to explain Play decline |

The joint country/version/source query confirms that Nigerian new-user rows are version 1.29 and direct/none, while most South African new users are version 1.38 from google-play/organic. All these Android rows report the same stream. Play's completed acquisitions are overwhelmingly South African. **The origin of the older-version international traffic is unverified**: sideloading, redistribution, identity changes or collection problems remain hypotheses, not findings. Segment it before forecasting qualified South African demand.

The production Play track currently lists **38 (1.38), completed**; its dashboard says released **6 July 2026**, before both comparison windows. The October checkout/analytics changes are merged code, not evidence that a new store release reached learners. App-version reports describe observed versions; they do not demonstrate a release caused the decline.

The website recorded three canonical store-referral clicks from two users in the prior period and no received row with activity in the recent period. The older platform-specific Android click overlaps the canonical event and is not another acquisition. Website host/test coverage is not fully verified for these historical dates; these counts are not a production conversion rate.

No iOS GA4 rows were returned for either period. The later iOS stream repair cannot backfill missing activity. Store-side iOS evidence is reported separately below.

## iOS: small, search-led acquisition

App Store Connect app `6784718443`, Analytics → Metrics / Acquisition Sources, the same two calendar ranges in **UTC**. Metric totals and source rows were read separately; download totals were not inferred from page views or missing source rows.

| Apple measure | Prior | Recent |
| --- | ---: | ---: |
| First-time downloads | 35 | 40 |
| First-time downloads: South Africa storefront | 25 | 38 |
| First-time downloads: App Store Search | 32 | 36 |
| First-time downloads: App Referrer | 1 | 3 |
| First-time downloads: Web Referrer | 2 | 1 |
| Product page views (total, not unique devices) | 47 | 41 |

First-time downloads increased by five (+14.3%), so this small sample does not show the Android decline. Search supplied 36 of the 40 recent first-time downloads. South Africa storefront downloads increased from 25 to 38; the recent remainder was Namibia (1) and Zambia (1). Storefront territory is an App Store account location, not measured physical location. App Version is disabled for this download metric, so no iOS release-level comparison is claimed. Other source cells displayed dashes, which are preserved as unavailable rather than assumed zeros. Apple's unique-device page-view source chart showed rounded daily averages; those were not multiplied into invented totals.

Do not divide first-time downloads by page views and call it Apple's conversion rate: downloads can occur from search without a product-page visit, and Apple's denominator is unique-device impressions. Redownloads, usage installations and retained users are different measures; they were not substituted for first-time downloads. No keyword-level iOS data or acquired-cohort purchase quality was established. [Apple metric definitions](https://developer.apple.com/help/app-store-connect-analytics/reference/metrics-definitions), [Apple filters and dimensions](https://developer.apple.com/help/app-store-connect-analytics/reference/filters-and-dimensions).

## Historical Android campaign quality

The Google Ads API independently returned customer currency ZAR and timezone Africa/Johannesburg. Campaign/action/asset snapshots describe configuration **as read on 7 October**, not a reconstruction of every past setting. Financial exports and detailed cost calculations remain private.

For **1 January 2020–3 October 2026**, campaign totals reconcile exactly to the account totals:

| Campaign | App | Status now | Impressions | Clicks | Conversions |
| --- | --- | --- | ---: | ---: | ---: |
| Initial - Low Volume | Old K53 Ninja package | Removed | 143,615 | 4,117 | 966 |
| App Promotion K53 SG | Current package | Paused | 1,090,030 | 101,493 | 69,824 |
| Account total | Both packages | — | 1,233,645 | 105,610 | 70,790 |

The current-app campaign's **69,824 conversions are the Google Play download action**, not premium sales. It selects that action for install optimisation. The action is one-per-click with a 30-day click window and one-day view window. First open is currently secondary; app purchase actions are not substitutes for verified transaction reconciliation.

Monthly results show activity in July–October 2021, August–September 2022 and December 2023–April 2024. No later activity rows were returned through 3 October 2026. The removed old-package campaign ran in April–August 2020. Stopping this account's ads does not explain a new August–September 2026 decline.

In the **December 2023–April 2024** campaign/action slice, Ads reports 53,300 primary download conversions and 44,805 first-open All Conversions, with in-app-purchase action observations retained in the private financial appendix. First-open and in-app-purchase rows only appear in this later slice; dividing them by lifetime downloads would mix coverage periods. These actions may overlap, have different attribution windows and include repeat activity. They are **not deduplicated buyers, an acquired cohort, confirmed net revenue, or proof of incrementality**. Historic activity suggests some post-install use, but profitability remains unproven. Google normally dates conversions to the ad interaction, not the event date. [App-conversion comparisons](https://support.google.com/google-ads/answer/13070342), [attribution timing](https://developers.google.com/app-conversion-tracking/api/discrepancies).

Both campaigns currently target **South Africa, English**, with **presence or interest** location matching. Current-app user-location rows put all reported download conversions in South Africa; this does not identify nationality or guarantee future location quality. The two current-app ad groups use the same three headlines, four descriptions, one shared 512×512 image (`IconText-min.png`), and no supplied YouTube videos. Visual inspection shows a text-led “K53 Study Guide” gradient tile rather than app screenshots or feature demonstrations. Asset inventory does not rule out Google's automatically assembled assets.

The historical copy covers study material, tracking, quizzes and mock tests. It does not clearly explain free practice versus the one-time premium unlock. Asset-level causal effectiveness and audience purchase quality were not established. Refreshing creative is a testable opportunity, not a claim that the existing image caused the decline.

## Reconciliation boundaries

| Observation | Population / limit |
| --- | --- |
| Play listing visitors → install clicks | Same selected listing report; ratio measures clicking, not completed installation |
| Play all device acquisitions | New and returning device acquisition events across Play surfaces; cannot subtract listing clicks to calculate other-source installs |
| Play first opens | Store device measure with its own coverage/lag; not interchangeable with Firebase first_open |
| GA4 first_open / new users | First measured launch after installation or reinstallation; analytics identities, not store people/devices |
| Website store referral click | Website-observed handoff; no verified downstream install join |
| Ads conversions | Attributed action-specific counts; do not add downloads, first opens and purchases into an acquisition total |

Cross-system differences are **not a measured installation failure rate**. Downloads can open later or never; analytics coverage, identity, source classification, timezones and reinstall rules differ. The Play dashboard's rolling 28-day totals also include different dates/incomplete coverage, so the matched Statistics series above is the comparison authority. [Play Statistics](https://support.google.com/googleplay/android-developer/answer/139628), [GA automatic events](https://support.google.com/analytics/answer/9234069), [GA user acquisition](https://support.google.com/analytics/answer/12922540).

## Prioritised opportunities

1. **#19: test one South African listing hypothesis.** Lead the first screenshot with recognisable K53 learner's-test preparation and a clear free-practice/one-time-premium distinction. Broad `k53` discovery weakened while the longer intent phrase remained steady. Keep other listing elements unchanged for the first test, track traffic-source/query mix alongside clicks, and validate completed Play acquisitions separately. At this volume, treat results as directional; do not claim keyword-rank causality from click counts.
2. **#21: prepare a fresh South Africa Android pilot.** Use contemporary creative and explicit geographic intent. The historic campaign proves the channel delivered attributed installs, not that those installs were profitable. Use verified net proceeds and qualified cohort conversion scenarios for the spend ceiling; do not reuse historic install cost as a forecast. Activation still requires approved spend and the tested release/production measurement gates.
3. **Separate qualified acquisition from the legacy traffic anomaly.** Carry platform, geography, first-user source and app version in the scorecard. Investigate the provenance of international 1.29 direct traffic before including it in revenue projections. Do not automatically discard it or label it fraud.
4. **Keep measurement scope proportionate.** Reuse accepted checkout QA. Validate live collection after release; do not rerun the entire purchase matrix to finish this diagnosis. Retention, confirmed buyers and incremental revenue remain unavailable without the joins/exclusions in the [cohort reporting contract](cohort-reporting.md).

## Reproduce the evidence

- **Play Statistics:** select All device acquisitions → all events → daily; 9 August–3 October 2026; Country/region = overall and South Africa; display all 56 rows, split at 6 September. Saved full table outside the repo.
- **Play Store listings:** select acquisition metric; compare each explicit 28-day range; expand Visitors / Unique user install clicks; select Traffic source, then Search term. Preserve the metric label, URL, row count and source breakdown; the default-listing management card is not the selected report.
- **GA4 Data API:** the two inclusive named date ranges above; separate platform totals, first-user source/medium, country, appVersion, streamId and first_open reports, plus joint country/version/source. Retain request/response metadata, limits and all returned rows privately. Do not sum user breakdowns into a new denominator.
- **App Store Connect:** Analytics → Metrics, First-Time Downloads / Product Page Views (total), each explicit date range; Acquisition → Sources, First-Time Downloads; Metrics → By Territory for storefront geography. Confirm the date header after selection; the Overview page is a single-day view and was not used for period totals.
- **Google Ads API:** discover resource fields first; retrieve customer, campaign totals/months/action segments, conversion_action, campaign_criterion, ad_group, ad_group_ad, asset and user_location_view. Keep account totals separate and reconcile with the two campaigns; no campaign status, bid, budget or goal was changed.

Private evidence includes exact connector requests/responses, dated browser table captures and a calculation note. No credentials, transaction/customer identities, raw financial exports or financial forecasts are included in this public report. Existing [access](access.md) and [cohort reporting](cohort-reporting.md) instructions describe the authorised read-only retrieval path.
