/* Static gallery. Original documents stay unchanged. */
(() => {
  'use strict';
  const state = { category: 'All', query: '', visible: [], viewerIndex: 0 };
  const categories = [
    'All', 'Learning Paths', 'Hands-on Labs', 'Training & Courses',
    'Internships', 'CTFs & Challenges', 'Research & Conferences', 'Assessments & Skills'
  ];
  const featureNames = [
    'CORELiA — Cyber Security (RED) Internship',
    'XPAND CS — Cyber Week Plus — Top 10',
    'HTB Pro Lab — APTLabs'
  ];
  const featuredDocs = featureNames.map(name => CERTIFICATES.find(item => item.title === name)).filter(Boolean);
  const $ = selector => document.querySelector(selector);
  const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safePath = name => name.split('/').map(encodeURIComponent).join('/');
  const pathOf = (item, type) => safePath(item[type]);
  const arrow = '<svg aria-hidden="true" viewBox="0 0 16 16"><path d="M4 12 12 4M4 4h8v8"/></svg>';
  const isScreenshot = item => item.kind === 'image' && item.evidenceType !== 'certificate';


  function makeCard(item, featured = false) {
    const article = document.createElement('article');
    article.className = 'certificate-card' + (featured ? ' featured-card' : '');
    article.dataset.title = item.title;
    const clickable = document.createElement('button');
    clickable.type = 'button';
    clickable.className = 'frame-trigger';
    clickable.setAttribute('aria-label', `View ${isScreenshot(item) ? 'achievement evidence' : 'original document'}: ${item.title}`);
    clickable.innerHTML = `
      <div class="frame">
        ${item.highlight ? `<span class="achievement-badge"><svg aria-hidden="true" viewBox="0 0 16 16"><path d="m8 1 2 4.3 4.7.6-3.5 3.3.9 4.8L8 11.7l-4.1 2.3.9-4.8L1.3 5.9l4.7-.6Z"/></svg>${escapeHTML(item.highlight)}</span>` : ''}
        <span class="frame-glint" aria-hidden="true"></span>
        <div class="frame-recess"><img src="${pathOf(item, 'preview')}" loading="${featured ? 'eager' : 'lazy'}" decoding="async" width="${Math.round((item.ratio || 1.4142) * 1000)}" height="1000" alt="Preview of ${escapeHTML(item.title)}"></div>
      </div>
      <div class="certificate-caption">
        <span class="caption-overline">${escapeHTML(item.issuer)}</span>
        <h3>${escapeHTML(item.displayTitle || item.title)}</h3>
        <span class="caption-type">${escapeHTML(item.credentialType)}</span>
        <span class="open-hint" aria-hidden="true">${isScreenshot(item) ? 'VIEW COMPLETION' : 'VIEW ORIGINAL'} ${arrow}</span>
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
      button.setAttribute('aria-pressed', String(state.category === name));
      const number = name === 'All' ? CERTIFICATES.length : CERTIFICATES.filter(c => c.category === name).length;
      button.innerHTML = `${escapeHTML(name)}<span class="filter-count" aria-hidden="true">${number}</span>`;
      button.title = `${number} achievements`;
      button.addEventListener('click', () => {
        state.category = name;
        for (const chip of strip.children) chip.setAttribute('aria-pressed', String(chip === button));
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
      (!lowerQuery || `${item.title} ${item.displayTitle || ''} ${item.sourceTitle} ${item.issuer} ${item.category} ${item.focus} ${item.credentialType} ${item.detail}`.toLocaleLowerCase().includes(lowerQuery))
    );
    state.visible = matched;
    $('#result-count').textContent = isDefaultView ? `${matched.length} achievements` : `${matched.length} of ${CERTIFICATES.length} achievements`;
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
    if (!viewer.open) { viewer.showModal(); $('#viewer-close').focus(); }
  }
  function updateViewer() {
    const docs = state.visible.length ? state.visible : CERTIFICATES;
    const item = docs[state.viewerIndex];
    if (!item) return;
    const isImage = item.kind === 'image';
    $('#viewer-title').textContent = item.displayTitle || item.title;
    $('#viewer-category').textContent = `${item.issuer}  /  ${item.credentialType}  /  ${isImage ? (isScreenshot(item) ? 'COMPLETION SCREENSHOT' : 'ORIGINAL CERTIFICATE') : `${item.pages} ${item.pages === 1 ? 'PAGE' : 'PAGES'}`}`;
    $('#viewer-description').textContent = item.detail;
    $('#viewer-position').textContent = `${state.viewerIndex + 1} / ${docs.length}`;
    $('#viewer-pdf-wrap').hidden = isImage;
    $('#viewer-evidence').hidden = !isImage;
    $('#viewer-drive').hidden = !item.driveId;
    $('#viewer-download').textContent = isImage ? 'Download image ↓' : 'Download PDF ↓';
    const file = isImage ? pathOf(item,'source') : pathOf(item,'pdf');
    $('#viewer-download').href = file;
    $('#viewer-download').download = decodeURIComponent(file.split('/').pop());
    $('#viewer-original').href = file;
    if (isImage) {
      $('#viewer-pdf').src = 'about:blank';
      $('#viewer-image').src = file;
      $('#viewer-image').alt = `${isScreenshot(item) ? 'Original completion screenshot' : 'Original certificate'}: ${item.title}`;
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
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
    if (!viewer.open && event.key === '/' && !typing && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault(); $('#certificate-search').focus(); return;
    }
    if (!viewer.open || typing) return;
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
  $('#record-total').textContent = CERTIFICATES.length;
  renderFilterChips();
  renderGallery();
})();
