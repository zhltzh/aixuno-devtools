import { initLayout } from '../layout.js';
import { t } from '../i18n.js';

initLayout('date-calculator');

const today = new Date().toISOString().slice(0, 10);
document.getElementById('d-from').value = today;
document.getElementById('d-to').value = today;
document.getElementById('a-base').value = today;

function row(label, value, out) {
  const el = document.createElement('div');
  el.className = 'result-item';
  el.innerHTML = `<span class="label">${label}</span><code>${value}</code>`;
  out.appendChild(el);
}

document.getElementById('btn-diff').addEventListener('click', () => {
  const out = document.getElementById('diff-out');
  out.innerHTML = '';
  const a = new Date(document.getElementById('d-from').value);
  const b = new Date(document.getElementById('d-to').value);
  if (isNaN(a) || isNaN(b)) return;
  const days = Math.round((b - a) / 86400000);
  let workdays = 0;
  const dir = days >= 0 ? 1 : -1;
  const cur = new Date(a);
  for (let i = 0; i < Math.abs(days); i++) {
    cur.setDate(cur.getDate() + dir);
    const dow = cur.getDay();
    if (dow !== 0 && dow !== 6) workdays++;
  }
  row(t('date_days'), `${days}`, out);
  row(t('date_weeks'), (Math.abs(days) / 7).toFixed(1), out);
  row(t('date_months'), (Math.abs(days) / 30.4375).toFixed(1), out);
  row(t('date_workdays'), `${dir * workdays}`, out);
});

document.getElementById('btn-add').addEventListener('click', () => {
  const out = document.getElementById('add-out');
  out.innerHTML = '';
  const base = new Date(document.getElementById('a-base').value);
  const n = Number(document.getElementById('a-days').value);
  if (isNaN(base) || isNaN(n)) return;
  const result = new Date(base);
  result.setDate(result.getDate() + n);
  row(t('date_result'), result.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), out);
  row('ISO', result.toISOString().slice(0, 10), out);
});
