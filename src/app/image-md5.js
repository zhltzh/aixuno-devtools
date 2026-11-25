import SparkMD5 from 'spark-md5';
import JSZip from 'jszip';
import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { toast, copyText, downloadBlob, makeDropzone } from '../ui.js';

initLayout('image-md5');

const items = [];
const listEl = document.getElementById('list');
const btnRun = document.getElementById('btn-run');

makeDropzone(document.getElementById('dz'), (files) => void add(files));

async function add(files) {
  for (const file of files.filter((f) => f.type.startsWith('image/'))) {
    const buf = await file.arrayBuffer();
    const head = new Uint8Array(buf);
    const tail = new Uint8Array(16);
    crypto.getRandomValues(tail);
    const merged = new Uint8Array(head.length + tail.length);
    merged.set(head, 0);
    merged.set(tail, head.length);
    const s1 = new SparkMD5.ArrayBuffer();
    s1.append(head.buffer);
    const s2 = new SparkMD5.ArrayBuffer();
    s2.append(merged.buffer);
    items.push({
      file,
      blob: new Blob([merged], { type: file.type || 'image/jpeg' }),
      oldMd5: s1.end(),
      newMd5: s2.end(),
    });
  }
  render();
}

function render() {
  listEl.innerHTML = '';
  for (const [i, item] of items.entries()) {
    const el = document.createElement('div');
    el.className = 'result-item';
    el.style.flexWrap = 'wrap';
    el.innerHTML = `
      <span class="label">#${i + 1}</span>
      <code style="flex: 1">${item.file.name}</code>
      <code style="color: var(--ink-soft); font-size: 12px">${item.oldMd5.slice(0, 10)}… → <b style="color: var(--ok)">${item.newMd5.slice(0, 10)}…</b></code>`;
    const cp = document.createElement('button');
    cp.className = 'copy-btn';
    cp.textContent = '⧉';
    cp.addEventListener('click', () => void copyText(item.newMd5));
    const rm = document.createElement('button');
    rm.className = 'copy-btn';
    rm.textContent = '✕';
    rm.addEventListener('click', () => {
      items.splice(i, 1);
      render();
    });
    el.append(cp, rm);
    listEl.appendChild(el);
  }
}

btnRun.addEventListener('click', async () => {
  if (items.length === 0) {
    toast(t('md5_empty'));
    return;
  }
  btnRun.disabled = true;
  const zip = new JSZip();
  for (const item of items) {
    zip.file(item.file.name, item.blob);
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(blob, 'image-md5-modified.zip');
  btnRun.disabled = false;
  toast(t('md5_modified'));
});
