import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { toast, copyText } from '../ui.js';

initLayout('password');

const out = document.getElementById('pw-out');
const len = document.getElementById('len');
const lenVal = document.getElementById('len-val');
const strengthEl = document.getElementById('pw-strength');

len.addEventListener('input', () => {
  lenVal.textContent = len.value;
});

function pools() {
  const sets = {
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    digit: '0123456789',
    symbol: '!@#$%^&*()-_=+[]{};:,.?/',
  };
  const exclude = document.getElementById('c-exclude').checked;
  const ambiguous = /[0O1lI]/g;
  let all = '';
  for (const [id, charset] of Object.entries(sets)) {
    if (!document.getElementById(`c-${id}`).checked) continue;
    all += exclude ? charset.replace(ambiguous, '') : charset;
  }
  return all;
}

function generate() {
  const all = pools();
  if (!all) {
    out.textContent = '—';
    return;
  }
  const n = Number(len.value);
  const values = new Uint32Array(n);
  crypto.getRandomValues(values);
  let pw = '';
  for (const v of values) pw += all[v % all.length];
  out.textContent = pw;

  const entropy = n * Math.log2(all.length);
  let label;
  let cls;
  if (entropy < 40) {
    label = t('pw_strength_weak');
    cls = 'err-text';
  } else if (entropy < 70) {
    label = t('pw_strength_fair');
    cls = '';
  } else if (entropy < 100) {
    label = t('pw_strength_strong');
    cls = 'ok-text';
  } else {
    label = t('pw_strength_xstrong');
    cls = 'ok-text';
  }
  strengthEl.className = cls;
  strengthEl.textContent = `${t('pw_strength')}: ${label} (${Math.round(entropy)} bits)`;
}

document.getElementById('btn-gen').addEventListener('click', generate);
document.getElementById('btn-copy').addEventListener('click', async () => {
  if (await copyText(out.textContent)) toast('✓');
});

generate();
