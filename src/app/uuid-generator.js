import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { toast, copyText } from '../ui.js';

initLayout('uuid-generator');

function uuidV4() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

let current = [];

function generate() {
  const n = Math.min(500, Math.max(1, Number(document.getElementById('count').value) || 10));
  const upper = document.getElementById('upper').checked;
  current = Array.from({ length: n }, () => {
    const id = uuidV4();
    return upper ? id.toUpperCase() : id;
  });
  const out = document.getElementById('out');
  out.innerHTML = '';
  for (const id of current) {
    const el = document.createElement('div');
    el.className = 'result-item';
    el.innerHTML = `<code>${id}</code>`;
    const cp = document.createElement('button');
    cp.className = 'copy-btn';
    cp.textContent = '⧉';
    cp.addEventListener('click', () => void copyText(id));
    el.appendChild(cp);
    out.appendChild(el);
  }
}

document.getElementById('btn-gen').addEventListener('click', generate);
document.getElementById('btn-copy').addEventListener('click', async () => {
  if (await copyText(current.join('\n'))) toast('✓');
});
generate();
