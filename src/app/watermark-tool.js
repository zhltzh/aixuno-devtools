import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { toast, downloadBlob, makeDropzone } from '../ui.js';

initLayout('watermark-tool');

const dz = document.getElementById('dz');
const actions = document.getElementById('wm-actions');
const listEl = document.getElementById('wm-list');
const files = [];

makeDropzone(dz, (list) => void add(list));

async function add(list) {
  for (const f of list.filter((x) => x.type.startsWith('image/'))) {
    files.push(f);
  }
  actions.hidden = files.length === 0;
  render();
}

function render() {
  listEl.innerHTML = '';
  files.forEach((f, i) => {
    const el = document.createElement('div');
    el.className = 'result-item';
    el.innerHTML = `<span class="label">#${i + 1}</span><code>${f.name} · ${(f.size / 1024).toFixed(0)} KB</code>`;
    const rm = document.createElement('button');
    rm.className = 'copy-btn';
    rm.textContent = '✕';
    rm.addEventListener('click', () => {
      files.splice(i, 1);
      actions.hidden = files.length === 0;
      render();
    });
    el.appendChild(rm);
    listEl.appendChild(el);
  });
}

document.getElementById('btn-run').addEventListener('click', async () => {
  const text = document.getElementById('wm-text').value || '©';
  const pos = document.getElementById('wm-pos').value;
  const opacity = Number(document.getElementById('wm-opacity').value);
  const color = document.getElementById('wm-color').value;
  const sizePct = Number(document.getElementById('wm-size').value) / 100;

  for (const f of files) {
    const bitmap = await createImageBitmap(f);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0);
    const fontSize = Math.max(12, Math.round(Math.min(canvas.width, canvas.height) * sizePct));
    ctx.font = `700 ${fontSize}px sans-serif`;
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = fontSize * 0.08;
    const metrics = ctx.measureText(text);
    const pad = fontSize * 0.8;

    if (pos === 'tile') {
      const stepX = metrics.width + pad * 3;
      const stepY = fontSize * 5;
      ctx.rotate(-0.35);
      for (let y = -canvas.height; y < canvas.height * 2; y += stepY) {
        for (let x = -canvas.width; x < canvas.width * 2; x += stepX) {
          ctx.fillText(text, x, y);
        }
      }
    } else {
      let x;
      let y;
      if (pos === 'br') { ctx.textAlign = 'right'; x = canvas.width - pad; y = canvas.height - pad; }
      else if (pos === 'bl') { ctx.textAlign = 'left'; x = pad; y = canvas.height - pad; }
      else if (pos === 'tr') { ctx.textAlign = 'right'; x = canvas.width - pad; y = pad + fontSize; }
      else { ctx.textAlign = 'left'; x = pad; y = pad + fontSize; }
      ctx.fillText(text, x, y);
    }
    ctx.globalAlpha = 1;

    const blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', 0.92));
    const name = f.name.replace(/(\.[^.]+)?$/, (ext) => `-wm${ext || '.jpg'}`);
    downloadBlob(blob, name);
    await new Promise((r) => setTimeout(r, 250));
  }
  toast(t('wm_done', { n: files.length }));
});
