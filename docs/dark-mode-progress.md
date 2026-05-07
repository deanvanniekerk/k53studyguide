# Dark Mode Progress

Last reviewed: 2026-05-06

## Completed in first implementation pass

- Normalized app-owned tokens to the `--app-*` namespace across app styles.
- Mapped Ionic global background, text, and border variables to the app palette in light and dark mode.
- Added RGB companion tokens for app text and progress colors.
- Fixed mismatched Ionic RGB companions for `--ion-color-light-rgb` and `--ion-color-secondary-contrast-rgb`.
- Replaced non-icon runtime hardcoded colors with semantic variables:
  - Progress foreground/track colors.
  - Study navigation decorative icon color.
  - Arena watermark fill.
  - Error boundary gradient.
- Browser-checked Study, Quiz, Test, and Profile in the local app.
- Fixed Profile light/dark contrast issues found during browser QA:
  - Settings select values now use `--app-text-primary`.
  - Dark palette now redefines Ionic's `dark` color token so `color="dark"` buttons invert correctly on dark surfaces.
- Removed obsolete `TEXT_COLOR` and `hexToRgb` helpers.
- Updated settings tests to include the persisted theme field and cover `themeSelector`.

## Ionic convention baseline

- App uses Ionic React `8.8.5`.
- Current dark-mode approach is the Ionic v8 CSS class approach:
  - `@ionic/react/css/palettes/dark.class.css` is imported in `pkg/app/src/App.tsx`.
  - `Startup` toggles `ion-palette-dark` on `document.documentElement`, which matches Ionic's requirement that the class is added to the `html` element.
  - `pkg/app/index.html` includes `<meta name="color-scheme" content="light dark" />`.
- Ionic docs reference:
  - Dark palette methods and `.ion-palette-dark` class: https://ionicframework.com/docs/theming/dark-mode
  - Theme/application variables and stepped colors: https://ionicframework.com/docs/theming/themes
  - `theme-color` and RGB alpha variable guidance: https://ionicframework.com/docs/theming/advanced

## Current status

- Theme setting state exists with `light | dark | system`, defaulting to `system`.
- System mode listens to `prefers-color-scheme: dark` and updates when the OS setting changes.
- Core app surfaces now use app-scoped variables:
  - Cards use `--app-card-background`.
  - Main text uses `--app-text-primary`.
  - Muted text uses `--app-text-muted`.
  - Section backgrounds use `--app-study-background`, `--app-dojo-background`, `--app-arena-background`, `--app-profile-background`, and `--app-purchase-background`.
  - Page headers use `--app-*-header-gradient` variables.
- Ionic dark palette specificity is partially handled by `.ion-palette-dark.md` and `.ion-palette-dark.ios` overrides for `--ion-background-color` and `--ion-item-background`.

## Convention checks

- Good: using `dark.class.css` is appropriate because the app has an explicit user setting instead of purely following system mode.
- Good: applying `ion-palette-dark` to `html` follows Ionic's class palette convention.
- Good: adding `color-scheme: light dark` via meta follows Ionic's guidance for native browser/system UI pieces.
- Done: `--ion-text-color` and `--ion-text-color-rgb` are explicitly mapped to `--app-text-primary`.
- Done: light and dark `--ion-background-color` and `--ion-background-color-rgb` are explicitly set to the app page background palette.
- Needs work: the app overrides `--ion-background-color` in dark mode but does not define the stepped text/background variables for the custom dark colors. Ionic's imported dark palette supplies defaults, but custom background/text values may make some components look slightly off.
- Done: `--ion-color-light` and `--ion-color-light-rgb` now match.
- Done: `--ion-color-secondary-contrast` and `--ion-color-secondary-contrast-rgb` now match.
- Done: `.alert-button.sc-ion-alert-md { color: var(--ion-color-dark); }` now resolves against a dark-palette-aware Ionic `dark` color token.

## CSS variable naming review

- Done: `--app-text-primary`, `--app-text-muted`, `--app-card-background`, `--app-divider-color`, and `--app-tab-selected-border` are app-scoped.
- Done: section backgrounds now use `--app-study-background`, `--app-dojo-background`, `--app-arena-background`, `--app-profile-background`, and `--app-purchase-background`.
- Done: header gradients now use `--app-study-header-gradient`, etc.
- Done: `--ic-*` card variables were renamed to `--app-card-*`.
- Done: `--card-shadow` was renamed to `--app-card-shadow`.
- Done: `--line-height` and `--default-padding` were renamed to `--app-line-height` and `--app-padding`.
- Done: app font size variables now use `--app-font-size-*`.

## Hardcoded runtime colors to replace

These are outside `pkg/app/src/theme/variables.css` and are likely worth naming before finishing dark mode:

- Done: `pkg/app/src/data/theme.ts` was removed; the progress foreground is now `--app-progress-foreground` and `--app-progress-foreground-rgb`.
- Done: `pkg/app/src/app/components/ProgressBar.tsx` now consumes RGB CSS variables instead of converting hex in JS.
- Done: `pkg/app/src/app/pages/study/components/SeenProgress.tsx` now passes an RGB token.
- Done: `pkg/app/src/app/pages/study/components/NavigationItem.tsx` now uses `--app-decorative-icon-color`.
- Done: `pkg/app/src/app/pages/arena/ArenaWatermark.tsx` now uses `--app-watermark-fill`.
- Done: `pkg/app/src/app/components/ErrorBoundary.tsx` now uses `--app-error-background`.

## Icon color note

There are many hardcoded `fill="#..."` values under `pkg/app/src/app/components/icons`. These look like illustrative SVG asset colors rather than theme surface colors. Do not blindly replace all of them with theme variables. Review only icons that sit directly on dark surfaces and fail contrast or brand expectations.

## Suggested next steps

1. Define custom stepped text/background variables for the custom app palette if Ionic components look off in visual QA.
2. Review alert/select/modal overlays in dark mode, especially the MD alert button override.
3. Review illustrative SVG icons only where they sit directly on dark surfaces and fail contrast or brand expectations.
4. Smoke-test light, dark, and system modes in browser, then verify on iOS/Android webviews after Capacitor sync.
