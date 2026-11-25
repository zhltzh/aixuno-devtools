import { initLayout } from '../layout.js';
import { copyText } from '../ui.js';

initLayout('url-encode');

const io = document.getElementById('io');
const paramsCard = document.getElementById('params-card');
const paramsEl = document.getElementById('params');

function tryRenderParams() {
  paramsCard.hidden = true;
  paramsEl.innerHTML = '';
  let u;
  try {
    u = new URL(io.value.trim());
  } catch (err) {
    return;
  }
  const entries = [...u.searchParams.entries()];
  if (entries.length === 0) return;
  paramsCard.hidden = false;
  for (const [k, v] of entries) {
    const el = document.createElement('div');
    el.className = 'result-item';
    el.innerHTML = `<span class="label">${k}</span><code>${v}</code>`;
    const cp = document.createElement('button');
    cp.className = 'copy-btn';
    cp.textContent = '⧉';
    cp.addEventListener('click', () => void copyText(v));
    el.appendChild(cp);
    paramsEl.appendChild(el);
  }
}

document.getElementById('btn-enc').addEventListener('click', () => {
  io.value = encodeURIComponent(io.value);
  tryRenderParams();
});
document.getElementById('btn-uri').addEventListener('click', () => {
  io.value = encodeURI(io.value);
  tryRenderParams();
});
document.getElementById('btn-dec').addEventListener('click', () => {
  try {
    io.value = decodeURIComponent(io.value.replace(/\+/g, '%20'));
  } catch (err) {
    io.value = decodeURI(io.value);
  }
  tryRenderParams();
});
document.getElementById('btn-clear').addEventListener('click', () => {
  io.value = '';
  paramsCard.hidden = true;
});
io.addEventListener('input', () => {
  if (io.value.trim().startsWith('http')) tryRenderParams();
});
