# Store listing variant — learner's-test preparation

Prepared **7 October 2026** for [#19](https://github.com/deanvanniekerk/k53studyguide/issues/19), under [#3](https://github.com/deanvanniekerk/k53studyguide/issues/3). Status: **prepared for review, not published**. This package prepares the copy and evaluation; collecting a result starts after a separate listing publication.

## One hypothesis

Putting South African learner's-test preparation and the free/Premium access distinction at the start of the full description will attract better-matched listing traffic and set clearer expectations before installation. This is a **metadata relevance and expectation-setting hypothesis**, not a proven ranking fix. The two effects cannot be isolated within this one copy variant.

The [#18 diagnosis](../../analytics/acquisition-diagnosis.md) found listing visitors down 19%, `k53` query-associated install clicks down from 60 to 21, and visitor-to-install-click ratio up from 62.8% to 65.1%. That supports investigating discovery before a screenshot conversion experiment. It does not establish a missing keyword, a rank loss, or that the full description caused the decline. The current description already mentions K53 and learner's licences; this is a modest clarity change, not a claim that adding keywords will recover traffic.

Use a **sequential evaluation of the published metadata**. A localized Play experiment can compare description variants among listing visitors, but that does not establish a discovery/ranking effect. We will not use its conversion result to claim more people found the app. Low traffic and the absence of a randomized discovery control mean all conclusions here are directional.

## Exact assets and controls

Package: `deanvniekerk.k53studyguide.app`. Listing: default **English (United Kingdom), en-GB**. Baseline read through Google Play MCP and checked against the [public South African listing](https://play.google.com/store/apps/details?id=deanvniekerk.k53studyguide.app&hl=en_GB&gl=ZA) on 7 October.

| Field | Current / proposed action |
| --- | --- |
| Title | Keep exactly `K53 Study Guide Test SA` (23 characters) |
| Short description | Keep exactly `Study K53 rules, road signs and mock tests for South Africa's learner's licence.` (80 characters) |
| Full description | Replace only this field with [full-description-en-GB.txt](full-description-en-GB.txt), 2,413 characters excluding its final file newline |
| Phone/tablet screenshots | No replacements, captions, cropping or reorderings; preserve all Console assets in their existing device groups |
| Icon / feature graphic / video | No changes |
| Category, tags, localizations, custom listings, price, distribution | No changes |

[current-en-GB.json](current-en-GB.json) is the exact text snapshot and rollback source. The variant replaces the introduction and labels the two existing mock-test mentions as requiring Premium access. Everything from the independent-app disclaimer through the official information, website, terms, privacy and no-pass-guarantee statement remains verbatim.

The public gallery showed 14 screenshot buttons; its first image was the Study screen with “Warning signals” and topic progress. That public gallery is not a device-group asset manifest. At publication, preserve the Console's complete asset list, including groups not visible on the public web page. Existing screenshots use the older UI; replacing them with the recently redesigned app would introduce a separate treatment and requires the matching release to be live.

### Proposed opening

> Prepare for your South African learner's licence test with K53 Study Guide. Study road signs, rules of the road and vehicle controls, then check your understanding with practice quizzes.
>
> Study content and practice quizzes are free to use.
>
> Premium access is a one-time purchase that unlocks full mock tests and lets you reset your study and assessment history. There is no subscription. Mock tests show a result for each section so you can see where to focus next.

Google limits title / short / full description to 30 / 80 / 4,000 characters. Its short/promotional-description guidance restricts “free” promotional wording, so factual access terms belong in the full description for this proposal. No prices, offers, pass guarantees, official affiliation, ranking claims or keyword stuffing are added. [Field limits](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en), [listing guidance](https://support.google.com/googleplay/android-developer/answer/13393723?hl=en).

### Claim checks

| Claim | Repository evidence at starting commit `445c9d3` |
| --- | --- |
| Study content and practice quizzes are free | [Study page](../../../pkg/app/src/app/pages/study/StudyPage.tsx) and [Quiz page](../../../pkg/app/src/app/pages/quiz/QuizPage.tsx) allow those activities without a Premium entitlement |
| Mock tests require Premium access | [Test page](../../../pkg/app/src/app/pages/test/TestPage.tsx) routes non-owners to the Premium offer |
| One-time purchase, no subscription | [Glossary](../../../GLOSSARY.md), Premium access; [purchase modal](../../../pkg/app/src/app/modals/PurchaseModal.tsx) uses the one-time payment message |
| Reset study and assessment history | [Profile history](../../../pkg/app/src/app/pages/profile/components/History.tsx) gates resetting on ownership |
| Results by section | [Mock test results](../../../pkg/app/src/app/pages/test/results/TestResultPage.tsx) |

These checks substantiate the copy against the repository; they do not certify deployment. Before publishing, confirm that the live Play release still has these existing capabilities. Reuse accepted purchase QA; do not rerun the purchase matrix for a text-only listing change.

## Audience and timing

Intended audience: South African learners preparing in English on Android. The actual change affects anyone served the default en-GB listing, including fallback-language users outside South Africa. It is **not a country-targeted rollout**. Report South Africa separately; do not silently treat worldwide visitors as South African learners.

Do not overlap with the next app release, screenshot/title changes, another listing experiment, new ads or deliberate traffic campaigns. If a release is imminent, finish it first and collect a stable baseline. Capture the live release/version and listing revision at the start and end. Track unavoidable changes in ratings, reviews, Play featuring and seasonality as possible confounders.

Let **D** be the Pacific calendar date when this description is first confirmed publicly live, not the date Save or Submit is clicked. Record its UTC timestamp too.

| Window | Inclusive dates | Treatment |
| --- | --- | --- |
| Fresh baseline | D−28 through D−1 | Current text; 28 complete days |
| Settling period | D through D+6 | Exclude the publication day and next six days |
| Evaluation | D+7 through D+34 | Variant; 28 complete days, same weekday mix as baseline |
| Readout | D+38 or later | Allow at least three further complete days for reporting lag |

The settling period is a practical convention, not an indexing guarantee. If the change was visible before the recorded D, correct D and recompute windows. A gradual/uncertain rollout or another material change makes the comparison inconclusive. Use the source's displayed reporting timezone for each export, retain it, and avoid blending calendar days across sources. D and the schedule above use Play Statistics' Pacific dates; if the listing report uses a different day boundary, keep its own aligned 28-day windows and record that offset rather than joining daily rows.

The #18 windows are motivation, **not the launch baseline**. Do not backdate a result or publish immediately if there is no clean 28-day baseline. No observation dates are scheduled yet.

## Scorecard and decision rule

Primary acquisition measure: **South Africa store-listing visitors per 28-day window**, with the same listing, locale, country and source filters in both windows. Select the default en-GB listing if the reporting surface supports it; record the exact filters and any unavailable dimension before publishing. If locale cannot be isolated, label the result “South Africa, all listing languages” as a proxy, not an en-GB treatment effect. Do not swap to a better-looking denominator after seeing results.

| Measure | Purpose / denominator |
| --- | --- |
| Listing visitors | Primary discovery measure; compare identical report filters, whole-window counts |
| Unique user install clicks / listing visitors | Guardrail for intent/conversion to a click; not completed-install conversion |
| Explore and Ads/referrals visitors and clicks | Diagnose source-mix changes; Ads/referrals is not necessarily paid |
| `k53`, `k53 rsa learners license`, Other, all search terms | Secondary query-associated install clicks; preserve suppressed/missing rows and this view's own totals |
| All device acquisitions, South Africa | Separate completed-acquisition guardrail from Play Statistics; not attributable solely to the changed listing |
| Release, ratings/review themes, availability | Explain changes in quality or unexpected free/paid confusion |

Use the Play Store listings report's selected **Unique user install clicks** metric, not a legacy row label saying acquisitions. Sum daily acquisition events only for the event-count Statistics measure; never sum daily unique visitors into a whole-window unique count. Report `(variant − baseline) / baseline` for count changes (undefined if baseline is zero), and percentage-point differences for the click ratio. Do not add query rows to source rows, join Play visitors to GA4 identities, or count missing data as zero. The [metric boundaries](../../analytics/acquisition-diagnosis.md#reconciliation-boundaries) still apply.

Precommit these pragmatic rules before publication; they are operational thresholds, **not a power calculation or statistical significance test**:

- Require all 28 evaluation days and at least **300 visitors in each comparable window**. With #18's 464 worldwide visitors in 28 days, a narrower South African/language slice may not reach this floor. Insufficient volume or missing primary/guardrail data means **inconclusive**, not failure or zero.
- **Promising, directional:** visitors increase by at least 15%, the install-click ratio falls by no more than 5 percentage points, and South African device acquisitions fall by no more than 10%. Source/query breakdowns must not reveal that a new referral burst accounts for the result. Retain the variant provisionally, without claiming rank, buyer or revenue uplift.
- **Revert:** after the complete observation window, visitors fall by at least 15%, the click ratio falls by more than 5 points, or device acquisitions fall by more than 10%, provided data coverage is comparable. Revert immediately for a confirmed inaccurate claim or listing rejection; this is a correctness stop, not evidence about acquisition.
- **Otherwise:** record inconclusive and restore the baseline full description. If the wording is kept for clarity despite inconclusive acquisition results, record that as a separate editorial decision, not an experiment win. No automatic extension or repeated significance peeking.
- A release, new campaign, changed listing assets, material reporting change or clear seasonal/referral disruption invalidates the inference. Stop, record why and plan a new baseline; do not present before/after movement as causal lift. Do not reverse an unrelated safety fix merely to preserve the experiment.

Record baseline/evaluation dates, filters/timezones, visitors, install clicks, calculated ratios, device acquisitions, source/query breakdowns, release versions, exceptions and decision in a dated result linked from #19/#3. Keep raw exports and any financial/customer-level evidence private. A template for the final sentence is: “Directional [promising / adverse / inconclusive] result; visitors A→B, click ratio C→D, device acquisitions E→F; confounders: …; decision: …”. Premium purchase attribution and retained cohorts remain work for #21's measurement plan.

## Publishing and rollback handoff

1. Review and approve this exact copy package. Before changing Play, read the live en-GB fields again and compare them with `current-en-GB.json`; if they differ, refresh the baseline and review the diff instead of overwriting newer work. Capture the existing image/device-group inventory and any pending publishing changes.
2. Confirm the feature claims, stable-release/baseline conditions, actual report filters and decision thresholds above. Preserve the fresh baseline exports privately. This package does not start an experiment, publish a store change, deploy an app or authorise ad spend.
3. In Play Console → this app → Grow users → Store presence → Store listings, open the default English (United Kingdom) listing. Paste `full-description-en-GB.txt` into **Full description only**, excluding the final file newline. Verify the 2,413-character count and unchanged title, short description and graphics. Preview the paragraphs and retained links.
4. Save the listing edit. Inspect Publishing overview for unrelated pending changes before submitting the listing change for review. Respect the app's existing managed-publishing setting; do not change it. Release only the approved listing change when review is complete. Google review/propagation timing is not assumed.
5. Confirm the new introduction is visible on the public Play listing (also check the Play app on an English Android device). Capture the dated live copy and record D, the UTC timestamp and the exact reporting windows. Calendar dates start from public visibility, not PR merge.
6. At the readout, apply the precommitted decision rule and attach the result to the parent workstream. To roll back, replace **Full description only** with `fullDescription` from the baseline JSON, follow the same review/publishing steps, and verify the original opening is publicly visible again. Leave all other fields untouched.

Google documents localized description experiments as a separate option, with one-asset changes and visitor-based metrics. This package intentionally chooses sequential observation for the discovery question, accepts the weaker causal inference, and does not present it as an A/B test. [Current experiment documentation](https://support.google.com/googleplay/android-developer/answer/12053285?hl=en).
