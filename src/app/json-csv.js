import Papa from 'papaparse';
import { initLayout } from '../layout.js';
import { t } from '../i18n.js';

initLayout('json-csv');

const io = document.getElementById('io');
const msg = document.getElementById('csv-msg');
const delimEl = document.getElementById('delim');
const headerEl = document.getElementById('header');

document.getElementById('btn-csv').addEventListener('click', () => {
  let data;
  try {
    data = JSON.parse(io.value);
  } catch (err) {
    msg.className = 'err-text';
    msg.textContent = `✗ ${t('csv_invalid')} (${err.message})`;
    return;
  }
  if (!Array.isArray(data) || data.some((x) => typeof x !== 'object' || x === null || Array.isArray(x))) {
    msg.className = 'err-text';
    msg.textContent = `✗ ${t('csv_invalid')}`;
    return;
  }
  const flat = data.map((row) => {
    const out = {};
    for (const [k, v] of Object.entries(row)) {
      out[k] = typeof v === 'object' && v !== null ? JSON.stringify(v) : v;
    }
    return out;
  });
  io.value = Papa.unparse(flat, { delimiter: delimEl.value });
  msg.className = 'ok-text';
  msg.textContent = `✓ JSON → CSV (${flat.length})`;
});

document.getElementById('btn-json').addEventListener('click', () => {
  const parsed = Papa.parse(io.value.trim(), {
    delimiter: delimEl.value,
    header: headerEl.checked,
    skipEmptyLines: true,
  });
  if (parsed.errors.length > 0 && parsed.data.length === 0) {
    msg.className = 'err-text';
    msg.textContent = `✗ ${parsed.errors[0].message}`;
    return;
  }
  io.value = JSON.stringify(parsed.data, null, 2);
  msg.className = 'ok-text';
  msg.textContent = `✓ CSV → JSON (${parsed.data.length})`;
});

document.getElementById('btn-clear').addEventListener('click', () => {
  io.value = '';
  msg.textContent = '';
});
