/* =========================================
   Excel → JSON Translation Exporter
   Core Application Logic
   ========================================= */

(function () {
  'use strict';

  // ── Language mapping ──────────────────────────────────────────
  const LANGUAGE_MAP = {
    'English':                  'en',
    'French':                   'fr',
    'Spanish':                  'es',
    'Italian':                  'it',
    'German':                   'de',
    'Chinese Simplified (CN)':  'zh-hans',
    'Chinese Traditional (CT)': 'zh-hant',
    'Japanese':                 'jp',
    'Russian':                  'ru',
  };

  // Ordered list for tab display
  const LANGUAGE_ORDER = ['en', 'fr', 'es', 'it', 'de', 'zh-hans', 'zh-hant', 'jp', 'ru'];

  const LANG_DISPLAY_NAMES = {
    'en':      'en.json',
    'fr':      'fr.json',
    'es':      'es.json',
    'it':      'it.json',
    'de':      'de.json',
    'zh-hans': 'zh-hans.json',
    'zh-hant': 'zh-hant.json',
    'jp':      'jp.json',
    'ru':      'ru.json',
  };

  // ── State ─────────────────────────────────────────────────────
  let generatedFiles = {};   // { 'en': {...}, 'fr': {...}, ... }
  let activeTab = 'en';
  let uploadedFileName = '';

  // ── DOM References ────────────────────────────────────────────
  const uploadSection   = document.getElementById('upload-section');
  const previewSection  = document.getElementById('preview-section');
  const uploadZone      = document.getElementById('upload-zone');
  const fileInput       = document.getElementById('file-input');
  const btnReset        = document.getElementById('btn-reset');
  const btnExport       = document.getElementById('btn-export');
  const btnCopy         = document.getElementById('btn-copy');
  const btnDownloadSingle = document.getElementById('btn-download-single');
  const fileNameEl      = document.getElementById('file-name');
  const fileMetaEl      = document.getElementById('file-meta');
  const tabsScroll      = document.getElementById('tabs-scroll');
  const jsonCodeContent = document.getElementById('json-code-content');
  const toast           = document.getElementById('toast');
  const toastMessage    = document.getElementById('toast-message');

  // ── Event Listeners ───────────────────────────────────────────

  // Upload zone click
  uploadZone.addEventListener('click', () => fileInput.click());

  // File input change
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });

  // Drag & drop
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });

  uploadZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  // Reset
  btnReset.addEventListener('click', resetApp);

  // Export zip
  btnExport.addEventListener('click', exportZip);

  // Copy JSON
  btnCopy.addEventListener('click', copyCurrentJson);

  // Download single file
  btnDownloadSingle.addEventListener('click', downloadSingleFile);

  // ── File Handling ─────────────────────────────────────────────

  function handleFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'xlsx' && ext !== 'xls') {
      showToast('Please upload an .xlsx or .xls file');
      return;
    }

    uploadedFileName = file.name;
    showLoading();

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });

        parseAndGenerate(rows);
        showPreview();
        hideLoading();
        showToast('File parsed successfully!', 'success');
      } catch (err) {
        hideLoading();
        console.error('Parse error:', err);
        showToast('Failed to parse file. Check the format.');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  // ── Parsing & JSON Generation ─────────────────────────────────

  function parseAndGenerate(rows) {
    if (rows.length < 2) {
      showToast('File appears to be empty');
      return;
    }

    // Header row — detect column indices
    const headerRow = rows[0];
    const columnMap = {}; // { langCode: columnIndex }
    let labelCol = -1;
    let keyCol = -1;

    for (let i = 0; i < headerRow.length; i++) {
      const header = String(headerRow[i]).trim();
      if (header.toLowerCase() === 'label') {
        labelCol = i;
      } else if (header.toLowerCase() === 'key') {
        keyCol = i;
      } else {
        // Check if it matches a known language
        for (const [langHeader, langCode] of Object.entries(LANGUAGE_MAP)) {
          if (header === langHeader) {
            columnMap[langCode] = i;
            break;
          }
        }
      }
    }

    if (labelCol === -1 || keyCol === -1) {
      showToast('Could not find "Label" and "Key" columns');
      return;
    }

    // Initialize JSON structures for each language
    generatedFiles = {};
    for (const langCode of Object.keys(columnMap)) {
      generatedFiles[langCode] = {
        caliberModel: '',
        steps: {},
      };
    }

    // Track step order for consistent output
    const stepOrder = [];

    // Process data rows
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      const label = String(row[labelCol] || '').trim();
      const key = String(row[keyCol] || '').trim();

      // Skip empty rows
      if (!label) continue;

      // CaliberModel row (no key)
      if (label.toLowerCase() === 'calibermodel') {
        for (const [langCode, colIdx] of Object.entries(columnMap)) {
          const val = String(row[colIdx] || '').trim();
          generatedFiles[langCode].caliberModel = val;
        }
        continue;
      }

      // Regular step row
      if (!stepOrder.includes(label)) {
        stepOrder.push(label);
        // Initialize step in all languages
        for (const langCode of Object.keys(columnMap)) {
          generatedFiles[langCode].steps[label] = {};
        }
      }

      for (const [langCode, colIdx] of Object.entries(columnMap)) {
        const val = String(row[colIdx] || '').trim();
        const step = generatedFiles[langCode].steps[label];

        if (key === 'title' || key === 'text') {
          step[key] = val;
        } else if (key === 'infoOverlay.title') {
          if (!step.infoOverlay) step.infoOverlay = { heading: {} };
          if (!step.infoOverlay.heading) step.infoOverlay.heading = {};
          step.infoOverlay.heading.title = val;
        } else if (key === 'infoOverlay.subtitle') {
          if (!step.infoOverlay) step.infoOverlay = { heading: {} };
          if (!step.infoOverlay.heading) step.infoOverlay.heading = {};
          step.infoOverlay.heading.subtitle = val;
        } else if (key === 'infoOverlay.text') {
          if (!step.infoOverlay) step.infoOverlay = { heading: {} };
          step.infoOverlay.text = val;
        } else if (key) {
          // Generic fallback: set dot-notation path
          setNestedValue(step, key, val);
        }
      }
    }

    // Store step count for metadata display
    generatedFiles._meta = { stepCount: stepOrder.length };
  }

  /**
   * Set a value at a dot-notation path on an object.
   * e.g., setNestedValue(obj, 'a.b.c', 'val') → obj.a.b.c = 'val'
   */
  function setNestedValue(obj, path, value) {
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]] || typeof current[parts[i]] !== 'object') {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
  }

  // ── UI: Show Preview ──────────────────────────────────────────

  function showPreview() {
    uploadSection.style.display = 'none';
    previewSection.style.display = 'block';
    btnReset.style.display = 'inline-flex';
    btnExport.style.display = 'inline-flex';

    // File info
    fileNameEl.textContent = uploadedFileName;
    const stepCount = generatedFiles._meta?.stepCount || 0;
    const langCount = Object.keys(generatedFiles).filter(k => k !== '_meta').length;
    fileMetaEl.textContent = `${stepCount} steps · ${langCount} languages`;

    // Build tabs
    buildTabs();

    // Show first tab
    activeTab = LANGUAGE_ORDER.find(lang => generatedFiles[lang]) || Object.keys(generatedFiles).find(k => k !== '_meta');
    setActiveTab(activeTab);
  }

  function buildTabs() {
    tabsScroll.innerHTML = '';
    for (const lang of LANGUAGE_ORDER) {
      if (!generatedFiles[lang]) continue;

      const btn = document.createElement('button');
      btn.className = 'tab-btn';
      btn.dataset.lang = lang;
      btn.textContent = LANG_DISPLAY_NAMES[lang] || `${lang}.json`;
      btn.addEventListener('click', () => setActiveTab(lang));
      tabsScroll.appendChild(btn);
    }
  }

  function setActiveTab(lang) {
    activeTab = lang;

    // Update tab visuals
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Render JSON
    const jsonObj = getCleanJson(lang);
    const jsonStr = JSON.stringify(jsonObj, null, 2);
    jsonCodeContent.innerHTML = syntaxHighlight(jsonStr);
  }

  /**
   * Get the JSON object for a language, excluding internal _meta keys.
   */
  function getCleanJson(lang) {
    const obj = generatedFiles[lang];
    if (!obj) return {};
    // Return a clean copy without _meta
    return { caliberModel: obj.caliberModel, steps: obj.steps };
  }

  // ── JSON Syntax Highlighting ──────────────────────────────────

  function syntaxHighlight(json) {
    // Escape HTML first
    json = json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return json.replace(
      /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'json-string';    // default: string value
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'json-key';       // key
          }
        } else if (/true|false/.test(match)) {
          cls = 'json-boolean';
        } else if (/null/.test(match)) {
          cls = 'json-null';
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  }

  // ── Export ─────────────────────────────────────────────────────

  async function exportZip() {
    const zip = new JSZip();

    for (const lang of LANGUAGE_ORDER) {
      if (!generatedFiles[lang]) continue;
      const jsonObj = getCleanJson(lang);
      const jsonStr = JSON.stringify(jsonObj, null, 2);
      const fileName = `${lang}.json`;
      zip.file(fileName, jsonStr);
    }

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');

      // Name zip after caliber model or file
      const caliberModel = generatedFiles.en?.caliberModel || 'translations';
      const zipName = caliberModel.toLowerCase().replace(/\s+/g, '-') + '.zip';

      a.href = url;
      a.download = zipName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Zip exported successfully!', 'success');
    } catch (err) {
      console.error('Export error:', err);
      showToast('Failed to generate zip file');
    }
  }

  function downloadSingleFile() {
    const jsonObj = getCleanJson(activeTab);
    const jsonStr = JSON.stringify(jsonObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`${activeTab}.json downloaded`, 'success');
  }

  function copyCurrentJson() {
    const jsonObj = getCleanJson(activeTab);
    const jsonStr = JSON.stringify(jsonObj, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
      showToast('Copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Failed to copy');
    });
  }

  // ── Reset ─────────────────────────────────────────────────────

  function resetApp() {
    generatedFiles = {};
    activeTab = 'en';
    uploadedFileName = '';
    fileInput.value = '';

    uploadSection.style.display = '';
    previewSection.style.display = 'none';
    btnReset.style.display = 'none';
    btnExport.style.display = 'none';
    tabsScroll.innerHTML = '';
    jsonCodeContent.innerHTML = '';
  }

  // ── Toast Notifications ───────────────────────────────────────

  let toastTimeout = null;

  function showToast(message, type = '') {
    toastMessage.textContent = message;
    toast.className = 'toast show' + (type ? ` ${type}` : '');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.className = 'toast';
    }, 3000);
  }

  // ── Loading Overlay ───────────────────────────────────────────

  let loadingEl = null;

  function showLoading() {
    loadingEl = document.createElement('div');
    loadingEl.className = 'loading-overlay';
    loadingEl.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loadingEl);
  }

  function hideLoading() {
    if (loadingEl) {
      loadingEl.remove();
      loadingEl = null;
    }
  }

})();
