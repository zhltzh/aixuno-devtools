import { initLayout } from '../layout.js';
import { t } from '../i18n.js';

initLayout('jwt-decoder');

function b64urlDecode(str) {
  const pad = '='.repeat((4 - (str.length % 4)) % 4);
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/') + pad;
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function pretty(obj) {
  return JSON.stringify(obj, null, 2);
}

document.getElementById('btn-jwt').addEventListener('click', () => {
  const status = document.getElementById('jwt-status');
  const hCard = document.getElementById('jwt-header-card');
  const pCard = document.getElementById('jwt-payload-card');
  const hOut = document.getElementById('jwt-header');
  const pOut = document.getElementById('jwt-payload');
  const timesEl = document.getElementById('jwt-times');
  hCard.hidden = true;
  pCard.hidden = true;
  status.textContent = '';

  const parts = document.getElementById('token').value.trim().split('.');
  if (parts.length < 2) {
    status.className = 'err-text';
    status.textContent = '✗ JWT must have at least 2 dot-separated parts';
    return;
  }
  let header;
  let payload;
  try {
    header = JSON.parse(b64urlDecode(parts[0]));
    payload = JSON.parse(b64urlDecode(parts[1]));
  } catch (err) {
    status.className = 'err-text';
    status.textContent = `✗ ${err.message}`;
    return;
  }

  hCard.hidden = false;
  pCard.hidden = false;
  hOut.textContent = pretty(header);
  pOut.textContent = pretty(payload);

  timesEl.innerHTML = '';
  const fields = [
    ['exp', t('jwt_exp')],
    ['iat', t('jwt_iat')],
    ['nbf', t('jwt_nbf')],
  ];
  const now = Date.now() / 1000;
  for (const [key, label] of fields) {
    if (typeof payload[key] !== 'number') continue;
    const date = new Date(payload[key] * 1000);
    const el = document.createElement('div');
    el.className = 'result-item';
    const expired = key === 'exp' && payload[key] < now;
    el.innerHTML = `<span class="label">${label}</span><code>${date.toLocaleString()}</code><span class="${expired ? 'err-text' : 'ok-text'}" style="font-size: 13px">${expired ? '✗ ' + t('jwt_expired') : ''}</span>`;
    timesEl.appendChild(el);
  }
});
