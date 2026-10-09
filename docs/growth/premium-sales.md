# Premium sales plan

## Product and objective

Increase **confirmed new Premium buyers and net proceeds**, with useful free study and reliable paid access as guardrails. Premium is a one-time unlock for mock tests and history reset. Study material, progress tracking and practice quizzes remain free. Use the store's localized price; browser/Test Store prices are fixtures.

The core journey is: discover the app → use free study or quizzes → see a relevant Premium invitation → open the offer → attempt checkout → receive access. Store-confirmed transactions establish sales; client events explain the experience around them.

## Work in this order

1. **Establish the released baseline.** Confirm 1.40 availability separately on Android and iOS. Validate received events, usable reporting dimensions and exclusion of internal/sandbox traffic on the released build. Record rollout and website deployment dates separately.
2. **Make sales reporting trustworthy.** Reconcile RevenueCat transactions to store reports, separating production, sandbox, restores and refunds. Establish confirmed buyers and net proceeds. Until a buyer-to-analytics identity join is verified, report sales beside the funnel; do not manufacture an offer-to-paid conversion rate.
3. **Find the largest actionable loss.** Compare invitation reach, offer reach, eligible checkout starts, unresolved attempts and failures by platform/version and `offer_origin`. Diagnose availability or payment defects before changing persuasion or bringing in more traffic.
4. **Run one focused conversion experiment.** Choose its primary measure, denominator, audience, duration, guardrails and decision rule before starting. Keep the original available for comparison. Report counts and uncertainty; extend observation when sales are too sparse for a useful conclusion.
5. **Prepare acquisition only after measurement works.** Use [pilot #21](https://github.com/deanvanniekerk/k53studyguide/issues/21) under [growth #3](https://github.com/deanvanniekerk/k53studyguide/issues/3) for a bounded South African Android campaign. No campaign or spend is authorized by this plan.

## Weekly scorecard

Review a complete seven-day window, with a 28-day view for low-volume outcomes. Use the same weekdays and explicit source timezones; leave a processing buffer and label incomplete data. Keep Android and iOS separate, and identify app version, geography and source mix.

| Question | Measure | Decision it supports |
| --- | --- | --- |
| Are qualified learners finding us? | Store visitors, install clicks and completed acquisitions/downloads as separate series; South Africa/source breakdown | Discovery and listing work |
| Do learners use the free product? | Measured new users; users submitting `v2` quizzes; return activity | Value before purchase and engagement guardrails |
| Are invitations reaching learners? | Unique invitation viewers and taps, by origin | Placement and visibility |
| Is the offer understandable and usable? | Eligible offer viewers, checkout starters, offer closes and initialization failures | Benefit copy versus availability problems |
| Where does checkout stop? | Started attempts and cancel/pending/error/access outcomes, including unresolved attempts | Reliability and payment friction |
| Are we generating revenue? | Deduplicated production buyers, transactions, refunds and net proceeds by store/currency | Commercial outcome |

Use the [reporting definitions](../analytics/README.md) before calculating rates. A scorecard should include the observation window, coverage limits, one interpretation and the next decision. Missing coverage is “unavailable,” not zero.

## Experiment priorities

Select from these only after reading the baseline; these are hypotheses, not demonstrated improvements.

| Signal | Candidate test | Guardrail |
| --- | --- | --- |
| Low invitation reach among engaged free learners | Placement/timing on Quiz results or Quiz home | Quiz completion and return study use |
| Strong reach but few eligible checkout starts | Clearer mock-test benefit and one-time purchase wording | Offer closes and cancellation rate |
| Unavailable offers or checkout errors | Fix the specific initialization/store failure | Paid access, restore and retry remain reliable |
| Stable app conversion but weak discovery | One store creative or metadata treatment | Completed acquisitions, not just listing clicks |

Do not add forced purchase popups, obscure restore, or imply a guaranteed official test pass. Keep free-versus-Premium wording consistent across app, website and stores. Review the website's benefit claims against the approved copy before increasing traffic.

The 1.40 refresh changes app behavior, copy and multiple assets together. Treat it as a combined release baseline, not an isolated screenshot or title experiment. The approved [storefront package](../../assets/store-refresh-2026-10/REVIEW.md) is the creative source; do not revive the superseded copy-only proposal.

## Paid acquisition decision

Use the [paid acquisition pilot](paid-acquisition.md) for the current channel research, proposed minimum budget, creative brief and stop/expand rules.

The earlier diagnosis found fewer Android listing visitors while the visitor-to-install-click ratio improved. Historical Ads “conversions” counted downloads, not Premium buyers. Neither observation establishes profitable acquisition. Keep older-version international traffic separate until its provenance is understood; do not label it fraud.

Before asking for a pilot budget, document audience, creative, destination, attribution, daily/total caps, duration and stop/expand rules. Use verified net proceeds per new buyer and explicitly labeled install-to-buyer scenarios to calculate a break-even CPI ceiling; allow a margin below it. Historical install costs are not a forecast.

Assess mature 7/30/60/90-day acquired cohorts only where inputs and joins exist. Keep spend and net contribution in private reports. Activate only after an explicit budget decision and confirmation that the tested release and production measurement are available to the campaign audience.

## Organic search and website discovery

Use the canonical website URL, `https://www.k53studyguide.online/`, in owned profiles and future store edits. The app listings already link to this domain; the public repository’s About website and README also link to it. Store URLs without `www` currently rely on the site’s canonical tag. Keep the brand name “K53 Study Guide” consistent across titles, visible copy and `WebSite` metadata.

The public [road-sign guide](https://www.k53studyguide.online/k53-road-signs.html), [vehicle-control guide](https://www.k53studyguide.online/vehicle-controls.html) and [practice questions](https://www.k53studyguide.online/k53-practice-questions.html) are useful entry points and resources that driving schools can reference. Improve these when learner questions reveal gaps; do not create thin keyword variants or buy links. Future partner outreach needs a specific recipient and message approved separately.

During the weekly scorecard review:

- Open the [South Africa exact-brand comparison](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Ak53studyguide.online&country=zaf&compare_query=!k53%20study%20guide&query=!k53studyguide). Track `k53studyguide` and `k53 study guide` separately: clicks, impressions, CTR and position. Use 28 complete days, compare the preceding period and record the actual date range. Sparse or withheld query data is not proof of no searches; position is unavailable when there are no reported impressions.
- Remove the query comparison to assess non-brand discovery and each guide’s search landing traffic. Keep South Africa selected. Check Pages and the sitemap when a new guide is published, rather than repeatedly requesting the same URL.
- In one website collector, segment organic-search landing sessions by landing page and compare `select_store_cta` by `cta_location` and `store_platform`. Exclude QA. Use the same cohort for any session-to-referral rate; event count divided by visitors is not that rate. Keep referral clicks, store downloads and confirmed Premium purchases as separate measures until attribution joins are verified.

Give Google time to recrawl and collect enough observations before judging the change. Structured data, sitemap submission and a unique domain name do not guarantee indexing or a top position. Keep private performance exports outside this public repository.
