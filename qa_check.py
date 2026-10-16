from pathlib import Path
from collections import Counter
from bs4 import BeautifulSoup
import json, re, fitz, subprocess
root=Path(__file__).parent
js=(root/'data.js').read_text()
items=json.loads(js[js.index('['):js.rindex(']')+1])
assert len(items)==34,len(items)
assert len(set(x['title'] for x in items))==34
pdfs=[x for x in items if x.get('kind')!='image']
images=[x for x in items if x.get('kind')=='image']
assert len(pdfs)==32 and len(images)==2
assert len(set(x['driveId'] for x in pdfs))==32
cats=Counter(x['category'] for x in items)
assert cats=={'Learning Paths':9,'Hands-on Labs':3,'Training & Courses':10,'Internships':2,'CTFs & Challenges':6,'Research & Conferences':2,'Assessments & Skills':2},cats
for item in items:
 assert item.get('detail') and item.get('credentialType') and item.get('focus'),item['title']
 for key in (['source','preview'] if item.get('kind')=='image' else ['pdf','preview']):
  path=root/item[key]
  assert path.is_file(),(key,path)
  assert path.stat().st_size>1000,path
 if item in pdfs:
  with fitz.open(root/item['pdf']) as d:
   assert d.page_count == item['pages'] and d.page_count>=1
  assert re.fullmatch('[A-Za-z0-9_-]+',item['driveId'])
assert len(list((root/'assets/certificates').glob('*.pdf')))==32
assert len(list((root/'assets/previews').glob('*.webp')))==34
assert (root/'assets/background/restaurant-bricks.webp').is_file()
html=BeautifulSoup((root/'index.html').read_text(),'html.parser')
assert html.select_one('#filter-strip') and html.select_one('#featured-wall')
assert html.select_one('#viewer-description')
assert not html.select('.site-footer,.about-strip,.collection-heading,.gallery-topline')
assert len(html.select('.profile-nav .profile-link')) == 3
assert html.select_one('#identity-title') and html.select_one('.hero-arabic')
assert 'كلما ازددت علمًا، ازددت إدراكًا بمدى جهلي.' in html.select_one('.hero-arabic').get_text()
assert not any('EnglishScore CEFR B2' in x['title'] for x in items)
assert any('(eJPT Prep)' in x['title'] for x in items) and any('(eCIR Prep)' in x['title'] for x in items)
s=(root/'script.js').read_text()
for name in ['CORELiA — Cyber Security (RED) Internship','HTB Pro Lab — APTLabs','HTB Academy — Penetration Tester Path (CPTS Preparation)']:
 assert name in s and any(x['title']==name for x in items)
for cat in cats: assert cat in s
for script in ('script.js','data.js'):
 subprocess.run(['node','--check',str(root/script)],check=True)
print('PASS: 32 originals, 2 HexTree screenshots, 34 matching previews, 7 audited categories, 3 featured, UI and JS OK')

assert {x["title"] for x in items if x["title"].startswith("HTB Pro Lab — ")}=={"HTB Pro Lab — APTLabs","HTB Pro Lab — Zephyr"}
assert {p.stem for p in (root/"assets/certificates").glob("HTB Pro Lab*.pdf")}=={"HTB Pro Lab - APTLabs","HTB Pro Lab - Zephyr"}
