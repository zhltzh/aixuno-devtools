import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { copyText } from '../ui.js';

initLayout('json-format');

const io = document.getElementById('io');
const msg = document.getElementById('json-msg');

function parse() {
  try {
    const data = JSON.parse(io.value);
    msg.className = 'ok-text';
    msg.textContent = `✓ ${t('json_valid')}`;
    return data;
  } catch (err) {
    msg.className = 'err-text';
    msg.textContent = `✗ ${t('json_error_at')}: ${err.message}`;
    return undefined;
  }
}

document.getElementById('btn-fmt').addEventListener('click', () => {
  const data = parse();
  if (data !== undefined) io.value = JSON.stringify(data, null, 2);
});

document.getElementById('btn-min').addEventListener('click', () => {
  const data = parse();
  if (data !== undefined) io.value = JSON.stringify(data);
});

document.getElementById('btn-val').addEventListener('click', () => {
  parse();
});

document.getElementById('btn-esc').addEventListener('click', () => {
  io.value = io.value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
});

document.getElementById('btn-unesc').addEventListener('click', () => {
  io.value = io.value
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
});

document.getElementById('btn-clear').addEventListener('click', () => {
  io.value = '';
  msg.textContent = '';
});

document.getElementById('btn-copy')?.addEventListener('click', () => void copyText(io.value));
