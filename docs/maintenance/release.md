# Release and validation

Build commands and native configuration live in [Readme.md](../../Readme.md); exact dependencies live in the manifests and lockfiles. Use this checklist for the changed paths rather than repeating old setup audits.

## Release checks

1. Verify the source commit, platform version/build and store upload history. Increment both native build numbers together; never reuse an uploaded number.
2. Run `pnpm lint`, `pnpm test`, `pnpm build` and `pnpm lander:build`. For locale changes also run `pnpm translations:check`. Validate affected native behavior on the intended build.
3. Build production assets with the platform RevenueCat keys and correct Firebase configs. Browser purchase previews and RevenueCat Test Store builds are QA-only; neither certifies store billing.
4. Queue the manual [Azure pipeline](../../azure-pipelines.yml) with `buildAndroid=true`, `buildIOS=true`, `uploadIOS=true`, `showDebug=false` for a full release. Pushes/PRs do not start builds. Preserve the existing signing/Firebase secure-file names documented in the root README.
5. Verify successful signing/archive/export, artifact version and package identity. Use the signed Android artifact and the matching processed Apple build. An iOS upload is not an App Review submission.
6. Review copy/assets and validation messages in both stores. Record submission, approval and public rollout separately, including manual/automatic publishing and target countries. A successful pipeline does not establish store approval.
7. After availability, verify received/processed analytics on each platform and annotate the actual rollout dates before evaluating growth.

Current marketing source: [approved package](../../assets/store-refresh-2026-10/REVIEW.md). It contains 42 screenshots across six size families and three landscape graphics. Preserve authentic UI, feature order, free/Premium distinctions and the approved smiling driver. Label AI-assisted assets where the storefront asks for it.

## Focused native smoke

| Journey | Expected behavior |
| --- | --- |
| Free learner | Study and quizzes work; Test and Profile explain Premium with store-local price, purchase and restore reachable |
| Offer origins | Quiz home/results, Test and Profile retain correct origin; Premium users do not see free-user invitations |
| Cancel/failure/unavailable product | Free access retained, useful feedback and appropriate retry; failed loading does not claim an eligible offer |
| Successful purchase | Authoritative entitlement unlocks mock tests; success feedback once; tab return and relaunch preserve access |
| Restore | Existing store purchase restores access without a new sale or purchase thank-you; no entitlement stays free |
| Deferred payment | No premature access/sale; pending state and eventual access reconcile without duplicate feedback; use service regression tests for SDK orderings that cannot be staged manually |
| Assessment results | Submit quiz or full mock test → Study/other tab → return: score and answers remain. Explicit Back exits results; a fresh attempt starts normally; empty result routes recover |
| Persistence and layout | Background/relaunch retains progress, settings and paid access; narrow screens, large system text, safe areas and both themes keep actions reachable |

Use a clean store sandbox buyer for fresh checkout and an owned buyer for restore. Preserve existing learner data. Log build, platform, store environment and redacted pass/fail evidence in the relevant issue. Test Store simulations, browser checks and automated tests have distinct coverage; do not relabel them as real-store tests.

## Analytics acceptance

Use actual UI journeys and confirm receipt, not just SDK calls. Check invitation → offer → checkout → outcome parameters in GA4; separately inspect processed platform/version rows. Complete a `v2` quiz/mock test, revisit results and relaunch: no duplicate completion. Empty/incomplete submissions emit no completion. Study visibility remains a view.

For website changes, exercise all 11 [referral combinations](../analytics/events.md#website-referrals) with `?analytics_test=true&utm_source=qa&utm_medium=validation&utm_campaign=issue7`. Confirm correct new-tab destination and received canonical event/parameters in each collector, then demonstrate exclusion from production reports. Local tests prove handlers, not ingestion.

Keep QA session/time windows private for exclusion, including unknown-environment starts. Disable native analytics debug mode afterward. Restore tests and access outcomes do not establish sales; reconcile transaction evidence separately.

## Known limitations to carry forward

- Physical Apple sandbox purchase/reinstall/restore evidence exists; both platforms have native RevenueCat Test Store and GA4 receipt evidence. Fresh Google Play billing and current-release real-store parity are not established by those tests. The owner accepted the final Test Store smoke's real-store billing limitation. Preserve that distinction for future billing changes.
- Native screen-reader/focus traversal, owned-account restore after the dependency migration, and server-side crash ingestion were not fully verified in the recorded smoke. Do not imply accessibility certification or complete crash-reporting acceptance.
- [Issue #43](https://github.com/deanvanniekerk/k53studyguide/issues/43) remains open for dependency exceptions and residual native verification. The subsequent 1.40 Azure archive/export/upload succeeded, superseding its old “not yet built/uploaded” wording; that does not itself resolve its advisory decisions.

### Dependency constraints

The last audit recorded five upstream advisories (not a fresh audit). Reassess applicability and supported upgrades when dependencies or call sites change:

| Dependency path | Recorded advisory / scope |
| --- | --- |
| Ionic 9 → Router 6.30.6 | Ionic peers require Router <7. `GHSA-wrjc-x8rr-h8h6` and `GHSA-337j-9hxr-rhxg`; app uses fixed internal routes and no SSR. Do not force an incompatible Router major |
| Capacitor CLI → xcode → uuid | `GHSA-w5hq-g745-h8pq`; build tooling dependency |
| Firebase → Node Firestore → gRPC | `GHSA-m9gg-hp2v-232j`, `GHSA-f596-whhp-79r4`; app imports Firebase app/analytics, not Node Firestore transport |

Keep compatible parent graphs and lockfiles together; limited call-site exposure is not a blanket safety claim. Reverting a native/framework migration requires reverting its coupled configuration and dependency changes, followed by a new build number and validation.
