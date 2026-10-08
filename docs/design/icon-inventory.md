# App illustration inventory

Updated 2026-10-07 for the premium conversion work on #30. The approved woman-in-car illustration is the visual reference: rounded shapes, deep indigo outlines, soft dimensional shading and bright section colours.

## Generated replacements

The six section assets live under `pkg/shared/src/react/icons/illustrations/` and are bundled for both the app and landing-page demo. Other filenames below are under `pkg/app/public/assets/images/illustrations/`. Each asset was generated individually with ImageGen, then encoded as a 256×256 WebP with transparent alpha. Study and quiz navigation share `SectionIcon`; other app artwork uses `Illustration`. All decorative images have empty alt text; adjacent visible headings carry their meaning.

| Location | Previous icon | New asset | Palette | Display size |
| --- | --- | --- | --- | --- |
| Study / quiz selection: vehicle controls | Speedometer SVG | `vehicle-controls.webp` — gauge | Coral `#ff828a` | 36px |
| Study / quiz selection: rules of the road | Clipboard SVG | `road-rules.webp` — driving handbook | Turquoise `#63d6ce` | 36px |
| Study / quiz selection: defensive driving | Car SVG | `defensive-driving.webp` — car and shield | Lavender `#a38cf4` | 36px |
| Study / quiz selection: road markings | Straight road SVG | `road-markings.webp` — curved marked road | Orange `#ffad66`, indigo | 36px |
| Study / quiz selection: road signals | Traffic light SVG | `traffic-signals.webp` — traffic light | Blue `#6eb0f9`; red/amber/green lights | 36px |
| Study / quiz selection: road signs | Stop sign SVG | `road-signs.webp` — signposts | Gold `#ffdb70`, red/blue sign faces | 36px |
| Purchase sheet: mock tests | Clipboard outline | `mock-tests.webp` — checked clipboard | Purple/blue | 40px |
| Purchase sheet: scores | Bar chart outline | `score-breakdown.webp` — three ascending bars | Purple/blue, gold accent | 40px |
| Purchase sheet: repeat practice | Refresh outline | `repeat-practice.webp` — circular arrows | Purple/blue | 40px |
| Profile: premium offer / owned | Trophy glyph | `premium-trophy.webp` — trophy | Gold `#ffca3a`, green `#007e6c` | 52px |
| Quiz result: all correct | Passed document SVG | `quiz-success.webp` — checkmark rosette | Gold, magenta/coral ribbons | 52px |
| Quiz result: review answers | Warning document SVG | `quiz-practice.webp` — result sheet and magnifier | Coral/magenta, gold | 52px |
| Test result: passed | Passed document SVG | `test-success.webp` — checkmark rosette | Purple/blue, gold trim | 64px |
| Test result: more practice | Warning document SVG | `test-practice.webp` — result sheet and magnifier | Purple/blue, gold | 64px |

The magnifier expresses review and continued practice. Existing scores, result text and pass criteria remain unchanged. Study tiles hide the eye and progress percentage at widths up to 360px; the progress bar remains visible.

## Other icons audited

| Group | Existing icons and uses | Treatment |
| --- | --- | --- |
| Tab navigation | Book, quiz sheet, test pen, settings | Hidden by `.app-tab-pill svg`; navigation currently uses text labels. No replacement assets needed. |
| Background watermarks | BookOutline, QuizOutline, TestPenOutline, SettingsOutline | Retained as subtle line artwork behind content. |
| Learning status | Filled/outline stars, XP bolt, check/cross, read/unread eye, section result ticks | Retained as small functional symbols. |
| Controls | Info, close, back/forward, chevrons, radio selectors, trash, lock, shuffle, search, options | Retained library icons for legibility at control size. |
| Info modals | Eye, progress, reset, shuffle, review, stars, points and settings | Refreshed with section-themed artwork; see the additions below. |
| Error boundary | Legacy warning-document SVG | Retained for technical errors; distinct from a learner needing more practice. |
| Unused custom exports | ResetIcon, YinYangIcon | No consuming app call sites found; no new artwork generated. |
| Educational content | Road signs, controls and question diagrams | Existing teaching assets retained; these are content, not decorative navigation art. |
| Landing website quiz demo | Shared section illustrations | Uses the same six section assets as Study and quiz selection. The six legacy section SVG components and exports have been removed. |

## Generation recipe

Use the approved `premium/open-road.webp` as the style reference. Request one centered, compact object per transparent square canvas, smooth thick indigo (`#20205d`) outlines, ivory highlights, gentle dimensional shading and the palette in the table. Fill approximately 85% of the canvas and simplify for the final display size. Avoid labels, tiny text, background plates, scenery, confetti, glows and large shadows. Preserve traffic-light ordering and recognizable sign shapes. For result variants, reference the corresponding Quiz artwork to retain composition while changing the section palette.

Original ImageGen PNGs remain in the local generated-image archive; the app depends only on the committed WebP assets. No runtime image service is required.

## Introduction illustrations

The Study, Quiz and Test info modals now share `SectionInfoModal`, with translated headings/body copy, section-themed hero panels, illustrated cards and a pinned dismissal button. Repeated decorative animation timers were removed. The functional eye, progress, star and control indicators elsewhere in the app remain unchanged.

Eight additional ImageGen assets (88,546 bytes combined), all transparent 256×256 WebP:

| Asset | Purpose | Palette |
| --- | --- | --- |
| `study-seen.webp` | Viewed-material tracking | Turquoise, blue, green check |
| `study-progress.webp` | Topic progress | Turquoise frame, blue fill |
| `study-reset.webp` | Reset seen history | Turquoise/blue |
| `quiz-star.webp` | Topic stars; Quiz hero | Gold, coral/magenta shading |
| `quiz-points.webp` | Quiz points and level | Gold bolt, coral/magenta shading |
| `quiz-settings.webp` | Topic and quiz-length controls | Coral/magenta, gold knobs |
| `quiz-reset.webp` | Reset quiz history | Coral/magenta |
| `test-shuffle.webp` | Question selection | Purple/blue |

Test also reuses `test-practice.webp` and `repeat-practice.webp`; Study/Test heroes reuse `road-rules.webp` and `mock-tests.webp`. Card images display at 56px, reduced to 44px on screens up to 360px. Hero images display at 56px. All are decorative alongside accessible visible headings.

Copy is grounded in the implementation: viewed content is tracked automatically, points are awarded for first correct answers, mock tests prioritize questions never answered correctly, and clearing history requires Premium. The former guarantee-like real-test wording and fixed bank-size claim were replaced with descriptions of the actual app experience.
