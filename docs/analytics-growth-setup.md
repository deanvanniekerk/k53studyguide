# Analytics Growth Tracking

This repo now tracks the K53 Study Guide funnel from landing-page interest through app engagement and premium purchase. The app reports to Firebase/GA4 through `AnalyticsFirebase`; the landing site reports to GA4 through `gtag` when `VITE_GA_MEASUREMENT_ID` is configured.

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
- `study_section_complete`
  - Fires at the same meaningful visibility milestone as `study_content_view`.
  - Params: `content_key`, `content_category`.

Legacy continuity:

- `NAVIGATE` still fires from existing study/content navigation handlers.

### Quiz engagement

Tracked in quiz start, quiz session, and quiz result components.

- `quiz_start`
  - Fires when the user starts or continues a quiz.
  - Params: `quiz_mode`: `new` or `continue`.
- `quiz_answer`
  - Fires when the user selects an answer in a quiz or mock test session.
  - Params: `question_id`, `answer_id`, `question_index`.
- `quiz_complete`
  - Fires on the quiz result screen.
  - Params: `question_count`, `correct_count`, `score_percent`, `experience_gained`.

Legacy continuity:

- `START_QUIZ`, `CONTINUE_QUIZ`, and `QUIZ_RESULT` still fire with normalized scalar params.

### Mock test engagement

Tracked in test start, test session, and test result components.

- `mock_test_start`
  - Fires when the user starts or continues a mock test.
  - Params: `quiz_mode`: `new` or `continue`.
- `mock_test_complete`
  - Fires on the mock test result screen.
  - Params: `question_count`, `correct_count`, `score_percent`, `passed`, section-level correct/total/pass values.

Legacy continuity:

- `START_TEST`, `CONTINUE_TEST`, and `TEST_RESULT` still fire with normalized scalar params.

### Premium and purchase funnel

Tracked in `PurchaseModal`, `CordovaPurchaseService`, and `LocalPurchaseService`.

- `view_promotion`
  - Fires when the premium modal opens.
  - Params: `product_id`, `price`, `currency`, `item_id`, `item_name`, `offer_surface`.
- `select_promotion`
  - Fires when the user taps the premium CTA.
  - Params: `product_id`, `price`, `currency`, `item_id`, `item_name`, `offer_surface`, `cta_location`.
- `begin_checkout`
  - Fires before `store.order(...)` starts.
  - Params: `product_id`, `price`, `currency`, `value`, `item_id`, `item_name`.
- `purchase_pending`
  - Fires when the purchase plugin reports pending.
  - Params include `purchase_state`.
- `purchase_cancel`
  - Fires when the purchase plugin returns `PAYMENT_CANCELLED`.
  - Params include `purchase_state`.
- `purchase_error`
  - Fires for non-cancel purchase errors.
  - Params include `purchase_state`.
- `purchase`
  - Fires when the purchase plugin reports `finished`.
  - Params include `purchase_state`.

Legacy continuity:

- `PRESENT_OFFER` still fires when the premium modal opens.

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

Tracked in `pkg/lander/index.html`.

- `landing_page_view`
  - Fires once on page load when `VITE_GA_MEASUREMENT_ID` is present.
  - Params: `page_location`, `page_title`.
- `select_store_cta`
  - Fires when any Google Play CTA is clicked.
  - Params: `cta_location`, `store_platform`.
- `play_store_referral_click`
  - Fires with the same click as `select_store_cta`.
  - Params: `cta_location`, `store_platform`.
- `ios_interest`
  - Fires when an App Store coming-soon CTA is clicked.
  - Params: `cta_location`, `store_platform`.

Existing Play Store `referrer=utm_source...` URLs are preserved.

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

The lander deploy script sources `.dev.env`, then runs the Vite build, so `pnpm deploy:lander` injects the Measurement ID into the production HTML.

## GA4 Admin Configuration

Create these event-scoped custom dimensions:

- `screen_name`
- `cta_location`
- `offer_surface`
- `product_id`
- `premium_status`
- `quiz_mode`
- `passed`
- `language`
- `theme`
- `content_key`
- `content_category`
- `history_type`
- `purchase_state`
- `store_platform`

Create these custom metrics if numeric aggregation is needed:

- `score_percent`
- `question_count`
- `correct_count`
- `experience_gained`
- `value`

Mark these events as key events:

- `purchase`
- `begin_checkout`
- `select_promotion`
- `mock_test_start`
- `mock_test_complete`
- `quiz_complete`
- `select_store_cta`

## Useful GA Explorations

- Website CTA click to first app open.
- First app open to quiz completion.
- Quiz completion to premium offer view.
- Offer view to checkout start.
- Checkout start to purchase, cancel, or error.
- Free vs premium engagement and retention.

Add a GA annotation for each release that changes analytics, purchase UX, pricing, or landing-page CTA placement.
