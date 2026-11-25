import SparkMD5 from 'spark-md5';
import JSZip from 'jszip';
import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { toast, copyText, downloadBlob, makeDropzone, nextFrame } from '../ui.js';

initLayout('md5-modifier');

const items = [];
const dz = document.getElementById('dz');
const listEl = document.getElementById('list');
const btnAll = document.getElementById('btn-all');
const btnZip = document.getElementById('btn-zip');
const btnClear = document.getElementById('btn-clear');

makeDropzone(dz, (files) => {
  void addFiles(files);
});

async function md5Of(file) {
  const spark = new SparkMD5.ArrayBuffer();
  const CHUNK = 4 * 1024 * 1024;
  let offset = 0;
  while (offset < file.size) {
    const slice = file.slice(offset, offset + CHUNK);
    spark.append(await slice.arrayBuffer());
    offset += CHUNK;
  }
  return spark.end();
}

async function addFiles(files) {
  for (const file of files) {
    const item = {
      file,
      oldMd5: null,
      newMd5: null,
      blob: null,
      status: 'pending',
    };
    items.push(item);
    render();
    item.oldMd5 = await md5Of(file);
    render();
    await nextFrame();
  }
}

async function modifyItem(item) {
  if (item.status === 'done') return item;
  const tail = new Uint8Array(16);
  crypto.getRandomValues(tail);
  const head = new Uint8Array(await item.file.arrayBuffer());
  const merged = new Uint8Array(head.length + tail.length);
  merged.set(head, 0);
  merged.set(tail, head.length);
  item.blob = new Blob([merged], { type: item.file.type || 'application/octet-stream' });
  const spark = new SparkMD5.ArrayBuffer();
  spark.append(merged.buffer);
  item.newMd5 = spark.end();
  item.status = 'done';
  return item;
}

async function modifyAll() {
  if (items.length === 0) {
    toast(t('md5_empty'));
    return;
  }
  btnAll.disabled = true;
  btnAll.textContent = t('md5_working');
  for (const item of items) {
    await modifyItem(item);
    render();
    await nextFrame();
  }
  btnAll.disabled = false;
  btnAll.textContent = t('md5_modify_all');
  toast(t('md5_modified'));
}

btnAll.addEventListener('click', () => void modifyAll());

btnZip.addEventListener('click', async () => {
  const pending = items.filter((x) => x.status !== 'done');
  for (const item of pending) {
    await modifyItem(item);
  }
  if (items.length === 0) {
    toast(t('md5_empty'));
    return;
  }
  const zip = new JSZip();
  for (const item of items) {
    const name = item.file.name.replace(/(\.[^.]+)?$/, (ext) => `-md5${ext || ''}`);
    zip.file(name, item.blob);
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(blob, 'aixuno-md5-modified.zip');
});

btnClear.addEventListener('click', () => {
  items.length = 0;
  render();
});

function fmtSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function render() {
  listEl.innerHTML = '';
  for (const [index, item] of items.entries()) {
    const row = document.createElement('div');
    row.className = 'result-item';
    row.style.flexWrap = 'wrap';
    row.innerHTML = `
      <div style="flex: 1 1 100%; display: flex; align-items: center; gap: 10px;">
        <span class="label" style="min-width: 0">📄 ${item.file.name}</span>
        <span style="font-size: 12px; color: var(--ink-soft)">${fmtSize(item.file.size)}</span>
        <span style="margin-left: auto; font-size: 12px; font-weight: 700;" class="${item.status === 'done' ? 'ok-text' : ''}">${item.status === 'done' ? '✓ ' + t('md5_modified') : ''}</span>
      </div>
      <div style="flex: 1 1 100%; display: flex; gap: 14px; flex-wrap: wrap; font-size: 12.5px;">
        <span style="color: var(--ink-soft)">${t('md5_old')}:</span>
        <code style="font-family: var(--mono); word-break: break-all;">${item.oldMd5 ?? '…'}</code>
      </div>
      ${item.newMd5
        ? `<div style="flex: 1 1 100%; display: flex; gap: 14px; flex-wrap: wrap; font-size: 12.5px;">
             <span style="color: var(--ink-soft)">${t('md5_new')}:</span>
             <code style="font-family: var(--mono); word-break: break-all; color: var(--ok);">${item.newMd5}</code>
           </div>`
        : ''}
      <div style="flex: 1 1 100%;" class="item-actions"></div>`;
    const actions = row.querySelector('.item-actions');
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap;';
    if (item.oldMd5) {
      const cp = document.createElement('button');
      cp.className = 'copy-btn';
      cp.textContent = t('md5_old');
      cp.addEventListener('click', () => void copyText(item.oldMd5));
      wrap.appendChild(cp);
    }
    if (item.newMd5) {
      const cp2 = document.createElement('button');
      cp2.className = 'copy-btn';
      cp2.textContent = t('md5_new');
      cp2.addEventListener('click', () => void copyText(item.newMd5));
      wrap.appendChild(cp2);
      const dl = document.createElement('button');
      dl.className = 'copy-btn';
      dl.textContent = '⤓';
      dl.title = 'Download';
      dl.addEventListener('click', () => {
        const name = item.file.name.replace(/(\.[^.]+)?$/, (ext) => `-md5${ext || ''}`);
        downloadBlob(item.blob, name);
      });
      wrap.appendChild(dl);
      const rm = document.createElement('button');
      rm.className = 'copy-btn';
      rm.textContent = '✕';
      rm.addEventListener('click', () => {
        items.splice(index, 1);
        render();
      });
      wrap.appendChild(rm);
    }
    actions.appendChild(wrap);
    listEl.appendChild(row);
  }
}
