# Translation release gate (#45)

The tooling and welcome flow are implemented on `codex/issue-45-translations-welcome`.
The Afrikaans, isiZulu and isiXhosa resources are empty placeholders. **This branch is not ready to publish or release.** No live translation generation, fluent review or model comparison has been performed.

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

## Fluent review and model comparison (pending)

| Locale | Sol/medium vs Astra/low | Semantic/terminology errors | Correct answers preserved | Retries/duration/allowance | Fluent reviewer/date |
| --- | --- | --- | --- | --- | --- |
| af | Not run | Not reviewed | Not reviewed | Not measured | Pending |
| zu | Not run | Not reviewed | Not reviewed | Not measured | Pending |
| xh | Not run | Not reviewed | Not reviewed | Not measured | Pending |

Fluent reviewers must check each full dictionary, paying particular attention to negations, numeric rules, South African terminology and each question's unchanged correct-answer letter. Keep the lightest configuration meeting that quality bar. Commit reviewed resources and completed evidence before publishing a PR that claims to close #45.

## App checks

Automated coverage includes English fallback/interpolation, the exact released registry and regional matching, saved/invalid locales, confirmed welcome settings, upgrades, interrupted onboarding, native detection failure/races, browser suggestion, and preservation of study/session/premium state. The native bridge is simulated in these tests; no physical-device sign-off is implied.

Before release, test fresh install, upgrade with each saved language (including English and invalid values), interruption, deep link with query/hash, language changes in Profile and relaunch on iOS, Android and web. Use regional tags en-ZA, af-ZA, zu-ZA, xh-ZA, unsupported tags and detection failure. Inspect translated study HTML and full question/option groups in light/dark mode, narrow screens and large system text. Confirm no change to active assessments or premium access. `pnpm translations:check` must pass, then run `pnpm test`, `pnpm lint`, `pnpm tsc`, `pnpm build` and `pnpm lander:build`.

## Image text audit

Dictionary translation does not change pixels. The asset tree contains sign diagrams, vehicle-control diagrams and legacy app screenshots. Inspect the images actually referenced by `pkg/shared/src/data/content.ts` and `questions.ts`; unrelated legacy files do not establish a shipped limitation. Embedded road-sign names, place names, units and official sign lettering may be protected exam material; explanatory English labels require separate localized assets or text extraction. Audit findings and device/layout sign-off remain pending until generated resources are available.
