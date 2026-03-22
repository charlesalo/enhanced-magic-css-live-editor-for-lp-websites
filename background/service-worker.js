/* EnhancedMagicCSS — Service Worker
   Clicking the extension icon directly injects and opens the widget */

// ── CMS Monaco bridge ─────────────────────────────────────────────────────
// Content scripts can't access window.monaco (CSP + isolated world).
// We run the Monaco call here via executeScript world:MAIN which bypasses CSP.
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action !== 'emcss_cms_write') return false;
  chrome.scripting.executeScript({
    target: { tabId: sender.tab.id },
    world: 'MAIN',
    func: (text) => {
      try {
        if (!window.monaco) return { ok: false, msg: 'window.monaco not found on this page' };
        const eds = window.monaco.editor.getEditors();
        if (!eds || !eds.length) return { ok: false, msg: 'No Monaco editors found — open the Advanced CSS panel first' };
        let target = null;
        for (let i = 0; i < eds.length; i++) {
          if (eds[i].getModel && eds[i].getModel()) { target = eds[i]; break; }
        }
        if (!target) return { ok: false, msg: 'Monaco editors found but none have a model' };
        target.setValue(text);
        return { ok: true, count: eds.length };
      } catch (err) {
        return { ok: false, msg: err.message };
      }
    },
    args: [msg.text]
  }).then(results => {
    sendResponse((results && results[0] && results[0].result) || { ok: false, msg: 'No result returned' });
  }).catch(err => {
    sendResponse({ ok: false, msg: 'executeScript error: ' + err.message });
  });
  return true; // keep message channel open for async sendResponse
});

chrome.action.onClicked.addListener(async (tab) => {
  // Inject widget CSS
  try {
    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['content/widget.css']
    });
  } catch(e) {}

  // Inject autocomplete data then main widget script
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content/css-data.js']
    });
  } catch(e) {}

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content/content.js']
    });
  } catch(e) {}

  // Show if already injected but hidden
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => { if (window.__emcss) window.__emcss.show(); }
  });
});
