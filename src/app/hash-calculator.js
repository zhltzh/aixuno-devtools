import SparkMD5 from 'spark-md5';
import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { toast, copyText, makeDropzone } from '../ui.js';

initLayout('hash-calculator');

const dz = document.getElementById('dz');
const progressCard = document.getElementById('progress-card');
const pbar = document.getElementById('pbar');
const ptext = document.getElementById('ptext');
const resultCard = document.getElementById('result-card');
const fileNameEl = document.getElementById('file-name');
const hashesEl = document.getElementById('hashes');
const expectedEl = document.getElementById('expected');
const btnVerify = document.getElementById('btn-verify');
const verifyOut = document.getElementById('verify-out');

let lastHashes = null;

makeDropzone(dz, (files) => {
  void process(files[0]);
});

async function process(file) {
  dz.hidden = true;
  progressCard.hidden = false;
  ptext.textContent = t('hash_uploading');
  pbar.style.width = '0%';

  const md5Spark = new SparkMD5.ArrayBuffer();
  const CHUNK = 8 * 1024 * 1024;
  let offset = 0;
  let headBuffer = null;
  const parts = [];
  while (offset < file.size) {
    const slice = file.slice(offset, offset + CHUNK);
    const buf = await slice.arrayBuffer();
    md5Spark.append(buf);
    if (offset === 0) headBuffer = buf;
    parts.push(buf);
    offset += CHUNK;
    pbar.style.width = `${Math.min(100, Math.round((offset / file.size) * 100))}%`;
  }
  let full = null;
  if (file.size <= 512 * 1024 * 1024) {
    full = new Blob(parts).arrayBuffer
      ? await new Blob(parts).arrayBuffer()
      : null;
  }

  const hashes = { MD5: md5Spark.end() };
  if (full) {
    const algos = {
      'SHA-1': 'SHA-1',
      'SHA-256': 'SHA-256',
      'SHA-512': 'SHA-512',
    };
    for (const [label, algo] of Object.entries(algos)) {
      const digest = await crypto.subtle.digest(algo, full);
      hashes[label] = [...new Uint8Array(digest)]
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
  }
  lastHashes = hashes;

  progressCard.hidden = true;
  resultCard.hidden = false;
  fileNameEl.textContent = `📄 ${file.name}`;
  hashesEl.innerHTML = '';
  for (const [label, value] of Object.entries(hashes)) {
    const row = document.createElement('div');
    row.className = 'result-item';
    row.innerHTML = `
      <span class="label">${label}</span>
      <code>${value}</code>`;
    const cp = document.createElement('button');
    cp.className = 'copy-btn';
    cp.textContent = '⧉';
    cp.addEventListener('click', () => void copyText(value));
    row.appendChild(cp);
    hashesEl.appendChild(row);
  }
}

btnVerify.addEventListener('click', () => {
  if (!lastHashes) return;
  const expected = expectedEl.value.trim().toLowerCase();
  verifyOut.textContent = '';
  if (!expected) return;
  let matched = false;
  let matchedLabel = '';
  for (const [label, value] of Object.entries(lastHashes)) {
    if (value.toLowerCase() === expected) {
      matched = true;
      matchedLabel = label;
      break;
    }
  }
  verifyOut.className = matched ? 'ok-text' : 'err-text';
  verifyOut.textContent = matched
    ? `✓ ${t('hash_match')} (${matchedLabel})`
    : `✗ ${t('hash_mismatch')}`;
});
