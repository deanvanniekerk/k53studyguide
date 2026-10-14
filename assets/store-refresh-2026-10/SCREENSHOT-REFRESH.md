# Screenshot refresh — 1.41 (42)

14 October 2026. Requested: larger app captures, one title sentence per image, subdued background.

All 42 screenshots now use one authentic capture, with no supporting paragraph or separate brand/badge. Premium is named in the test/results titles. Dark mode uses one large screen. The original source captures are unchanged; this release changes purchase recovery, which is not depicted in these seven feature screens. Landscape feature/header/search artwork is unchanged.

The app panel fits uniformly within 94% of the export width and 86% of its height. On iPhone the panel grows from 71% to 86% of canvas height (21% larger linearly). The quiet indigo/teal background was generated with built-in Image Gen; the [prompt and provenance](qa/screenshot-refresh-generation.json) are retained. A local OFL font makes the HTML renderer reproducible without Google Fonts access.

Validation: 42 screenshot exports and three existing landscape graphics pass exact dimensions, RGB/JPEG/no alpha and file-size limits. Screenshot geometry confirms no distortion, cropped panels or headline overlap. All seven stories were visually reviewed across phone and tablet layouts. No conversion improvement is claimed before measurement.

## Store status

- Apple: 1.41 draft created. All 21 screenshots uploaded: Dynamic Island medium, Face ID large override and iPad 13-inch, seven ordered images each. New purchase-recovery release notes saved. Build 42 attached and submitted on 14 October 2026; status **Waiting for Review**. Existing manual release setting retained.
- Google Play: all 21 screenshots uploaded and ordered across phone, 7-inch tablet and 10-inch tablet. Submitted with production release 1.41 (42) on 14 October 2026. Publishing overview shows **Changes in review**, with automated quick checks still running at submission. Managed publishing remains off: approval will publish the release to 100% of the existing target countries. No supported devices were lost.
- Azure: run 1820 succeeded in 38m 38s, building native 1.41 (42) from main commit 5ddbaab and uploading iOS to App Store Connect. Downloaded Android APK package/version verified; v2 and v3 signatures passed. Screenshot assets are on main at ddbda81 and do not require a native rebuild.

Google Play returned three non-blocking warnings: APK rather than App Bundle, no deobfuscation mapping, and no native debug symbols. These affect optimisation/diagnostics, not submission eligibility. No new real-device or real-store purchase smoke was performed during this submission. Store submission is not approval or public availability.

## Release notes for 1.41

Improved Premium store loading on unreliable connections. If the store cannot load, clearer feedback and a retry option help you reconnect. Premium availability refreshes when your connection returns or you reopen the app. Your free study material and quizzes remain available.
