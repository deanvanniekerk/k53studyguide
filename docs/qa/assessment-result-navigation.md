# Assessment result tab return — 8 October 2026

## Report and cause

After completing a practice quiz, visiting Study or Test and returning to Quiz showed the quiz header/background with no score or answers. Reproduced in the web app at an iPhone-size viewport, matching the supplied iPhone report.

Both result pages called `recieveQuestionAnswers([])` in `useIonViewWillLeave`. Ionic retains each tab's route and cached page. A tab switch therefore cleared the session, and returning reopened the result route with an empty answer list. The mock-test page had the same lifecycle/data-loss problem.

## Reproduction and regression

`pnpm --filter app test src/app/pages/assessmentResultNavigation.test.jsx`

Before the fix, the minimal completed one-question quiz lost its score and answers on a leave/enter cycle. Repeated runs failed deterministically. The expanded retained-page/router integration suite failed all eight checks before the fix and passes afterward. The seam uses the real result pages, headers, Redux reducers and submit operations, while modelling Ionic's cached-page lifecycle; native animation/layout is verified separately in the browser.

Ranked hypotheses were destructive page-leave cleanup, an invalid cached route, and hidden content from scroll/animation state. The first was confirmed: page-leave removed the result data. Removing that side effect preserves the rendered result on return. The blank-route fallback addresses already empty routes without redirecting from hidden cached pages.

## Change

- Retain quiz and mock-test results across tab switches.
- Clear the result session when its explicit Back button returns to the start page.
- On entering an empty result route, replace it with the appropriate start route. Run this on Ionic view entry so a cached hidden page cannot redirect another tab.
- Treat submitted sessions as completed, not resumable, so returning to an assessment's root can start a fresh attempt rather than resume the retained answers.
- Increment Android versionCode and iOS build number to 41; marketing version remains 1.40.

## Verification

- All **247 tests passed**: app 217, lander 12, translator 18.
- `pnpm lint` passed, including app/lander TypeScript and Biome.
- `pnpm build` passed. Vite reports the existing large application-chunk warning.
- Browser: complete a quiz → Study → Quiz: score and answer review remain visible.
- Browser: completed quiz → Test → Quiz: score and answer review remain visible.
- Browser: Back from quiz results → Study → Quiz: Start Quiz appears.
- Browser: direct empty `/quiz/results` and `/test/results` recover to their start pages.
- Browser: completed 64-question mock test, select section C → Study → Test: section scores and answers remain visible.
- Eight integration regressions cover tab return, explicit exit, stale/empty result routes, and clearing a hidden cached page, for both assessment types. Selector regressions distinguish retained completion from an in-progress attempt.

The before/after browser images are local-only under `.codex-screenshots/quiz-return/` and excluded from the commit. The temporary reproduction entry point was removed. No production state, purchase or store listing was changed. Native-device verification remains for the user's rebuilt Azure/TestFlight package; the browser checks do not claim an installed iPhone test.

## Release handoff

Build **1.40 (41)** from the committed fix. On iPhone, repeat the original sequence in light and dark mode, then use Back and start another quiz. Repeat for a Premium mock test. The approved storefront package is in `assets/store-refresh-2026-10/`; its release notes include this fix. App Store Connect's earlier 1.3 draft must be reconciled with the intended release version before submission.
