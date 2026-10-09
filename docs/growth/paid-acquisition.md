# Paid acquisition pilot

Research and proposal: **9 October 2026**. Start with one South African Android campaign, judge it by confirmed new Premium buyers, and expand only when the economics work. This document proposes a budget; it does not authorize spending. Delivery work belongs under [pilot #21](https://github.com/deanvanniekerk/k53studyguide/issues/21). Use the existing [reporting contract](../analytics/README.md) and [event definitions](../analytics/events.md).

## Where to advertise

| Channel | Recommendation | Reason and limitation |
| --- | --- | --- |
| Google App campaigns, Android | First pilot; direct to Google Play | Uses Search, Play, YouTube, Discover and Display from one campaign. We cannot treat this as a keyword-only Search campaign. Android first is a budget-focus decision, not proof it has better buyers. [Google](https://support.google.com/google-ads/answer/6247380?hl=en) |
| Apple Ads search results | Second, only after account eligibility is confirmed | South Africa is a supported target market but is absent from Apple's separate advertiser-residence list. Verify the legitimate entity/account with Apple before budgeting. If eligible, use Advanced for keyword control and reporting; begin with learner-test, K53 and mock-test intent, keeping brand terms separate. [Eligibility](https://ads.apple.com/app-store/countries-and-regions), [Advanced vs Basic](https://ads.apple.com/app-store/help/apple-ads-basic/0001-compare-apple-ads-solutions) |
| Meta / Instagram | Later creative test | A plausible way to reach learners with demonstrations, but no app-specific evidence yet that it beats Google on paid buyers. Requires a separately verified purchase-attribution path. |
| TikTok | Later, after a compelling short video and viable economics | Published budget minimums are US$50 at campaign level and US$20 at ad-group level; verify the selected budget type and local billing. Splitting our small pilot would weaken learning. [TikTok](https://ads.tiktok.com/resources/help/article/budget-and-bidding-faq?category=e-commerce-101) |
| Google Search → website | Later, separate test | Useful for specific search intent, but adds website → store friction. A website store-link click is not a paid conversion. |
| RevenueCat “Ads” | Measurement/monetization, not an acquisition channel | Reports ads shown **inside our app** and the revenue they earn; also supports rewarded-ad access. It does not buy new users for us. Adding in-app ads would be a separate product decision. [RevenueCat](https://www.revenuecat.com/docs/ad-monetization), [rewards](https://www.revenuecat.com/blog/engineering/monetizing-without-a-paywall-using-ads) |

Do not allocate money to all platforms at once. Do not start with broad awareness, retargeting or a paid influencer package. Keep organic study content and legitimate driving-school referrals running alongside the pilot, with tagged links where appropriate; no outreach is authorized by this document.

## Economics before a bid

Premium is a **one-time** purchase. Do not use subscription LTV, imagined renewals or potential future ad revenue to justify today's cost. The public South African [iOS listing](https://apps.apple.com/za/app/k53-study-guide/id6784718443) currently shows R39.99; that is neither verified Android pricing nor net proceeds.

Use these inputs for the same acquisition cohort and observation window:

- `I`: attributable new installations/first opens, using one verified definition consistently; exclude redownloads where the source identifies them.
- `B`: unique new Premium buyers with a confirmed production payment. Restores, existing entitlements and repeat event deliveries do not count. Refunds reduce proceeds, not this original buyer count.
- `P`: those buyers' proceeds after store commission, taxes and refunds, less variable service costs. Reconcile RevenueCat with store reports; do not subtract fees a second time from an already-net figure.
- `S`: actual acquisition spend, including nonrecoverable ad tax/payment charges. Preserve separate reported media spend too.
- `F`: incremental creative and measurement/setup costs, including a separately stated labor allowance.

| Measure | Calculation |
| --- | --- |
| Install → buyer rate | `p = B / I` |
| Average net contribution per buyer | `N = P / B` |
| Acquisition cost per install | `CPI = S / I` |
| Cost per new buyer | `CAC = S / B` |
| Break-even CPI | `p × N` |
| Proposed target CPI / CAC | `0.70 × p × N` / `0.70 × N` |
| Net return on ad spend | `P / S`; break-even is 1.00, proposed scale target is at least 1.43 |
| Total pilot contribution | `P − S − F`; also report `(P − S − F) / (S + F)` |

The 30% acquisition margin is our proposed buffer, not an industry benchmark. Translate the all-in CPI ceiling into a lower media-only bid when nonrecoverable ad charges apply; a target CPI is an average bidding goal, not a guaranteed per-install cap. Zero denominators are unavailable, not zero-cost acquisition. Ads-platform ROAS based on gross purchase value is a different measure.

**Illustration only: assume N = R25. Replace this with verified Android proceeds before launch.**

| D30 install → buyer rate | Break-even CPI | Target CPI with buffer |
| --- | ---: | ---: |
| 2% | R0.50 | R0.35 |
| 5% | R1.25 | R0.88 |
| 10% | R2.50 | R1.75 |
| 15% | R3.75 | R2.63 |

At R2 per install, this model needs **8%** of installers to buy merely to break even, and **11.4%** to meet the proposed margin. A cheap install can still be an expensive customer. If the affordable bid cannot win useful traffic, improve the offer, conversion or price/value proposition before raising the bid.

## Minimum investment and spend control

**Smallest test I recommend: 14 acquisition days at R100 average daily media budget.** Plan for R1,400 media at nominal pacing, up to R500 incremental creative cash if needed, plus actual charges. Reuse our screenshots/artwork and edit in-house. A contractor, attribution service or engineering work requires a separate quote/effort allowance; it is not included as free labor.

**Reserve a maximum R4,000 cash envelope:** R2,800 media upper bound + up to R500 creative + R700 reserve for taxes/payment charges. This is a conservative funding proposal, not an instruction to spend the reserve. Before launch, verify charges fit the envelope and lower the media budget if they do not. Aim for the nominal spend, with alerts/review at R1,000 and R1,400.

Google's daily budget is an average: most campaigns can bill up to twice that amount in a day. With an unchanged R100 budget and exactly 14 active calendar days, the conservative media bound is therefore R2,800. Set and verify start/end dates in Africa/Johannesburg; do not extend or raise the budget without a new decision. Pause alerts are additional controls, not an instantaneous cap. Current total-budget documentation does not list App campaigns; true account budgets require monthly invoicing. [Daily limits](https://support.google.com/google-ads/answer/10486637), [total budgets](https://support.google.com/google-ads/answer/10486938), [account caps](https://support.google.com/google-ads/answer/2393037)

Google recommends daily budgets at least 50× target CPI, or 10× target CPA for in-app-action bidding, with an action completed by at least 10 different campaign users per day. R100/day accommodates a target CPI up to R2 under that guidance. The economically affordable target may be much lower. These are learning recommendations, not guaranteed delivery or a platform minimum deposit. Start install bidding only as a bounded learning test if purchase volume is sparse; purchase outcomes remain the business score. Do not optimize for `checkout_outcome`, restores or an unverified purchase event. [Google setup guidance](https://support.google.com/google-ads/answer/6167162)

No reliable current South African auction CPI or production purchase rate was established here. This budget can reveal gross problems; it cannot guarantee enough purchases to prove profitability. Approximate media needed for 30 buyers is `30 × CPI / p`: at R2 CPI that is R3,000 at 2%, R1,200 at 5%, or R600 at 10%. Buying more observations is not automatically justified when each buyer loses money.

## Creative package

**Yes: make two short demonstration concepts, not a large brand film.** Video is optional for Google App campaigns, but supplying it gives us control over the story; Google can otherwise generate videos from available assets. Use a 20-second edit in 1080×1920, 1920×1080 and 1080×1080, hosted on YouTube. These proposed exports fit supported portrait, landscape and square formats. Apple default search-result ads can use our existing listing screenshots; no video is needed to start there. [Google video formats](https://support.google.com/google-ads/answer/17091671?hl=en), [Apple variations](https://ads.apple.com/app-store/help/ads/0077-create-ad-variations)

| Timing | Concept A: understand a sign | Concept B: prepare for a mock test |
| --- | --- | --- |
| 0–3 seconds | A genuine sign question: “What does this sign mean?” | “What still needs practice?” over the real test screen |
| 3–9 seconds | Choose an answer; show the real feedback | Show the three sections and answering a question |
| 9–15 seconds | Show study progress and language choices | Show actual section results and return to study |
| 15–20 seconds | “Free study and quizzes. Download K53 Study Guide.” | “Full mock tests with one-time Premium. Start studying free.” |

Use the [approved source captures and brand](../../assets/store-refresh-2026-10/REVIEW.md), with the smiling driver as supporting artwork. Keep all app UI and signs exact. Captions must work without audio; voiceover/music is optional and needs appropriate rights. No invented testimonials, government endorsement or pass guarantee. Make free versus Premium clear. These are hypotheses to test, not proven winning ads.

Also prepare three static concepts in 1200×1200, 1200×628 and 1200×1500, with limited text and no fake interface buttons; avoid pasting store screenshot headlines across every image. Provide five standalone headlines (≤30 characters) and five descriptions (≤90). [Google asset specifications](https://support.google.com/google-ads/answer/9948381?hl=en)

Start with one campaign and one cohesive ad group, not separate campaigns for each feature/language/creative. Use English ads initially, clearly showing the four available app languages. Keep language and price unchanged during the first cohort. Asset ratings are directional because Google chooses delivery; they are not a randomized proof that one creative caused more purchases.

## Measurement and launch gates

Complete these before the acquisition clock starts:

1. Confirm the tested release and current Premium product are available to ordinary South African Android users. Verify checkout, restore and pricing; record realized proceeds and a mature organic baseline. Do not assume a submitted build is released.
2. Audit campaign goals for the correct app and billing model. Retire obsolete subscription goals from this pilot and choose **one** verified install source and **one** confirmed purchase source; avoid counting Firebase automatic IAP, custom purchase and RevenueCat-forwarded purchase as three sales. Keep diagnostic events secondary and use campaign-specific goals rather than inheriting a mixed account default. [Google conversion setup](https://support.google.com/google-ads/answer/16056245?hl=en)
3. Establish a private acquisition-to-purchase join. The current app configures RevenueCat, but source inspection found no Firebase app-instance-ID setter or Apple AdServices collection call. RevenueCat's Firebase forwarding requires `$firebaseAppInstanceId` and dashboard configuration; it supports non-subscription purchases. Decide whether that or the verified existing native/Play purchase source will supply the Ads signal, and prove matching/deduplication with a fresh test identity before enabling bidding. Receipt confirmation alone does not establish campaign attribution. [RevenueCat Firebase](https://www.revenuecat.com/docs/integrations/third-party-integrations/firebase-integration), [Google linking](https://support.google.com/analytics/answer/13823256?hl=en)
4. Keep production buyer reconciliation separate from Ads-modeled conversions. Validate currency, refunds, QA/sandbox exclusions and selected click/engaged-view/view-through windows. Report attribution coverage and unattributed buyers; do not allocate unknown purchases proportionally to a campaign. If no trustworthy cohort join exists, the paid-buyer pilot is not ready.
5. Record one test campaign identifier, creative versions, dates, selected goals, attribution windows and stop rules. Target South Africa only, using presence controls where supported; review observed geography. Link directly to the Android store. Do not inherit the old campaign's audience or primary conversions without inspection.

For a later eligible Apple pilot, add and validate AdServices attribution. RevenueCat currently warns that age/gender-targeted Apple ad groups return `attribution:false` from September 2026; account for that before choosing targeting. Verify the installed Capacitor SDK's supported path instead of copying a native Swift snippet. [RevenueCat Apple attribution](https://www.revenuecat.com/docs/integrations/attribution/apple-search-ads)

## Schedule, scorecard and decision rules

- **Preparation:** measurement repair/validation and two reusable edits. No fixed launch date until gates pass.
- **Days 1–3:** check delivery, geography, events and store/checkout health daily. Pause immediately for broken measurement, wrong destination/market or payment defects. Do not call a creative winner from a few clicks.
- **Days 4–14:** retain the same offer and budget. Review cost and engagement; avoid daily campaign rebuilds. If 200 users have completed seven full days and none has bought, pause acquisition and diagnose; this is an early warning, not a final D30 verdict.
- **After day 14:** stop acquisition as scheduled. Read cumulative D7 and D30 outcomes for each original cohort; D30 covers D0–D29, then allow three days for processing. The last cohort is ready roughly 44 days after the first acquisition date. Recheck D60/D90 only where identity and retention support it.

Use one row per platform/campaign/acquisition cohort: media spend; tax/fees; attributable new users; users completing a `v2` quiz; eligible offer viewers; checkout starters; unique confirmed new buyers; refunds; net proceeds; CPI; buyer rate; CAC; net return; total contribution; attribution coverage; maturity date. Preserve the original cohort denominator and report counts beside rates. Do not add unique users across days.

| Decision | Predefined rule |
| --- | --- |
| Stop/fix | Measurement or checkout fails; spend boundary reached; or mature D30 net return <1.00. Do not buy more losing installs to satisfy a learning recommendation. |
| Inconclusive / revise | Fewer than 30 confirmed attributed buyers, significant missing attribution, or net return between 1.00 and 1.43. Diagnose the largest loss and propose one bounded follow-up; no automatic top-up. |
| Candidate for cautious expansion | At least 30 buyers, mature D30 net return ≥1.43, and no material checkout/engagement deterioration. Check a 95% Wilson interval for the buyer rate: its lower bound × conservative N should exceed measured CPI before treating unit economics as convincingly positive. This does not cover attribution bias or prove incrementality. |
| Profitable pilot | `P − S − F > 0`, separately from recurring media economics. If setup makes the pilot negative, show how many additional buyers would recover it rather than hiding the cost. |

Example excluding ad tax/fees: R1,400 media at R2 CPI yields 700 installs. At 5% buying and R25 net each, 35 buyers return R875: CAC R40, net return 0.625, loss R525 before creative/setup. At the same spend, 56 buyers break even on media; 80 buyers return R2,000 and meet the 1.43 target. With R500 creative and no other costs, that latter pilot leaves R100. These are scenarios, not forecasts.

Even a successful attributed pilot can include people who would have installed organically. Keep brand acquisition separate where the channel permits, compare contemporaneous organic trends as context, and require a suitable holdout or incrementality test before large scaling. A before/after comparison alone is not causal evidence.
