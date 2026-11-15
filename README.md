# Certificate Wall

A responsive certificate gallery for Mohamed Salah / lightofthemoon. Titles, descriptions, and credential labels use concise, consistent wording. Issuers appear above the titles so they do not repeat within every card. The design keeps the red brick wall, warm gallery light, black frames, and gold details, with improved spacing, consistent frame sizes, and clearer captions.

## Open it

Extract the ZIP and open `certificate/index.html` in a browser. All styles, scripts, previews, PDFs, and images are included. No install or build is needed. If a browser blocks an embedded PDF from a local file, use **Open original** or serve the folder with `python3 -m http.server 8000`.

For GitHub Pages, upload the files inside `certificate/` to the repository root, keeping the assets directory beside index.html. Use the existing repository's Pages settings.

## Collection

35 achievements: 32 original PDFs, 2 original HexTree screenshots, and the supplied Cyber Week Plus Top 10 certificate image. Original documents are unchanged.

| Category | Records |
| --- | ---: |
| Learning Paths | 9 |
| Hands-on Labs | 3 |
| Training & Courses | 10 |
| Internships | 2 |
| CTFs & Challenges | 7 |
| Research & Conferences | 2 |
| Assessments & Skills | 2 |

The featured wall displays CORELiA, Cyber Week Plus Top 10, and APTLabs. The Top 10 certificate is larger on desktop and appears first on small screens. CPTS preparation remains in the full collection under Learning Paths.

## Gallery features

- Search titles, issuers, skills, and credential descriptions.
- Filter by category with counts and a live results count.
- Open original PDFs and images in the document viewer.
- Download originals or open the existing Google Drive links.
- Use left/right arrows in the viewer, Escape to close it, and `/` to focus search.
- Portrait and landscape documents fit fully within consistent frames.
- Phone, tablet, keyboard, and reduced-motion layouts are supported.

## Content labels

HTB Academy and INE path completions retain their learning-path labels. They do not claim a passed certification exam. APTLabs and Zephyr remain the only displayed HTB Pro Labs. The British Council EnglishScore B2 item remains excluded.

## Checks

Run `python3 qa_check.py` with Python, PyMuPDF, and Node installed. The check validates record counts, categories, original PDF page counts, assets, featured entries, HTML IDs, and JavaScript syntax. Browser checks also covered search, empty results, category filtering, image/PDF viewer navigation, and phone/tablet layouts.

The package contains the original certificate files intended for the gallery. Publishing the unpacked website makes those documents accessible to visitors.
