import { initLayout } from '../layout.js';
import { t } from '../i18n.js';

initLayout('regex-tester');

const patternEl = document.getElementById('pattern');
const textEl = document.getElementById('text');
const statusEl = document.getElementById('rx-status');
const outCard = document.getElementById('rx-out-card');
const outEl = document.getElementById('rx-out');
const groupsCard = document.getElementById('rx-groups-card');
const groupsEl = document.getElementById('rx-groups');

function flags() {
  let f = '';
  for (const id of ['f-g', 'f-i', 'f-m', 'f-s']) {
    if (document.getElementById(id).checked) f += id.slice(2);
  }
  return f;
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function render() {
  outCard.hidden = true;
  groupsCard.hidden = true;
  statusEl.textContent = '';
  outEl.innerHTML = '';
  groupsEl.innerHTML = '';
  if (!patternEl.value) return;

  let re;
  try {
    re = new RegExp(patternEl.value, flags());
  } catch (err) {
    statusEl.className = 'err-text';
    statusEl.textContent = `✗ ${err.message}`;
    return;
  }

  const text = textEl.value;
  const matches = [];
  if (re.global) {
    for (const m of text.matchAll(re)) {
      matches.push(m);
      if (matches.length > 500) break;
    }
  } else {
    const m = re.exec(text);
    if (m) matches.push(m);
  }

  outCard.hidden = false;
  statusEl.className = 'ok-text';
  statusEl.textContent = `${matches.length} ${t('rx_matches_count')}`;

  let html = '';
  let last = 0;
  const frag = [];
  for (const [i, m] of matches.entries()) {
    const [start, end] = [m.index, m.index + m[0].length];
    if (start < last) continue;
    frag.push(esc(text.slice(last, start)));
    frag.push(`<mark class="rx-mark rx-${i % 4}">${esc(m[0])}</mark>`);
    last = end;
  }
  frag.push(esc(text.slice(last)));
  html = frag.join('');
  outEl.innerHTML = html.replace(/\n/g, '<br>');

  if (matches.length > 0 && matches[0].length > 1) {
    groupsCard.hidden = false;
    for (const [i, m] of matches.entries()) {
      for (let g = 1; g < m.length; g++) {
        const el = document.createElement('div');
        el.className = 'result-item';
        el.innerHTML = `<span class="label">#${i + 1}.$${g}</span><code>${esc(String(m[g] ?? ''))}</code>`;
        groupsEl.appendChild(el);
      }
    }
  }
}

patternEl.addEventListener('input', render);
textEl.addEventListener('input', render);
for (const id of ['f-g', 'f-i', 'f-m', 'f-s']) {
  document.getElementById(id).addEventListener('change', render);
}
render();
