# Translation release gate (#45)

The tooling and welcome flow are implemented on `codex/issue-45-translations-welcome`.
The maintainer generated all 3,222 nonblank entries in each Afrikaans, isiZulu and isiXhosa dictionary with Sol/medium. **Release readiness is pending** fluent review, model comparison and native-device checks. The UI follow-up can merge independently of those release gates; it does not close #45.

## Manual UI copy overrides

### 8 October 2026: compact isiZulu labels and supporting copy

These eight `zu.json` entries were manually shortened after generated copy crowded the navigation, quiz header, level indicator and premium cards. Only `text` changed; the original `generatedHash` and other metadata remain intact so subsequent generation preserves the overrides. This pass made no manual changes to isiXhosa, whose generator was still running at that checkpoint.

| Key | Replacement wording | Reason |
| --- | --- | --- |
| `quiz` | Imibuzo | Replaces “Imibuzo yokuzilolonga” in tabs, headers and study controls; matches the existing “Qala Imibuzo” and “Qhubeka Nemibuzo” actions. |
| `quizIntro` | Phendula imibuzo, uthole amaphuzu, ukhuphuke ngezinga. | Shortens the header explanation of questions, points and level progression. |
| `quizLevelUpAfterShort` | {number} pts → Izinga {level} | Compact progress label; preserves both placeholders. |
| `premiumQuizTitle` | Ulungele inselele enkulu? | Shorter invitation heading. |
| `premiumQuizInfo` | Funda ngemibuzo emifushane. Nge-Premium, zilolonge ngesivivinyo esiphelele se-K53. | Keeps the short-question/full-test distinction in less space. |
| `testLockedInfo` | Zilolonge ngesivivinyo esiphelele se-K53. Thola izigaba okufanele ugxile kuzo. | Retains the full mock-test and focus-area message. |
| `testLockedBenefitStructure` | Izivivinyo ezigcwele: zonke izigaba ezi-3 | Shortens the benefit while retaining all three sections. |
| `testLockedBenefitScoring` | Bona amamaki akho nawokuphasa esigabeni ngasinye | Shortens the score/pass-mark benefit. |

The compact `quiz` label is also supported by the [Translate.com isiZulu dictionary entry for “imibuzo”](https://www.translate.com/dictionary/zulu-english/imibuzo-24477498). This lookup is supporting evidence, not fluent sign-off for the full set of edits.

Verification: `pnpm translator:check`, lint and all 207 app tests passed. Browser checks at 320 × 568 and 390 × 844 confirmed readable navigation labels and the revised quiz layout; light and dark themes were inspected. Shared tab padding/type sizing and header subtitle spacing were adjusted alongside these edits. Fluent review of all eight overrides, large-system-text checks for the revised navigation and physical-device sign-off remain pending.

For later overrides, add a dated entry with locale, keys, replacement wording, rationale and review evidence. Follow the [README override workflow](../../Readme.md#manual-translation-overrides); never edit a locale while its generator is writing checkpoints.

### 8 October 2026: completed isiXhosa and compact UI copy

The generator completed all 3,222 entries and exited; its locale lock was absent before editing. The following nine overrides change only `text`, preserving the original generated hash and metadata. Study content and question/answer translations were not manually rewritten.

| Key | Replacement wording | Reason |
| --- | --- | --- |
| `quiz` | Ikhwizi | Replaces “Imibuzo yokuziqhelanisa”; matches existing start/continue actions and fits tabs and study controls. |
| `quizIntro` | Phendula imibuzo, ufumane amanqaku, unyuke ngenqanaba. | Compact questions/points/level explanation. |
| `quizLevelUpAfterShort` | {number} pts → Inqanaba {level} | Preserves placeholders while removing the clipped sentence. |
| `premiumQuizTitle` | Ukulungele umngeni omkhulu? | Shorter invitation to a bigger challenge. |
| `premiumQuizInfo` | Funda ngeekhwizi ezimfutshane. NgePremium, ziqhelanise novavanyo olupheleleyo lwe-K53. | Retains short quizzes versus the full mock test. |
| `premiumSeeOffer` | Jonga iPremium | Compact action to view premium details. |
| `testLockedInfo` | Ziqhelanise novavanyo olupheleleyo lwe-K53. Fumana amacandelo ekufuneka uwaphucule. | Keeps the full-test and improvement-area message. |
| `testLockedBenefitStructure` | Iimvavanyo ezipheleleyo: onke amacandelo ama-3 | Retains coverage of all three sections. |
| `testLockedBenefitScoring` | Bona amanqaku akho nawokuphumelela kwicandelo ngalinye | Shorter score/pass-mark benefit. |

“Ikhwizi” is listed for “quiz” in the Department of Sport, Arts and Culture [Multilingual Mathematics Dictionary](https://www.dsac.gov.za/sites/default/files/2023-11/Multilingual%20Mathematics%20Dictionary.pdf), and is used by the [Western Cape Education Department](https://wcedonline.westerncape.gov.za/circulars/minutes24/CMminutes/DCG/xdcg0003-2024.pdf). These terminology sources do not provide fluent sign-off for the full copy edits.

The narrow-screen review also found clipping with enlarged text. Shared headers now grow with the root font size, navigation labels can wrap, the level indicator can wrap onto a second row, and all five stars fit their card. Default header height stays 65px.

Fluent review and physical-device sign-off remain pending. Verification results for this follow-up are recorded below separately from the original implementation checks.

## Manual generation

Use the supported repository Node version and pnpm. Install/update the official Codex CLI separately and sign in with `codex login` using ChatGPT. The generator requires a CLI supporting `--ignore-user-config`; it keeps the existing authentication location and never copies credentials or changes global settings. It excludes API/provider environment overrides, uses the built-in OpenAI provider and forces ChatGPT authentication. It needs connectivity and consumes subscription allowances.

```bash
pnpm translations:generate -- --help
pnpm translations:generate -- --target af --dry-run
pnpm translations:generate -- --target af --sample --model gpt-6.1-sol --reasoning-effort medium
pnpm translations:generate -- --target af --sample --model gpt-6-astra --reasoning-effort low
# Repeat the identical sample for zu and xh; optionally compare gpt-6-luna/high.
pnpm translations:generate -- --target af --model gpt-6.1-sol --reasoning-effort medium
pnpm translations:generate -- --target zu --model gpt-6.1-sol --reasoning-effort medium
pnpm translations:generate -- --target xh --model gpt-6.1-sol --reasoning-effort medium
pnpm translations:generate -- --target af --resume
pnpm translations:check
```

Only the maintainer manually starts generation. Do not add this command to startup, installs, builds, CI, deployment, schedules or background jobs. Default batches are sequential and bounded; nonsecret limits and prompt version are in `tools/translator/defaults.json`. Progress goes to stderr as readable periodic lines, including wait activity, retries, validated counts and a final summary. Ctrl-C keeps completed batches; `--resume` skips unchanged checkpointed entries. Authentication/model/effort errors and subscription limits fail without another transport.

Resources in `pkg/shared/src/data/locales/` contain text and per-entry source/output hashes plus model, effort and prompt version. They are the checkpoints and ship through the shared translation boundary. Writes validate the entire batch and recheck English and the locale file. A changed source or concurrent manual edit prevents application of the returned result. A `.lock` prevents concurrent generators for the same output; after an unclean process termination, remove that lock only after verifying no generator is running.

Edit an entry's `text` to correct it manually, keeping its metadata. A text/hash mismatch preserves that correction, including with `--regenerate-ai`; changed English flags it for review. After fluent review of a changed source, update that manual entry's `sourceHash` to the current English SHA-256. Missing metadata is treated as manual, never overwritten. `--regenerate-ai` explicitly refreshes otherwise unchanged AI entries. Intentional whitespace-only English fields remain canonical blanks and are skipped.

`--sample` writes to ignored `.translation-samples/<locale>-<model>-<effort>.json`, never to shipping resources. The deterministic sample includes UI, long passages, numbers/units, placeholders, signs, controls, negations and a complete question/option group. Record allowance before/after using the signed-in account's usage display; schema validity does not measure language quality.

## Run in chunks

Live runs prompt: `How many records should this run process? (N remaining; blank = all):`. Enter a positive whole number to process at most that many missing/stale entries, or press Enter to process all remaining entries. Counts exclude already completed entries, manual corrections and intentional blanks. Question/option groups stay together, so a chunk can finish slightly below its limit. If the next group alone exceeds the limit, choose a larger count. Dry runs and runs with nothing pending do not prompt.

```bash
# Enter a record count when prompted; blank processes everything remaining.
pnpm translations:generate -- --target af
# Subsequent chunks and recovery use the same checkpoint and prompt again.
pnpm translations:generate -- --target af --resume
# Explicit alternatives for manually started runs without a prompt:
pnpm translations:generate -- --target af --limit 50
pnpm translations:generate -- --target af --all
pnpm translations:generate -- --target af --dry-run --limit 50
```

A completed chunk exits successfully even when records remain. Its summary distinguishes pending records from records deliberately deferred by the limit. Validation/request failures still exit unsuccessfully. Each validated batch is written atomically; Ctrl-C or a failed request preserves completed batches, and the next run skips their unchanged entries. An interrupted batch that has not passed validation is regenerated on resume. Never use `--regenerate-ai` for ordinary chunk continuation; it explicitly requests regeneration of existing AI text. After a forced termination that prevented cleanup, follow the lock-file guidance above before resuming.

Monitor subscription percentages in the account's usage display between chunks. Automatic token/cost/allowance estimates and measurement sidecars have been removed. The maintainer's initial Afrikaans sample completed 21 entries in 157.1 seconds with one retry; fluent review is still pending. No live generation calls were made to implement or test chunking.

## Fluent review and model comparison (pending)

| Locale | Sol/medium vs Astra/low | Semantic/terminology errors | Correct answers preserved | Retries/duration/allowance | Fluent reviewer/date |
| --- | --- | --- | --- | --- | --- |
| af | Full Sol/medium dictionary generated; comparison pending | Not reviewed | Not reviewed | Sample: 1 retry, 157.1s; final full invocation: 4510.3s, 3122 translated, 155 skipped, 0 failed | Pending |
| zu | Full Sol/medium dictionary generated; comparison pending | Not reviewed | Not reviewed | Duration/allowance unrecorded | Pending |
| xh | Full Sol/medium dictionary generated; comparison pending | Not reviewed | Not reviewed | Completed 8 October 2026; duration/allowance unrecorded | Pending |

Fluent reviewers must check each full dictionary, paying particular attention to negations, numeric rules, South African terminology and each question's unchanged correct-answer letter. Keep the lightest configuration meeting that quality bar. Commit reviewed resources and completed evidence before publishing a PR that claims to close #45.

## App checks

Automated coverage includes English fallback/interpolation, the exact released registry and regional matching, saved/invalid locales, confirmed welcome settings, upgrades, interrupted onboarding, native detection failure/races, browser suggestion, and preservation of study/session/premium state. The native bridge is simulated in these tests; no physical-device sign-off is implied.

Before release, test fresh install, upgrade with each saved language (including English and invalid values), interruption, deep link with query/hash, language changes in Profile and relaunch on iOS, Android and web. Use regional tags en-ZA, af-ZA, zu-ZA, xh-ZA, unsupported tags and detection failure. Inspect translated study HTML and full question/option groups in light/dark mode, narrow screens and large system text. Confirm no change to active assessments or premium access. `pnpm translations:check` must pass, then run `pnpm test`, `pnpm lint`, `pnpm tsc`, `pnpm build` and `pnpm lander:build`.

## Image text audit (8 October 2026)

Inspected all 418 unique image paths referenced by the shared study and question data with local Apple Vision OCR (first frame, accurate recognition). All files loaded; 100 had candidate text. The reproducible inspection inventory is `translation-image-text-45.json`; OCR may miss text or include false positives. Visually inspected the vehicle-control diagram and representative direction, restriction, busway and toll signs.

The only referenced image outside `road-signs/` is `rules-of-the-road/vehicleControls.png`: it has numbered controls and no explanatory English copy. The legacy app screenshots in the asset tree are not referenced by current study/questions. No ordinary English UI screenshots require replacement in this boundary.

Official sign lettering, place names, route identifiers, times and units remain unchanged in all languages: for example `GA2.gif` contains Sandton/Rivonia Rd/N1/M9; STOP/GO signs retain their actual lettering. Supplemental panels contain language-dependent English. Record these for fluent review of their adjacent translated explanations; use separate localized explanatory text if needed, preserving the exam sign image:

| Asset under `pkg/app/public/assets/images/road-signs/` | Visible English | Follow-up |
| --- | --- | --- |
| `R533.gif` | up to 125 cc | Confirm localized explanation of the upper limit |
| `R534.gif` | and Local Access Only | Confirm conjunction and local-access restriction |
| `R535.gif`, `GS605.gif` | For 5km | Confirm distance scope without changing 5 km |
| `GS701.gif` | Busway | Confirm meaning in adjacent translated description |
| `R503.gif`, `R505.gif` | WEEK / SAT | Confirm weekday/Saturday time applicability |
| `IN25.gif` | Including VAT | Confirm toll-board explanation and protected amounts |

Separate asset localization is deferred: these are representations of real road signs, and blindly replacing their lettering would change the study question. Physical-device and translated-layout sign-off remains pending.

## Original implementation verification and review

Historical checkpoint before isiXhosa generation on 8 October 2026: 207 app tests, 12 lander tests and the original 13 generator/validation tests pass. `pnpm lint`, `pnpm tsc`, `pnpm build`, `pnpm lander:build`, `pnpm translator:check` and full/sample dry runs pass. The chunking change passes all 18 generator/validation/CLI tests, lint/type checks, translator check and limited/full dry runs. The host runs Node 24.15.0; repository-supported Node 26 verification still needs a run on that runtime. At that checkpoint, the complete-release checker failed with 3,222 missing isiXhosa entries; Afrikaans and isiZulu were complete and current. No live Codex translation calls were made by the coding agent.

Browser checks before generation on a 390 × 844 viewport confirmed Continue returns to the requested quiz URL, confirmation survives reload, Profile exposes English/Afrikaans/isiZulu/isiXhosa, and a Profile language change survives reload. Those checks used English fallback while resources were empty; translated-layout and native-device checks remain pending.

### Standards

No documented-standard violations. The reviewer identified duplicated model/effort defaults in CLI help and sample paths; both now derive from checked-in defaults. The additional prompt-size observation is fixed: limits cover the prompt, context and reserved correction space.

### Spec

The reviewer reproduced acceptance of changed units attached directly to numbers; validation now protects attached units, with regression coverage for 60km/h, 14m and 9000kg. The missing image audit is completed above. The original release blockers were complete dictionaries, fluent review, model comparisons, native-device and translated-layout checks. See the follow-up below for the completed dictionary and browser checks. No scope creep identified.

The original implementation was merged separately. The maintainer authorized publishing and merging this UI/isiXhosa follow-up after review and CI; it does not claim the remaining #45 release gates are complete.


## UI follow-up verification (8 October 2026)

All three dictionaries now contain 3,222 current nonblank entries. The isiXhosa writer exited and its locale lock was absent before the nine wording-only overrides were applied. `pnpm translations:check` passes for the complete dictionaries, including protected placeholders, numbers, units and brands. No translation generation was started by the coding agent.

The follow-up passed 207 app tests, 12 lander tests, 18 translator tests, lint/type checks, the app build and the lander build. The full suite was repeated successfully using the supported Node 26.10.0 and pnpm 12.9.1, after the initial host Node 24.15.0 checks. App and lander builds report large-chunk warnings. Azure Pipelines is configured for manual runs (`trigger: none`, `pr: none`); no automatic build is expected on PR creation.

Browser review covered isiXhosa navigation, quiz title/subtitle and premium card, study Quiz control, level progress and mock-test premium copy at narrow phone widths (320 × 568 and 390 × 844), with light/dark appearance checks. At 320px and a 24px root font (150%), shared headers, wrapping labels/progress and all five stars remained readable. This root-font simulation is not native OS text scaling.

Welcome checks used the real component in a temporary fresh-store browser fixture, including simulated 47px top/34px bottom safe areas. At 320px and 150% text, switching all four languages kept title/body/menu positions stable; the title and body reserved 130px and 207px respectively. The footer remained visible at the bottom of the 568px viewport while the content scrolled, and Continue completed onboarding. The 390px light-mode isiXhosa layout was also inspected. Temporary fixtures are excluded from the shipped app.

Fluent review of the generated dictionaries and all manual overrides, model comparison, and physical iOS/Android lifecycle, safe-area and system-text checks remain release gates. These browser checks do not provide fluent or physical-device sign-off; #45 stays open.
