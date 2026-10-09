# Storefront release refresh

Prepared 8 October 2026. **Plan approved; local production completed. No store changes saved or published.** See [REVIEW.md](REVIEW.md) for the delivered package and changes from this initial plan.

## Outcome

Create one coherent, reviewable storefront package for the new Android and iOS release: refreshed metadata, benefit-led screenshots with authentic app captures, a Google Play feature graphic, and an Apple product-page header. Keep all work in this directory. Present the plan before asset production, as requested.

The marketing promise is **“Prepare for your learner’s licence with confidence.”** The supporting story is **study → practise → check your progress**. Each image must demonstrate a useful part of that story.

## What the initial review found

Inspected the signed-in Google Play Console and App Store Connect in Safari on 8 October. These are account-specific observations, not assumptions from old size guides.

| Area | Observed state | Proposed response |
| --- | --- | --- |
| Play default listing | English (United Kingdom); title `K53 Study Guide Test SA`; short description at 80/80 characters; full description 2,053/4,000 | Review all three fields; make the opening and feature benefits clearer |
| Play artwork | One icon, one feature graphic, eight phone screenshots, six 7-inch tablet screenshots, no 10-inch tablet screenshots; video field empty | Replace feature graphic and screenshot sets; add genuine 10-inch tablet coverage |
| Apple release | Version 1.3 is Prepare for Submission; 1.2 Ready for Distribution; no build selected in 1.3 at inspection | Prepare assets independently, then reconcile against the actual release build |
| Apple metadata | `K53 Study Guide`; subtitle `K53 Learner's Licence Tests.`; UK English; promotional text and What's New empty; description 2,053 characters; keywords have 3 characters remaining | Review name, subtitle, keywords, promo text, description and release notes as a coordinated package |
| Apple screenshots | Default iPhone slot is now “Dynamic Island (medium display)”; inherited images shown; iPad 13-inch has nine screenshots | Supply current, deliberately sequenced phone and tablet sets |
| Apple landscape artwork | Header and Search Results tab is available; header empty; accepts 3,840 × 1,646 or 5,244 × 2,950 | Produce a dedicated header and an optional search-results asset |
| Existing creative | Repository feature graphic says “K53 Questions” with neon road imagery; existing screenshots are mostly uncaptioned and repeat light/dark views | Broaden the benefit story; reserve one deliberate slide for appearance choice |
| Existing growth work | Issue #19 proposed a separate, unpublished copy-only evaluation (superseded by this refresh) | Preserve it as historical work; this multi-asset release refresh cannot be evaluated as that isolated copy treatment |

Source checkout at planning time: `390d468`. The successful Azure build was later confirmed to match this commit. Fresh release-source web captures are now included in the review package.

## Marketing strategy

### Audience and discovery

Address South African learners who want a practical way to prepare for the learner’s licence test, including first-time learners and people returning to preparation. Use recognisable intent terms naturally: K53, learner’s licence, South Africa, road signs, rules of the road, practice questions and mock tests.

Preserve K53 Study Guide as the recognisable brand. Evaluate a clearer search-facing title and subtitle without keyword stuffing or claiming a ranking benefit. Apple’s name, subtitle and keyword field need distinct roles; Google’s short description needs to communicate the core value in one readable sentence.

English (UK) is the observed default storefront language. Proposed first package: English copy and captions, with a screenshot showing the app’s four languages. English-first production proceeded after approval; no additional localized storefronts were requested. If requested, check each store’s supported listing locales before producing translations; app language support and storefront locale support are different.

### Conversion

Make the first three images useful on their own: study progress, randomized practice, and structured mock tests. The visitor should understand what the app does without opening the full description. Follow with proof of useful content, results, language choice and display choice.

Use short benefit headlines, a single supporting line where necessary, and one dominant authentic screen per image. Screens should occupy approximately 70–80% of portrait artwork height where legibility allows. Assess at a small store-card size as well as full resolution. Final proportions will follow real screen captures, not a fixed layout that forces illegible UI.

Be explicit that mock tests require Premium. Put the factual free/Premium breakdown in full descriptions: study material and quizzes are free; Premium is a one-time purchase for mock tests and history reset. Avoid prices in artwork, pass guarantees, invented success rates, claims of official endorsement or “actual exam questions.”

### Measurement after an approved launch

Record publication dates, release versions and the final asset revision. Compare discovery (impressions/listing visitors) separately from listing conversion and completed acquisitions. Review activation and completed study/quiz activity where the existing analytics supports it. Keep Apple and Google definitions and reporting windows separate.

Use comparable 28-day windows and report the release plus listing changes as one combined intervention. Do not attribute any movement specifically to the artwork or keywords. Once the release is stable, propose one screenshot-order or first-image experiment at a time, subject to enough traffic. No experiment, advertising spend or recurring monitor is started by this plan.

## Creative direction

**Confident, colourful learning.** Use the existing app palette and type direction: Plus Jakarta Sans, purple `#4a3fb8`, blue `#2e7bd6`, teal `#2bb5a8`, warm off-white `#fafaf7`, and selective coral/gold accents from the quiz and progress UI.

Use a consistent headline treatment, generous margins, recurring placement of the screen, and restrained road/journey illustration in the surrounding artwork. The same visual language should connect the landscape graphics and all seven screenshot stories. Avoid complicated neon scenes, confetti over the UI, and decorative signs that could be confused with study content. The user subsequently requested keeping the smiling illustrated lady in the car; all accepted landscape graphics follow that preference.

Keep the existing app icon as the identity reference. Inspect its store/build consistency and prepare correctly sized exports if needed; a new icon design is not assumed for this release while builds are underway.

## Exact planned asset package

These are chosen output targets within the live console's displayed requirements. They are not claims that every listed asset is mandatory.

| Deliverable | Final size | Count | Purpose |
| --- | --- | --- | --- |
| Play feature graphic | 1,024 × 500 | 1 | Required landscape placement; PNG/JPEG, ≤15 MB in Console |
| Apple product-page header | 3,840 × 1,646 | 1 | Available landscape header; dedicated composition |
| Apple search-results creative | 3,840 × 2,560 | 1 optional proposal | Available discovery placement; review against screenshot-led search presentation |
| Android phone screenshots | 1,080 × 1,920 | 7 | 9:16 portrait; Console allows 2–8, ≤8 MB each |
| Android 7-inch tablet screenshots | 1,440 × 2,560 | 7 | 9:16 artwork around real 7-inch layout captures |
| Android 10-inch tablet screenshots | 1,800 × 3,200 | 7 | 9:16 artwork around real 10-inch layout captures |
| iPhone screenshots | 1,206 × 2,622 | 7 | Current Dynamic Island medium slot; up to 10 |
| iPad screenshots | 2,064 × 2,752 | 7 | Current 13-inch slot; up to 10 |

Initial core target: **35 screenshot exports + 2 landscape graphics**, plus one optional Apple search creative. The final Media Manager audit found an explicit older iPhone Face ID large set, so the completed package adds seven 1,284 × 2,778 exports: **42 screenshots + 3 landscapes**. All final raster uploads will be opaque RGB with no alpha channel. Other phone sizes use store scaling where supported; inspect the full Media Manager before handoff to ensure explicit older sets cannot leave stale artwork visible. Extra device tabs alone do not establish that a Watch, XR, desktop or foldable-specific set is required for this app.

The 5,244 × 2,950 Apple universal asset is an alternative, not an additional required export. Dedicated header/search compositions make crop control simpler and avoid relying on one image for dissimilar slots.

## Screenshot storyboard

Draft captions below establish the story; final wording is reviewed together with the captured screens.

| Order | Draft headline | Feature and exact capture intent | Acceptance criterion |
| --- | --- | --- | --- |
| 1 | **Your learner’s journey starts here** | Study dashboard with visible topic names, believable partial progress, and a Continue action | Clearly demonstrates both the study content and progress tracking; no empty onboarding screen |
| 2 | **Make every practice session count** | An active quiz with a clear road-sign question and readable answer choices; supporting caption explains randomized practice | Genuine quiz question, correct sign and answer labels; no invented instant feedback or promise of never repeating questions |
| 3 | **Get familiar with the test format** | Active mock test showing section navigation and question progress; visible `Premium feature` caption | Demonstrates actual section structure; no fabricated timer or official-test branding |
| 4 | **Learn the signs. Understand the rules.** | A well-composed study content screen with recognisable road-sign artwork and readable explanation | Real content; no partially loaded images or essential text hidden by the caption |
| 5 | **See where to focus next** | Completed mock-test results with section-level results; visible `Premium feature` caption | Results internally consistent with the captured session; no implication that a practice result guarantees a licence |
| 6 | **Study in your language** | Language picker and a genuine localized study view, using two clearly separated captures if necessary | English, Afrikaans, isiZulu and isiXhosa spelled correctly; actual in-app translated content is readable |
| 7 | **Make study time feel right** | The same useful content in light and dark mode, paired in a deliberate comparison | Both real captures, identical content and scale, adequate contrast; no fake split-theme app state |

The two extra stories beyond the requested five feature areas give content depth and useful results their own space. Seven images fit both stores without filling slots with repetitive screenshots.

## Capture and ImageGen workflow

1. Confirm the Azure release commit/version before claiming release fidelity. Start with the matching local web app in the internal browser. Keep debug UI out of captures and use isolated, reproducible demonstration progress. Realize states through the app or an existing local test facility; never alter production accounts or make a real purchase for screenshots.
2. Inspect each candidate screen visually before capture. Select short, clear questions and content that make good use of the available space. Record route, language, theme, progress/session state, CSS viewport, raster render scale and resulting pixel dimensions in a capture manifest.
3. Capture the actual Ionic platform mode for each family. Initial phone targets: Android 360 × 640 CSS pixels at render scale 3; iPhone 402 × 874 at render scale 3. Initial iPad target: 1,032 × 1,376 at render scale 2. Choose true tablet-width Android viewports for the 7-inch and 10-inch captures; record the exact resulting pixels separately from the final 9:16 marketing canvas. Verify responsive layouts and browser capture capability before producing the whole set.
4. Preserve original full-resolution source captures. A screenshot panel can be uniformly reduced inside the marketing artwork, but its content and aspect ratio must remain intact. Do not stretch a phone screen into a tablet format, enlarge desktop UI to simulate a phone, or invent OS chrome. Compare web platform appearance with the release app when the native builds are ready.
5. Produce one representative feature graphic and one study screenshot treatment with ImageGen first. Supply the real screenshot, existing brand reference and exact headline. Define the screenshot as protected content; ask for colour, illustration and text in the surrounding marketing area only. Critique this small set before expanding the direction across all features.
6. Use the accepted treatment as the reference for subsequent ImageGen work. Give each request explicit text, placement, palette, safe margins and protected UI constraints. Generate separately for dissimilar aspect ratios rather than stretching a finished image.
7. Compare every generated image against its original capture. Reject changed words, invented controls, incorrect road signs, warped geometry, lost detail, mismatched fonts or inconsistent colours. Generated text must match the approved caption exactly. Rework failures; do not accept “close enough” app content. If ImageGen cannot preserve a dense screen reliably, retain the authentic source and revise the production method before marking that asset ready.
8. Validate pixel size, format, file size, opacity, caption spelling, small-preview readability and cross-set consistency. Keep rejected artwork separate from final exports. Record any exact-size finishing operations; a prompt asking for dimensions is not proof of the output dimensions.

## Copy deliverables

Prepare paste-ready text files plus a single Markdown review document showing the proposed copy, character counts, captions and embedded final graphics.

| Store | Fields to review and deliver |
| --- | --- |
| Google Play | App name (30), short description (80), full description (4,000), screenshot captions and alt text; draft release notes checked against actual release changes |
| Apple | App name (30), subtitle (30), promotional text (170), description (4,000), keywords (100), What's New (4,000), screenshot captions; check support/marketing URLs |

Review the existing government-independence statement, official information links, privacy/terms links and practice-test disclaimer for accuracy and retain their substance. Describe the app’s implemented mock-test structure without claiming identical official papers or timing. Check the release changes before calling features “new.”

Source checks already made: released locales are `en`, `af`, `zu`, `xh`; quiz generation uses a shuffle; mock generation selects up to 8/28/28 questions across its three sections; results are assessed per section; mock access is gated on ownership. These confirm implementation intent, not native release QA or every jurisdiction's official test details.

## Local handoff structure

```text
assets/store-refresh-2026-10/
  PLAN.md                    # This plan
  README.md                  # Package status and navigation
  REVIEW.md                  # Final copy + embedded artwork, created during production
  copy/google-play/          # Paste-ready metadata and captions
  copy/apple/                # Paste-ready metadata and captions
  source-captures/           # Authentic browser captures by device family
  concepts/                  # First treatments and revision history
  final/google-play/         # Feature graphic + phone/tablet sets
  final/apple/               # Header + iPhone/iPad sets + optional search creative
  qa/                        # Capture manifest, asset checks, contact sheets, critique
```

Store only public-facing app content and creative work here. Keep console account details, private analytics exports, credentials, builds and unrelated screenshots out of the package. Existing assets are retained as rollback material; nothing is committed or pushed by this planning step.

## Review checkpoints

1. **Plan review (approved):** positioning, screenshot sequence, device coverage and language scope.
2. **Creative pilot:** inspect the first screenshot treatment and landscape graphic before multiplying the work; user can steer the visual direction here.
3. **Full local package:** review all copy, asset contact sheets and exact final exports, with source comparisons and outstanding native-build checks clearly listed.
4. **Publication:** only after explicit user go-ahead for the reviewed package. Recheck live fields and pending changes before any later upload or update. The current request authorizes local preparation only.

## References

- [Google Play preview assets](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- [Apple screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/)
- [Apple creative asset specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/creative-assets-specifications/)
- [Apple asset guidance](https://developer.apple.com/app-store/asset-best-practices/)
- [Previous copy-only proposal (historical)](https://github.com/deanvanniekerk/k53studyguide/blob/fd7ed33319c67201c1183058cc97efecb1939582/docs/growth/store-listing-19/README.md)
- [App design tokens](../../pkg/app/src/theme/variables.css)
- [Released languages](../../pkg/shared/src/data/locales.ts)

Requirements were cross-checked with the live consoles. Recheck at export/upload time if the stores change their accepted slots.
