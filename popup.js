function waitFocus() {
  return new Promise(resolve => {
    if (document.hasFocus()) {
      resolve();
      return;
    }
    window.addEventListener("focus", () => resolve(), { once: true });
    window.focus();
  });
}

function readTextFromClipboard() {
  // It seems that navigator.clipboard.readText does not work correctly with popups.
  // return navigator.clipboard.readText();
  return new Promise(resolve => {
    const textarea = document.createElement('textarea');
    textarea.style.opacity = '0';
    textarea.style.position = 'absolute';
    textarea.style.width = '1px';
    textarea.style.height = '1px';
    textarea.style.left = '-1px';
    textarea.style.top = '0';
    let resolved = false;
    const read = () => {
      if (resolved) {
        return;
      }
      resolved = true;
      textarea.remove();
      resolve(textarea.value);
    };
    textarea.addEventListener("paste", () => setTimeout(read, 0), { once: true });
    textarea.addEventListener("input", () => read(), { once: true });
    textarea.addEventListener("focus", () => document.execCommand('paste'), { once: true });
    document.body.appendChild(textarea);
    textarea.focus();
  });
}

window.addEventListener("load", async () => {
  try {
    await waitFocus();
    const text = await readTextFromClipboard();
    const v = text.match(/(https|http|ttps|ttp)\:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+/ig);
    if (!v || !v.length) {
      throw new Error('URL not found in your clipboard.');
    }
    for (var i = 0; i < v.length; ++i) {
      if (v[i].substring(0, 3) === 'ttp') {
        v[i] = 'h' + v[i];
      }
      chrome.tabs.create({ url: v[i] });
    }
    window.close();
  } catch (err) {
    document.querySelector('nobr').innerText = err;
  }
}, { once: true });
