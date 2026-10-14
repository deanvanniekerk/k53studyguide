"""Render an edited product demo from authentic browser captures (not live footage).

Requires Pillow and ffmpeg. Run with --ffmpeg /path/to/ffmpeg.
App panels are cropped/scaled only; no UI content is synthesized or retouched.
"""
from pathlib import Path
import argparse
import subprocess
from PIL import Image, ImageDraw, ImageFont, ImageOps

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
BRAND = ROOT.parent / 'store-refresh-2026-10'
W, H, FPS, SECONDS = 1080, 1920, 30, 20
TEAL, WHITE = '#80f3df', '#ffffff'


def font(size, bold=False):
    f = ImageFont.truetype(str(HERE / 'PlusJakartaSans.ttf'), size)
    f.set_variation_by_axes([800 if bold else 500])
    return f


def text(draw, xy, value, size, fill=WHITE, bold=False, anchor=None):
    draw.text(xy, value, font=font(size, bold), fill=fill, anchor=anchor,
              spacing=8, stroke_width=0)


background = ImageOps.fit(Image.open(BRAND / 'concepts/portrait-background.png').convert('RGB'), (W, H))
background = Image.blend(background, Image.new('RGB', (W, H), '#151545'), .25)
icon = Image.open(ROOT.parent.parent / 'pkg/lander/assets/logo.png').convert('RGBA')
scenes = [
    (0, 5, '01-question.png', 'Know this\nroad sign?', 'A quick quiz. A little more confidence.', 'CHOOSE YOUR ANSWER'),
    (5, 7, '02-answer.png', 'Make your\nchoice.', 'Short quizzes. Focused practice.', 'QUESTION 2 OF 6'),
    (7, 9, '03-result.png', 'Finish your\nquiz.', 'See your score and points earned.', 'AFTER ALL SIX QUESTIONS'),
    (9, 12, '04-review.png', 'Review your\nanswers.', 'See which answers you got right.', 'LEARN FROM YOUR RESULTS'),
    (12, 16, '05-study.png', 'Build your\nroad knowledge.', 'Go straight to the related study material.', 'STUDY AT YOUR OWN PACE'),
]
# Crop the wrapper gutter, app toolbar and bottom navigation. The remaining
# contiguous rectangle is preserved without edits to any text, sign or state.
panels = {name: Image.open(ROOT / 'source' / name).convert('RGB').crop((0, 130, 804, 1416))
          for _, _, name, *_ in scenes}


def frame(t):
    out = background.copy()
    d = ImageDraw.Draw(out)
    text(d, (76, 100), 'K53 STUDY GUIDE', 30, bold=True)
    d.rounded_rectangle((76, 159, 180, 166), radius=3, fill=TEAL)
    if t < 16:
        start, end, name, title, sub, footer = next(s for s in scenes if s[0] <= t < s[1])
        progress = (t - start) / (end - start)
        ease = 1 - (1 - min(1, (t - start) / .4)) ** 3
        text(d, (76, 199 + int((1-ease)*22)), title, 78, bold=True)
        # Gentle camera move on the entire authentic panel; no invented tap UI.
        panel = panels[name]
        width = 876 + int(progress * 12)
        height = round(width * panel.height / panel.width)
        x, y = (W-width)//2, 451
        d.rounded_rectangle((x-10, y-10, x+width+10, y+height+10), radius=34, fill='#192458')
        resized = panel.resize((width, height), Image.Resampling.LANCZOS)
        mask = Image.new('L', (width, height), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, width, height), radius=25, fill=255)
        out.paste(resized, (x,y), mask)
        # Footer is drawn on its own solid band for contrast over the artwork.
        d.rectangle((0,1740,W,H), fill='#151b50')
        text(d, (540,1780), footer, 25, TEAL, True, 'mm')
        text(d, (540,1833), sub, 30, WHITE, False, 'mm')
    else:
        # One headline, with the app icon replacing the text-heavy feature graphic.
        mark=icon.resize((288,288),Image.Resampling.LANCZOS)
        out.paste(mark,(396,405),mark)
        text(d,(540,820),'Start studying',86,WHITE,True,'mm')
        text(d,(540,930),'free.',86,WHITE,True,'mm')
        d.rounded_rectangle((100,1080,980,1212),radius=66,fill=TEAL)
        text(d,(540,1142),'Download K53 Study Guide',43,'#16235b',True,'mm')
        text(d,(540,1300),'Google Play  ·  App Store',35,WHITE,True,'mm')
        text(d,(540,1365),'k53studyguide.online',33,WHITE,False,'mm')
        text(d,(540,1485),'Mock tests: one-time Premium',30,WHITE,False,'mm')
        # Attribution travels with the exported ad; full clickable credit is also
        # retained in the music notice and in MP4 metadata.
        d.rectangle((0,1730,W,H),fill='#151b50')
        text(d,(540,1780),'Music: “Carefree” — Kevin MacLeod (incompetech.com)',24,WHITE,False,'mm')
        text(d,(540,1825),'CC BY 4.0 · excerpt, volume adjustment and fades',24,WHITE,False,'mm')
        text(d,(540,1870),'creativecommons.org/licenses/by/4.0',24,WHITE,False,'mm')
    return out


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--ffmpeg',default='ffmpeg')
    args=parser.parse_args()
    final=ROOT/'final'
    final.mkdir(exist_ok=True)
    command=[args.ffmpeg,'-hide_banner','-loglevel','error','-y','-f','rawvideo',
             '-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-',
             '-i',str(ROOT/'audio/carefree-kevin-macleod.mp3'),
             '-map','0:v:0','-map','1:a:0','-t',str(SECONDS),
             '-af','atrim=duration=20,asetpts=PTS-STARTPTS,volume=-3dB,afade=t=in:st=0:d=0.3,afade=t=out:st=18.5:d=1.5',
             '-c:a','aac','-b:a','192k','-ar','48000',
             '-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p',
             '-metadata','title=K53 Study Guide — quiz demonstration v2',
             '-metadata','comment=Music: Carefree by Kevin MacLeod (https://incompetech.com/music/royalty-free/index.html?gt=&isrc=USUAN1400037), licensed CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Excerpt, volume adjustment and fades.',
             '-movflags','+faststart',str(final/'k53-quiz-demo-portrait-v2.mp4')]
    process=subprocess.Popen(command,stdin=subprocess.PIPE)
    for n in range(FPS*SECONDS):
        process.stdin.write(frame(n/FPS).tobytes())
    process.stdin.close()
    if process.wait():
        raise SystemExit('Video encoding failed')
    frame(1).save(final/'poster.jpg',quality=94)
    frame(18).save(final/'end-card-v2.jpg',quality=94)
    sheet=Image.new('RGB',(1080,1280),'#111128')
    for i,t in enumerate([1,5.5,7.5,10,13,18]):
        shot=frame(t).resize((360,640),Image.Resampling.LANCZOS)
        sheet.paste(shot,((i%3)*360,(i//3)*640))
    sheet.save(final/'review-contact-sheet.jpg',quality=92)
    print(final/'k53-quiz-demo-portrait-v2.mp4')


if __name__ == '__main__':
    main()
