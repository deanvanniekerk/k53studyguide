# Quiz demonstration — revised review cut (v2)

9 October 2026. Local creative review only; no ad campaign or upload has been started.

[Watch the portrait video](final/k53-quiz-demo-portrait-v2.mp4)

- 20 seconds, 1080 × 1920 portrait, 30 fps, H.264 MP4.
- Burned-in headlines and captions, plus a quiet upbeat instrumental: “Carefree” by Kevin MacLeod. [Music credit and licence](audio/MUSIC-NOTICE.md).
- Edited from genuine app screenshots captured through the browser on this date, using app code at commit `86c73d3`. This is an animated screen-based demonstration, not continuous screen-recorded footage.
- The quiz was completed through the real interface. All six answers were correct; the displayed score and points are the app’s actual result for this demonstration, not a claim about typical learners.
- Question 2 is shown before and after selection. The edit then jumps to the completed six-question quiz, explicitly captioned “After all six questions”, followed by answer review and related study material.
- Uses the approved road background. The final card now uses the app icon and a single “Start studying free.” headline; the embedded feature graphic and duplicate headline are removed.
- Free study and quizzes are distinguished from one-time Premium mock tests.

## Sequence

| Time | Scene |
| --- | --- |
| 0–5s | “Know this road sign?” — real crossroad question |
| 5–7s | Answer selected in the actual app |
| 7–9s | Completed quiz score and points |
| 9–12s | Correct answer highlighted on the results page |
| 12–16s | Related study material |
| 16–20s | Simplified app-icon end card and download message |

## Source and reproduction

`source/` retains the unretouched browser captures, including the surrounding capture-wrapper gutter. The isolated local app used a 402 × 780 CSS-pixel iframe at 2× zoom. The renderer takes a contiguous crop of the app content (x=0, y=130, width=804, height=1286), excluding the wrapper, toolbar and bottom navigation. It scales that crop uniformly and applies framing, motion and captions. A footer band covers the lowest part of the panel; all featured questions, selected answers, result and study text remain readable. There are no generated questions, replacement interface elements or simulated taps.

Run `tooling/render.py --ffmpeg /path/to/ffmpeg` with Python, Pillow and FFmpeg installed. Plus Jakarta Sans is bundled under its accompanying OFL; the font comes from the Google Fonts repository. Artwork is referenced from the previously approved store-refresh folder; the icon comes from the landing page. The renderer trims and mixes the locally stored licensed music automatically.

The approved first 16 seconds are retained. V2 revises the final card and adds music throughout; the silent v1 remains available for comparison. Landscape/square exports and a mock-test concept can follow the review. Channel-specific safe areas and upload checks remain part of campaign preparation.

## Validation

The final MP4 decoded successfully through all 600 frames with no errors. Its encoded metadata confirms 20.00 seconds, 1080 × 1920, H.264/yuv420p and 30 fps. The revised final card was visually checked. The v2 export includes stereo AAC audio at 48 kHz; measured integrated loudness is −23.1 LUFS, with a −9.4 dBFS true peak and no clipping. Audio fades in over 0.3 seconds and out over the final 1.5 seconds. Music attribution is included visibly on the final card, in MP4 metadata and in the music notice.
