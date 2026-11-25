import { Cron } from 'croner';
import { toString as cronstrue } from 'cronstrue/i18n';
import { initLayout } from '../layout.js';
import { t } from '../i18n.js';

initLayout('cron-parser');

const status = document.getElementById('cron-status');
const nextCard = document.getElementById('cron-next-card');
const nextEl = document.getElementById('cron-next');

function render() {
  status.textContent = '';
  nextCard.hidden = true;
  nextEl.innerHTML = '';
  const expr = document.getElementById('expr').value.trim();
  if (!expr) return;

  const lang = document.documentElement.lang === 'zh-CN' ? 'zh_CN' : 'en';
  let described;
  try {
    described = cronstrue(expr, { locale: lang, verbose: true });
  } catch (err) {
    described = null;
  }

  let job;
  try {
    job = new Cron(expr);
  } catch (err) {
    status.className = 'err-text';
    status.textContent = `✗ ${err.message}`;
    return;
  }

  status.className = 'ok-text';
  status.textContent = described ? `✓ ${described}` : `✓ ${expr}`;

  nextCard.hidden = false;
  let cursor = new Date();
  const dates = [];
  for (let i = 0; i < 5; i++) {
    const next = job.nextRun(cursor);
    if (!next) break;
    dates.push(next);
    cursor = next;
  }
  job.stop();

  for (const [i, date] of dates.entries()) {
    const el = document.createElement('div');
    el.className = 'result-item';
    el.innerHTML = `<span class="label">#${i + 1}</span><code>${date.toLocaleString()}</code>`;
    nextEl.appendChild(el);
  }
}

document.getElementById('btn-cron').addEventListener('click', render);
document.getElementById('expr').addEventListener('input', () => render());
render();
