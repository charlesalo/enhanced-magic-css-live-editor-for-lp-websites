/* EnhancedMagicCSS — Popup launcher */

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function injectWidget(tab) {
  try {
    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['content/widget.css']
    });
  } catch(e) {}
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content/content.js']
    });
  } catch(e) {}
}

document.getElementById('openBtn').addEventListener('click', async () => {
  const tab = await getActiveTab();
  await injectWidget(tab);
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => { if (window.__emcss) window.__emcss.show(); }
  });
  const s = document.getElementById('statusLine');
  s.textContent = 'Editor opened ✓';
  s.className = 'status status--active';
  setTimeout(() => window.close(), 400);
});

document.getElementById('toggleBtn').addEventListener('click', async () => {
  const tab = await getActiveTab();
  await injectWidget(tab);
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => { if (window.__emcss) window.__emcss.toggle(); }
  });
  setTimeout(() => window.close(), 300);
});

document.getElementById('clearPageBtn').addEventListener('click', async () => {
  const tab = await getActiveTab();
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const el = document.getElementById('__emcss_injected__');
      if (el) el.remove();
      if (window.__emcss) window.__emcss.clearEditor();
    }
  });
  chrome.storage.local.remove('emcss_code');
  const s = document.getElementById('statusLine');
  s.textContent = 'Styles removed ✓';
  s.className = 'status status--active';
});
