# Content and artwork

## Translation maintenance

English is canonical; the app exposes English, Afrikaans, isiZulu and isiXhosa. Generated dictionaries live in [shared locales](../../pkg/shared/src/data/locales). Dictionary completeness is verified structurally, but fluent review of generated content and manual overrides is still unrecorded. A closed translation ticket or passing schema check does not establish language accuracy.

The [root README](../../Readme.md#translations) owns generation, checkpoint and CLI instructions. Generation is manually initiated through the maintainer's signed-in Codex subscription, never app startup, CI, deployment or a scheduled/background job. Do not regenerate content merely to tidy documentation.

The five `welcome*` entries and `crashTitle`/`restart` also carry eager Afrikaans, isiZulu and isiXhosa values in the English dictionary so welcome can reserve stable layout and startup crash recovery stays translated before locale loading. Keep those inline values identical to their JSON entries when editing welcome or recovery copy. A regression test compares these eager copies with the generated dictionaries; update both together. Welcome uses the eager copies to reserve layout. Elsewhere the selected generated dictionary loads on demand and wins for its locale; English remains the fallback while loading.

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
| Landing website | [Website package](../../pkg/lander) |

Landing screenshots live in `pkg/lander/assets/screens/`, exported at 804 × 1748 from the approved package’s `source-captures/iphone/`. Keep the UI intact when refreshing them. `ready-to-learn.webp` and `public/assets/k53-social.jpg` reuse the approved Google Play feature graphic; the latter has a stable public URL for social previews.

Keep the indigo/blue/teal palette, rounded artwork and visible smiling driver consistent. Decorative app illustrations are compact transparent WebP assets; real UI screenshots and educational signs remain accurate. Keep functional symbols legible and decorative imagery silent to assistive technology where adjacent text supplies meaning.

For future storefront experiments, derive a variant from the approved package and document exactly which element changes. Keep generated backgrounds separate from authentic UI captures. Retain truthful one-time Premium wording and independent-app positioning; avoid official endorsement, exact official-paper claims or pass guarantees.

## Static English study topics

`pnpm lander:build` generates `/study/` pages from the shared English navigation, content and translations, then builds them with the existing guide styles. Generated HTML and `public/sitemap.xml` are ignored; `pkg/lander/scripts/sitemap-base.xml` preserves the six existing public entries and dates. A section receives a URL when its subtree has at least three content items or 150 words; smaller sections appear under their parent. Review `pkg/lander/tests/topics.urls.txt` deliberately when shared content changes a public URL. Append new routes to `pkg/lander/scripts/published-topic-urls.json` before deployment and retain old entries: retired paths generate noindex replacement pages linking to the nearest surviving topic, so FTP overwrites their old content. These replacement URLs stay out of the sitemap.

The default is a noindex preview linking to `/app-preview/`, with no generated topics in the sitemap or production analytics script. `TOPIC_PREVIEW=0 pnpm lander:build` prepares indexable pages linking to `/app/`. After #55 launch approval, publish with `WEB_LAUNCH_APPROVED=1 TOPIC_PREVIEW=0 pnpm lander:deploy`: deployment rebuilds the site, so the flag must be present on that command too. `TOPIC_APP_BASE` and `TOPIC_IMAGE_BASE` override the app and image mounts. Images reuse the app's asset tree and are not copied into the lander. The more specific robots Allow rule keeps `/app/assets/images/` crawlable within the app route exclusion.

`pnpm --filter lander test` builds the site, verifies generated HTML without running scripts, and checks all built internal links/assets. Apache serves directory `index.html` files; `public/.htaccess` configures the root custom 404 page. Test a missing URL after an approved deployment and check the HTTP status remains 404.

Website and production app deployment commands stop before upload without `WEB_LAUNCH_APPROVED=1`, representing the owner launch gate in #55. For preview topics only, use `pnpm lander:deploy:preview`; this forces noindex `/app-preview/` links and uploads only assets, `/study/` HTML, custom 404/routing files and crawler exclusions. It preserves live homepage/guides/privacy HTML and the sitemap. Before the first preview upload, inspect existing host `.htaccess` and merge any site rules rather than replacing unknown configuration.
