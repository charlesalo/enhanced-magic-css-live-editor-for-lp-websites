/* ============================================
   EnhancedMagicCSS — Floating Widget
   Injected into page as content script
   ============================================ */

(function () {
  if (window.__emcss) { window.__emcss.show(); return; }

  // ── Build widget DOM ──────────────────────────────────────────────────────
  const widget = document.createElement('div');
  widget.id = '__emcss_widget__';
  widget.innerHTML = `
    <div class="emcss__header" id="emcss-header">
      <div class="emcss__brand">
        <span class="emcss__logo">&#9889;</span>
        <span class="emcss__title">EnhancedMagicCSS</span>
      </div>
      <div class="emcss__header-actions">
        <span class="emcss__mode-badge" id="emcss-mode-badge">CSS</span>
        <button class="emcss__btn-icon" id="emcss-settings" title="Settings">&#9881;</button>
        <button class="emcss__btn-icon emcss__btn-icon--minimize" id="emcss-minimize" title="Minimize">&#8212;</button>
        <button class="emcss__btn-icon emcss__btn-icon--close" id="emcss-close" title="Close widget">&#10005;</button>
      </div>
    </div>

    <div class="emcss__tabbar" id="emcss-tabbar">
      <button class="emcss__tab emcss__tab--active" id="emcss-tab-editor">Editor</button>
      <button class="emcss__tab" id="emcss-tab-elements">Elements</button>
    </div>

    <div class="emcss__view" id="emcss-editor-view">
      <div class="emcss__statusbar">
        <span class="emcss__status" id="emcss-status">Ready &#8212; CSS/SCSS/SASS auto-detected</span>
        <span class="emcss__cursor-pos" id="emcss-cursor">Ln 1, Col 1</span>
      </div>

      <div class="emcss__editor-wrap">
        <div class="emcss__line-numbers" id="emcss-lines">1</div>
        <textarea
          class="emcss__editor"
          id="emcss-editor"
          spellcheck="false"
          autocorrect="off"
          autocapitalize="off"
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
          placeholder=".hero {&#10;  background: #fff;&#10;  padding: 40px;&#10;  h1 { font-size: 2rem; }&#10;}"
        ></textarea>
      </div>

      <div class="emcss__toolbar">
        <div class="emcss__toolbar-left">
          <button class="emcss__btn" id="emcss-format">Format</button>
          <button class="emcss__btn" id="emcss-copy">Copy</button>
          <button class="emcss__btn emcss__btn--danger" id="emcss-clear">Clear</button>
          <button class="emcss__btn emcss__btn--hover" id="emcss-hover" title="Hover mode: click any element to capture its selector">Hover</button>
        </div>
        <div class="emcss__toolbar-right">
          <label class="emcss__toggle">
            <input type="checkbox" id="emcss-auto" checked />
            <span class="emcss__toggle-track"></span>
            <span class="emcss__toggle-label">Auto-apply</span>
          </label>
          <button class="emcss__btn emcss__btn--apply" id="emcss-apply">Apply</button>
        </div>
      </div>

      <div class="emcss__footer">
        <button class="emcss__btn" id="emcss-undo">Undo</button>
        <span class="emcss__byte-count" id="emcss-bytes">0 bytes</span>
        <button class="emcss__btn" id="emcss-redo">Redo</button>
      </div>
    </div>

    <div class="emcss__view emcss__view--hidden" id="emcss-elements-view">
      <div class="emcss__el-controls">
        <select class="emcss__el-select" id="emcss-template-select">
          <option value="">&#8212; Select Template &#8212;</option>
          <option value="Masterpiece">Masterpiece</option>
          <option value="Producer">Producer</option>
          <option value="Visionary">Visionary</option>
        </select>
        <select class="emcss__el-select" id="emcss-global-moodboard" style="display:none">
          <option value="Default Build">Default Build</option>
        </select>
        <label class="emcss__toggle emcss__build-toggle" title="Pre-fill editors with saved template code">
          <input type="checkbox" id="emcss-build-mode" />
          <span class="emcss__toggle-track"></span>
          <span class="emcss__toggle-label">Build</span>
        </label>
      </div>
      <div class="emcss__el-list" id="emcss-el-list">
        <div class="emcss__el-empty">Select a template above to scan the page.</div>
      </div>
    </div>

    <div class="emcss__view emcss__view--hidden" id="emcss-settings-view">
      <div class="emcss__settings-section">
        <div class="emcss__settings-section-label">Elements</div>
        <div class="emcss__settings-form">
          <input class="emcss__settings-input" type="text" id="emcss-cust-tpl"  list="emcss-tpl-list" placeholder="Template (e.g. Producer)" autocomplete="off" />
          <datalist id="emcss-tpl-list"></datalist>
          <input class="emcss__settings-input" type="text" id="emcss-cust-name" placeholder="Element name (e.g. Boxed Text)" />
          <input class="emcss__settings-input" type="text" id="emcss-cust-id"   placeholder="ID — optional (e.g. global-navbar)" />
          <input class="emcss__settings-input" type="text" id="emcss-cust-cls"  placeholder="Class(es): same element: redesign opening-with-search — parent>child: image-section > image-wrapper" />
          <button class="emcss__btn emcss__btn--apply" id="emcss-cust-add">Add Element</button>
        </div>
        <div class="emcss__settings-divider"></div>
        <div class="emcss__settings-section-label">Browse by Template</div>
        <select class="emcss__settings-input" id="emcss-settings-tpl-filter">
          <option value="">&#8212; Select template &#8212;</option>
        </select>
        <div class="emcss__cust-list" id="emcss-cust-list"></div>
        <div class="emcss__settings-divider"></div>
        <div class="emcss__settings-section-label">Moodboards</div>
        <div class="emcss__settings-mood-form">
          <input class="emcss__settings-input" type="text" id="emcss-mood-name" placeholder="Add moodboard (e.g. Coastal)" />
          <button class="emcss__btn emcss__btn--apply" id="emcss-mood-add">Add</button>
        </div>
        <div class="emcss__mood-list" id="emcss-mood-list"></div>
        <div class="emcss__settings-divider emcss__settings-divider--danger"></div>
        <div class="emcss__settings-section-label emcss__settings-label--danger">&#9888; Delete</div>
        <div class="emcss__danger-group">
          <div class="emcss__danger-group-label">Template</div>
          <p class="emcss__danger-hint">Removes all user-added elements in the selected template.</p>
          <div class="emcss__danger-row">
            <select class="emcss__settings-input" id="emcss-del-tpl">
              <option value="">&#8212; Select template &#8212;</option>
            </select>
            <button class="emcss__btn emcss__btn--danger" id="emcss-del-tpl-btn">Delete</button>
          </div>
        </div>
        <div class="emcss__danger-group">
          <div class="emcss__danger-group-label">Element</div>
          <p class="emcss__danger-hint">Removes a specific user-added element.</p>
          <select class="emcss__settings-input" id="emcss-del-el-tpl">
            <option value="">&#8212; Template &#8212;</option>
          </select>
          <div class="emcss__danger-row">
            <select class="emcss__settings-input" id="emcss-del-el-name">
              <option value="">&#8212; Element &#8212;</option>
            </select>
            <button class="emcss__btn emcss__btn--danger" id="emcss-del-el-btn">Delete</button>
          </div>
        </div>
        <div class="emcss__danger-group">
          <div class="emcss__danger-group-label">Moodboard</div>
          <p class="emcss__danger-hint">Permanently removes a moodboard option.</p>
          <div class="emcss__danger-row">
            <select class="emcss__settings-input" id="emcss-del-bld-mood">
              <option value="">&#8212; Select moodboard &#8212;</option>
            </select>
            <button class="emcss__btn emcss__btn--danger" id="emcss-del-bld-btn">Delete</button>
          </div>
        </div>
      </div>
      <div class="emcss__settings-divider"></div>
      <div class="emcss__settings-section-label">Export to TEMPLATES</div>
      <p class="emcss__danger-hint">Generates code for all custom elements ready to paste into content.js.</p>
      <button class="emcss__btn emcss__btn--apply" id="emcss-export-btn" style="width:100%">Generate Export Code</button>
      <textarea class="emcss__settings-code emcss__export-output" id="emcss-export-out" readonly placeholder="Click Generate to produce code…" spellcheck="false"></textarea>
      <button class="emcss__btn" id="emcss-export-copy" style="width:100%;margin-top:4px;display:none">Copy to Clipboard</button>
    </div>
    <div class="emcss__rh emcss__rh--n"  data-dir="n"></div>
    <div class="emcss__rh emcss__rh--s"  data-dir="s"></div>
    <div class="emcss__rh emcss__rh--e"  data-dir="e"></div>
    <div class="emcss__rh emcss__rh--w"  data-dir="w"></div>
    <div class="emcss__rh emcss__rh--nw" data-dir="nw"></div>
    <div class="emcss__rh emcss__rh--ne" data-dir="ne"></div>
    <div class="emcss__rh emcss__rh--sw" data-dir="sw"></div>
    <div class="emcss__rh emcss__rh--se" data-dir="se"></div>
  `;

  document.body.appendChild(widget);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const editor       = widget.querySelector('#emcss-editor');
  const linesEl      = widget.querySelector('#emcss-lines');
  const statusEl     = widget.querySelector('#emcss-status');
  const cursorEl     = widget.querySelector('#emcss-cursor');
  const bytesEl      = widget.querySelector('#emcss-bytes');
  const modeBadge    = widget.querySelector('#emcss-mode-badge');
  const autoChk      = widget.querySelector('#emcss-auto');
  const tabEditor    = widget.querySelector('#emcss-tab-editor');
  const tabElements  = widget.querySelector('#emcss-tab-elements');
  const editorView   = widget.querySelector('#emcss-editor-view');
  const elementsView = widget.querySelector('#emcss-elements-view');
  const tmplSelect   = widget.querySelector('#emcss-template-select');
  const elList       = widget.querySelector('#emcss-el-list');
  const buildModeChk  = widget.querySelector('#emcss-build-mode');
  const globalMoodSel = widget.querySelector('#emcss-global-moodboard');
  const settingsBtn  = widget.querySelector('#emcss-settings');
  const settingsView = widget.querySelector('#emcss-settings-view');
  const custTplIn    = widget.querySelector('#emcss-cust-tpl');
  const custNameIn   = widget.querySelector('#emcss-cust-name');
  const custIdIn     = widget.querySelector('#emcss-cust-id');
  const custClsIn    = widget.querySelector('#emcss-cust-cls');
  const custAddBtn        = widget.querySelector('#emcss-cust-add');
  const custListEl        = widget.querySelector('#emcss-cust-list');
  const tplDatalist       = widget.querySelector('#emcss-tpl-list');
  const settingsTplFilter = widget.querySelector('#emcss-settings-tpl-filter');
  const moodNameIn        = widget.querySelector('#emcss-mood-name');
  const moodAddBtn        = widget.querySelector('#emcss-mood-add');
  const moodListEl        = widget.querySelector('#emcss-mood-list');
  const delTplSel    = widget.querySelector('#emcss-del-tpl');
  const delTplBtn    = widget.querySelector('#emcss-del-tpl-btn');
  const delElTplSel  = widget.querySelector('#emcss-del-el-tpl');
  const delElNameSel = widget.querySelector('#emcss-del-el-name');
  const delElBtn     = widget.querySelector('#emcss-del-el-btn');
  const delBldMoodSel = widget.querySelector('#emcss-del-bld-mood');
  const delBldBtn    = widget.querySelector('#emcss-del-bld-btn');

  // ── State ─────────────────────────────────────────────────────────────────
  let applyTimer   = null;
  let undoStack    = [''];
  let redoStack    = [];
  let minimized    = false;
  let lastSavedPos  = null;
  let lastSavedSize = null;
  let hoverMode    = false;
  let hoverTarget  = null;
  const DEFAULT_MOODBOARD = 'Default Build';
  let buildMode    = false;
  let customEls    = [];
  let settingsOpen = false;
  let moodboards   = ['Dark Modern', 'Light Modern', 'Earth Tones', 'Light & Bright', 'Coastal', 'Classic Elegance', 'Traditional Navy', 'Industrial'];
  let elLoadBuildFns = [];
  let excldTpls    = []; // excluded built-in template names
  let excldEls     = []; // excluded elements: [{template, name}]

  // ── Restore ───────────────────────────────────────────────────────────────
  chrome.storage.local.get(['emcss_code', 'emcss_auto', 'emcss_pos', 'emcss_size', 'emcss_build_mode', 'emcss_custom_els', 'emcss_moodboards', 'emcss_excl_tpls', 'emcss_excl_els', 'emcss_last_tpl', 'emcss_last_mood', 'emcss_last_tab'], (data) => {
    if (data.emcss_code) { editor.value = data.emcss_code; undoStack = [data.emcss_code]; }
    if (typeof data.emcss_auto !== 'undefined') autoChk.checked = data.emcss_auto;
    if (data.emcss_pos)  { lastSavedPos  = data.emcss_pos; }
    if (data.emcss_size) { lastSavedSize = data.emcss_size; widget.style.setProperty('width', data.emcss_size.w + 'px', 'important'); widget.style.setProperty('height', data.emcss_size.h + 'px', 'important'); }
    if (data.emcss_build_mode) {
      buildMode = true;
      buildModeChk.checked = true;
      globalMoodSel.style.display = '';
    }
    if (Array.isArray(data.emcss_custom_els)) {
      customEls = data.emcss_custom_els;
    }
    if (Array.isArray(data.emcss_moodboards) && data.emcss_moodboards.length) {
      moodboards = data.emcss_moodboards.filter(m => m !== DEFAULT_MOODBOARD);
    }
    if (Array.isArray(data.emcss_excl_tpls)) excldTpls = data.emcss_excl_tpls;
    if (Array.isArray(data.emcss_excl_els))  excldEls  = data.emcss_excl_els;
    renderMoodboardList();
    syncTemplateDropdown();
    renderCustomList();
    syncDeleteDropdowns();
    if (data.emcss_last_tpl && tmplSelect.querySelector(`option[value="${data.emcss_last_tpl}"]`)) {
      tmplSelect.value = data.emcss_last_tpl;
      renderElementList(scanPage(data.emcss_last_tpl), data.emcss_last_tpl);
    }
    if (data.emcss_last_mood) {
      syncGlobalMoodSel();
      const opt = globalMoodSel.querySelector(`option[value="${data.emcss_last_mood}"]`);
      if (opt) globalMoodSel.value = data.emcss_last_mood;
    }
    if (data.emcss_last_tab === 'elements') tabElements.click();
    updateAll();
    if (data.emcss_code && autoChk.checked) applyCSS();
    applyResponsive();
  });

  // ── Auto-detect mode ──────────────────────────────────────────────────────
  function detectMode(code) {
    if (!code.trim()) return 'CSS';
    if (!code.includes('{') && !code.includes('}') && /^\s{2,}\S/m.test(code)) return 'SASS';
    if (
      /\$[a-zA-Z]/.test(code)          ||
      /&[\s:{[.]/.test(code)           ||
      /@(mixin|include|extend|each|for)\b/.test(code) ||
      /\/\//.test(code)                ||
      /\{[^}]*\{/.test(code)
    ) return 'SCSS';
    return 'CSS';
  }

  // ── UI helpers ────────────────────────────────────────────────────────────
  function updateLineNumbers() {
    const count = editor.value.split('\n').length;
    linesEl.textContent = Array.from({ length: count }, (_, i) => i + 1).join('\n');
    linesEl.scrollTop = editor.scrollTop;
  }

  function updateCursor() {
    const txt = editor.value.substring(0, editor.selectionStart).split('\n');
    cursorEl.textContent = 'Ln ' + txt.length + ', Col ' + (txt[txt.length - 1].length + 1);
  }

  function updateBytes() {
    const b = new Blob([editor.value]).size;
    bytesEl.textContent = b < 1024 ? b + ' bytes' : (b / 1024).toFixed(1) + ' KB';
  }

  function updateAll() {
    updateLineNumbers();
    updateCursor();
    updateBytes();
    modeBadge.textContent = detectMode(editor.value);
  }

  function setStatus(msg, type, duration) {
    statusEl.textContent = msg;
    statusEl.className = 'emcss__status' + (type ? ' emcss__status--' + type : '');
    if (duration !== 0) {
      setTimeout(() => {
        statusEl.textContent = 'Ready \u2014 CSS/SCSS/SASS auto-detected';
        statusEl.className = 'emcss__status';
      }, duration || 3000);
    }
  }

  // ── Compiler ──────────────────────────────────────────────────────────────
  function compile(code) {
    const mode = detectMode(code);
    if (mode === 'CSS') return { css: code, error: null };
    try {
      let out = code.replace(/\/\/[^\n]*/g, '');
      if (mode === 'SASS') out = sassToScss(out);
      const vars = {};
      out = out.replace(/\$([a-zA-Z0-9_-]+)\s*:\s*([^;{}\n]+);/g, (_, n, v) => { vars[n.trim()] = v.trim(); return ''; });
      out = out.replace(/\$([a-zA-Z0-9_-]+)/g, (_, n) => vars[n] !== undefined ? vars[n] : ('var(--' + n + ')'));
      out = processMixins(out);
      out = expandNesting(out);
      return { css: out.trim(), error: null };
    } catch(e) { return { css: null, error: e.message }; }
  }

  function sassToScss(sass) {
    const result = [], stack = [];
    sass.split('\n').forEach(line => {
      if (!line.trim()) { result.push(''); return; }
      const indent = (line.match(/^(\s*)/) || ['',''])[1].length;
      const content = line.trim();
      while (stack.length && indent <= stack[stack.length - 1]) { stack.pop(); result.push('}'); }
      if (!content.includes(':') || content.endsWith(',')) {
        result.push(line + ' {'); stack.push(indent);
      } else {
        result.push(line.trimEnd() + (content.endsWith(';') ? '' : ';'));
      }
    });
    while (stack.length) { result.push('}'); stack.pop(); }
    return result.join('\n');
  }

  function processMixins(css) {
    const mixins = {};
    css = css.replace(/@mixin\s+([\w-]+)\s*(?:\(([^)]*)\))?\s*\{([\s\S]*?)\}/g, (_, n, p, b) => {
      mixins[n] = { params: p ? p.split(',').map(s => s.trim()) : [], body: b.trim() };
      return '';
    });
    return css.replace(/@include\s+([\w-]+)\s*(?:\(([^)]*)\))?;/g, (_, n, a) => {
      if (!mixins[n]) return '';
      let body = mixins[n].body;
      if (a) a.split(',').forEach((arg, i) => {
        const p = mixins[n].params[i];
        if (p) body = body.replace(new RegExp('\\' + p, 'g'), arg.trim());
      });
      return body;
    });
  }

  function expandNesting(scss) {
    function parse(input) {
      const root = { sel: '', props: '', children: [] };
      const stack = [root];
      let i = 0;
      while (i < input.length) {
        const openIdx = input.indexOf('{', i);
        if (openIdx === -1) {
          const tail = input.slice(i).trim();
          if (tail) stack[stack.length - 1].props += tail + '\n';
          break;
        }
        let depth = 1, j = openIdx + 1;
        while (j < input.length && depth > 0) {
          if (input[j] === '{') depth++;
          if (input[j] === '}') depth--;
          j++;
        }
        const before = input.slice(i, openIdx);
        const lines = before.split('\n');
        let selLine = '';
        const propLines = [];
        for (let k = lines.length - 1; k >= 0; k--) {
          if (lines[k].trim()) { selLine = lines[k].trim(); propLines.push(...lines.slice(0, k)); break; }
        }
        const propsText = propLines.join('\n').trim();
        if (propsText) stack[stack.length - 1].props += propsText + '\n';
        const body = input.slice(openIdx + 1, j - 1);
        const child = { sel: selLine, props: '', children: [] };
        stack[stack.length - 1].children.push(child);
        const sub = parse(body);
        child.props = sub.props;
        child.children = sub.children;
        i = j;
      }
      return root;
    }

    function emit(node, parent) {
      let out = '';
      const sel = node.sel || '';

      if (!sel && parent === null) {
        if (node.props.trim()) out += node.props.trim() + '\n\n';
        for (const child of node.children) out += emit(child, '');
        return out;
      }

      const isMedia     = /^@(media|supports|document|layer)\b/i.test(sel);
      const isKeyframes = /^@(keyframes|-webkit-keyframes)\b/i.test(sel);
      const isAtRule    = sel.startsWith('@');

      if (isKeyframes) {
        let inner = node.props;
        for (const c of node.children) inner += c.sel + ' {' + c.props + '}\n';
        return sel + ' {\n' + inner + '}\n\n';
      }

      if (isMedia) {
        if (parent) {
          let inner = '';
          const p = node.props.trim();
          if (p) inner += '  ' + parent + ' {\n    ' + p.replace(/\n/g, '\n    ').trim() + '\n  }\n';
          for (const child of node.children) {
            const cc = emit(child, parent);
            if (cc.trim()) inner += '  ' + cc.trim().replace(/\n/g, '\n  ') + '\n';
          }
          if (inner.trim()) out += sel + ' {\n' + inner + '}\n\n';
        } else {
          let inner = '';
          if (node.props.trim()) inner += node.props.trim() + '\n';
          for (const child of node.children) inner += emit(child, '');
          if (inner.trim()) out += sel + ' {\n  ' + inner.trim().replace(/\n/g, '\n  ') + '\n}\n\n';
        }
        return out;
      }

      if (isAtRule) {
        out += sel + ' {\n' + node.props;
        for (const c of node.children) out += c.sel + ' {\n' + c.props + '}\n';
        return out + '}\n\n';
      }

      const full = sel.includes('&')
        ? sel.replace(/&/g, parent || '').trim()
        : (parent ? parent + ' ' + sel : sel).trim();

      const propStr = node.props.trim();
      if (propStr && full) out += full + ' {\n  ' + propStr.replace(/\n/g, '\n  ').trim() + '\n}\n\n';
      for (const child of node.children) out += emit(child, full);
      return out;
    }

    return emit(parse(scss), null).trim();
  }

  // ── Draggable ─────────────────────────────────────────────────────────────
  const header = widget.querySelector('#emcss-header');
  let dragging = false, dragOffX = 0, dragOffY = 0;

  header.addEventListener('mousedown', e => {
    if (e.target.closest('button')) return;
    if (window.innerWidth <= 768) return; // no drag on mobile
    dragging = true;
    const rect = widget.getBoundingClientRect();
    dragOffX = e.clientX - rect.left;
    dragOffY = e.clientY - rect.top;
    widget.style.setProperty('right', 'auto', 'important');
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const x = Math.max(0, Math.min(e.clientX - dragOffX, window.innerWidth - widget.offsetWidth));
    const y = Math.max(0, Math.min(e.clientY - dragOffY, window.innerHeight - widget.offsetHeight));
    widget.style.setProperty('left', x + 'px', 'important');
    widget.style.setProperty('top',  y + 'px', 'important');
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    const rect = widget.getBoundingClientRect();
    lastSavedPos = { x: rect.left, y: rect.top };
    chrome.storage.local.set({ emcss_pos: lastSavedPos });
  });

  // ── Resizable ─────────────────────────────────────────────────────────────
  const MIN_W = 320, MIN_H = 300;
  let resizing = false, resizeDir = '';
  let rsX = 0, rsY = 0, rsW = 0, rsH = 0, rsLeft = 0, rsTop = 0;

  widget.querySelectorAll('.emcss__rh').forEach(handle => {
    handle.addEventListener('mousedown', e => {
      if (window.innerWidth <= 768) return;
      e.preventDefault();
      e.stopPropagation();
      resizing   = true;
      resizeDir  = handle.dataset.dir;
      rsX        = e.clientX;
      rsY        = e.clientY;
      const rect = widget.getBoundingClientRect();
      rsW = rect.width; rsH = rect.height;
      rsLeft = rect.left; rsTop = rect.top;
      widget.style.setProperty('right', 'auto', 'important');
      widget.style.setProperty('left',  rsLeft + 'px', 'important');
      widget.style.setProperty('top',   rsTop  + 'px', 'important');
    });
  });

  document.addEventListener('mousemove', e => {
    if (!resizing) return;
    const dx = e.clientX - rsX, dy = e.clientY - rsY;
    let w = rsW, h = rsH, left = rsLeft, top = rsTop;
    if (resizeDir.includes('e')) w    = Math.max(MIN_W, rsW + dx);
    if (resizeDir.includes('s')) h    = Math.max(MIN_H, rsH + dy);
    if (resizeDir.includes('w')) { w  = Math.max(MIN_W, rsW - dx); left = rsLeft + rsW - w; }
    if (resizeDir.includes('n')) { h  = Math.max(MIN_H, rsH - dy); top  = rsTop  + rsH - h; }
    widget.style.setProperty('width',  w    + 'px', 'important');
    widget.style.setProperty('height', h    + 'px', 'important');
    widget.style.setProperty('left',   left + 'px', 'important');
    widget.style.setProperty('top',    top  + 'px', 'important');
  });

  document.addEventListener('mouseup', () => {
    if (!resizing) return;
    resizing = false;
    const rect = widget.getBoundingClientRect();
    lastSavedSize = { w: rect.width, h: rect.height };
    lastSavedPos  = { x: rect.left,  y: rect.top };
    chrome.storage.local.set({ emcss_size: lastSavedSize, emcss_pos: lastSavedPos });
  });

  // ── Close / Minimize ──────────────────────────────────────────────────────
  widget.querySelector('#emcss-close').addEventListener('click', e => {
    e.stopPropagation();
    widget.classList.add('emcss--hidden');
    if (typeof exitHoverMode === 'function') exitHoverMode();
    if (typeof activePickerCleanups !== 'undefined') { activePickerCleanups.forEach(fn => fn()); activePickerCleanups.length = 0; }
  });

  widget.querySelector('#emcss-minimize').addEventListener('click', e => {
    e.stopPropagation();
    minimized = !minimized;
    widget.classList.toggle('emcss--minimized', minimized);
    if (minimized) {
      widget.style.setProperty('height', 'auto', 'important');
    } else {
      if (lastSavedSize) {
        widget.style.setProperty('height', lastSavedSize.h + 'px', 'important');
      } else {
        widget.style.removeProperty('height');
      }
    }
  });

  // ── Toolbar ───────────────────────────────────────────────────────────────
  widget.querySelector('#emcss-apply').addEventListener('click', applyCSS);
  widget.querySelector('#emcss-format').addEventListener('click', formatCode);
  widget.querySelector('#emcss-undo').addEventListener('click', undo);
  widget.querySelector('#emcss-redo').addEventListener('click', redo);
  autoChk.addEventListener('change', save);

  widget.querySelector('#emcss-copy').addEventListener('click', () => {
    if (!editor.value.trim()) return;
    navigator.clipboard.writeText(editor.value).then(() => {
      const btn = widget.querySelector('#emcss-copy');
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('emcss__btn--copied');
      setTimeout(() => { btn.textContent = orig; btn.classList.remove('emcss__btn--copied'); }, 2000);
    });
  });

  widget.querySelector('#emcss-clear').addEventListener('click', () => {
    if (!editor.value.trim()) return;
    undoStack.push(editor.value);
    redoStack = [];
    editor.value = '';
    save();
    updateAll();
    const existing = document.getElementById('__emcss_style__');
    if (existing) existing.remove();
  });

  // ── Hover mode (Editor tab) ───────────────────────────────────────────────
  const hoverBtn = widget.querySelector('#emcss-hover');

  // Pseudo-element badge
  const pseudoBadge = document.createElement('div');
  pseudoBadge.id = '__emcss_pseudo_badge__';
  pseudoBadge.style.cssText = 'display:none;position:fixed;z-index:2147483646;pointer-events:none;';
  document.body.appendChild(pseudoBadge);

  function hasPseudo(el, pseudo) {
    const cs = window.getComputedStyle(el, pseudo);
    const content = cs.getPropertyValue('content');
    return content !== 'none' && content !== 'normal';
  }

  function updatePseudoBadge(el) {
    if (!el) { pseudoBadge.style.display = 'none'; return; }
    const hasBefore = hasPseudo(el, '::before');
    const hasAfter  = hasPseudo(el, '::after');
    const rect = el.getBoundingClientRect();
    const path = buildSelectorPath(el, null);
    const parts = [];
    if (path) parts.push(pathLabel(path));
    if (hasBefore) parts.push('::before');
    if (hasAfter)  parts.push('::after');
    if (!parts.length) { pseudoBadge.style.display = 'none'; return; }
    pseudoBadge.textContent = parts.join('  ·  ');
    pseudoBadge.style.cssText = [
      'display:block', 'position:fixed', 'z-index:2147483646', 'pointer-events:none',
      'font:11px/1.4 monospace', 'background:#0f172a', 'color:#4ade80',
      'border:1px solid #4ade80', 'border-radius:3px', 'padding:2px 7px',
      'box-shadow:0 2px 8px rgba(0,0,0,0.6)',
      'left:' + Math.round(rect.left) + 'px',
      'top:'  + Math.round(rect.top - 24) + 'px',
      'max-width:480px', 'white-space:nowrap', 'overflow:hidden', 'text-overflow:ellipsis',
    ].join(';');
  }

  // Layer picker popup — shows selectable layers on Alt+Shift+click or when pseudo found
  let layerPicker = null;
  function dismissLayerPicker() {
    if (layerPicker) { layerPicker.remove(); layerPicker = null; }
  }

  function showLayerPicker(candidates, x, y) {
    dismissLayerPicker();
    layerPicker = document.createElement('div');
    layerPicker.id = '__emcss_layer_picker__';
    layerPicker.style.cssText = [
      'position:fixed', 'z-index:2147483646',
      'left:' + x + 'px', 'top:' + y + 'px',
      'background:#1a2235', 'border:1px solid #2a3447',
      'border-radius:6px', 'box-shadow:0 8px 24px rgba(0,0,0,0.5)',
      'font:12px/1.5 monospace', 'color:#e2e8f0',
      'width:max-content', 'min-width:160px', 'max-width:480px', 'overflow:hidden',
    ].join(';');

    const header = document.createElement('div');
    header.textContent = 'Pick a layer:';
    header.style.cssText = 'padding:6px 10px;font-size:10px;color:#64748b;border-bottom:1px solid #2a3447;font-family:sans-serif;';
    layerPicker.appendChild(header);

    candidates.forEach(({ el: cEl, pseudos }) => {
      const path = buildSelectorPath(cEl, null);
      if (!path) return;
      const rows = [{ label: pathLabel(path), pseudo: null }];
      if (pseudos.before) rows.push({ label: pathLabel([...path, '&::before']), pseudo: '::before' });
      if (pseudos.after)  rows.push({ label: pathLabel([...path, '&::after']),  pseudo: '::after'  });

      rows.forEach(({ label, pseudo }) => {
        const row = document.createElement('div');
        row.textContent = label;
        row.style.cssText = 'padding:6px 10px;cursor:pointer;white-space:nowrap;';
        row.addEventListener('mouseenter', () => { row.style.background = '#2a3447'; });
        row.addEventListener('mouseleave', () => { row.style.background = ''; });
        row.addEventListener('mousedown', ev => {
          ev.preventDefault();
          ev.stopPropagation();
          dismissLayerPicker();
          insertSelectorPath(path, pseudo, editor, () => { afterEdit(); exitHoverMode(); tabEditor.click(); });
        });
        layerPicker.appendChild(row);
      });
    });

    document.body.appendChild(layerPicker);

    const ph = layerPicker.getBoundingClientRect().height;
    if (y + ph > window.innerHeight - 10) layerPicker.style.top = Math.max(10, y - ph) + 'px';

    setTimeout(() => {
      document.addEventListener('mousedown', dismissLayerPicker, { once: true, capture: true });
    }, 0);
  }

  function hoverOnMouseOver(e) {
    if (e.target.closest('#__emcss_widget__')) return;
    const el = deepestElAtPoint(document.body, e.clientX, e.clientY) || e.target;
    if (!el || el.closest('#__emcss_widget__') || el === document.body || el === document.documentElement) return;
    if (hoverTarget && hoverTarget !== el) hoverTarget.classList.remove('__emcss_hover_highlight__');
    hoverTarget = el;
    el.classList.add('__emcss_hover_highlight__');
    updatePseudoBadge(el);
  }

  function hoverOnClick(e) {
    if (e.target.closest('#__emcss_widget__') || e.target.closest('#__emcss_layer_picker__')) return;
    e.preventDefault();
    e.stopPropagation();

    const el = deepestElAtPoint(document.body, e.clientX, e.clientY) || e.target;
    if (!el || el.closest('#__emcss_widget__') || el === document.body || el === document.documentElement) return;

    const path = buildSelectorPath(el, null);
    if (!path) return;

    const pseudoBefore = hasPseudo(el, '::before');
    const pseudoAfter  = hasPseudo(el, '::after');
    const layerMode    = (e.altKey || e.metaKey) && e.shiftKey;

    // Layer picker: show all stacked DOM elements
    if (layerMode) {
      const stack = (document.elementsFromPoint(e.clientX, e.clientY) || [])
        .filter(n => n && !n.closest('#__emcss_widget__') && !n.closest('#__emcss_layer_picker__')
                  && n !== pseudoBadge && n !== document.documentElement && n !== document.body);
      const candidates = [el, ...stack.filter(n => n !== el)].map(n => ({
        el: n,
        pseudos: { before: hasPseudo(n, '::before'), after: hasPseudo(n, '::after') }
      }));
      showLayerPicker(candidates, e.clientX + 8, e.clientY + 8);
      return;
    }

    // Pseudo picker
    if (pseudoBefore || pseudoAfter) {
      showLayerPicker([{ el, pseudos: { before: pseudoBefore, after: pseudoAfter } }], e.clientX + 8, e.clientY + 8);
      return;
    }

    insertSelectorPath(path, null, editor, () => { afterEdit(); exitHoverMode(); tabEditor.click(); });
  }

  function exitHoverMode() {
    hoverMode = false;
    hoverBtn.classList.remove('emcss__btn--hover-active');
    document.body.style.cursor = '';
    if (hoverTarget) { hoverTarget.classList.remove('__emcss_hover_highlight__'); hoverTarget = null; }
    pseudoBadge.style.display = 'none';
    dismissLayerPicker();
    document.removeEventListener('mouseover', hoverOnMouseOver, true);
    document.removeEventListener('click',     hoverOnClick,     true);
  }

  function enterHoverMode() {
    if (hoverMode) return;
    hoverMode = true;
    hoverBtn.classList.add('emcss__btn--hover-active');
    document.body.style.cursor = 'crosshair';
    document.addEventListener('mouseover', hoverOnMouseOver, true);
    document.addEventListener('click',     hoverOnClick,     true);
  }

  hoverBtn.addEventListener('click', () => { if (hoverMode) exitHoverMode(); else enterHoverMode(); });

  // Hold Alt/Cmd to temporarily enter hover mode (hide widget while picking)
  let hoverKeyActive = false;
  document.addEventListener('keydown', e => {
    if ((e.key === 'Alt' || e.key === 'Meta') && !hoverMode && !widget.contains(document.activeElement)) {
      hoverKeyActive = true;
      enterHoverMode();
      widget.style.setProperty('opacity', '0', 'important');
      widget.style.setProperty('pointer-events', 'none', 'important');
    }
  });
  document.addEventListener('keyup', e => {
    if ((e.key === 'Alt' || e.key === 'Meta') && hoverKeyActive) {
      hoverKeyActive = false;
      exitHoverMode();
      widget.style.removeProperty('opacity');
      widget.style.removeProperty('pointer-events');
    }
  });

  // ── Core functions ────────────────────────────────────────────────────────
  function scheduleApply() {
    clearTimeout(applyTimer);
    applyTimer = setTimeout(applyCSS, 600);
  }

  function save() {
    chrome.storage.local.set({ emcss_code: editor.value, emcss_auto: autoChk.checked });
  }

  function afterEdit() {
    updateAll();
    const val = editor.value;
    if (undoStack[undoStack.length - 1] !== val) {
      undoStack.push(val);
      if (undoStack.length > 200) undoStack.shift();
      redoStack = [];
    }
    if (autoChk.checked) scheduleApply();
    save();
  }

  function applyCSS() {
    clearTimeout(applyTimer);
    const code = editor.value.trim();
    if (!code) {
      const el = document.getElementById('__emcss_injected__');
      if (el) el.remove();
      setStatus('Styles removed', 'warning');
      return;
    }
    const { css, error } = compile(code);
    if (error) { setStatus('Error: ' + error, 'error', 0); return; }
    let style = document.getElementById('__emcss_injected__');
    if (!style) {
      style = document.createElement('style');
      style.id = '__emcss_injected__';
      document.head.appendChild(style);
    }
    style.textContent = css;
    setStatus('Applied \u2714', 'success');
    save();
  }

  // ── CSS/SCSS formatting helpers (widget scope, shared by all formatters) ──

  function _cssTokenize(src) {
    const tokens = [];
    let i = 0;
    while (i < src.length) {
      while (i < src.length && /\s/.test(src[i])) i++;
      if (i >= src.length) break;
      if (src[i] === '/' && src[i + 1] === '*') {
        const end = src.indexOf('*/', i + 2);
        const stop = end === -1 ? src.length : end + 2;
        tokens.push({ type: 'comment', text: src.slice(i, stop).trim() });
        i = stop;
        continue;
      }
      const selStart = i;
      while (i < src.length && src[i] !== '{') {
        if (src[i] === '/' && src[i + 1] === '*') { const e = src.indexOf('*/', i + 2); i = e === -1 ? src.length : e + 2; }
        else i++;
      }
      if (i >= src.length) break;
      const selector = src.slice(selStart, i).trim();
      i++;
      let depth = 1, bodyStart = i;
      while (i < src.length && depth > 0) { if (src[i] === '{') depth++; else if (src[i] === '}') depth--; i++; }
      const body = src.slice(bodyStart, i - 1).trim();
      if (!selector) continue;
      tokens.push({ type: selector.startsWith('@') ? 'at-rule' : 'rule', selector, body });
    }
    return tokens;
  }

  function _fmtBody(src, indent) {
    const lines = [];
    let i = 0, decl = '';
    function flushDecl() {
      const d = decl.trim();
      if (d) lines.push(indent + d + (d.endsWith(';') ? '' : ';'));
      decl = '';
    }
    while (i < src.length) {
      const ch = src[i];
      if (ch === '/' && src[i + 1] === '*') {
        flushDecl();
        const end = src.indexOf('*/', i + 2);
        const stop = end === -1 ? src.length : end + 2;
        lines.push(indent + src.slice(i, stop).trim());
        i = stop; continue;
      }
      if (ch === '{') {
        const sel = decl.trim(); decl = '';
        let depth = 1, j = i + 1;
        while (j < src.length && depth > 0) { if (src[j] === '{') depth++; else if (src[j] === '}') depth--; j++; }
        const inner = src.slice(i + 1, j - 1).trim();
        if (sel) {
          lines.push(indent + sel + ' {');
          _fmtBody(inner, indent + '  ').forEach(l => lines.push(l));
          lines.push(indent + '}');
        }
        i = j;
        while (i < src.length && /[;\s]/.test(src[i])) i++;
        continue;
      }
      if (ch === ';') { flushDecl(); } else { decl += ch; }
      i++;
    }
    flushDecl();
    return lines;
  }

  function _parseBemStr(selector) {
    const m = selector.match(/^\.([\w-]+)([\s\S]*)/);
    if (!m) return null;
    const cls = m[1], tail = m[2].trim();
    if (!cls.includes('__')) return null;
    const blockName = cls.split('__')[0];
    return { blockSel: '.' + blockName, childSel: '&' + cls.slice(blockName.length) + (tail ? tail : '') };
  }

  // Standard BEM-aware formatter (no DOM context)
  function formatCSS(code) {
    function process(tokens) {
      const out = [];
      let pendingComments = [];
      let bemGroup = null;

      function flushBem() {
        if (!bemGroup) return;
        bemGroup.leadComments.forEach(c => out.push(c));
        out.push(bemGroup.blockSel + ' {');
        bemGroup.entries.forEach(({ childSel, body }) => {
          out.push('  ' + childSel + ' {');
          _fmtBody(body, '    ').forEach(l => out.push(l));
          out.push('  }');
        });
        out.push('}');
        out.push('');
        bemGroup = null;
      }

      function emitComments() {
        pendingComments.forEach(c => out.push(c));
        if (pendingComments.length) out.push('');
        pendingComments = [];
      }

      tokens.forEach(tok => {
        if (tok.type === 'comment') { flushBem(); pendingComments.push(tok.text); return; }
        if (tok.type === 'at-rule') {
          flushBem(); emitComments();
          const inner = process(_cssTokenize(tok.body));
          out.push(tok.selector + ' {');
          if (inner) inner.split('\n').forEach(l => out.push(l ? '  ' + l : ''));
          out.push('}'); out.push('');
          return;
        }
        const bem = _parseBemStr(tok.selector);
        if (bem) {
          if (bemGroup && bemGroup.blockSel === bem.blockSel && pendingComments.length === 0) {
            bemGroup.entries.push({ childSel: bem.childSel, body: tok.body });
          } else {
            flushBem();
            bemGroup = { blockSel: bem.blockSel, leadComments: pendingComments, entries: [{ childSel: bem.childSel, body: tok.body }] };
            pendingComments = [];
          }
        } else {
          flushBem(); emitComments();
          out.push(tok.selector + ' {');
          _fmtBody(tok.body, '  ').forEach(l => out.push(l));
          out.push('}'); out.push('');
        }
      });

      flushBem();
      pendingComments.forEach(c => out.push(c));
      return out.join('\n').trimEnd();
    }
    return process(_cssTokenize(code));
  }

  // DOM-aware second pass: wrap sub-component blocks under the section's primary class
  // e.g. .gallery-card { } → .gallery-component { .gallery-card { } }
  // Parse a rule body into structured items: {type:'decl'|'block'|'comment', ...}
  function _parseBody(src) {
    const items = [];
    let i = 0, decl = '';
    function flushDecl() {
      const d = decl.trim();
      if (d) items.push({ type: 'decl', text: d + (d.endsWith(';') ? '' : ';') });
      decl = '';
    }
    while (i < src.length) {
      const ch = src[i];
      if (ch === '/' && src[i + 1] === '*') {
        flushDecl();
        const end = src.indexOf('*/', i + 2), stop = end === -1 ? src.length : end + 2;
        items.push({ type: 'comment', text: src.slice(i, stop).trim() });
        i = stop; continue;
      }
      if (ch === '{') {
        const sel = decl.trim(); decl = '';
        let depth = 1, j = i + 1;
        while (j < src.length && depth > 0) { if (src[j] === '{') depth++; else if (src[j] === '}') depth--; j++; }
        const body = src.slice(i + 1, j - 1).trim();
        if (sel) items.push({ type: 'block', selector: sel, body });
        i = j;
        while (i < src.length && /[;\s]/.test(src[i])) i++;
        continue;
      }
      if (ch === ';') { flushDecl(); } else { decl += ch; }
      i++;
    }
    flushDecl();
    return items;
  }

  // DOM-aware element editor formatter:
  // – Merges all rules under one primary component block
  // – Moves top-level @media inside the targeted BEM element
  // – Strips structural /* START */  /* END */ comments
  // – Skips empty blocks
  function formatCSSForElement(code, sectionEl) {
    const PSKIP = /^(js-|is-|has-|slick-|lp-|solid-|is-font|is-background|__emcss|redesign)/;
    const STRUCT_CMT = /^\/\*[\s*]*(?:START|END)/i;

    let primaryClass = null;
    for (const child of sectionEl.children) {
      const cls = [...child.classList].find(c => c && !PSKIP.test(c) && !c.includes('__') && !c.includes('--'));
      if (cls) { primaryClass = cls; break; }
    }
    if (!primaryClass) return formatCSS(code);

    const primarySel = '.' + primaryClass;
    const itemKeys = [];
    const itemMap  = new Map(); // key → { bodyItems:[], mediaRules:[] }
    const standalones = [];

    function ensureItem(key) {
      if (!itemMap.has(key)) { itemKeys.push(key); itemMap.set(key, { bodyItems: [], mediaRules: [] }); }
      return itemMap.get(key);
    }

    function addBodyItems(key, bodyStr) {
      _parseBody(bodyStr).forEach(bi => ensureItem(key).bodyItems.push(bi));
    }

    // Unpack an @media token, routing inner rules into their BEM item's mediaRules
    function processMedia(tok) {
      const residual = [];
      _cssTokenize(tok.body).forEach(inner => {
        if (inner.type !== 'rule') { residual.push(inner); return; }
        let handled = false;

        if (inner.selector === primarySel) {
          _parseBody(inner.body).forEach(bi => {
            if (bi.type !== 'block') return;
            const m = bi.selector.match(/^(&[\w-]*)(.*)/);
            if (!m) return;
            ensureItem(m[1]).mediaRules.push({ query: tok.selector, innerSel: m[2] ? '&' + m[2] : null, body: bi.body });
            handled = true;
          });
        } else {
          const bem = _parseBemStr(inner.selector);
          if (bem && bem.blockSel === primarySel) {
            const m = bem.childSel.match(/^(&[\w-]*)(.*)/);
            if (m) {
              ensureItem(m[1]).mediaRules.push({ query: tok.selector, innerSel: m[2] ? '&' + m[2] : null, body: inner.body });
              handled = true;
            }
          }
        }
        if (!handled) residual.push(inner);
      });
      if (residual.length) {
        standalones.push({ type: 'at-rule', selector: tok.selector, body: residual.map(t => t.selector + ' {\n' + t.body + '\n}').join('\n') });
      }
    }

    _cssTokenize(code).forEach(tok => {
      if (tok.type === 'comment') return; // strip top-level structural comments
      if (tok.type === 'at-rule') {
        tok.selector.startsWith('@media') ? processMedia(tok) : standalones.push(tok);
        return;
      }
      if (!tok.body.trim()) return; // skip empty blocks

      // Already wrapped in primary block → unpack
      if (tok.selector === primarySel) {
        _parseBody(tok.body).forEach(bi => {
          if (bi.type === 'block') addBodyItems(bi.selector, bi.body);
        });
        return;
      }

      // BEM child of primary (e.g. .gallery-component__col)
      const bem = _parseBemStr(tok.selector);
      if (bem && bem.blockSel === primarySel) { addBodyItems(bem.childSel, tok.body); return; }

      // BEM element of a sub-component (e.g. .gallery-card__title)
      if (bem) {
        try {
          if (sectionEl.querySelector(bem.blockSel)) {
            ensureItem(bem.blockSel).bodyItems.push({ type: 'block', selector: bem.childSel, body: tok.body });
            return;
          }
        } catch(e) {}
      }

      // Plain sub-component class (e.g. .gallery-card)
      const m = tok.selector.match(/^\.([\w-]+)/);
      if (m) {
        try {
          if (sectionEl.querySelector('.' + m[1])) { addBodyItems(tok.selector, tok.body); return; }
        } catch(e) {}
      }

      standalones.push(tok);
    });

    // ── Render ────────────────────────────────────────────────────────────
    const out = [];
    const activeKeys = itemKeys.filter(k => {
      const it = itemMap.get(k);
      return it.mediaRules.length || it.bodyItems.some(bi => bi.type !== 'comment' || !STRUCT_CMT.test(bi.text));
    });

    if (activeKeys.length) {
      out.push(primarySel + ' {');
      activeKeys.forEach((key, idx) => {
        const item = itemMap.get(key);
        out.push('  ' + key + ' {');

        let prevWasDecl = false;
        item.bodyItems.forEach(bi => {
          if (bi.type === 'comment') {
            if (STRUCT_CMT.test(bi.text)) return;
            out.push('    ' + bi.text); prevWasDecl = false;
          } else if (bi.type === 'decl') {
            out.push('    ' + bi.text); prevWasDecl = true;
          } else if (bi.type === 'block') {
            if (prevWasDecl) out.push('');
            out.push('    ' + bi.selector + ' {');
            _fmtBody(bi.body, '      ').forEach(l => out.push(l));
            out.push('    }'); prevWasDecl = false;
          }
        });

        item.mediaRules.forEach(mq => {
          if (prevWasDecl || item.bodyItems.length) out.push('');
          out.push('    ' + mq.query + ' {');
          if (mq.innerSel) {
            out.push('      ' + mq.innerSel + ' {');
            _fmtBody(mq.body, '        ').forEach(l => out.push(l));
            out.push('      }');
          } else {
            _fmtBody(mq.body, '      ').forEach(l => out.push(l));
          }
          out.push('    }'); prevWasDecl = false;
        });

        out.push('  }');
        if (idx < activeKeys.length - 1) out.push('');
      });
      out.push('}');
      out.push('');
    }

    standalones.forEach(tok => {
      out.push(tok.selector + ' {');
      _fmtBody(tok.body, '  ').forEach(l => out.push(l));
      out.push('}'); out.push('');
    });

    return out.join('\n').trimEnd();
  }

  function formatCode() {
    const val = editor.value.trim();
    if (!val) return;
    try {
      editor.value = formatCSS(val);
      afterEdit();
      setStatus('Formatted \u2714', 'success');
    } catch(e) {
      setStatus('Cannot format: ' + e.message, 'error');
    }
  }

  function undo() {
    if (undoStack.length <= 1) return;
    redoStack.push(undoStack.pop());
    editor.value = undoStack[undoStack.length - 1];
    updateAll();
    if (autoChk.checked) scheduleApply();
  }

  function redo() {
    if (!redoStack.length) return;
    const val = redoStack.pop();
    undoStack.push(val);
    editor.value = val;
    updateAll();
    if (autoChk.checked) scheduleApply();
  }

  // ── Editor events ─────────────────────────────────────────────────────────
  editor.addEventListener('input', () => { afterEdit(); acUpdate(); });

  editor.addEventListener('scroll', () => { linesEl.scrollTop = editor.scrollTop; });

  editor.addEventListener('click',  () => { updateCursor(); acHide(); });
  editor.addEventListener('keyup',  updateCursor);
  editor.addEventListener('blur',   acHide);
  editor.addEventListener('focus',  () => { acTarget = editor; });

  // ── Keyboard shortcuts & smart editing ────────────────────────────────────
  editor.addEventListener('keydown', e => {
    const start = editor.selectionStart;
    const end   = editor.selectionEnd;
    const val   = editor.value;

    // Autocomplete navigation — must run before all other shortcuts
    if (!acEl.classList.contains('emcss-ac--hidden')) {
      if (e.key === 'ArrowDown') { e.preventDefault(); acMove(1);  return; }
      if (e.key === 'ArrowUp')   { e.preventDefault(); acMove(-1); return; }
      if (e.key === 'Escape')    { e.preventDefault(); acHide();   return; }
      if (e.key === 'Enter' && acList.length > 0) {
        e.preventDefault(); acAccept(acSel >= 0 ? acSel : 0); return;
      }
      if (e.key === 'Tab' && acSel >= 0) {
        e.preventDefault(); acAccept(); return;
      }
      // Navigation / indentation keys with no selection → close dropdown, fall through
      if (['Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(e.key)) {
        acHide();
      }
    }

    // Ctrl/Cmd+S → apply
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      applyCSS();
      return;
    }

    // Ctrl/Cmd+Z → undo
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') {
      e.preventDefault();
      undo();
      return;
    }

    // Ctrl/Cmd+Y or Ctrl/Cmd+Shift+Z → redo
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
      e.preventDefault();
      redo();
      return;
    }

    // Ctrl/Cmd+/ → toggle line comment
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      toggleComment(start, end);
      return;
    }

    // Tab → insert 2 spaces or indent/unindent selection
    if (e.key === 'Tab') {
      e.preventDefault();
      if (start === end) {
        editor.value = val.slice(0, start) + '  ' + val.slice(end);
        editor.selectionStart = editor.selectionEnd = start + 2;
        afterEdit();
      } else {
        indentLines(start, end, !e.shiftKey);
      }
      return;
    }

    // Enter → auto-indent
    if (e.key === 'Enter') {
      e.preventDefault();
      const lineStart = val.lastIndexOf('\n', start - 1) + 1;
      const indent = (val.slice(lineStart, start).match(/^(\s*)/) || ['', ''])[1];
      const before = val[start - 1];
      const after  = val[start];
      let ins, cursor;
      if (before === '{' && after === '}') {
        // Between braces: split with indented middle line
        ins    = '\n' + indent + '  \n' + indent;
        cursor = start + indent.length + 3;
      } else {
        ins    = '\n' + indent + (before === '{' ? '  ' : '');
        cursor = start + ins.length;
      }
      editor.value = val.slice(0, start) + ins + val.slice(end);
      editor.selectionStart = editor.selectionEnd = cursor;
      afterEdit();
      requestAnimationFrame(() => { editor.scrollLeft = 0; });
      return;
    }

    // Auto-pair: opening brackets
    const PAIRS = { '{': '}', '(': ')', '[': ']' };
    if (PAIRS[e.key] !== undefined) {
      e.preventDefault();
      const close = PAIRS[e.key];
      if (start !== end) {
        const sel = val.slice(start, end);
        editor.value = val.slice(0, start) + e.key + sel + close + val.slice(end);
        editor.selectionStart = start + 1;
        editor.selectionEnd   = end + 1;
      } else {
        editor.value = val.slice(0, start) + e.key + close + val.slice(end);
        editor.selectionStart = editor.selectionEnd = start + 1;
      }
      afterEdit();
      return;
    }

    // Auto-pair: quotes
    if (e.key === '"' || e.key === "'") {
      e.preventDefault();
      if (start !== end) {
        const sel = val.slice(start, end);
        editor.value = val.slice(0, start) + e.key + sel + e.key + val.slice(end);
        editor.selectionStart = start + 1;
        editor.selectionEnd   = end + 1;
      } else if (val[start] === e.key) {
        // Skip over existing closing quote
        editor.selectionStart = editor.selectionEnd = start + 1;
        return;
      } else {
        editor.value = val.slice(0, start) + e.key + e.key + val.slice(end);
        editor.selectionStart = editor.selectionEnd = start + 1;
      }
      afterEdit();
      return;
    }

    // Skip over closing bracket if already present
    if ((e.key === '}' || e.key === ')' || e.key === ']') && val[start] === e.key && start === end) {
      e.preventDefault();
      editor.selectionStart = editor.selectionEnd = start + 1;
      updateCursor();
      return;
    }

    // Backspace on empty pair → delete both chars
    if (e.key === 'Backspace' && start === end && start > 0) {
      if (['{}', '()', '[]', '""', "''"].includes(val[start - 1] + val[start])) {
        e.preventDefault();
        editor.value = val.slice(0, start - 1) + val.slice(start + 1);
        editor.selectionStart = editor.selectionEnd = start - 1;
        afterEdit();
        return;
      }
    }
  });

  // ── Helper: toggle line/block comment ─────────────────────────────────────
  function toggleComment(start, end) {
    const val = editor.value;
    let from = start, to = end;
    if (start === end) {
      from = val.lastIndexOf('\n', start - 1) + 1;
      to   = (val.indexOf('\n', start) + 1 || val.length + 1) - 1;
    }
    const text    = val.slice(from, to);
    const trimmed = text.trim();
    let newText;
    if (trimmed.startsWith('/*') && trimmed.endsWith('*/')) {
      newText = text.replace(/^(\s*)\/\* ?/, '$1').replace(/ ?\*\/$/, '');
    } else {
      newText = '/* ' + text.trim() + ' */';
    }
    editor.value = val.slice(0, from) + newText + val.slice(to);
    editor.selectionStart = from;
    editor.selectionEnd   = from + newText.length;
    afterEdit();
  }

  // ── Helper: indent/unindent selected lines ─────────────────────────────────
  function indentLines(start, end, indent) {
    const val       = editor.value;
    const lineStart = val.lastIndexOf('\n', start - 1) + 1;
    const block     = val.slice(lineStart, end);
    const newBlock  = block.split('\n')
      .map(l => indent ? '  ' + l : l.replace(/^  /, ''))
      .join('\n');
    editor.value = val.slice(0, lineStart) + newBlock + val.slice(end);
    editor.selectionStart = lineStart;
    editor.selectionEnd   = lineStart + newBlock.length;
    afterEdit();
  }

  // ── Smart-editing helper (shared by main editor and element mini-editors) ──
  function handleSmartKeydown(e, el, onAfterEdit) {
    const start = el.selectionStart;
    const end   = el.selectionEnd;
    const val   = el.value;

    if (e.key === 'Enter') {
      e.preventDefault();
      const lineStart = val.lastIndexOf('\n', start - 1) + 1;
      const indent = (val.slice(lineStart, start).match(/^(\s*)/) || ['', ''])[1];
      const before = val[start - 1];
      const after  = val[start];
      let ins, cursor;
      if (before === '{' && after === '}') {
        ins    = '\n' + indent + '  \n' + indent;
        cursor = start + indent.length + 3;
      } else {
        ins    = '\n' + indent + (before === '{' ? '  ' : '');
        cursor = start + ins.length;
      }
      el.value = val.slice(0, start) + ins + val.slice(end);
      el.selectionStart = el.selectionEnd = cursor;
      onAfterEdit(); return;
    }

    const PAIRS = { '{': '}', '(': ')', '[': ']' };
    if (PAIRS[e.key] !== undefined) {
      e.preventDefault();
      const close = PAIRS[e.key];
      if (start !== end) {
        const sel = val.slice(start, end);
        el.value = val.slice(0, start) + e.key + sel + close + val.slice(end);
        el.selectionStart = start + 1; el.selectionEnd = end + 1;
      } else {
        el.value = val.slice(0, start) + e.key + close + val.slice(end);
        el.selectionStart = el.selectionEnd = start + 1;
      }
      onAfterEdit(); return;
    }

    if (e.key === '"' || e.key === "'") {
      e.preventDefault();
      if (start !== end) {
        const sel = val.slice(start, end);
        el.value = val.slice(0, start) + e.key + sel + e.key + val.slice(end);
        el.selectionStart = start + 1; el.selectionEnd = end + 1;
      } else if (val[start] === e.key) {
        el.selectionStart = el.selectionEnd = start + 1; return;
      } else {
        el.value = val.slice(0, start) + e.key + e.key + val.slice(end);
        el.selectionStart = el.selectionEnd = start + 1;
      }
      onAfterEdit(); return;
    }

    if ((e.key === '}' || e.key === ')' || e.key === ']') && val[start] === e.key && start === end) {
      e.preventDefault();
      el.selectionStart = el.selectionEnd = start + 1; return;
    }

    if (e.key === 'Backspace' && start === end && start > 0) {
      if (['{}', '()', '[]', '""', "''"].includes(val[start - 1] + val[start])) {
        e.preventDefault();
        el.value = val.slice(0, start - 1) + val.slice(start + 1);
        el.selectionStart = el.selectionEnd = start - 1;
        onAfterEdit(); return;
      }
    }
  }

  // ── Autocomplete ──────────────────────────────────────────────────────────
  const acEl = document.createElement('div');
  acEl.id = 'emcss-autocomplete';
  acEl.className = 'emcss-ac--hidden';
  document.body.appendChild(acEl);

  let acList   = [];   // current suggestion list
  let acSel    = -1;   // selected index (-1 = none)
  let acCtx    = null; // context when dropdown was opened
  let acTarget = editor; // which textarea the autocomplete is targeting

  // Determine what the cursor is completing right now
  function acContext() {
    const pos = acTarget.selectionStart;
    if (acTarget.selectionEnd !== pos) return null; // ignore selections
    const val       = acTarget.value;
    const lineStart = val.lastIndexOf('\n', pos - 1) + 1;
    const line      = val.slice(lineStart, pos);

    // !important mode — must check BEFORE value mode so `color: red !` is caught here
    const im = line.match(/(!\w*)$/);
    if (im) return { mode: 'important', partial: im[1] };

    // CSS custom property mode — must check BEFORE value mode so `content: --foo` is caught here
    const cm = line.match(/(--[-a-zA-Z0-9]*)$/);
    if (cm) return { mode: 'custom', partial: cm[1] };

    // Value mode — `known-property: partial`
    const vm = line.match(/^\s*([a-zA-Z-]+)\s*:\s*([^;{}]*)$/);
    if (vm && CSS_PROPS.indexOf(vm[1].toLowerCase()) !== -1) {
      return { mode: 'value', prop: vm[1].toLowerCase(), partial: vm[2] };
    }

    // Pseudo mode — `&:partial` or `&::partial`
    const xm = line.match(/(&:{1,2})([-a-zA-Z]*)$/);
    if (xm) return { mode: 'pseudo', partial: xm[1] + xm[2] };

    // Property name mode — 2+ letters after whitespace / ; / {
    const pm = line.match(/(?:^|[\s;{])([a-zA-Z-]{2,})$/);
    if (pm) return { mode: 'prop', partial: pm[1] };

    return null;
  }

  // Return filtered suggestion list for the current context
  function acSuggest(ctx) {
    if (!ctx) return [];

    if (ctx.mode === 'important') {
      return ['!important'].filter(v => v.startsWith(ctx.partial));
    }

    if (ctx.mode === 'custom') {
      const vars = [];
      try {
        const rs = getComputedStyle(document.documentElement);
        for (let i = 0; i < rs.length; i++) { if (rs[i].startsWith('--')) vars.push(rs[i]); }
      } catch(e) {}
      return vars.filter(v => v.startsWith(ctx.partial)).slice(0, 12);
    }

    if (ctx.mode === 'value') {
      const vals    = CSS_VALUES[ctx.prop] || [];
      const partial = ctx.partial.trim(); // trim leading space from `prop: partial`
      if (!partial) return vals.slice(0, 12);
      return vals.filter(v => v.toLowerCase().startsWith(partial.toLowerCase())).slice(0, 12);
    }

    if (ctx.mode === 'prop') {
      return CSS_PROPS.filter(p => p.startsWith(ctx.partial.toLowerCase())).slice(0, 12);
    }

    if (ctx.mode === 'pseudo') {
      return CSS_PSEUDOS.filter(p => p.startsWith(ctx.partial)).slice(0, 15);
    }

    return [];
  }

  // Calculate viewport coordinates for the dropdown (below current line)
  function acCoords() {
    const pos  = acTarget.selectionStart;
    const val  = acTarget.value;
    const cs   = getComputedStyle(acTarget);
    const rect = acTarget.getBoundingClientRect();
    const lh   = parseFloat(cs.lineHeight) || 19;
    const pt   = parseFloat(cs.paddingTop) || 12;
    const pl   = parseFloat(cs.paddingLeft) || 14;
    const line = val.slice(0, pos).split('\n').length - 1;
    const y    = rect.top + pt + (line + 1) * lh - acTarget.scrollTop;
    const x    = rect.left + pl;
    return {
      x: Math.max(4, Math.min(x, window.innerWidth  - 260)),
      y: Math.min(y, window.innerHeight - 220),
    };
  }

  // Escape HTML special chars for safe innerHTML use
  function acEsc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Re-render the dropdown with bolded matched prefix (IntelliSense style)
  function acRender() {
    const partial = !acCtx ? '' :
      acCtx.mode === 'value' ? acCtx.partial.trim() : acCtx.partial;
    acEl.innerHTML = '';
    acList.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = 'emcss-ac__item' + (i === acSel ? ' emcss-ac__item--active' : '');
      // Bold the matched prefix so it feels like IntelliSense
      if (partial && item.toLowerCase().startsWith(partial.toLowerCase())) {
        el.innerHTML = '<strong>' + acEsc(item.slice(0, partial.length)) + '</strong>' + acEsc(item.slice(partial.length));
      } else {
        el.textContent = item;
      }
      el.addEventListener('mousedown', ev => { ev.preventDefault(); acAccept(i); });
      acEl.appendChild(el);
    });
    const { x, y } = acCoords();
    acEl.style.left = x + 'px';
    acEl.style.top  = y + 'px';
    acEl.classList.remove('emcss-ac--hidden');
  }

  function acHide() {
    acEl.classList.add('emcss-ac--hidden');
    acList = [];
    acSel  = -1;
    acCtx  = null;
  }

  // Move selection up (-1) or down (+1)
  function acMove(dir) {
    acSel = Math.max(-1, Math.min(acList.length - 1, acSel + dir));
    acEl.querySelectorAll('.emcss-ac__item').forEach((el, i) => {
      el.classList.toggle('emcss-ac__item--active', i === acSel);
    });
    if (acSel >= 0) acEl.querySelectorAll('.emcss-ac__item')[acSel].scrollIntoView({ block: 'nearest' });
  }

  // Accept the chosen suggestion and insert it into the editor
  function acAccept(idx) {
    if (idx === undefined) idx = acSel;
    if (idx < 0 || idx >= acList.length) return;
    const chosen = acList[idx];
    const ctx    = acCtx;
    acHide();

    const pos       = acTarget.selectionStart;
    const val       = acTarget.value;
    const lineStart = val.lastIndexOf('\n', pos - 1) + 1;
    const line      = val.slice(lineStart, pos);

    let replaceFrom, insert, cursorOffset = null;
    const replaceTo = pos;

    if (ctx.mode === 'important') {
      const m = line.match(/(!\w*)$/);
      replaceFrom = lineStart + line.length - (m ? m[1].length : 0);
      insert = chosen;
    } else if (ctx.mode === 'custom') {
      const m = line.match(/(--[-a-zA-Z0-9]*)$/);
      replaceFrom = lineStart + line.length - (m ? m[1].length : 0);
      insert = chosen;
    } else if (ctx.mode === 'value') {
      replaceFrom = pos - ctx.partial.length;
      insert = chosen;
    } else if (ctx.mode === 'pseudo') {
      const m = line.match(/(&:{1,2}[-a-zA-Z]*)$/);
      replaceFrom = lineStart + line.length - (m ? m[1].length : 0);
      const indent = line.match(/^(\s*)/)[1];
      insert = chosen + ' {\n' + indent + '  \n' + indent + '}';
      // Cursor lands on the blank inner line: after chosen + ' {\n' + indent + '  '
      cursorOffset = chosen.length + 3 + indent.length + 2;
    } else { // prop
      const m = line.match(/([a-zA-Z-]{2,})$/);
      replaceFrom = lineStart + line.length - (m ? m[1].length : 0);
      insert = chosen + ': ';
    }

    const hasParen  = insert.endsWith('()');
    acTarget.value  = val.slice(0, replaceFrom) + insert + val.slice(replaceTo);
    const cursorPos = cursorOffset !== null
      ? replaceFrom + cursorOffset
      : replaceFrom + insert.length - (hasParen ? 1 : 0);
    acTarget.selectionStart = acTarget.selectionEnd = cursorPos;
    if (acTarget === editor) {
      afterEdit();
    } else {
      acTarget.dispatchEvent(new Event('input'));
    }
  }

  // Called on every input event — refresh or hide the dropdown
  function acUpdate() {
    const ctx  = acContext();
    const list = acSuggest(ctx);
    if (!list.length || !ctx) { acHide(); return; }
    acList = list;
    acCtx  = ctx;
    if (acSel >= acList.length) acSel = -1;
    acRender();
  }

  // ── Responsive layout ─────────────────────────────────────────────────────
  function applyResponsive() {
    const w = window.innerWidth;
    const mobile = w <= 768;
    const tablet = w > 768 && w <= 1024;
    widget.classList.toggle('emcss--mobile', mobile);
    widget.classList.toggle('emcss--tablet', tablet);
    if (mobile) {
      // Full-width bar anchored to bottom
      widget.style.setProperty('left',   '0',     'important');
      widget.style.setProperty('right',  '0',     'important');
      widget.style.setProperty('bottom', '0',     'important');
      widget.style.setProperty('top',    'auto',  'important');
      widget.style.setProperty('width',  '100%',  'important');
    } else {
      // Restore desktop/tablet position
      widget.style.removeProperty('bottom');
      if (lastSavedPos) {
        widget.style.setProperty('left',  lastSavedPos.x + 'px', 'important');
        widget.style.setProperty('top',   lastSavedPos.y + 'px', 'important');
        widget.style.setProperty('right', 'auto', 'important');
        if (!lastSavedSize) {
          widget.style.setProperty('width', tablet ? '360px' : '', 'important');
        }
      } else {
        widget.style.setProperty('right', tablet ? '12px' : '24px', 'important');
        widget.style.setProperty('top',   tablet ? '16px' : '40px', 'important');
        widget.style.setProperty('left',  'auto', 'important');
        if (!lastSavedSize) {
          widget.style.setProperty('width', tablet ? '360px' : '', 'important');
        }
      }
      // Clamp widget so it never overflows the viewport
      const rect = widget.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        const clampedLeft = Math.max(0, window.innerWidth - rect.width - 8);
        widget.style.setProperty('left',  clampedLeft + 'px', 'important');
        widget.style.setProperty('right', 'auto', 'important');
      }
      if (rect.left < 0) {
        widget.style.setProperty('left',  '8px', 'important');
        widget.style.setProperty('right', 'auto', 'important');
      }
      // Clamp vertically too
      if (rect.bottom > window.innerHeight) {
        widget.style.setProperty('top', Math.max(0, window.innerHeight - rect.height - 8) + 'px', 'important');
      }
      if (rect.top < 0) {
        widget.style.setProperty('top', '8px', 'important');
      }
    }
  }

  window.addEventListener('resize', applyResponsive);

  // ── Template Element Inspector ────────────────────────────────────────────

  // depth: 0 = findBy element IS the section; 1 = parent of findBy is the section
  const TEMPLATES = {
    'Masterpiece': [
      { name: 'Homepage Opening with Search',   findBy: '.redesign.opening-with-search',               depth: 1, buildCode: '' },
      { name: 'Homepage Opening - Full Bleed',  findBy: '.opening-with-search.parallax',               depth: 1, buildCode: '' },
      { name: 'Stats Highlight',                findBy: '.company-stats',                             depth: 1, buildCode: '' },
      { name: 'Featured Agent',                 findBy: '.section:has(.agent-details)',                depth: 1, buildCode: '' },
      { name: 'Featured Team',                  findBy: '.featured-team',                              depth: 1, buildCode: '' },
      { name: 'Featured Testimonials',          findBy: '.testimonials-section',                       depth: 1, buildCode: '' },
      { name: 'Press Logo Carousel',            findBy: '.press-carousel-component',                   depth: 1, buildCode: '' },
      { name: 'Gallery Style Menu',             findBy: '.gallery-component',                          depth: 1, buildCode: '' },
      { name: 'Newsletter Sign Up',             findBy: '.newsletter-signup',                          depth: 1, buildCode: '' },
      { name: 'Featured Properties',            findBy: '.featured-properties',                        depth: 1, buildCode: '' },
      { name: 'Featured Neighborhoods',         findBy: '.featured-neighborhoods',                     depth: 1, buildCode: '' },
      { name: 'Instant Home Valuation',         findBy: '.home-valuation',                             depth: 0, buildCode: '' },
      { name: 'Team Grid',                       findBy: '.lp-vertical-paddings:has(ul.data-container:not(.collection))', depth: 1, buildCode: '' },
      { name: 'Properties Grid',                 findBy: '.section:has(div.data-container:not(.collection))',   depth: 1, buildCode: '' },
      { name: 'MLS Properties Grid with Filters',findBy: '.properties-grid',                                    depth: 1, buildCode: '' },
      { name: 'Blog Grid',                      findBy: '.section:has(div.collection.data-container)',          depth: 1, buildCode: '' },
      { name: 'Blog Intro - Full Bleed',        findBy: '.section:has(.share-holder)',                         depth: 1, buildCode: '' },
      { name: 'Blog Content',                   findBy: '.section:has(.lp-a.description)',                     depth: 1, buildCode: '' },
      { name: 'Featured Blogs',                 findBy: '.lp-vertical-paddings:has(.js-slick)',        depth: 1, buildCode: '' },
      { name: 'Agent Bio',                       findBy: '.agent-detail-section',                       depth: 1, buildCode: '' },
      { name: 'Property Description',            findBy: '.info.redesign',                              depth: 1, buildCode: '' },
      { name: 'Property Intro',                  findBy: '.section:has(.holder):has(.js-collection)',  depth: 1, buildCode: '' },
      { name: 'Property Neighborhood',           findBy: '.section:has(.neighborhood-wrap)',            depth: 1, buildCode: '' },
      { name: 'Property Agent',                  findBy: '.agent.lp-vertical-paddings',                 depth: 1, buildCode: '' },
      { name: 'Features & Amenities',            findBy: '.section:has(.amenities-list-box)',           depth: 1, buildCode: '' },
      { name: 'CTA Block',                       findBy: '.cta-block',                                  depth: 2, buildCode: '' },
      { name: 'Featured Video',                 findBy: '.section-video',                              depth: 1, buildCode: '' },
      { name: 'Neighborhood Intro - Full Bleed', findBy: '.section:has(.image-wrap):not(:has(.agent-details))', depth: 1, buildCode: '' },
      { name: 'Neighborhood Content',            findBy: '.section:has(.holder):has(.description)',     depth: 1, buildCode: '' },
      { name: 'Neighborhood MLS Geolocation CTA',findBy: '.wrapper.redesign',                           depth: 1, buildCode: '' },
      { name: 'Neighborhood Overview',           findBy: '.section:has(.item__icon)',                   depth: 1, buildCode: '' },
      { name: 'Neighborhood Points of Interest & Commute', findBy: '.lp-vertical-paddings:has(.poi-table)', depth: 1, buildCode: '' },
      { name: 'Neighborhood Demographics & Employment', findBy: '.section:has(.population-age)',         depth: 1, buildCode: '' },
      { name: 'Neighborhood Schools',            findBy: '.section:has(.items-box)',                    depth: 1, buildCode: '' },
      { name: 'Neighborhood Map',               findBy: '.neighborhood-map',                            depth: 1, buildCode: '' },
      { name: 'Neighborhood Grid - Full Bleed',findBy: '.featured-neighborhoods-grid:has(.grid-item)', depth: 1, buildCode: '' },
      { name: 'Similar Neighborhoods - Full Bleed', findBy: '.featured-neighborhoods-grid:has(.items > .item)', depth: 1, buildCode: '' },
      { name: 'Hoverable Image with Info',       findBy: '.hoverable-section',                          depth: 1, buildCode: '' },
      { name: 'Text Grid',                      findBy: '.text-grid',                                  depth: 1, buildCode: '' },
      { name: 'Timeline',                       findBy: '.lp-container:has(ul.collection:not(.data-container))', depth: 1, buildCode: '' },
      { name: 'Testimonial List',               findBy: '.testimonials',                               depth: 1, buildCode: '' },
      { name: 'Custom Form',                    findBy: '.custom-form',                                depth: 1, buildCode: '' },
      { name: 'Custom Intro',                   findBy: '.lp-container--l:has(> .lp-title-group)',     depth: 1, buildCode: '' },
      { name: 'Terms & Conditions',             findBy: '.terms-and-conditions',                       depth: 2, buildCode: '' },
      { name: 'Work With Us',                   findBy: '.work-with-us',                               depth: 1, buildCode: '' },
      { name: 'Instagram Feed',                 findBy: '.jsIGContainer',                              depth: 3, buildCode: '' },
    ],
    'Producer': [
      {
        name: 'Homepage Opening with Rotating Headlines',
        findBy: '.video-section', depth: 0,
        buildCode: '/* START - spacing for title + subtitle + buttons */\n.collection .btn-container {\n    margin-top: 0 !important;\n    .lp-btn {\n        min-width: 250px;\n    }\n}\n.lp-title-group .lp-text--subtitle, .lp-title-group .lp-text--subtitle p {\n    margin-bottom: 0 !important;\n}\n.lp-h1, h1 {\n    margin-bottom: 0px !important;\n}',
      },
      { name: 'Gallery Style Menu', findBy: '.gallery-component', depth: 1, buildCode: '' },
    ],
    'Visionary': [
      { name: 'Opening with Search', findBy: '.video-section',  depth: 0, buildCode: '' },
      { name: 'Full Bleed CTA',      findBy: '.full-bleed-cta', depth: 1, buildCode: '' },
    ],
  };

  function isExcldTpl(t)    { return excldTpls.includes(t); }
  function isExcldEl(t, n)  { return excldEls.some(e => e.template === t && e.name === n); }

  // Tab switching
  tabEditor.addEventListener('click', () => {
    tabEditor.classList.add('emcss__tab--active');
    tabElements.classList.remove('emcss__tab--active');
    settingsView.classList.add('emcss__view--hidden');
    settingsBtn.classList.remove('emcss__btn-icon--active');
    settingsOpen = false;
    editorView.classList.remove('emcss__view--hidden');
    elementsView.classList.add('emcss__view--hidden');
    chrome.storage.local.set({ emcss_last_tab: 'editor' });
  });

  tabElements.addEventListener('click', () => {
    tabElements.classList.add('emcss__tab--active');
    tabEditor.classList.remove('emcss__tab--active');
    settingsView.classList.add('emcss__view--hidden');
    settingsBtn.classList.remove('emcss__btn-icon--active');
    settingsOpen = false;
    elementsView.classList.remove('emcss__view--hidden');
    editorView.classList.add('emcss__view--hidden');
    chrome.storage.local.set({ emcss_last_tab: 'elements' });
  });

  // Build Mode toggle
  buildModeChk.addEventListener('change', () => {
    buildMode = buildModeChk.checked;
    chrome.storage.local.set({ emcss_build_mode: buildMode });
    elList.querySelectorAll('.emcss__el-action-btn').forEach(btn => {
      btn.textContent = buildMode ? 'Save' : 'Apply';
      btn.classList.toggle('emcss__btn--apply', !buildMode);
      btn.classList.toggle('emcss__btn--build-save', buildMode);
    });
    globalMoodSel.style.display = buildMode ? '' : 'none';
  });

  globalMoodSel.addEventListener('change', () => {
    chrome.storage.local.set({ emcss_last_mood: globalMoodSel.value });
    if (buildMode) elLoadBuildFns.forEach(fn => fn());
  });

  // ── Settings panel ────────────────────────────────────────────────────────
  // Derive the querySelector selector from stored id / className fields
  function elFindBy(el) {
    if (el.id) return '#' + el.id.replace(/^#/, '');
    const raw = el.className.trim();
    if (!raw) return '';
    // ">" separates parent from child: "image-section > image-wrapper" → ".image-section:has(.image-wrapper)"
    // Space separates same-element classes: "redesign opening-with-search" → ".redesign.opening-with-search"
    if (raw.includes('>')) {
      const sides = raw.split('>').map(s => s.trim()).filter(Boolean)
        .map(c => c.startsWith('.') ? c : '.' + c);
      return sides[0] + sides.slice(1).map(c => ':has(' + c + ')').join('');
    }
    const parts = raw.split(/\s+/).filter(Boolean)
      .map(c => c.startsWith('.') ? c : '.' + c);
    // Same-element multi-class: chain them (.class1.class2)
    return parts.join('');
  }

  // Keep the template dropdown and datalist in sync with all known templates
  function syncTemplateDropdown() {
    const builtIn   = new Set(Object.keys(TEMPLATES));
    const userTpls  = new Set(customEls.map(e => e.template));

    // Add any user template not yet in the dropdown
    userTpls.forEach(tpl => {
      if (!tmplSelect.querySelector(`option[value="${CSS.escape(tpl)}"]`)) {
        const opt = document.createElement('option');
        opt.value = tpl;
        opt.textContent = tpl;
        tmplSelect.appendChild(opt);
      }
    });

    // Remove dropdown options that were user-only and no longer have elements
    tmplSelect.querySelectorAll('option').forEach(opt => {
      if (opt.value && !builtIn.has(opt.value) && !userTpls.has(opt.value)) {
        if (tmplSelect.value === opt.value) {
          tmplSelect.value = '';
          elList.innerHTML = '<div class="emcss__el-empty">Select a template above to scan the page.</div>';
        }
        opt.remove();
      }
    });

    // Remove excluded built-in templates from Elements tab dropdown
    tmplSelect.querySelectorAll('option').forEach(opt => {
      if (opt.value && excldTpls.includes(opt.value)) {
        if (tmplSelect.value === opt.value) {
          tmplSelect.value = '';
          elList.innerHTML = '<div class="emcss__el-empty">Select a template above to scan the page.</div>';
        }
        opt.remove();
      }
    });

    // Populate datalist with all known non-excluded template names
    tplDatalist.innerHTML = '';
    const allTpls = [...new Set([...builtIn, ...userTpls])].filter(t => !excldTpls.includes(t));
    allTpls.forEach(tpl => {
      const dOpt = document.createElement('option');
      dOpt.value = tpl;
      tplDatalist.appendChild(dOpt);
    });

    // Populate the settings filter select, preserving current selection
    const prevFilter = settingsTplFilter.value;
    settingsTplFilter.innerHTML = '<option value="">&#8212; Select template &#8212;</option>';
    allTpls.forEach(tpl => {
      const fOpt = document.createElement('option');
      fOpt.value = tpl;
      fOpt.textContent = tpl;
      settingsTplFilter.appendChild(fOpt);
    });
    if (prevFilter && settingsTplFilter.querySelector(`option[value="${CSS.escape(prevFilter)}"]`)) {
      settingsTplFilter.value = prevFilter;
    }
    syncDeleteDropdowns();
  }

  function syncGlobalMoodSel() {
    const prev = globalMoodSel.value;
    const all = [DEFAULT_MOODBOARD, ...moodboards];
    globalMoodSel.innerHTML = all.map(m => `<option value="${m}">${m}</option>`).join('');
    if (all.includes(prev)) globalMoodSel.value = prev;
  }

  function renderMoodboardList() {
    moodListEl.innerHTML = '';
    if (!moodboards.length) {
      moodListEl.innerHTML = '<div class="emcss__settings-empty">No moodboards defined.</div>';
    } else {
      moodboards.forEach(m => {
        const row = document.createElement('div');
        row.className = 'emcss__mood-item';
        row.innerHTML = `<span class="emcss__mood-item-name">${m}</span>`;
        moodListEl.appendChild(row);
      });
    }
    syncGlobalMoodSel();
    syncDeleteDropdowns();
  }

  moodAddBtn.addEventListener('click', () => {
    const name = moodNameIn.value.trim();
    if (!name || name === DEFAULT_MOODBOARD || moodboards.includes(name)) return;
    moodboards.push(name);
    chrome.storage.local.set({ emcss_moodboards: moodboards });
    moodNameIn.value = '';
    renderMoodboardList();
    renderCustomList();
  });

  function renderCustomList() {
    custListEl.innerHTML = '';
    const tpl = settingsTplFilter.value;
    if (!tpl) {
      custListEl.innerHTML = '<div class="emcss__settings-empty">Select a template above to browse its elements.</div>';
      return;
    }

    const builtInItems = (TEMPLATES[tpl] || [])
      .filter(def => !isExcldEl(tpl, def.name))
      .map(def => ({ name: def.name, selector: def.findBy, builtIn: true, defName: def.name, defaultCode: def.buildCode || '' }));
    const userItemsMapped = [];
    customEls.forEach((el, i) => {
      if (el.template === tpl && !isExcldEl(tpl, el.name)) {
        userItemsMapped.push({ name: el.name, selector: elFindBy(el), builtIn: false, index: i, defName: el.name, defaultCode: '' });
      }
    });
    const all = [...builtInItems, ...userItemsMapped];

    if (!all.length) {
      custListEl.innerHTML = '<div class="emcss__settings-empty">No elements in this template yet.</div>';
      return;
    }

    const moodOpts = [DEFAULT_MOODBOARD, ...moodboards].map(m => `<option value="${m}">${m}</option>`).join('');

    all.forEach(item => {
      const row = document.createElement('div');
      row.className = 'emcss__cust-item emcss__cust-item--accordion';
      row.innerHTML = `
        <div class="emcss__cust-item-hd">
          <div class="emcss__cust-item-info">
            <span class="emcss__cust-item-name">${item.name}</span>
            <span class="emcss__cust-item-sel">${item.selector}</span>
          </div>
          <div class="emcss__cust-item-controls">
            <select class="emcss__cust-mood-sel">${moodOpts}</select>
          </div>
          <span class="emcss__cust-arrow">&#9654;</span>
        </div>
        <div class="emcss__cust-body emcss__cust-body--closed">
          <textarea class="emcss__settings-code" spellcheck="false" data-gramm="false" data-gramm_editor="false" data-enable-grammarly="false"></textarea>
          <div class="emcss__cust-foot">
            <button class="emcss__btn emcss__btn--build-save emcss__cust-save-btn">Save</button>
          </div>
        </div>
      `;

      const hd       = row.querySelector('.emcss__cust-item-hd');
      const body     = row.querySelector('.emcss__cust-body');
      const arrow    = row.querySelector('.emcss__cust-arrow');
      const moodSel  = row.querySelector('.emcss__cust-mood-sel');
      const codeArea = row.querySelector('.emcss__settings-code');
      const saveBtn  = row.querySelector('.emcss__cust-save-btn');

      // Stop dropdown and delete from toggling the row
      row.querySelector('.emcss__cust-item-controls').addEventListener('click', e => e.stopPropagation());

      function settingsBldKey() {
        return 'emcss_bld_' + tpl + '_' + item.defName + '_' + moodSel.value.replace(/\s+/g, '_');
      }
      function loadCode() {
        const key = settingsBldKey();
        chrome.storage.local.get([key], (data) => {
          codeArea.value = data[key] !== undefined ? data[key] : item.defaultCode;
        });
      }

      hd.addEventListener('click', () => {
        const isOpen = !body.classList.contains('emcss__cust-body--closed');
        if (isOpen) {
          body.classList.add('emcss__cust-body--closed');
          arrow.style.transform = '';
        } else {
          body.classList.remove('emcss__cust-body--closed');
          arrow.style.transform = 'rotate(90deg)';
          loadCode();
        }
      });

      moodSel.addEventListener('change', () => {
        if (!body.classList.contains('emcss__cust-body--closed')) loadCode();
      });

      saveBtn.addEventListener('click', () => {
        chrome.storage.local.set({ [settingsBldKey()]: codeArea.value }, () => {
          const orig = saveBtn.textContent;
          saveBtn.textContent = 'Saved \u2714';
          setTimeout(() => { saveBtn.textContent = orig; }, 2000);
        });
      });

      custListEl.appendChild(row);
    });
  }

  settingsTplFilter.addEventListener('change', renderCustomList);

  // ── Delete zone ───────────────────────────────────────────────────────────
  function syncDeleteDropdowns() {
    const builtIn = new Set(Object.keys(TEMPLATES));
    const allTpls = [...new Set([...builtIn, ...customEls.map(e => e.template)])]
      .filter(t => !excldTpls.includes(t));

    // Delete Template: all non-excluded templates
    const prevDelTpl = delTplSel.value;
    delTplSel.innerHTML = '<option value="">&#8212; Select template &#8212;</option>';
    allTpls.forEach(t => {
      const o = document.createElement('option');
      o.value = t; o.textContent = t; delTplSel.appendChild(o);
    });
    if (prevDelTpl) delTplSel.value = prevDelTpl;

    // Delete Element: all non-excluded templates
    const prevDelElTpl = delElTplSel.value;
    delElTplSel.innerHTML = '<option value="">&#8212; Template &#8212;</option>';
    allTpls.forEach(t => {
      const o = document.createElement('option');
      o.value = t; o.textContent = t; delElTplSel.appendChild(o);
    });
    if (prevDelElTpl) { delElTplSel.value = prevDelElTpl; populateDelElNames(); }

    // Delete Moodboard dropdown
    const prevDelBldMood = delBldMoodSel.value;
    delBldMoodSel.innerHTML = '<option value="">&#8212; Moodboard &#8212;</option>';
    moodboards.forEach(m => {
      const o = document.createElement('option');
      o.value = m; o.textContent = m; delBldMoodSel.appendChild(o);
    });
    if (prevDelBldMood) delBldMoodSel.value = prevDelBldMood;
  }

  function populateDelElNames() {
    const tpl = delElTplSel.value;
    delElNameSel.innerHTML = '<option value="">&#8212; Element &#8212;</option>';
    if (!tpl) return;
    // Built-in elements (value prefixed "builtin:")
    (TEMPLATES[tpl] || [])
      .filter(d => !isExcldEl(tpl, d.name))
      .forEach(d => {
        const o = document.createElement('option');
        o.value = 'builtin:' + d.name; o.textContent = d.name; delElNameSel.appendChild(o);
      });
    // User-added elements (value prefixed "user:{globalIndex}")
    customEls.forEach((e, i) => {
      if (e.template === tpl && !isExcldEl(tpl, e.name)) {
        const o = document.createElement('option');
        o.value = 'user:' + i; o.textContent = e.name; delElNameSel.appendChild(o);
      }
    });
  }

  delElTplSel.addEventListener('change', populateDelElNames);

  delTplBtn.addEventListener('click', () => {
    const tpl = delTplSel.value;
    if (!tpl) return;
    const isBuiltIn = tpl in TEMPLATES;
    const msg = isBuiltIn
      ? 'Delete template "' + tpl + '"?\n\nThis is a built-in template. It will be hidden from the extension and all its elements will be removed. This cannot be undone.'
      : 'Delete template "' + tpl + '"?\n\nThis will permanently remove all user-added elements in this template. This cannot be undone.';
    if (!confirm(msg)) return;
    if (isBuiltIn) {
      excldTpls.push(tpl);
      chrome.storage.local.set({ emcss_excl_tpls: excldTpls });
    }
    customEls = customEls.filter(e => e.template !== tpl);
    chrome.storage.local.set({ emcss_custom_els: customEls });
    syncTemplateDropdown();
    syncDeleteDropdowns();
    renderCustomList();
  });

  delElBtn.addEventListener('click', () => {
    const tpl = delElTplSel.value;
    const val = delElNameSel.value;
    if (!tpl || !val) return;
    const isBuiltIn = val.startsWith('builtin:');
    const name = isBuiltIn ? val.slice(8) : null;
    const userIdx = isBuiltIn ? null : parseInt(val.slice(5), 10);
    const displayName = isBuiltIn ? name : (customEls[userIdx] || {}).name;
    if (!displayName) return;
    const msg = isBuiltIn
      ? 'Delete element "' + displayName + '" from "' + tpl + '"?\n\nThis is a built-in element. It will be hidden from the extension. This cannot be undone.'
      : 'Delete element "' + displayName + '" from "' + tpl + '"?\n\nThis cannot be undone.';
    if (!confirm(msg)) return;
    if (isBuiltIn) {
      excldEls.push({ template: tpl, name });
      chrome.storage.local.set({ emcss_excl_els: excldEls });
    } else {
      customEls.splice(userIdx, 1);
      chrome.storage.local.set({ emcss_custom_els: customEls });
    }
    syncTemplateDropdown();
    syncDeleteDropdowns();
    renderCustomList();
  });

  delBldBtn.addEventListener('click', () => {
    const mood = delBldMoodSel.value;
    if (!mood) return;
    if (!confirm('Delete moodboard "' + mood + '"?\n\nThis will remove it from the list. This cannot be undone.')) return;
    moodboards = moodboards.filter(m => m !== mood);
    chrome.storage.local.set({ emcss_moodboards: moodboards });
    renderMoodboardList();
    syncDeleteDropdowns();
  });

  // ── Export ────────────────────────────────────────────────────────────────
  const exportBtn     = widget.querySelector('#emcss-export-btn');
  const exportOut     = widget.querySelector('#emcss-export-out');
  const exportCopyBtn = widget.querySelector('#emcss-export-copy');

  exportBtn.addEventListener('click', () => {
    if (!customEls.length) {
      exportOut.value = '// No custom elements to export.';
      exportCopyBtn.style.display = 'none';
      return;
    }
    // Group by template
    const grouped = {};
    customEls.forEach(el => {
      if (!grouped[el.template]) grouped[el.template] = [];
      grouped[el.template].push(el);
    });
    const lines = [];
    Object.entries(grouped).forEach(([tpl, els]) => {
      lines.push(`'${tpl}': [`);
      els.forEach(el => {
        let findBy;
        if (el.id) {
          findBy = '#' + el.id.replace(/^#/, '');
        } else {
          const parts = el.className.trim().split(/\s+/).filter(Boolean)
            .map(c => c.startsWith('.') ? c : '.' + c);
          findBy = parts[0] + parts.slice(1).map(c => ':has(' + c + ')').join('');
        }
        lines.push(`  { name: '${el.name}', findBy: '${findBy}', depth: 1, buildCode: '' },`);
      });
      lines.push(`],`);
    });
    exportOut.value = lines.join('\n');
    exportCopyBtn.style.display = '';
  });

  exportCopyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(exportOut.value).then(() => {
      const orig = exportCopyBtn.textContent;
      exportCopyBtn.textContent = 'Copied!';
      setTimeout(() => { exportCopyBtn.textContent = orig; }, 2000);
    });
  });

  settingsBtn.addEventListener('click', () => {
    settingsOpen = !settingsOpen;
    settingsBtn.classList.toggle('emcss__btn-icon--active', settingsOpen);
    if (settingsOpen) {
      editorView.classList.add('emcss__view--hidden');
      elementsView.classList.add('emcss__view--hidden');
      settingsView.classList.remove('emcss__view--hidden');
    } else {
      settingsView.classList.add('emcss__view--hidden');
      if (tabEditor.classList.contains('emcss__tab--active')) {
        editorView.classList.remove('emcss__view--hidden');
      } else {
        elementsView.classList.remove('emcss__view--hidden');
      }
    }
  });

  custAddBtn.addEventListener('click', () => {
    const tpl  = custTplIn.value.trim();
    const name = custNameIn.value.trim();
    const id   = custIdIn.value.trim().replace(/^#/, '');
    const cls  = custClsIn.value.trim().replace(/^\./, '');
    if (!tpl || !name || (!id && !cls)) return;
    customEls.push({ template: tpl, name, id, className: cls });
    chrome.storage.local.set({ emcss_custom_els: customEls });
    custTplIn.value  = '';
    custNameIn.value = '';
    custIdIn.value   = '';
    custClsIn.value  = '';
    syncTemplateDropdown();
    settingsTplFilter.value = tpl;
    renderCustomList();
  });

  // Scan page when template is selected
  tmplSelect.addEventListener('change', () => {
    const tpl = tmplSelect.value;
    if (!tpl) {
      elList.innerHTML = '<div class="emcss__el-empty">Select a template above to scan the page.</div>';
      return;
    }
    chrome.storage.local.set({ emcss_last_tpl: tpl });
    renderElementList(scanPage(tpl), tpl);
  });

  function scanPage(templateName) {
    if (isExcldTpl(templateName)) return [];
    const builtInDefs = (TEMPLATES[templateName] || [])
      .filter(def => !isExcldEl(templateName, def.name));
    const userDefs = customEls
      .filter(el => el.template === templateName && !isExcldEl(templateName, el.name))
      .map(el => ({ name: el.name, findBy: elFindBy(el), depth: 0, buildCode: '', useClassSelector: true }));
    const defs = [...builtInDefs, ...userDefs];
    if (!defs.length) return [];
    const results = [];

    defs.forEach(def => {
      const els = Array.from(document.querySelectorAll(def.findBy))
        .filter(el => !el.closest('#__emcss_widget__'));

      els.forEach((el, idx) => {
        let section = el;
        for (let d = 0; d < def.depth; d++) {
          if (section.parentElement) section = section.parentElement;
        }
        if (!section || section === document.body || section === document.documentElement) return;

        let cssSelector = def.findBy; // last resort
        if (!def.useClassSelector) {
          if (section.id) {
            cssSelector = '#' + section.id;
          } else {
            let ancestor = section.parentElement;
            while (ancestor && ancestor !== document.body && ancestor !== document.documentElement) {
              if (ancestor.id) { cssSelector = '#' + ancestor.id; break; }
              ancestor = ancestor.parentElement;
            }
          }
        }
        const label = els.length > 1 ? def.name + ' #' + (idx + 1) : def.name;
        results.push({ label, selector: cssSelector, element: section, defName: def.name, buildCode: def.buildCode || '' });
      });
    });

    // Sort top-to-bottom by DOM position
    results.sort((a, b) =>
      a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    );
    return results;
  }

  function highlightElement(el) {
    const prev = { outline: el.style.outline, boxShadow: el.style.boxShadow, transition: el.style.transition };
    el.style.transition = 'outline 0.15s, box-shadow 0.15s';
    el.style.outline = '3px solid #4ade80';
    el.style.boxShadow = '0 0 0 8px rgba(74,222,128,0.15)';
    setTimeout(() => {
      el.style.outline = prev.outline;
      el.style.boxShadow = prev.boxShadow;
      setTimeout(() => { el.style.transition = prev.transition; }, 200);
    }, 2000);
  }

  // ── Hover utilities (shared by Editor tab and Elements tab) ──────────────

  // Flat DOM walk: find the deepest element whose bounding box contains (x,y).
  // Ignores pointer-events CSS entirely — purely geometric. Skips widget internals.
  function deepestElAtPoint(root, x, y) {
    let best = null;
    function walk(node) {
      if (node.id && node.id.startsWith('__emcss')) return;
      const r = node.getBoundingClientRect();
      if (x < r.left || x > r.right || y < r.top || y > r.bottom) return;
      best = node; // deeper always wins
      for (const child of node.children) walk(child);
    }
    for (const child of root.children) walk(child);
    return best;
  }

  const HSKIP = /^(js-|is-|has-|slick-|aos-|animated|active|open|closed|visible|hidden|show|hide|fade|collapse|loading|loaded|emcss|__emcss)/;

  // Return the single most-meaningful class for a node, or null.
  function hoverMainClass(node) {
    const cls = [...(node.classList || [])].filter(c => c && !HSKIP.test(c));
    if (!cls.length) return null;
    return cls.find(c => c.includes('__')) || cls.find(c => c.includes('--')) || cls[0];
  }

  // Build an array of nested SCSS selectors from rootEl's context down to el.
  //   rootEl  — sectionEl for Elements tab; null for Editor tab (auto-detects scope)
  // Returns e.g. ['.featured-properties', '.item', '&__text', '.lp-h5']  or null.
  function buildSelectorPath(el, rootEl) {
    // For Editor tab (no rootEl): find nearest <section>/<main>/<article> or id'd ancestor
    let root = rootEl;
    if (!root) {
      let n = el.parentElement;
      while (n && n !== document.body) {
        const tag = n.tagName && n.tagName.toLowerCase();
        if (tag === 'section' || tag === 'main' || tag === 'article') { root = n; break; }
        if (n.id && !n.id.startsWith('__emcss')) { root = n; break; }
        n = n.parentElement;
      }
    }

    // Collect steps (outer → inner) from root to el
    const steps = [];
    let node = el;
    const limit = root || document.documentElement;
    while (node && node !== limit) {
      const cls = hoverMainClass(node);
      if (cls) {
        steps.unshift({ cls, node });
      } else if (node === el) {
        // Target has no meaningful class — fall back to tag name
        const tag = node.tagName ? node.tagName.toLowerCase() : null;
        if (tag) steps.unshift({ cls: tag, node, isTag: true });
      }
      node = node.parentElement;
    }

    if (!steps.length) return null;

    // Without an explicit rootEl (Editor tab), limit to 4 meaningful steps
    const trimmed = (!rootEl && steps.length > 4) ? steps.slice(-4) : steps;

    // Find BEM blocks referenced by BEM-element classes in the path
    const bemBlocks = new Set();
    for (const { cls } of trimmed) {
      if (cls && cls.includes('__')) bemBlocks.add(cls.split('__')[0]);
    }

    // Keep: primary (outermost), BEM elements, their blocks, and target (el)
    const primary = trimmed[0];
    const target  = trimmed[trimmed.length - 1];
    const filtered = trimmed.filter(({ node: n, cls }) => {
      if (n === primary.node || n === target.node) return true;
      if (!cls) return false;
      if (cls.includes('__')) return true;   // BEM element
      if (bemBlocks.has(cls)) return true;   // BEM block
      return false;
    });

    // Build SCSS path with BEM & notation
    const path = [];
    for (const { cls, isTag } of filtered) {
      if (!cls) continue;
      if (!isTag && cls.includes('__')) {
        const block  = cls.split('__')[0];
        const suffix = cls.slice(block.length);
        if (path.length && path[path.length - 1] === '.' + block) {
          path.push('&' + suffix);           // compress: previous was the block
        } else {
          path.push('.' + block, '&' + suffix); // block not in path yet — add both
        }
      } else {
        path.push(isTag ? cls : '.' + cls);
      }
    }

    return path.length ? path : null;
  }

  // Compact label for a selector path (shown in tooltips).
  // e.g. '.item { &__text { .lp-h5 } }'
  function pathLabel(path) {
    if (!path || !path.length) return '';
    const show = path.length > 3 ? ['…', ...path.slice(-2)] : path;
    let label = show[0];
    for (let i = 1; i < show.length; i++) label += ' { ' + show[i];
    for (let i = 1; i < show.length; i++) label += ' }';
    return label;
  }

  // Render a selector path as a nested SCSS snippet.
  // Returns { snippet, cursorOffset } — cursorOffset is chars from snippet start to cursor.
  function renderSelectorPath(path, baseIndent) {
    if (!path || !path.length) return null;
    const bi = baseIndent || '';
    const lines = [];
    for (let i = 0; i < path.length; i++) lines.push(bi + '  '.repeat(i) + path[i] + ' {');
    const cursorLine = bi + '  '.repeat(path.length);
    lines.push(cursorLine);
    for (let i = path.length - 1; i >= 0; i--) lines.push(bi + '  '.repeat(i) + '}');
    const snippet = lines.join('\n');
    // Cursor offset = sum of all lines up to and including the cursorLine
    let offset = 0;
    for (let i = 0; i <= path.length; i++) offset += lines[i].length + 1; // +1 for \n
    offset--; // cursor sits at end of cursorLine, before its \n
    return { snippet, cursorOffset: offset };
  }

  // Insert a rendered selector path at the current cursor in targetEditor.
  // pseudo — '::before' / '::after' / null
  function insertSelectorPath(path, pseudo, targetEditor, syncFn) {
    const fullPath = pseudo ? [...path, '&' + pseudo] : path;
    const start  = targetEditor.selectionStart;
    const before = targetEditor.value.substring(0, start);
    const after  = targetEditor.value.substring(targetEditor.selectionEnd);
    const bi     = (before.slice(before.lastIndexOf('\n') + 1).match(/^(\s*)/) || ['', ''])[1];
    const rendered = renderSelectorPath(fullPath, bi);
    if (!rendered) return;
    const { snippet, cursorOffset } = rendered;
    const prefix = before.trim() ? '\n\n' : '';
    targetEditor.value = before + prefix + snippet + (after.trim() ? '\n\n' + after : after);
    targetEditor.selectionStart = targetEditor.selectionEnd = start + prefix.length + cursorOffset;
    targetEditor.focus();
    if (syncFn) syncFn();
  }

  // Track all active Elements-tab picker cleanups so widget close can stop them all
  const activePickerCleanups = [];

  function startHoverPicker(sectionEl, elEditor, syncLinesFn) {
    const tooltip = document.createElement('div');
    tooltip.style.cssText = 'position:fixed;z-index:2147483647;background:#1e293b;color:#94d5b2;font-family:monospace;font-size:12px;padding:4px 10px;border-radius:4px;pointer-events:none;display:none;border:1px solid #334155;white-space:nowrap;max-width:400px;';
    document.body.appendChild(tooltip);

    let hoveredEl = null;
    let savedOutline = '';
    let savedOutlineOffset = '';

    function applyHover(target) {
      if (hoveredEl === target) return;
      clearHover();
      hoveredEl = target;
      savedOutline = target.style.outline;
      savedOutlineOffset = target.style.outlineOffset;
      target.style.outline = '2px dashed #94d5b2';
      target.style.outlineOffset = '2px';
    }

    function clearHover() {
      if (!hoveredEl) return;
      hoveredEl.style.outline = savedOutline;
      hoveredEl.style.outlineOffset = savedOutlineOffset;
      hoveredEl = null;
    }

    function onMouseMove(e) {
      tooltip.style.left = (e.clientX + 14) + 'px';
      tooltip.style.top  = (e.clientY + 14) + 'px';
    }

    function onMouseOver(e) {
      if (e.target.closest('#__emcss_widget__')) return;
      const el = deepestElAtPoint(sectionEl, e.clientX, e.clientY);
      if (!el || el === sectionEl || el.closest('#__emcss_widget__')) {
        clearHover(); tooltip.style.display = 'none'; return;
      }
      const path = buildSelectorPath(el, sectionEl);
      if (!path) { clearHover(); tooltip.style.display = 'none'; return; }
      applyHover(el);
      tooltip.textContent = pathLabel(path);
      tooltip.style.display = 'block';
    }

    function onMouseOut(e) {
      if (!sectionEl.contains(e.relatedTarget)) { clearHover(); tooltip.style.display = 'none'; }
    }

    function onClick(e) {
      if (e.target.closest('#__emcss_widget__')) return;
      const el = deepestElAtPoint(sectionEl, e.clientX, e.clientY);
      if (!el || el === sectionEl || el.closest('#__emcss_widget__')) return;
      const path = buildSelectorPath(el, sectionEl);
      if (!path) return;
      e.preventDefault();
      e.stopPropagation();
      insertSelectorPath(path, null, elEditor, syncLinesFn);
    }

    sectionEl.addEventListener('mouseover', onMouseOver);
    sectionEl.addEventListener('mousemove', onMouseMove);
    sectionEl.addEventListener('mouseout',  onMouseOut);
    sectionEl.addEventListener('click',     onClick, true);

    function cleanup() {
      sectionEl.removeEventListener('mouseover', onMouseOver);
      sectionEl.removeEventListener('mousemove', onMouseMove);
      sectionEl.removeEventListener('mouseout',  onMouseOut);
      sectionEl.removeEventListener('click',     onClick, true);
      clearHover();
      tooltip.remove();
      const idx = activePickerCleanups.indexOf(cleanup);
      if (idx !== -1) activePickerCleanups.splice(idx, 1);
    }

    activePickerCleanups.push(cleanup);
    return cleanup;
  }

  function renderElementList(items, templateName) {
    elList.innerHTML = '';
    elLoadBuildFns = [];
    if (!items.length) {
      elList.innerHTML = '<div class="emcss__el-empty">No matching elements found on this page.</div>';
      return;
    }

    items.forEach((item, i) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'emcss__el-item';
      itemEl.innerHTML = `
        <div class="emcss__el-hd">
          <div class="emcss__el-info">
            <span class="emcss__el-name">${item.label}</span>
            <span class="emcss__el-sel">${item.selector}</span>
          </div>
          <div class="emcss__el-hd-actions">
            <button class="emcss__btn emcss__el-copy-btn" title="Copy code">Copy</button>
          </div>
          <span class="emcss__el-arrow">&#9654;</span>
        </div>
        <div class="emcss__el-body emcss__el-body--closed">
          <div class="emcss__el-selector-open">${item.selector} {</div>
          <div class="emcss__el-editor-wrap">
            <div class="emcss__el-lines">1</div>
            <textarea class="emcss__el-editor" spellcheck="false" data-gramm="false" data-gramm_editor="false" data-enable-grammarly="false"></textarea>
          </div>
          <div class="emcss__el-selector-close">}</div>
          <div class="emcss__el-foot">
            <button class="emcss__btn emcss__el-fmt-btn" title="Format SCSS">Format</button>
            <button class="emcss__btn emcss__el-action-btn ${buildMode ? 'emcss__btn--build-save' : 'emcss__btn--apply'}">${buildMode ? 'Save' : 'Apply'}</button>
          </div>
        </div>
      `;

      const hd        = itemEl.querySelector('.emcss__el-hd');
      const body      = itemEl.querySelector('.emcss__el-body');
      const linesDiv  = itemEl.querySelector('.emcss__el-lines');
      const elEditor  = itemEl.querySelector('.emcss__el-editor');
      const actionBtn = itemEl.querySelector('.emcss__el-action-btn');
      const copyBtn   = itemEl.querySelector('.emcss__el-copy-btn');
      const fmtBtn    = itemEl.querySelector('.emcss__el-fmt-btn');
      const hdActions = itemEl.querySelector('.emcss__el-hd-actions');

      // Prevent header clicks on controls from toggling the accordion
      hdActions.addEventListener('click', e => e.stopPropagation());

      function moodboardStorageKey() {
        return 'emcss_bld_' + templateName + '_' + item.defName + '_' + globalMoodSel.value.replace(/\s+/g, '_');
      }

      function loadBuildCode() {
        const key = moodboardStorageKey();
        chrome.storage.local.get([key], (data) => {
          elEditor.value = data[key] !== undefined ? data[key] : item.buildCode;
          editorLoaded = true;
          syncLines();
          setTimeout(() => { elEditor.selectionStart = elEditor.selectionEnd = 0; elEditor.focus(); }, 50);
        });
      }

      let editorLoaded = false;

      elLoadBuildFns.push(loadBuildCode);

      function syncLines() {
        const count = elEditor.value.split('\n').length;
        linesDiv.textContent = Array.from({ length: count }, (_, n) => n + 1).join('\n');
        linesDiv.scrollTop = elEditor.scrollTop;
      }
      syncLines();

      function applyElCSS() {
        const inner   = elEditor.value.trim();
        const styleId = '__emcss_el_' + i + '__';
        if (!inner) {
          const existing = document.getElementById(styleId);
          if (existing) existing.remove();
          return;
        }
        const code = item.selector + ' {\n' + inner + '\n}';
        const { css, error } = compile(code);
        if (error) return;
        let styleEl = document.getElementById(styleId);
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = styleId;
          document.head.appendChild(styleEl);
        }
        styleEl.textContent = css;
      }

      let pickerCleanup = null;

      hd.addEventListener('click', () => {
        const isOpen = !body.classList.contains('emcss__el-body--closed');
        if (isOpen) {
          body.classList.add('emcss__el-body--closed');
          hd.classList.remove('emcss__el-hd--open');
          if (pickerCleanup) { pickerCleanup(); pickerCleanup = null; }
        } else {
          body.classList.remove('emcss__el-body--closed');
          hd.classList.add('emcss__el-hd--open');
          item.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          highlightElement(item.element);
          if (buildMode) {
            loadBuildCode();
          } else {
            setTimeout(() => { elEditor.selectionStart = elEditor.selectionEnd = 0; elEditor.focus(); }, 100);
          }
          pickerCleanup = startHoverPicker(item.element, elEditor, syncLines);
        }
      });

      let elApplyTimer = null;

      elEditor.addEventListener('focus',  () => { acTarget = elEditor; });
      elEditor.addEventListener('blur',   acHide);
      elEditor.addEventListener('click',  acHide);
      elEditor.addEventListener('scroll', () => { linesDiv.scrollTop = elEditor.scrollTop; });
      elEditor.addEventListener('input',  () => {
        syncLines();
        acUpdate();
        clearTimeout(elApplyTimer);
        elApplyTimer = setTimeout(applyElCSS, 600);
      });

      elEditor.addEventListener('keydown', e => {
        // Autocomplete navigation
        if (!acEl.classList.contains('emcss-ac--hidden')) {
          if (e.key === 'ArrowDown') { e.preventDefault(); acMove(1);  return; }
          if (e.key === 'ArrowUp')   { e.preventDefault(); acMove(-1); return; }
          if (e.key === 'Escape')    { e.preventDefault(); acHide();   return; }
          if (e.key === 'Enter' && acList.length > 0) {
            e.preventDefault(); acAccept(acSel >= 0 ? acSel : 0); return;
          }
          if (e.key === 'Tab' && acSel >= 0) { e.preventDefault(); acAccept(); return; }
          if (['Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(e.key)) acHide();
        }
        // Ctrl/Cmd+S → save/apply
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
          e.preventDefault(); actionBtn.click(); return;
        }
        // Tab without autocomplete → indent
        if (e.key === 'Tab') {
          e.preventDefault();
          const s = elEditor.selectionStart, en = elEditor.selectionEnd, v = elEditor.value;
          elEditor.value = v.slice(0, s) + '  ' + v.slice(en);
          elEditor.selectionStart = elEditor.selectionEnd = s + 2;
          syncLines(); return;
        }
        // Smart editing (auto-indent, bracket pairing, etc.)
        handleSmartKeydown(e, elEditor, syncLines);
      });

      actionBtn.addEventListener('click', () => {
        if (buildMode) {
          chrome.storage.local.set({ [moodboardStorageKey()]: elEditor.value }, () => {
            const orig = actionBtn.textContent;
            actionBtn.textContent = 'Saved \u2714';
            setTimeout(() => { actionBtn.textContent = orig; }, 2000);
          });
        }
        applyElCSS();
      });

      copyBtn.addEventListener('click', () => {
        const doCopy = (text) => {
          navigator.clipboard.writeText(text).then(() => {
            const orig = copyBtn.textContent;
            copyBtn.textContent = 'Copied \u2714';
            setTimeout(() => { copyBtn.textContent = orig; }, 2000);
          });
        };
        if (!buildMode || editorLoaded) {
          doCopy(elEditor.value);
        } else {
          const key = moodboardStorageKey();
          chrome.storage.local.get([key], (data) => {
            doCopy(data[key] !== undefined ? data[key] : item.buildCode);
          });
        }
      });

      fmtBtn.addEventListener('click', () => {
        const val = elEditor.value.trim();
        if (!val) return;
        elEditor.value = formatCSSForElement(val, item.element);
        editorLoaded = true;
        syncLines();
      });

      elList.appendChild(itemEl);
    });
  }

  // ── Public API ────────────────────────────────────────────────────────────
  window.__emcss = {
    show:        () => widget.classList.remove('emcss--hidden'),
    hide:        () => widget.classList.add('emcss--hidden'),
    toggle:      () => widget.classList.toggle('emcss--hidden'),
    clearEditor: () => { editor.value = ''; afterEdit(); },
  };

})();
