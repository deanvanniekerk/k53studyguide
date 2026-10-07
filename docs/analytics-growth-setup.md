# Analytics Growth Tracking

This repo now tracks the K53 Study Guide funnel from landing-page interest through app engagement and premium purchase. The app reports to Firebase/GA4 through `AnalyticsFirebase`; the landing site reports to GA4 through `gtag` when `VITE_GA_MEASUREMENT_ID` is configured, and to PostHog through `posthog` (see [Landing page acquisition](#landing-page-acquisition)).

The active app GA4 property is `properties/269952161` (`k53-study-guide`). The landing page uses the web stream Measurement ID from `.dev.env`.

## What Is Implemented

### Shared app analytics layer

App analytics are centralized in `pkg/app/src/services/analytics/index.ts`.

The adapter:

- Defines typed canonical GA4-style event names.
- Normalizes event params to scalar values so GA4 can report on them.
- Wraps `AnalyticsFirebase.logEvent` and `AnalyticsFirebase.setCurrentScreen`.
- Sets user properties when the native plugin exposes `setUserProperty`.
- Keeps legacy uppercase events available while new reports use canonical lower snake case events.

### App lifecycle and user context

Tracked in `pkg/app/src/app/Startup.tsx` and `pkg/app/src/app/Router.tsx`.

- `app_open`
  - Fires when the app startup effect runs.
  - Params: `language`, `theme`, `premium_status`.
- Firebase `screen_view`
  - Driven centrally by `analytics.setCurrentScreen(...)` on route changes.
  - Screen names include `StudyPage`, `ContentPage`, `QuizPage`, `QuizPage:TestPage`, `QuizPage:TestResultPage`, `TestPage`, `TestPage:TestPage`, `TestPage:TestResultPage`, and `ProfilePage`.
- User properties:
  - `language`
  - `theme`
  - `premium_status`: `free` or `premium`

### Study and onboarding

Tracked in study/content pages.

- `onboarding_info_view`
  - Fires when study, quiz, or test info modals are opened.
  - Params: `screen_name`.
- `study_content_view`
  - Fires once per content card when it becomes visible.
  - Params: `content_key`, `content_category`.
- `study_section_complete` is retired; visibility is not demonstrated learning completion.

Legacy continuity:

- `NAVIGATE` still fires from existing study/content navigation handlers.

### Quiz engagement

Tracked in quiz start/session components and the guarded submission operation.

- `quiz_start`
  - Fires when the user starts or continues a quiz.
  - Params: `quiz_mode`: `new` or `continue`.
- `quiz_answer`
  - Fires when the user selects an answer in a quiz or mock test session.
  - Params: `question_id`, `answer_id`, `question_index`.
- `quiz_complete` (submission only, `analytics_schema_version = "v2"`)
  - Fires once when a non-empty, fully answered practice quiz is submitted.
  - Params: `question_count`, `correct_count`, `score_percent`, `experience_gained`.

Legacy continuity:

- `START_QUIZ` and `CONTINUE_QUIZ` still fire. `QUIZ_RESULT` is retired; do not add historical result views to canonical completion counts.

### Mock test engagement

Tracked in test start/session components and the guarded submission operation.

- `mock_test_start`
  - Fires when the user starts or continues a mock test.
  - Params: `quiz_mode`: `new` or `continue`.
- `mock_test_complete` (submission only, `analytics_schema_version = "v2"`)
  - Fires once when a non-empty, fully answered mock test is submitted.
  - Params: `question_count`, `correct_count`, `score_percent`, `passed`, section-level correct/total/pass values.

Legacy continuity:

- `START_TEST` and `CONTINUE_TEST` still fire. `TEST_RESULT` is retired; do not add historical result views to canonical completion counts.

### Premium and purchase funnel

Tracked in `PurchaseModal`, `RevenueCatPurchaseService`, and `LocalPurchaseService`. The authoritative [premium journey contract](analytics/purchase-measurement.md) defines exact payloads, lifecycle boundaries, environment labels and reconciliation requirements.

- `purchase_initialization_error` records setup/load failures even when premium controls are disabled; it is not an offer or checkout.
- `view_promotion` records one still-open offer after initialization settles, with origin, availability, eligibility and available local price/currency.
- `select_promotion` records Get Premium; `begin_checkout` records the app invoking checkout with a loaded product.
- `purchase_cancel`, `purchase_pending`, `purchase_error`, and `purchase_unavailable` distinguish action/SDK outcomes. Pending means a deferred store payment, not an open sheet.
- `checkout_outcome` records active premium access returned by the SDK. Existing access can satisfy it, so it is not a sale counter.
- `restore_start` and `restore_outcome` describe recovery of existing access and never add a sale.

`PRESENT_OFFER` and client `purchase` emission are retired. Checkout/restore actions and their outcomes share a random attempt ID; initialization failures have no attempt ID. Use reconciled RevenueCat/store transactions for confirmed revenue and keep historical client events separate. Local simulations and sandbox activity must be excluded from production reporting according to the contract.

### Profile actions

Tracked in profile components.

- `history_clear`
  - Fires when premium users clear study, quiz, or test history.
  - Params: `history_type`: `seen`, `quiz`, or `test`.
- `rate_app_tap`
  - Fires when the user taps the profile rate-app CTA.
  - Params: `cta_location`.

Legacy continuity:

- `CLEAR_HISTORY` and `RATE_APP` still fire.

### Landing page acquisition

Tracked in `pkg/lander/index.html` and the interactive demo. The authoritative [website referral contract](analytics/website-referrals.md) lists all 11 placement/platform pairs, collection guards, exclusions and delivery checks.

`select_store_cta` is the canonical click event for both Google Play and App Store, with `cta_location` and `store_platform`. Platform-specific referral events overlap with that event and must not be added to it. A click is not an install. Existing store destinations and new-tab behavior are preserved.

GA4 and PostHog initialize only on the exact production apex/www hosts. Custom events include `analytics_environment` and `analytics_test`; QA visits must be excluded from production analysis. `landing_page_view` overlaps automatic page views: choose one documented page-view denominator.

### PostHog (landing page)

PostHog is initialised in `pkg/lander/index.html`. The `phc_` project token is a
public client-side key defaulted in the HTML; override it per environment with
`VITE_POSTHOG_KEY` / `VITE_POSTHOG_HOST`. `api_host` defaults to the managed
reverse proxy `https://v.vanniekerk.online` (ingestion + `/static` assets), and
`ui_host` is set to `https://us.posthog.com` so dashboard links resolve correctly.

The shared `trackAnalyticsEvent` helpers in `index.html` and
`src/quiz-demo/QuizDemoDialog.tsx` forward **every** event above to both GA4
(`window.gtag`) and PostHog (`window.posthog.capture`) with identical names and
params, so no separate event wiring is needed. PostHog additionally captures
`$pageview`, `$pageleave`, and autocaptured clicks out of the box.

Key lander interactions that reach PostHog this way:

- "Test drive it now" CTA → `quiz_demo_open` (param `cta_location`:
  `hero_try_it_now`, `premium_try_it_now`).
- Quiz engagement inside the demo → `quiz_demo_start`, `quiz_demo_answer`,
  `quiz_demo_complete` (with `question_count`, `correct_count`,
  `experience_gained`), plus `quiz_demo_continue`, `quiz_demo_section_select`,
  `quiz_demo_tab_select`, `quiz_demo_locked_tab`, and `quiz_demo_theme_toggle`.
- Store referral → canonical `select_store_cta`; platform-specific referral events are overlapping observations, not additional conversions.

## GA Measurement ID Reference

The web Measurement ID is only needed for the landing site. It looks like `G-XXXXXXXXXX`.

To find it later:

1. Open [Google Analytics](https://analytics.google.com/).
2. Select the `K53 Study Guide` account/property.
3. Open **Admin**.
4. Under **Data collection and modification**, open **Data streams**.
5. Click the landing-site **Web** stream.
6. Copy the **Measurement ID**.
7. Put it in `.dev.env`:

```bash
VITE_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

`.dev.env` is ignored by git. Keep `.dev.env.example` committed with an empty placeholder only.

The lander deploy script sources `.dev.env`, then runs the Vite build, so `pnpm lander:deploy` injects the Measurement ID into the production HTML.

## GA4 reporting configuration

Use the verified [dimension ledger and reporting recipes](analytics/cohort-reporting.md) as the authority for scopes, registration dates, processing availability, retention and exclusions. Do not independently register the older broad dimension list from historical versions of this document. In particular, `premium_status` is user-scoped and assessment schema uses the string `v2`.

The reporting contract separates offer reach, sequential conversion, attempt outcomes, confirmed transactions and acquired-cohort retention. Aggregate event counts cannot prove a sequential funnel, and website clicks cannot be joined to app installs without verified attribution. The live configuration and processing/reconciliation gates are recorded there; this overview does not assert that all production measurement gates have passed.

Assessment semantics and per-platform release cutover: [study visibility and assessment completion](analytics/assessment-completion.md).
