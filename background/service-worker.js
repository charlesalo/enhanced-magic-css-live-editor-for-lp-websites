/* EnhancedMagicCSS — Service Worker
   Clicking the extension icon directly injects and opens the widget */

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
