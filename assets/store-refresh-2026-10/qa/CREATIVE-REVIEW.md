# Creative review — 8 October 2026

## Decisions

- **Accept the campaign direction:** indigo/blue/teal, warm sunrise and road imagery, bold white headlines, the smiling illustrated driver. The app already uses purple/blue/teal and illustrated topic icons. The landscape compositions feel welcoming and connect to the study journey without pass guarantees or official branding.
- **Reject the generated screenshot UI:** `concepts/01-study-pilot.png` changed progress bars and reproduced app text imperfectly. It is a style exploration only and must not be uploaded. `portrait-background.png` removes all app content; the final exports place original browser captures over it with deterministic text.
- **Reject the opaque windscreen:** the user preferred the smiling lady. `rejected-opaque-header.png` is retained only as revision history. The accepted Play, Apple header and Apple search masters all show her. Reviewed face/hands/seatbelt, readable wording and balanced safe margins at full composition size.
- **Keep one story per slide:** study/progress, randomized quiz, mock format, signs, section results, languages, theme choice. Premium is explicit in slides 3 and 5. No price appears in assets. Quiz wording does not promise never-repeated questions; mock wording does not promise official papers or identical timing.
- **Keep tablet layouts authentic:** all tablet screens originate at tablet CSS widths. The app naturally leaves white space on these screens; no phone layouts were stretched or UI invented to fill it.
- **Language choice is the strongest truthful image:** use the actual welcome screen displaying all four options. Supplementary isiXhosa study captures show real translated content but also an English progress-summary phrase; these are preserved as QA references, not substituted with fabricated translated UI.
- **Keep a single light/dark comparison:** both full app captures are paired at equal scale, with matching progress. Neither screen obscures the other. This comparison has smaller detail than the single-screen stories and is deliberately last.

The short Android phone welcome screen was scrolled using normal keyboard focus so all four language options are fully visible, then focus was removed by clicking the heading. The iPad background was anchored at the top to keep light clouds out of the headline area. Both refinements were recaptured and revalidated.

## Export review

A viewport-only browser capture was found to cap tall final artwork at 2,160 pixels. All final files were re-exported using full-page screenshots; actual raster dimensions are checked by `tooling/validate.py`. The final app-panel images are uniformly reduced, never stretched or cropped. Slight rounded outer corners and shadows are presentation only.

The Image Gen masters do not natively have the exact requested store dimensions. The browser renderer performs a proportional cover fit into the exact target canvas: Play is reduced; Apple landscape masters are enlarged. The tiny aspect-ratio differences in the header/Play masters only trim peripheral edges. No text or subject is trimmed. Source resolutions remain recorded in the generation record. Upscaled artwork should be inspected in the store's actual preview before publishing; exact final dimensions alone are not a claim of native generated detail.

Generated landscape typography was reviewed for the exact words and spelling: “K53 STUDY GUIDE”, “Ready for your learner’s licence?”, “Study. Practise. Build confidence.” Screenshot text is real Plus Jakarta Sans and checked against caption JSON. All image and font loads completed before export; headlines and app panels do not overlap.

## Evidence and scope

- `capture-manifest.json`: 47 authentic source captures (42 production scenes + five supplementary localized views), source commit and demo state.
- `render-manifest.json`: 42 screenshot exports, source image paths, dimensions and panel geometry.
- `asset-validation.json`: 45 final files with exact dimensions, RGB/no-alpha verification, byte counts and hashes.
- `copy-validation.json`: 10 copy fields within their limits.
- `link-checks.json`: public destination checks, including canonical redirect.

All seven scenes were visually reviewed across the phone/tablet sets. This is storefront creative QA on the web rendering, not native-device or linguistic certification. Source alignment with the successful Azure release was confirmed; an installed-build comparison remains a pre-publication step.
