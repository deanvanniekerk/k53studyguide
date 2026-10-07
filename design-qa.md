# Selected premium illustration — design QA

Date: 2026-10-07. Scope: place the selected Open Road artwork in the existing free Test page. This is asset integration, not a replacement screen design.

## Visual targets and evidence

- Source: `/Users/dean/.codex/generated_images/01a11162-bca8-7bb2-b7b3-8f1857137d74/exec-0b9fd1e2-ccf9-4f09-a11c-5d5c64b9390d.png` (1536×1024, transparent).
- Consuming asset: `pkg/app/public/assets/images/premium/open-road.webp` (1536×1024, alpha preserved, 105838 bytes).
- Implementation: `http://127.0.0.1:3013/test`, free learner, light theme, Safari responsive mode.
- Full browser captures: `/Users/dean/Documents/Codex/2026-10-07/issue30/open-road-390.jpg` and `open-road-320.jpg` in the same directory.
- Focused app captures: `open-road-390-crop.jpg` (880×1590 including small surrounding margin) and `open-road-320-crop.jpg` (760×1250 including small surrounding margin), same directory.
- CSS viewports: 390×754 and 320×568, 2× pixel density. App content measures 780×1508 and 640×1136 pixels respectively. Compare geometry in CSS pixels; the illustration uses object-fit contain, with no crop or stretch.
- The source artwork and each focused implementation capture were opened together in the same comparison tool response. The standalone artwork has no UI text to compare; existing app typography and copy are the screen baseline.

## Findings

No actionable P0/P1/P2 visual mismatches for this asset integration.

- Typography: existing Plus Jakarta Sans, headline weight, body sizes and CTA hierarchy preserved. At the narrow width, the headline wraps naturally and the complete CTA label stays visible.
- Layout: illustration is inside the free offer card above its heading. Height is capped at 184 CSS pixels and reduced to 96 on short viewports. Supporting copy scrolls in the existing content region; the primary action remains in its separate footer above navigation.
- Colours: the selected indigo/blue artwork sits cleanly on the light card and matches the app's existing Test palette. Its alpha is preserved rather than replaced by a rectangular background.
- Asset fidelity: same selected driver, blue hatchback, curved road and sun; no regeneration, distortion or subject cropping. WebP compression preserves the visible details at display size.
- Content: existing copy and purchase behaviour unchanged. Decorative image has empty alt text so it does not repeat or interrupt the offer's accessible content.

## Comparison history

The first browser capture was stale because the earlier preview server had stopped. It was excluded from acceptance. The preview server was restarted and fresh captures verified both sizes. No visual fixes were required after those comparisons.

## Checks and limits

- Component lint, TypeScript and production build passed.
- Browser visual checks passed at both recorded sizes. No new behavioural tests were added for this decorative asset change.
- Native simulator, enlarged native text and dark-theme visual acceptance remain part of #30's broader pending QA. No claim of native store validation is made here.
- Browser interaction was left with the user once they resumed using Safari.

## Cohesive icon set — 2026-10-07

Scope: 14 decorative illustrations across Study topics, the premium purchase sheet, Profile premium card and Quiz/Test results. Full inventory and generation recipe: `docs/design/icon-inventory.md`.

### Asset acceptance

All 14 final WebP assets were opened and visually inspected. They share rounded forms, navy outlines, ivory highlights and gentle dimensional shading grounded in the approved car illustration. Study keeps its six topic accents; purchase/Test uses purple-blue; Profile uses gold-green; Quiz uses coral-magenta. Each file is 256×256 with transparent alpha. Combined size: 207,180 bytes. All files are served by the preview and copied byte-for-byte into the production build.

### Browser evidence

Safari responsive mode, 2× density. Captures are under `/Users/dean/Documents/Codex/2026-10-07/issue30/`; `-crop.jpg` versions isolate the app:

- `icons-study-390-light`, `icons-study-complete-light`: final six topic icons at 390×754.
- `icons-study-320-fixed`: 320×568, narrow card layout after correction.
- `icons-study-390-dark`: dark topic surfaces. This early capture retained a failed image request for road-signs because that asset arrived after the page mounted. Reloading after generation resolved it; `icons-study-complete-light` confirms the final signposts render.
- `icons-profile-dark-card`: complete gold/green premium card at 390×754.
- `icons-offer-390-light`, `icons-offer-390-dark`: all three benefit icons and price/purchase/restore footer.
- `icons-offer-320-dark`: narrow purchase sheet; benefits scroll while purchase/restore stay visible.
- `icons-quiz-results-dark`: completed five-question browser quiz, showing the warm review-sheet illustration next to its result.

The source icons and rendered screenshots were inspected during comparison. No stretching, rectangular backgrounds or clipped artwork were found. Text labels carry meaning independently of icon colour. Empty image alt text avoids redundant screen-reader announcements. Existing typography, content and assessment logic remain intact.

### Correction and verification

The initial 320px Study capture exposed topic names breaking into fragments because the percentage occupied a separate column. At widths up to 360px the percentage now sits below the label, leaving the topic title enough width. The corrected screenshot verifies natural wrapping and intact artwork.

Lint (TypeScript and Biome), production build and the 11 purchase-modal/assessment-analytics tests passed. No new tests were added for decorative images. The build retains its existing large-JavaScript-chunk warning.

The browser quiz added one local preview quiz attempt; no store purchase occurred. Appearance was restored to Light. Success variants and Test-result variants were inspected as image assets and type-checked at their call sites; a full successful quiz or mock-test session was not rerun for this artwork change. Native simulator and enlarged native text checks remain pending the broader #30 review.

No unresolved P0/P1/P2 findings in the checked artwork/layout scope.

## Quiz result alignment refinement

The result header now has a 52px illustration column on the left and a single left-aligned text column on the right. The score sits above the smaller quiz-points row, with the bolt aligned beside that row. This replaces the independently centred score and full-width points row.

Verified in Safari at 390×754 and 320×568 using a completed 5/5 browser quiz. Both rows remain readable without overlap; the illustration is vertically centred beside them. Evidence: `result-aligned-390.jpg` and `result-aligned-320.jpg`, plus focused `-crop.jpg` versions, in the existing issue30 evidence directory. Component lint and TypeScript passed. One additional local preview quiz attempt was created for this check. The original 390×754 viewport was restored with the updated results open.

## Premium Test home refresh

Reused the approved woman-in-car asset on the owned/premium Test page. The large isolated zero is replaced by a hero card with a clear heading, short supporting copy and a tinted practice-goal panel. The panel keeps the real total tests passed and exposes a native progress element capped at the three-pass goal. Goal-reached and test-in-progress copy are supported; reset confirmation and the pinned Start/Continue action remain intact.

Safari captures at 390×800 and 320×568: `practice-home-390.jpg` and `practice-home-320.jpg`, with focused `-crop.jpg` versions in the issue30 evidence directory. At the larger size, the complete hero and goal panel fit. At the narrow/short size, supporting progress detail scrolls; Start Test and navigation stay visible. Artwork remains uncropped and uses the exact approved asset. Original 390×800 viewport restored. Component lint and TypeScript passed; no new behavioural tests for this presentation change. Goal-reached and continue/reset states were inspected in source, not exercised through additional mock-test attempts. No unresolved P0/P1/P2 findings in the checked layout scope.

## Study, Quiz and Test introductions

Replaced the three separate info-modal layouts with one shared responsive presentation. Each has a section-coloured hero, concise heading/subheading, consistent illustration style, scannable feature-card headings and a pinned “Let’s go” dismissal action. The existing close control remains available above the scrolling content. Eight individually generated images plus matching existing assets replace the old animated glyphs. Source images were inspected against the new rendered cards; no stretching, opaque image backgrounds or clipped subjects were found.

Copy review corrected typos and tied descriptions to the underlying selectors/operations. Study indicates viewed material rather than claiming mastery; quiz points are earned for first correct answers; Test prioritises questions not yet answered correctly. All reset descriptions disclose the Premium requirement. No assessment or purchase logic changed.

Evidence in the issue30 directory: `info-test-large.jpg` (430×932), `info-test-small.jpg`, `info-study-small.jpg`, `info-study-small-cards.jpg`, `info-quiz-small.jpg`, `info-quiz-small-cards.jpg` (320×568), and `info-quiz-dark.jpg` (390×800). Focused `-crop.jpg` captures are included for the small screens and dark Quiz view. At 320px the hero and first card establish the hierarchy; remaining cards scroll, while Close and Let’s go remain reachable. Both dismissal controls were exercised and returned to the respective underlying page. Light/dark surfaces use existing app tokens. Original light appearance and 430×932 viewport restored.

Validation: all 179 tests passed (169 app, 10 lander), TypeScript/Biome lint passed, production build passed with the existing bundle-size warning. All eight new files were verified in the running preview and production build. Native safe-area behaviour is implemented using existing Ionic/environment insets but remains pending simulator QA. Initial automatic display for a clean install uses unchanged notification wiring; testing here opened the same modal via each section’s information button. No unresolved P0/P1/P2 findings in the checked browser scope.

## Final browser refinements

Product feedback removed the practice-goal label, supporting subtitle and faint progress bar from the premium Test card, and enlarged its main heading. The real passed-test count and preparation guidance remain. Earlier screenshots above document the iteration, not this final copy.

All three introductions now use a larger section label, tighter hero spacing and 56px hero artwork. The top close button was removed; the pinned “Let’s go” action dismisses the modal. The final Study layout was visually checked in Safari at 430×932. Shared header help controls now use a question mark in a rounded translucent badge, retaining the 44px tap target and keyboard focus indicator.

Final publication checks: 179 tests, TypeScript/Biome and production build passed. Native acceptance remains outstanding under #30.

final result: passed (browser scope only)
