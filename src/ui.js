let toastTimer = 0;

export function toast(message, ms = 2200) {
  let el = document.getElementById('ui-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'ui-toast';
    el.className = 'toast';
    el.setAttribute('role', 'status');
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.hidden = true;
  }, ms);
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function makeDropzone(el, onFiles) {
  el.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = el.dataset.multiple === 'true';
    input.accept = el.dataset.accept || '';
    input.addEventListener('change', () => {
      if (input.files.length) onFiles([...input.files]);
    });
    input.click();
  });
  ['dragenter', 'dragover'].forEach((n) =>
    el.addEventListener(n, (e) => {
      e.preventDefault();
      el.classList.add('dragover');
    })
  );
  ['dragleave', 'drop'].forEach((n) =>
    el.addEventListener(n, (e) => {
      e.preventDefault();
      el.classList.remove('dragover');
    })
  );
  el.addEventListener('drop', (e) => {
    if (e.dataTransfer.files.length) onFiles([...e.dataTransfer.files]);
  });
}

export function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}
