# Study visibility and assessment completion

Issue: https://github.com/deanvanniekerk/k53studyguide/issues/6

## Event definitions

`study_content_view` means a study card became at least partly visible. It fires once per mounted card; revisiting the page may create another view. The existing seen-content indicator remains a visibility record. Neither the event nor the indicator demonstrates that the learner read, understood or completed the material. `study_section_complete` is retired.

`quiz_complete` and `mock_test_complete` now originate from submission, with `analytics_schema_version = "v2"`. A completed attempt has at least one question and an answer for every question. Both passing and failing completed attempts count. Empty or incomplete submissions do not count and do not award completion progress. Their existing results remain viewable; the learner can continue answering and then submit.

The event includes the actual question count, correct count and rounded score percentage. Practice quizzes include experience gained. Mock tests include each section's correct count, total and pass status, plus the overall pass status. Section thresholds remain unchanged.

A saved completion timestamp guards submission before the analytics call. Repeated submit actions, returning to results, continuing an already completed attempt and reopening saved state do not create another completion or award the same completion progress twice. Starting a new attempt resets the guard, even if its questions match the previous attempt. Merely answering every question and leaving without submitting does not count as completion.

This is an application emission guarantee for retained session state, not an exactly-once delivery guarantee from Firebase. Redux persistence and native analytics delivery are asynchronous; a crash before persistence, storage reset, collection disabled or an SDK failure can affect delivery. Do not derive billing or financial records from these events.

## Legacy attempts and reporting cutover

Fully answered attempts saved before this change are not backfilled into schema 2 when viewed or resubmitted. An incomplete legacy attempt can join schema 2 when the learner resumes answering and then submits all answers, provided it has not already been marked complete. Historical scores remain available.

`QUIZ_RESULT` and `TEST_RESULT` are retired. Before this change both those names and their canonical counterparts described result-screen renders, including revisits, and can overcount attempts. Never add legacy and canonical event counts together. Schema-1/unversioned completion events cannot reliably be deduplicated into completed attempts retrospectively.

For corrected reports, filter canonical completion events to `analytics_schema_version = "v2"`. Segment by platform and released app version; record the actual rollout date/build separately for Android and iOS. Old app versions continue sending old semantics after rollout. Register the schema-version parameter for GA reporting before relying on it in standard reports, or use its raw event parameter in the export. Treat any discontinuity as a measurement change, not proof of a change in engagement.

## Verification

Automated tests exercise actual Redux actions and reducers through the Firebase SDK boundary, including empty, incomplete, resumed, repeated, reopened and legacy attempts. Render tests revisit result screens and simulate study visibility at the external visibility-sensor boundary. UI library rendering is stubbed; these checks do not establish native event ingestion.

Before release, use GA DebugView on each platform: complete a quiz and mock test, leave/re-enter results, restart the app, attempt to submit the same completed session, then start a fresh attempt. Confirm one schema-2 completion per new submitted attempt and accurate scores. End an incomplete mock test and open empty results: neither should emit completion. View study content: only `study_content_view` should appear. Keep debug/test traffic out of production engagement reports. Record the validated app versions and platform cutover dates in the release evidence.
