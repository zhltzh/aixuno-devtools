import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { copyText } from '../ui.js';

initLayout('timestamp');

const clock = document.getElementById('clock');
setInterval(() => {
  const now = new Date();
  clock.textContent = `${now.toLocaleString()} · ${Math.floor(now.getTime() / 1000)}s`;
}, 1000);

function relTime(date) {
  const diff = (date.getTime() - Date.now()) / 1000;
  const units = [
    [31536000, 'year'],
    [2592000, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
    [1, 'second'],
  ];
  for (const [secs, name] of units) {
    const v = Math.round(Math.abs(diff) / secs);
    if (v >= 1) {
      return new Intl.RelativeTimeFormat(document.documentElement.lang === 'zh-CN' ? 'zh' : 'en', { numeric: 'auto' }).format(Math.sign(diff) * v, name);
    }
  }
  return new Intl.RelativeTimeFormat(document.documentElement.lang === 'zh-CN' ? 'zh' : 'en', { numeric: 'auto' }).format(0, 'second');
}

function row(label, value, out) {
  const el = document.createElement('div');
  el.className = 'result-item';
  el.innerHTML = `<span class="label">${label}</span><code>${value}</code>`;
  const cp = document.createElement('button');
  cp.className = 'copy-btn';
  cp.textContent = '⧉';
  cp.addEventListener('click', () => void copyText(value));
  el.appendChild(cp);
  out.appendChild(el);
}

document.getElementById('btn-ts2date').addEventListener('click', () => {
  const out = document.getElementById('ts-out');
  out.innerHTML = '';
  const raw = document.getElementById('in-ts').value.trim();
  if (!/^\d+$/.test(raw)) return;
  const n = Number(raw);
  const ms = raw.length > 10 ? n : n * 1000;
  const date = new Date(ms);
  if (isNaN(date.getTime())) return;
  row(t('ts_local'), date.toLocaleString(), out);
  row(t('ts_utc'), date.toUTCString(), out);
  row(t('ts_iso'), date.toISOString(), out);
  row(t('ts_rel'), relTime(date), out);
});

document.getElementById('btn-date2ts').addEventListener('click', () => {
  const out = document.getElementById('date-out');
  out.innerHTML = '';
  const v = document.getElementById('in-date').value;
  if (!v) return;
  const date = new Date(v);
  if (isNaN(date.getTime())) return;
  row('Unix (s)', String(Math.floor(date.getTime() / 1000)), out);
  row('Unix (ms)', String(date.getTime()), out);
  row(t('ts_iso'), date.toISOString(), out);
});
