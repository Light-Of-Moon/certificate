from pathlib import Path
import json
root=Path(__file__).parent
files=sorted((root/'assets/certificates').glob('*.pdf'))
ids={
 'NTI - Ethical Hacking':'1rBhCJEerb4CgCoaQAPAeo3DCG6tcs0vb',
 'NTI - Pentesting & Application Security':'1XYCvddRlNOgEy5Iyg_R_Y1qodq1uvJDN',
 'TryHackMe - Hacker Holidays 2026':'18kuhfNgRvYgiDzCVlR2oh5bjDPMdrGt4',
 'Amideast - Advanced STEM Program - Reduce Reuse & Recycle - Advanced Web Development':'12d8rhDWClZ3kYZF9qK245pqABUk19tSk',
 'Amideast - STEM Program - Reduce Reuse & Recycle':'1MaLxaB05b5iyd7yV5QD7mRgSuyyAnlMT',
 'British Council - EnglishScore CEFR B2':'1yqabfDfuWV3rjj-OTqbAyyhK8LxyvJrY',
 'Edraky CBA x SAP - Internship - August 2024':'1Zeivx-LNmd5gBqrNYBTuwPK9IYZIHSE5',
 'HTB Academy - AI Red Teamer Path':'1w8xXhZ9lbsj5dKVd8TDOWsiDbUQCPAx2',
 'HTB Academy - Penetration Tester Path':'1UACuMsDuBRd8oG5AmIZ9TXZeiuUcE7Bo',
 'HTB Academy - Web Penetration Tester Path':'1HnhFCRcA-U60BPaPJ9XDxi4Ynx3mhXdx',
 'Netriders Academy - eCIR Prep':'1kVL1OpzY42pMDRLLbG0eGITI5OQ-vg9O',
 'Sprints - Cybersecurity Fundamentals':'1_6ygFnhH8np93H3Ebjfvn5jqTfePOqe9',
 'TryHackMe - Pre Security':'1jbdOGxfo2lbV7JYVPxYxJNDBtN0XxymO',
 'British Council - Secondary Plus - YL Term 2 - Progress Report':'1f7cG0NP2szmTeZ3VSJjZaE5sOdZPz3rR',
 'ICMTC Finals 2026 - 8th Place':'1oTua_X5RdMLSwp-LTEgQ6h50wYiPzEIS',
 'HTB Cyber Apocalypse CTF 2026 - The Salt Crown - 123rd Place':'1ndvuta6RAB7dLlVzJzkrBXAOBUjMNq0e',
 'ICMTC 2026 - 4th Place':'12d2IIKgh-HYZqF1-_fR-a5haHjIOwJVZ',
 'E-JUST - International Japan-Africa Conference - Certificate of Attendance':'161NBOycGZJ-aUXmbMFkdeZAX2cWNr3-O',
 'VANET - Security and Attack Prevention System':'1wT71tZQQEdSniPu9s6koGuLHjq0bxH38',
 'ICMTC - Cyber Security Competition - Certificate of Participation':'1ujr21vzZ5PckGATqLt3SHyuIMJQxamXC',
 'BARQ Academy - Networking and Cyber Security Fundamentals Training':'1faCcvMTeKMp0PPVdm3fbfsLfK3ZH_ZrE',
 'HTB Pro Lab - Alchemy':'1Ng03YlGl_7RvQURUbAPUbbzA8hSFN5Ci',
 'HTB Pro Lab - Offshore':'1WWpt_7ewCVo4-kttBL7nbtD5MKQRmCDM',
 'HTB Pro Lab - Wutai':'1Uyp5pRmfYd-r_5xNzFhUayq1fN9nxn8j',
 'HTB Pro Lab - Shinra':'14NMnatfk29-xmkRbRRaHApoaaFK8q3Ne',
 'HTB Pro Lab - Dante':'1zIROQqZENnVfzmEBe1HGlB8Ku0t7cxqH',
 'HTB Pro Lab - APTLabs':'1H3iBbyS82Ov7rK9SzYacxqBz-BGWWhps',
 'HTB Pro Lab - Cybernetics':'1-4EPy5nHAAsj_GgKKVO2uJ3xgjBdmp5I',
 'HTB Pro Lab - Zephyr':'1RljsuyhhCfY6giqc40R8KhCYqEMWwq63',
 'HTB Pro Lab - Ifrit':'1H1uty92e6C2tVSr7rsFiv6u_xF_jZ3i2',
 'Wadhwani Foundation - Self-Presentation':'1nHqcEy-OrZ2QaA7t_-QuR9Btq1ImHr4F',
 'Wadhwani Foundation - Effective Speaking and Listening Skills':'16ofilTyWI-7XxUc7Wy_o5qOVMZCPNj_e',
 'CORELiA - Cyber Security RED Internship Program':'14DDD83lOArTctrcRHSJoTbLZ_RT9kZzm',
 'Orange Digital Center - Android Pentesting Internship':'1iArBKbv96XHvyxOb192tzBo_u7kqZ_M3',
 'LetsDefend - SOC Analyst Learning Path':'1LbFp0C_4dbDll0bGP5IQNOqp4Dge5FGL',
 'INE - Penetration Testing Student':'1-H-XZtKigHAPXmbZQfQokh5sAE4jT4AA',
 'INE - Incident Handling & Response Professional':'1tbTaNG_rGe28v9cDMv6aqtpgopnM-HB',
 'Typing.com - Typing Test - 53 WPM':'1CFEFZGDLzQoQDwTg0t61vjpQQlkTgXuF',
 'Security Blue Team - Blue Team Junior Analyst Pathway':'188AvhtXtJnYeBf0AHHpBZMjlSlahFVfi',
 'TryHackMe 2024':'1OmTdMt9vYG678BgLFdoDbDX5s_0Ivbe7',
}
assert len(ids)==40 and set(ids)=={x.stem for x in files},set(ids)^{x.stem for x in files}

def category(name):
 if name.startswith('VANET'):return 'Research'
 if name.startswith(('ICMTC','E-JUST','HTB Cyber Apocalypse','TryHackMe - Hacker Holidays')):return 'Events & CTFs'
 if name.startswith('HTB Pro Lab'):return 'Labs & CTFs'
 if name.startswith(('CORELiA','Orange Digital Center','Edraky')):return 'Internships'
 if name.startswith(('Netriders','LetsDefend','Security Blue Team','INE - Incident')):return 'Defensive Security'
 if name.startswith(('NTI','HTB Academy','INE - Penetration','BARQ')):return 'Offensive Security'
 return 'Learning & Skills'

def issuer(name):
 if name.startswith('HTB '): return 'Hack The Box'
 if name.startswith('ICMTC'):return 'ICMTC'
 if name.startswith('INE '):return 'INE'
 if name.startswith('NTI '):return 'NTI'
 if name.startswith('TryHackMe'):return 'TryHackMe'
 if name.startswith('BARQ'):return 'BARQ Academy'
 if name.startswith('Orange'):return 'Orange Digital Center'
 if name.startswith('Edraky'):return 'Edraky CBA × SAP'
 if name.startswith('Netriders'):return 'Netriders Academy'
 return name.split(' - ')[0]

import fitz
items=[]
for file in files:
 name=file.stem
 with fitz.open(file) as d:
  w,h=d[0].rect.width,d[0].rect.height
  pages=len(d)
 items.append(dict(title=name,issuer=issuer(name),category=category(name),driveId=ids[name],landscape=w>=h,ratio=round(w/h,5),pages=pages,pdf='assets/certificates/'+file.name,preview='assets/previews/'+name+'.webp'))
# Editorial ordering: center NTI first, supporting featured left/right, then group similar achievements organically.
features=['NTI - Pentesting & Application Security','NTI - Ethical Hacking','Orange Digital Center - Android Pentesting Internship']
rank={title:i for i,title in enumerate(features)}
cat_order=['Offensive Security','Internships','Defensive Security','Labs & CTFs','Events & CTFs','Learning & Skills','Research']
items.sort(key=lambda x:(0 if x['title'] in rank else 1,rank.get(x['title'],99) if x['title'] in rank else cat_order.index(x['category']),x['title']))
(root/'data.js').write_text('// Source: 40 original PDF files from the owner\'s Google Drive cet folder.\nconst CERTIFICATES = '+json.dumps(items,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
print('Generated manifest for',len(items),'original documents', ', '.join(f'{c}: {sum(1 for x in items if x["category"]==c)}' for c in cat_order))
