"""Validate deliverable metadata without modifying image pixels."""
from pathlib import Path
import hashlib,json,re,subprocess
ROOT=Path(__file__).resolve().parents[1]
EXPECTED={'google-play/phone':(1080,1920),'google-play/tablet-7':(1440,2560),'google-play/tablet-10':(1800,3200),'apple/iphone':(1206,2622),'apple/iphone-faceid-large':(1284,2778),'apple/ipad':(2064,2752),'google-play/feature-graphic.jpg':(1024,500),'apple/header.jpg':(3840,1646),'apple/search-results.jpg':(3840,2560)}
rows=[]
for f in sorted((ROOT/'final').rglob('*.jpg')):
 rel=f.relative_to(ROOT/'final'); target=EXPECTED.get(str(rel),EXPECTED.get(str(rel.parent)))
 info=subprocess.check_output(['sips','-g','pixelWidth','-g','pixelHeight','-g','format','-g','space','-g','hasAlpha',str(f)],text=True)
 def attr(k): return re.search(r'\b'+k+r': (.+)',info).group(1)
 size=(int(attr('pixelWidth')),int(attr('pixelHeight')))
 assert size==target,(str(rel),size,target)
 assert attr('format')=='jpeg' and attr('hasAlpha')=='no' and attr('space')=='RGB',info
 limit=15000000 if str(rel)=='google-play/feature-graphic.jpg' else 8000000
 assert f.stat().st_size<=limit,str(rel)
 rows.append({'file':str(rel),'width':size[0],'height':size[1],'bytes':f.stat().st_size,'format':'JPEG','colorSpace':'RGB','alpha':False,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
assert len(rows)==45,len(rows)
for key in EXPECTED:
 if not key.endswith('.jpg'):assert len(list((ROOT/'final'/key).glob('*.jpg')))==7,key
manifest=json.loads((ROOT/'qa/render-manifest.json').read_text())
for row in manifest:
 assert row['font'] and row['headerBottom']<row['screenTop'],row['file']
 for img in row['images'][1:]:
  x,y,w,h=img['box'];nw,nh=img['natural'];W,H=row['size']
  assert abs(w/h-nw/nh)<.0001,(row['file'],'distorted screen')
  assert min(x,y)>=0 and x+w<=W+1 and y+h<=H+1,(row['file'],'cropped screen')
copies=json.loads((ROOT/'qa/copy-validation.json').read_text())
for c in copies:
 value=(ROOT/'copy'/c['store']/(c['field']+'.txt')).read_text()
 assert len(value)==c['characters'] and len(value)<=c['limit'],c
(ROOT/'qa/asset-validation.json').write_text(json.dumps({'date':'2026-10-08','status':'PASS','total':len(rows),'screenshots':42,'landscapes':3,'files':rows},indent=2)+'\n')
print(f'PASS: {len(rows)} exact-size RGB JPEG assets; 42 undistorted screenshot panels; {len(copies)} copy fields within limits.')
print(f'Final assets: {sum(x["bytes"] for x in rows)/1000000:.1f} MB; largest: {max(x["bytes"] for x in rows)/1000000:.2f} MB.')
