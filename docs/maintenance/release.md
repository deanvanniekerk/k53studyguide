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

## Web release

Production is not launched. The preview is <https://www.k53studyguide.online/app-preview/>; generated noindex topics start at <https://www.k53studyguide.online/study/>. The live homepage/guides remain the previous release. Review new homepage/guide CTAs locally with `pnpm lander:start`; publishing those HTML files is the launch, not a hidden preview.

### Preconditions and evidence

Record the source commit, checks and preview evidence in #55. Run all of:

```bash
pnpm lint
pnpm test
pnpm build
WEB_APP_OUT_DIR=build-web pnpm web:build
pnpm lander:build
pnpm translator:check
pnpm translations:check
```

Use Node 26.10+ within the pinned major and the lockfile's pnpm version. Do not hide failed translation completeness checks. The owner runs `pnpm translations:generate -- --target <locale>` for af/zu/xh manually, then reruns both translation checks; agents must not run generation. English fallbacks keep preview usable while this gate is pending.

Verify Firebase web config in the existing `k53-study-guide` project and its GA4 stream/property association, tagged QA receipt and the production enablement decision. Keep config in ignored `.dev.env` and Azure variables. Capture the prior deployed website/app artifacts, current `.htaccess`/robots and checksums privately before a launch; Git history alone does not prove which files are live. FTP uploads have no atomic swap. Keep earlier fingerprinted assets available for cached clients.

The owner must approve this preview in writing on #55 before production publishing. `WEB_LAUNCH_APPROVED=1` records that prerequisite for the deploy helpers; setting a variable is not a substitute for approval. A merge authorizes code integration, not production launch. Native release remains a separate decision.

### Repeatable preview deployment

1. Inspect the existing root `.htaccess` via FTP without displaying credentials. Merge existing host rules into `pkg/lander/public/.htaccess` if present, then rebuild; do not edit only `dist`, which is regenerated. The first 19 October inspection returned FTP “file does not exist”; no existing root rules were replaced. The helper refuses all uploads if existing root rules differ from the built file, preserving subsequent host changes.
2. Run `pnpm web:deploy:preview`. It clears the production analytics flag, builds `/app-preview/`, uploads dependencies first, `index.html` next and app rewrite rules last. `FIREBASE_WEB_CONFIG`, if provided, permits explicit QA only.
3. Run `pnpm lander:deploy:preview`. It forces noindex topics and `/app-preview/` app/image URLs, then uploads dependencies, root/scoped custom 404 rules, crawler exclusions and `/study/` HTML. It does not publish the live homepage, guide, privacy or sitemap changes. Existing topic routes are overwritten, including retired-route replacement pages.
4. Exercise the journeys and hosting checks below. An ignored FTP environment is required; never put credentials on a public issue or in a committed command.

### Hosting and journey checks

Use curl to record status/content type and HTML, without following a failed route into a misleading homepage response:

```bash
curl -sS -D /tmp/k53-app-headers -o /tmp/k53-app.html https://www.k53studyguide.online/app-preview/quiz/results
curl -sSI https://www.k53studyguide.online/app-preview/dist/ACTUAL_HASH.js
curl -sSI https://www.k53studyguide.online/app-preview/assets/images/ACTUAL_FILE.png
curl -sS -D /tmp/k53-topic-headers -o /tmp/k53-topic.html https://www.k53studyguide.online/study/road-signs/
curl -sS -D /tmp/k53-404-headers -o /tmp/k53-404.html https://www.k53studyguide.online/study/does-not-exist/
curl -sS https://www.k53studyguide.online/robots.txt
curl -sSI http://k53studyguide.online/
curl -sSI http://www.k53studyguide.online/
curl -sSI https://k53studyguide.online/
```

Read actual fingerprint/image paths from delivered HTML/content; placeholders above are not URLs to test. Expect app deep links 200 with the same noindex shell, JS 200 with a JavaScript content type, CSS/image types matching their content, topics 200 with substantive HTML, and missing topic/root URLs 404 with custom helpful HTML. Expect crawler exclusions for both app mounts and an image exception for production topic illustrations. App navigation paths are rewritten; missing fingerprinted files must still produce a recoverable opening failure. If rewrite is ignored, stop and ask the owner to enable it in cPanel; do not silently switch to hash routing.

Canonical tags point at `https://www.k53studyguide.online`. On 19 October, HTTP and apex URLs returned 200 rather than redirecting. Record this host configuration gap for owner/cPanel correction; the canonical tag is not a redirect. Repeat the checks after any change.

Exercise topic → app study → quiz → results → mock test → results → optional store link. Verify score/history after reload, deliberate history reset without settings loss, direct study/quiz/result links, browser Back/Forward, failed-image retry, lost connection and recovery. Confirm free web access never sets paid ownership or shows checkout/restore. Confirm mobile links explain separate Premium and browser-local progress. In a marked QA tab, complete an attempt, revisit/reload/reconnect and confirm one received completion, web platform, free status and no purchase-family events. Open a separate unmarked preview tab and verify no production receipt; close QA tabs afterward and retain windows privately.

Required browser matrix: iPhone Safari 375×812 and 430×932; Android Chrome 360×800; desktop Chrome/Firefox/Safari at 1280×800 and 1920×1080, light/dark/system, en/af/zu/xh. Include a keyboard-only journey, language switch during an attempt, zoom and a Slow 4G first load. Responsive Safari desktop emulation is useful evidence but does not certify physical iPhone/Android behavior. Record missing matrix cells plainly in #55.

Native shared UI changed in #49: `app/Router.tsx`, `app/Startup.tsx`, `app/pages/test/TestPage.tsx`, quiz/test `History.tsx`, profile `Purchase.tsx`, `PremiumInvitation.tsx`, `usePremiumOffer.ts`, `usePurchaseRecovery.ts` and `state/configureStore.ts`. Later work also changes shared question-image rendering, translation loading and optional-link render guards. Automated SDK-mocked suites cover RevenueCat purchase/recovery, purchase journeys/modals, assessment result navigation and web/native access. They do not certify a device store sheet. Before the next store release, the owner decides on one Android or iOS dev-build smoke of the Free learner and Successful purchase rows above. Record whether performed, build and environment; no native device smoke has been performed for this web workstream.

### Approved production deployment

After written owner approval and completed translation/config/receipt gates:

1. Save current host artifacts privately and record their checksums and source provenance. Set `FIREBASE_WEB_CONFIG` in the ignored environment and approve `WEB_ANALYTICS=production`. Build/check the launch app and topics; use explicit `TOPIC_PREVIEW=0` because the safe default is preview. Example preparation:

   ```bash
   WEB_APP_BASE=/app/ WEB_APP_OUT_DIR=build-web WEB_ANALYTICS=production pnpm web:build
   TOPIC_PREVIEW=0 TOPIC_APP_BASE=/app/ TOPIC_IMAGE_BASE=/app/assets/images pnpm lander:build
   ```

2. Deploy the app first: `WEB_LAUNCH_APPROVED=1 WEB_ANALYTICS=production pnpm web:deploy`. The helper rebuilds and uploads fingerprinted files, shell, then `.htaccess`. It does not release a native app. Do not run Capacitor copy against a web build; Azure keeps outputs separate.
3. Deploy the website: `WEB_LAUNCH_APPROVED=1 TOPIC_PREVIEW=0 pnpm lander:deploy`. The helper rebuilds; flags must be present on this command too. Dependencies/config/sitemap/robots go first, then topic/guide HTML; homepage HTML is last. Confirm topics are indexable and listed once in the sitemap, with canonical URLs and production image/app mounts.
4. Repeat hosting checks against `/app/` and `/study/`, exercise the live homepage CTA and one marked quiz, and confirm live tagged receipt. Record any interval where app access was available before the homepage switched.
5. Record actual launch timestamp/timezone and measurement coverage in `docs/growth/web-launch.md`. The owner submits the sitemap in Search Console. Keep `/app-preview/` for seven days; remove that mount only after owner confirmation and successful live verification. Preserve its crawler exclusion.
6. Fill the four weekly dates and 28-complete-day review date from the scorecard's launch-time rule. Weekly checks cover hosting, GA web startup/completions, Search Console coverage and reconciled mobile transactions. Scheduling is optional and requires an explicit owner request; this document creates no automation.

### Rollback

Retain the captured pre-launch artifacts. Restore prior homepage/guide/privacy HTML and any changed root server rules from that capture; upload dependencies before HTML and homepage last. If rebuilding an old checkout, use its exact lockfile/config and verify its output before upload. Additive topic pages may remain noindex while entry points are restored; restore the captured sitemap/robots where needed. Do not run a full current-source build and call it a prior-release rollback.

For `/app/`, re-upload the last known good web build with dependencies before shell. If there is no prior app build, upload a small `index.html` redirecting to `/` and retain app rewrite rules so deep links reach it. Example emergency shell:

```html
<!doctype html><html lang="en"><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=/"><title>Study guide</title><a href="/">Return to the study guide</a></html>
```

Do not delete old app assets or change persistence keys during rollback. Existing local progress stays in the browser; neither FTP nor a redirect guarantees recovery of already-cleared storage. Check root/deep links and previous homepage/store destinations after restore. Record rollback time and the incomplete measurement interval. Preview rehearsal verifies ordering and scoped paths with the fixture deployment tests; destructive production rollback has not been executed.
