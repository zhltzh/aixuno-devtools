import { initLayout } from '../layout.js';
import { t } from '../i18n.js';

initLayout('random-picker');

document.getElementById('btn-pick').addEventListener('click', () => {
  const list = document.getElementById('names')
    .value.split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  const count = Math.max(1, Number(document.getElementById('count').value));
  const unique = document.getElementById('unique').checked;
  const card = document.getElementById('result-card');
  const out = document.getElementById('result');
  card.hidden = false;
  out.innerHTML = '';
  if (list.length === 0) return;

  const winners = [];
  if (unique && count <= list.length) {
    const pool = [...list];
    for (let i = 0; i < count; i++) {
      const idx = crypto.getRandomValues(new Uint32Array(1))[0] % pool.length;
      winners.push(pool.splice(idx, 1)[0]);
    }
  } else {
    for (let i = 0; i < count; i++) {
      winners.push(list[crypto.getRandomValues(new Uint32Array(1))[0] % list.length]);
    }
  }

  winners.forEach((name, i) => {
    const el = document.createElement('div');
    el.className = 'result-item';
    el.style.background = i === 0 ? '#eef3ff' : '';
    el.innerHTML = `<span class="label">#${i + 1}</span><code style="font-weight: 700">${name}</code>`;
    out.appendChild(el);
  });
});

document.getElementById('btn-clear').addEventListener('click', () => {
  document.getElementById('names').value = '';
  document.getElementById('result-card').hidden = true;
});
