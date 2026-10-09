# Content and artwork

## Translation maintenance

English is canonical; the app exposes English, Afrikaans, isiZulu and isiXhosa. Generated dictionaries live in [shared locales](../../pkg/shared/src/data/locales). Dictionary completeness is verified structurally, but fluent review of generated content and manual overrides is still unrecorded. A closed translation ticket or passing schema check does not establish language accuracy.

The [root README](../../Readme.md#translations) owns generation, checkpoint and CLI instructions. Generation is manually initiated through the maintainer's signed-in Codex subscription, never app startup, CI, deployment or a scheduled/background job. Do not regenerate content merely to tidy documentation.

For a wording correction:

1. Wait for that locale's generator to finish. Edit only the entry's `text`; retain `generatedHash` and source/generation metadata so the tool preserves the override.
2. Record affected keys, reason and fluent-review status in the change's issue/PR. If English later changes, review the preserved correction before updating its `sourceHash` to the current English SHA-256.
3. Preserve placeholders, HTML, numbers, units, brands, question IDs and correct-answer letters. Check complete question/option groups, especially negations and numeric limits.
4. Run `pnpm translator:check` and `pnpm translations:check`; inspect affected screens in all four languages at narrow widths and with large system text, in light/dark modes.

Verify welcome language suggestion/confirmation, saved settings after upgrade/relaunch, Profile switching, unsupported device-language fallback and preservation of active assessments/Premium. Layout tests are not fluent review.

Keep real road-sign lettering, places, routes, times and units unchanged. Localize the adjacent explanation instead of redrawing an exam sign. Known supplemental English needing explanation review includes `R533` (up to 125 cc), `R534` (local access), `R535`/`GS605` (5 km), `GS701` (Busway), `R503`/`R505` (WEEK/SAT), and `IN25` (VAT). Files are under [road-signs](../../pkg/app/public/assets/images/road-signs).

Market only the four supported study languages. The app's language selection does not establish language availability at a learner's testing centre or implement sign-language accessibility.

## Creative sources

| Asset | Source |
| --- | --- |
| Storefront copy, feature graphic, Apple header/search creative and screenshots | [Approved store package](../../assets/store-refresh-2026-10/REVIEW.md), [gallery](../../assets/store-refresh-2026-10/REVIEW.html) and [tooling](../../assets/store-refresh-2026-10/tooling/README.md) |
| Shared Study/Quiz section illustrations | [Shared illustrations](../../pkg/shared/src/react/icons/illustrations) |
| Purchase, results and informational artwork | [App illustrations](../../pkg/app/public/assets/images/illustrations) |
| Landing page and demo | [Website package](../../pkg/lander) |

Landing screenshots live in `pkg/lander/assets/screens/`, exported at 804 × 1748 from the approved package’s `source-captures/iphone/`. Keep the UI intact when refreshing them. `ready-to-learn.webp` and `public/assets/k53-social.jpg` reuse the approved Google Play feature graphic; the latter has a stable public URL for social previews.

Keep the indigo/blue/teal palette, rounded artwork and visible smiling driver consistent. Decorative app illustrations are compact transparent WebP assets; real UI screenshots and educational signs remain accurate. Keep functional symbols legible and decorative imagery silent to assistive technology where adjacent text supplies meaning.

For future storefront experiments, derive a variant from the approved package and document exactly which element changes. Keep generated backgrounds separate from authentic UI captures. Retain truthful one-time Premium wording and independent-app positioning; avoid official endorsement, exact official-paper claims or pass guarantees.
