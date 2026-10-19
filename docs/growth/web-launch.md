# Free web launch

All scope questions and release gates were agreed during the 19 October 2026 design interview, and the owner confirmed the consolidated scope, testing boundaries and ticket breakdown. The [spec (#48)](https://github.com/deanvanniekerk/k53studyguide/issues/48) and seven sub-issues (#49–#55) are published with native GitHub blocking dependencies; the sub-issues carry the implementation notes, tests and owner steps for each slice. Implementation has not started. Production launch requires review of a working preview.

## Objective

Prioritise useful free study access and organic reach, with mobile sales secondary. Keep Android and iOS Premium pricing unchanged and measure the revenue impact of offering the same features free on web. See the [access decision](../adr/0001-free-web-access-with-paid-mobile-premium.md).

## Agreed first-release scope

- Reuse the existing application and shared content for study progress, practice quizzes, mock tests, history reset, existing languages, and light/dark mode. Make all learner features free on web; omit web purchase and restore screens.
- Save progress in the current browser without registration or cloud sync. Explain that progress does not transfer to another browser, device or mobile app, and can be lost when browser storage is cleared.
- Launch online-first, preserve local progress and handle connectivity loss gracefully. Do not promise offline study or installable web support in this release.
- Keep the website and add the interactive app on the same domain. Provide English search-readable topic pages from shared content at launch, while retaining all existing languages inside the interactive app. Make “Start studying free” the main website action, retaining mobile download links. Support both phone and desktop browsers. Expand searchable translations after the first version is working well.
- Launch without display advertising. Offer optional mobile download links on results screens and in navigation, without popups or interruptions. Explain that mobile Premium is a separate paid unlock wherever platform access is compared; never imply payment is needed to continue on web. Revisit monetisation after observing usage.

## Measurement boundaries

Free web feature access is not paid ownership or a mobile Premium entitlement. Record web study activity separately from mobile purchases. Store referral clicks, attributed installs and confirmed purchases remain distinct measures; do not assume an identity link between them.

## Evaluation

Use completed practice quizzes or mock tests as the primary engagement measure, alongside returning browser users and organic-search traffic. Browser identifiers are not a count of distinct people across devices. Mere page views or assessment starts do not count as completed practice.

Review the first 28 complete days after launch, with weekly reliability checks. Record the actual launch time, reporting timezone, processing delay and QA exclusions. Track mobile purchases and net proceeds separately and investigate declines without assuming that web caused them. If usage is too sparse, extend observation rather than declare success or failure; no numeric growth target or guaranteed ranking improvement has been agreed.

## Release gates

Provide a working preview for the owner's review before production. Verify:

- Study progress, practice quizzes, mock tests and history reset work across reloads.
- Phone and desktop layouts, existing languages and light/dark themes work.
- Connection loss produces useful feedback without losing saved progress.
- Search-readable pages and direct links work.
- Analytics distinguish free web activity from paid mobile ownership.
- Android and iOS purchase and restore behaviour remain unchanged.

## Implementation decisions

Resolved in the 19 October 2026 ticket review (recorded in [#48](https://github.com/deanvanniekerk/k53studyguide/issues/48)):

- The interactive app is served from `/app/` on the existing host, with `/app-preview/` as the private preview mount; search-readable topic pages live under `/study/…`. The website keeps `/` and its existing URLs.
- The existing browser purchase service is a simulator, not a free production access policy. #49 introduces an access model that separates free web access from the Premium entitlement; web builds never run the simulator.
- Web analytics use a Firebase web data stream in the existing project, sharing the native GA4 property and event vocabulary; `premium_status` stays `free` on web (#54).
- The embedded website quiz demo is retired in favour of links into the real web app (#53).
- The 6 MB single-chunk web bundle is reduced in #51 by loading the selected locale dictionary on demand.
- New app copy needs generated translations through the maintainer's Codex CLI before launch; this is an owner step, not agent work.

These are implementation decisions, not evidence that the release gates have passed.
