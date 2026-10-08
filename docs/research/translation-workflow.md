# Translation workflow research

Researched 8 October 2026. This is planning evidence; no translation generation or app changes were performed.

## Existing K53 implementation

- `pkg/shared/src/data/translations.ts` contains roughly 3,200 English entries, covering UI copy, navigation, study content, question text and options. Content and question structures reference these keys. Keep IDs, answer letters, navigation keys, image paths and ordering unchanged.
- `pkg/shared/src/translation/index.tsx` already supplies a React translation boundary. Missing locale entries currently fall back to the key itself, so add canonical English fallback before enabling another language.
- `pkg/app/src/state/settings` persists language, defaulting to `en`; Profile exposes only English, with Afrikaans, isiZulu and isiXhosa options commented out. `App.tsx` waits for persistence rehydration before `Startup.tsx` renders the router. There is no first-entry language welcome screen.
- `tools/translator/main.js` is a legacy Google Cloud Translate v2 utility reading a separate input snapshot. It deletes `af`, `zu` and `xh` values, while API translation calls are commented out. It writes a separate output snapshot. Replace or retire this behavior; the current shared English dictionary must be the source of truth.
- There is hardcoded English outside the dictionary, including tabs and Profile settings. An extraction pass is necessary before declaring the UI fully translated. Audit text in images separately.

These findings come from the local repository at commit `49b2ee7cc98fd3aff088f28ce1989d8a53704d1f`, with unrelated working changes present.

## Jedidiah precedent

Inspected `/Users/dean/_repo/jedidiah-equipment/jedidiah-platform` at commit `86ffd1164f8ddd7dbf317d3c7d5b0d1d6e6ae505`:

- `pkg/ai/src/equipment/catalog-translation.ts`: South African Afrikaans prompt, domain terminology, schema-constrained output, unchanged identifiers/numbers/units/brands, array validation and a bounded correction attempt.
- `pkg/ai/src/ai-sdk-model.ts`: OpenAI Responses API through the AI SDK.
- `pkg/api/src/env.ts`: dedicated translation-model override, falling back to the configured assistant model (default `gpt-5.5`). The catalogue generation call does not explicitly pass reasoning effort, although assistant chat supports it.
- `pkg/api/src/equipment/scripts/translate-backfill.ts` and its backfill/runner modules: local command, bounded concurrency (default two), progress counts, failed-item handling and nonzero exit on failures.
- `docs/adr/0011-lander-localization.md`: per-field source hashes distinguish missing, fresh, stale and manual entries needing review; manual corrections survive regeneration; writes recheck the source after the model call.
- `pkg/lander/src/messages`: typed static English/Afrikaans dictionaries, separate from AI-generated catalogue text used by the lander.

Adapt the generation and validation approach into a local file-based K53 tool. The catalogue database, server scheduler and locale URL routing are not required for the mobile app.

## Subscription-backed execution and model recommendation

**User requirement:** use the locally signed-in Codex subscription, with no direct API integration or API-key billing. Reuse Jedidiah's translation principles, not its API transport. Official [Codex authentication documentation](https://developers.openai.com/codex/auth) distinguishes ChatGPT subscription sign-in from API-key access. Local inspection found Codex CLI 0.159.1 installed and `codex login status` reporting ChatGPT authentication; no model generation was run.

Use a local Node wrapper around `codex exec`, pass each translation prompt through stdin, request a JSON Schema using `--output-schema`, and capture the final result using `--output-last-message`. Run the model read-only; the wrapper validates and writes locale files. [Non-interactive documentation](https://developers.openai.com/codex/noninteractive) and local `codex exec --help` confirm these flags. `--json` is an event stream, not the final translation dictionary. Use subprocess argument arrays instead of shell string concatenation.

Expose `--model` and `--reasoning-effort`, mapping to CLI `--model` and configuration `model_reasoning_effort`. Use the built-in OpenAI provider with ChatGPT sign-in; fail if subscription authentication is unavailable rather than switching to API credentials. Runs use subscription allowances and still require connectivity; handle usage limits with a resumable checkpoint. Do not copy authentication files into the repository or change global user settings. [Authentication](https://developers.openai.com/codex/auth), [configuration reference](https://developers.openai.com/codex/config-reference)

Official [Codex model guidance](https://developers.openai.com/codex/models) recommends Astra starting at low effort, GPT-6.1 Sol for repeated work and Luna for focused tasks, with availability depending on the account/client. **Recommendation/inference:** use `gpt-6-astra`/`low` as the quality reference, compare `gpt-6.1-sol`/`medium` as the practical default, and optionally evaluate `gpt-6-luna`/`high` for throughput. Keep the selected model configurable and fail clearly if unavailable. No consulted official source establishes a best model specifically for Afrikaans or the other South African languages; select through representative evaluation. Do not adopt Jedidiah's `gpt-5.5` default for the new subscription script: the Codex guide announces its retirement from subscription access on 14 October 2026. A valid schema proves structure, not translation correctness.

Evaluate UI labels, long HTML passages, road signs, vehicle controls, question/option groups, negations, numeric limits, placeholders and terminology. Have a fluent speaker check semantic accuracy and whether each translated question still has the same correct answer. Compare errors, retries, token/allowance usage and duration; increase effort only when evaluation demonstrates a benefit.

## Device-language feasibility

The installed `@capacitor/device` v8 package exposes `Device.getLanguageTag()`. Its [official documentation](https://capacitorjs.com/docs/apis/device#getlanguagetag) specifies a BCP 47 locale tag. Use it on native devices and browser language preferences on web, normalize regional tags such as `af-ZA` to an enabled locale, and fall back to English. Device language is a first-run suggestion; explicit saved choices win on subsequent launches.

## Proposed boundaries

English remains canonical. Generate reviewed, bundled locale resources locally through the signed-in Codex CLI; no runtime model calls. Use a registry of released locales shared by onboarding and Profile. Recommend English/Afrikaans first, then additional spoken test languages as complete translations are reviewed. Test-language evidence and its limits are recorded separately in `learners-test-languages.md`.
