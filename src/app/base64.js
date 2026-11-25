import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { toast, makeDropzone } from '../ui.js';

initLayout('base64');

const io = document.getElementById('io');
const msg = document.getElementById('b64-msg');

function encode(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function decode(b64) {
  const bin = atob(b64.replace(/\s+/g, ''));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
}

document.getElementById('btn-enc').addEventListener('click', () => {
  try {
    io.value = encode(io.value);
    msg.textContent = '';
  } catch (err) {
    msg.className = 'err-text';
    msg.textContent = String(err);
  }
});

document.getElementById('btn-dec').addEventListener('click', () => {
  try {
    io.value = decode(io.value);
    msg.textContent = '';
  } catch (err) {
    msg.className = 'err-text';
    msg.textContent = String(err);
  }
});

document.getElementById('btn-swap').addEventListener('click', () => {
  io.value = io.value
    .split('\n')
    .map((line) => (line.trim() ? encode(line) : ''))
    .join('\n');
});

document.getElementById('btn-clear').addEventListener('click', () => {
  io.value = '';
  msg.textContent = '';
});

const dz = document.getElementById('dz');
makeDropzone(dz, async (files) => {
  const file = files[0];
  if (file.size > 5 * 1024 * 1024) {
    msg.className = 'err-text';
    msg.textContent = t('b64_too_large');
    return;
  }
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let bin = '';
  const CHUNK = 32768;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  io.value = btoa(bin);
  toast(`${file.name} → Base64 ✓`);
});
