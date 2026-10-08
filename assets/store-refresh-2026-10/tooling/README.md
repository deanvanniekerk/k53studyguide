# Reproduction notes

These are creative production helpers, not app changes. The final images work independently of these tools.

## Real app captures

From the repository root, run `node assets/store-refresh-2026-10/tooling/prepare-capture.mjs`, then `SHOW_DEBUG=false pnpm --filter app start --port 3012 --host 127.0.0.1`.

**Use the dedicated port.** `seed.ts` clears Preferences in that local origin to create isolated demonstration progress and a locally owned Premium state. Never point it at a production account. It imports the existing app entry point, content and questions; it does not redraw or restyle the UI. Both native targets deliberately use Ionic `md` mode in the production source.

Navigate the internal browser to `http://127.0.0.1:3012/storefront-capture.html?w=402&h=874&z=3&scene=study`. Set the browser viewport to `w*z` by `h*z`. Scenes: `study`, `quiz`, `test`, `content`, `results`, `languages`, `dark`. An optional `lang=xh` captures translated study content. Wait for `body[data-capture-ready="true"]`, loaded fonts and decoded app images. Save a **full-page JPEG**; a viewport-only capture can be capped at 2,160 pixels high by the browser backend. Check the actual image dimensions.

| Family | CSS viewport | Render scale | Source pixels |
| --- | --- | --- | --- |
| iphone | 402 × 874 | 3 | 1,206 × 2,622 |
| iphone-faceid-large | 428 × 926 | 3 | 1,284 × 2,778 |
| android-phone | 360 × 640 | 3 | 1,080 × 1,920 |
| android-7 | 800 × 1,280 | 2 | 1,600 × 2,560 |
| android-10 | 960 × 1,536 | 2 | 1,920 × 3,072 |
| ipad | 1,032 × 1,376 | 2 | 2,064 × 2,752 |

Scale comes from iframe CSS zoom in the capture wrapper, **not an emulated native device-pixel ratio**. Width and height still determine the app's genuine responsive layout. Fonts and source content render at the recorded scale. Tablet captures use tablet widths.

After capture, remove only the two temporary files created by this helper: `pkg/app/storefront-seed.html` and `pkg/app/storefront-capture.html`. They were removed from the delivered workspace.

## Marketing exports

Run `node assets/store-refresh-2026-10/tooling/serve.mjs`. Open `/tooling/render.html?family=iphone&scene=study` at the target export viewport. Wait for `body[data-ready="true"]` and use a full-page JPEG. `render.html` contains the exact captions, layout and source-image mapping. Google Fonts supplies Plus Jakarta Sans during rendering; exported JPEGs have no font/network dependency.

Use the output sizes in `../REVIEW.md`. Landscape queries are `?landscape=play`, `?landscape=apple` and `?landscape=search`. Their source artwork is in `../concepts/`. Backgrounds use an aspect-ratio-preserving cover fit; app screenshot panels use uniform scaling with no content editing. Soft shadows and slight corner rounding are applied outside their content.

Run `python3 assets/store-refresh-2026-10/tooling/validate.py` on macOS to check raster dimensions, RGB/JPEG/no alpha, file sizes, caption limits and recorded panel geometry. It uses `sips` for metadata inspection only; it never edits an image. Refresh the manifests and repeat visual QA after any new capture or renderer edit. The current manifests describe the delivered exports, not arbitrary future changes.
