/* Static website. Original Google Drive PDFs plus two verified HexTree screenshots. */
(() => {
  'use strict';
  const state = { category: 'All', query: '', visible: [], viewerIndex: 0 };
  const categories = [
    'All', 'Learning Paths', 'Hands-on Labs', 'Training & Courses',
    'Internships', 'CTFs & Challenges', 'Research & Conferences', 'Assessments & Skills'
  ];
  const featureNames = [
    'CORELiA — Cyber Security (RED) Internship',
    'HTB Pro Lab — APTLabs',
    'HTB Academy — Penetration Tester Path (CPTS Preparation)'
  ];
  const featuredDocs = featureNames.map(name => CERTIFICATES.find(item => item.title === name)).filter(Boolean);
  const $ = selector => document.querySelector(selector);
  const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safePath = name => name.split('/').map(encodeURIComponent).join('/');
  const pathOf = (item, type) => safePath(item[type]);


  function makeCard(item, featured = false) {
    const article = document.createElement('article');
    article.className = 'certificate-card' + (featured ? ' featured-card' : '');
    article.dataset.title = item.title;
    const clickable = document.createElement('button');
    clickable.type = 'button';
    clickable.className = 'frame-trigger';
    clickable.setAttribute('aria-label', `View ${item.kind === 'image' ? 'achievement evidence' : 'original document'}: ${item.title}`);
    clickable.innerHTML = `
      <div class="frame">
        <span class="frame-glint" aria-hidden="true"></span>
        <div class="frame-recess"><img src="${pathOf(item, 'preview')}" loading="${featured ? 'eager' : 'lazy'}" decoding="async" alt="Preview of ${escapeHTML(item.title)}"></div>
      </div>
      <div class="certificate-caption">
        <span class="caption-overline">${escapeHTML(item.issuer)}</span>
        <h3>${escapeHTML(item.title)}</h3>
        <span class="caption-type">${escapeHTML(item.credentialType)}</span>
        <span class="open-hint" aria-hidden="true">${item.kind === 'image' ? 'VIEW SCREENSHOT EVIDENCE ↗' : 'EXAMINE THE ORIGINAL ↗'}</span>
      </div>`;
    clickable.addEventListener('click', () => openDocument(item));
    article.appendChild(clickable);
    return article;
  }

  function renderFilterChips() {
    const strip = $('#filter-strip');
    const fragment = document.createDocumentFragment();
    categories.forEach(name => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'filter-chip';
      button.textContent = name;
      button.setAttribute('aria-pressed', String(state.category === name));
      const number = name === 'All' ? CERTIFICATES.length : CERTIFICATES.filter(c => c.category === name).length;
      button.title = `${number} documents`;
      button.addEventListener('click', () => {
        state.category = name;
        renderFilterChips();
        renderGallery();
      });
      fragment.appendChild(button);
    });
    strip.replaceChildren(fragment);
  }

  function renderGallery() {
    const isDefaultView = state.category === 'All' && !state.query.trim();
    const lowerQuery = state.query.trim().toLocaleLowerCase();
    const matched = CERTIFICATES.filter(item =>
      (state.category === 'All' || item.category === state.category) &&
      (!lowerQuery || `${item.title} ${item.sourceTitle} ${item.issuer} ${item.category} ${item.focus} ${item.credentialType} ${item.detail}`.toLocaleLowerCase().includes(lowerQuery))
    );
    state.visible = matched;
    $('#featured-section').hidden = !isDefaultView;
    const chosen = isDefaultView ? matched.filter(item => !featureNames.includes(item.title)) : matched;
    const fragment = document.createDocumentFragment();
    for (const item of chosen) fragment.appendChild(makeCard(item));
    $('#gallery-grid').replaceChildren(fragment);
    $('#no-results').hidden = matched.length > 0;
  }

  const viewer = $('#certificate-dialog');
  function openDocument(item) {
    const i = state.visible.findIndex(other => other.title === item.title);
    state.viewerIndex = i >= 0 ? i : CERTIFICATES.findIndex(other => other.title === item.title);
    if (state.viewerIndex < 0) state.viewerIndex = 0;
    updateViewer();
    if (!viewer.open) viewer.showModal();
  }
  function updateViewer() {
    const docs = state.visible.length ? state.visible : CERTIFICATES;
    const item = docs[state.viewerIndex];
    if (!item) return;
    const isImage = item.kind === 'image';
    $('#viewer-title').textContent = item.title;
    $('#viewer-category').textContent = `${item.issuer}  /  ${item.category}  /  ${item.credentialType}  /  ${isImage ? 'SCREENSHOT' : `${item.pages} ${item.pages === 1 ? 'PAGE' : 'PAGES'}`}`;
    $('#viewer-description').textContent = item.detail;
    $('#viewer-position').textContent = `${state.viewerIndex + 1} / ${docs.length}`;
    $('#viewer-pdf-wrap').hidden = isImage;
    $('#viewer-evidence').hidden = !isImage;
    $('#viewer-drive').hidden = isImage;
    $('#viewer-download').textContent = isImage ? 'Download screenshot ↓' : 'Download PDF ↓';
    const file = isImage ? pathOf(item,'source') : pathOf(item,'pdf');
    $('#viewer-download').href = file;
    $('#viewer-download').download = file.split('/').pop();
    if (isImage) {
      $('#viewer-pdf').src = 'about:blank';
      $('#viewer-image').src = file;
      $('#viewer-image').alt = `Original screenshot evidence of ${item.title}`;
    } else {
      $('#viewer-image').removeAttribute('src');
      $('#viewer-pdf').title = item.title;
      $('#viewer-pdf').src = `${file}#toolbar=1&navpanes=0&view=Fit`;
      $('#viewer-drive').href = `https://drive.google.com/file/d/${item.driveId}/view`;
    }
  }
  function navigateViewer(direction) {
    const size = state.visible.length || CERTIFICATES.length;
    state.viewerIndex = (state.viewerIndex + size + direction) % size;
    updateViewer();
  }
  $('#viewer-close').addEventListener('click', () => viewer.close());
  $('#viewer-prev').addEventListener('click', () => navigateViewer(-1));
  $('#viewer-next').addEventListener('click', () => navigateViewer(1));
  viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener('close', () => { $('#viewer-pdf').src = 'about:blank'; $('#viewer-image').removeAttribute('src'); });
  document.addEventListener('keydown', event => {
    if (!viewer.open) return;
    if (event.key === 'ArrowRight') navigateViewer(1);
    if (event.key === 'ArrowLeft') navigateViewer(-1);
  });
  $('#certificate-search').addEventListener('input', event => {
    state.query = event.target.value;
    renderGallery();
  });
  $('#clear-filters').addEventListener('click', () => {
    state.category = 'All';state.query='';$('#certificate-search').value='';
    renderFilterChips();renderGallery();
  });

  $('#featured-wall').replaceChildren(...featuredDocs.map(doc => makeCard(doc,true)));
  renderFilterChips();
  renderGallery();
})();
