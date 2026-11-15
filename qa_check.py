from pathlib import Path
from collections import Counter
from html.parser import HTMLParser
import json, re, fitz, subprocess

root = Path(__file__).parent
js = (root / 'data.js').read_text()
items = json.loads(js[js.index('['):js.rindex(']') + 1])
assert len(items) == 35
assert len({x['title'] for x in items}) == 35
pdfs = [x for x in items if x.get('kind') != 'image']
images = [x for x in items if x.get('kind') == 'image']
screenshots = [x for x in images if x.get('evidenceType') != 'certificate']
assert len(pdfs) == 32 and len(images) == 3 and len(screenshots) == 2
assert len({x['driveId'] for x in pdfs}) == 32
cats = Counter(x['category'] for x in items)
assert cats == {'Learning Paths': 9, 'Hands-on Labs': 3, 'Training & Courses': 10, 'Internships': 2, 'CTFs & Challenges': 7, 'Research & Conferences': 2, 'Assessments & Skills': 2}, cats
for item in items:
    assert item.get('detail') and item.get('credentialType') and item.get('focus'), item['title']
    for key in (['source', 'preview'] if item.get('kind') == 'image' else ['pdf', 'preview']):
        path = root / item[key]
        assert path.is_file() and path.stat().st_size > 1000, (key, path)
    if item in pdfs:
        with fitz.open(root / item['pdf']) as doc:
            assert doc.page_count == item['pages'] and doc.page_count >= 1
        assert re.fullmatch('[A-Za-z0-9_-]+', item['driveId'])
assert len(list((root / 'assets/certificates').glob('*.pdf'))) == 32
assert len(list((root / 'assets/previews').glob('*.webp'))) == 35
assert (root / 'assets/background/restaurant-bricks.webp').is_file()

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.elements = []
    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, dict(attrs)))
page = Page()
html = (root / 'index.html').read_text()
page.feed(html)
ids = [attrs['id'] for tag, attrs in page.elements if 'id' in attrs]
assert len(ids) == len(set(ids)), 'Duplicate HTML IDs'
for name in ['filter-strip', 'featured-wall', 'viewer-description', 'viewer-original', 'result-count', 'record-total', 'identity-title']:
    assert name in ids
assert sum('profile-link' in attrs.get('class', '').split() for tag, attrs in page.elements) == 3
assert 'كلما ازددت علمًا، ازددت إدراكًا بمدى جهلي.' in html
assert not any('EnglishScore CEFR B2' in x['title'] for x in items)
assert any('(eJPT Prep)' in x['title'] for x in items)
assert any('(eCIR Prep)' in x['title'] for x in items)
s = (root / 'script.js').read_text()
for name in ['CORELiA — Cyber Security (RED) Internship', 'HTB Pro Lab — APTLabs', 'XPAND CS — Cyber Week Plus — Top 10']:
    assert name in s and any(x['title'] == name for x in items)
for cat in cats:
    assert cat in s
for script in ('script.js', 'data.js'):
    subprocess.run(['node', '--check', str(root / script)], check=True)
assert {x['title'] for x in items if x['title'].startswith('HTB Pro Lab — ')} == {'HTB Pro Lab — APTLabs', 'HTB Pro Lab — Zephyr'}
assert {p.stem for p in (root / 'assets/certificates').glob('HTB Pro Lab*.pdf')} == {'HTB Pro Lab - APTLabs', 'HTB Pro Lab - Zephyr'}
print('PASS: 35 records; 32 original PDFs; 2 screenshots; 1 certificate image; 35 previews; 7 categories; 3 featured; HTML and JS valid')
