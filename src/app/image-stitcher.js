import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { toast, downloadBlob, makeDropzone } from '../ui.js';

initLayout('image-stitcher');

const dz = document.getElementById('dz');
const optsCard = document.getElementById('stitch-opts');
const queueEl = document.getElementById('queue');
const images = [];

makeDropzone(dz, (files) => void add(files));

async function add(files) {
  for (const f of files.filter((x) => x.type.startsWith('image/'))) {
    images.push({ file: f, bitmap: await createImageBitmap(f) });
  }
  render();
}

function render() {
  optsCard.hidden = images.length === 0;
  queueEl.innerHTML = '';
  images.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'result-item';
    el.innerHTML = `
      <span class="label">#${i + 1}</span>
      <code>${item.file.name} · ${item.bitmap.width}×${item.bitmap.height}</code>`;
    const mv = document.createElement('button');
    mv.className = 'copy-btn';
    mv.textContent = '↑';
    mv.disabled = i === 0;
    mv.addEventListener('click', () => {
      [images[i - 1], images[i]] = [images[i], images[i - 1]];
      render();
    });
    const rm = document.createElement('button');
    rm.className = 'copy-btn';
    rm.textContent = '✕';
    rm.addEventListener('click', () => {
      images.splice(i, 1);
      render();
    });
    el.append(mv, rm);
    queueEl.appendChild(el);
  });
}

document.getElementById('btn-stitch').addEventListener('click', () => {
  if (images.length < 2) {
    toast(t('stitch_need_two'));
    return;
  }
  const dir = document.getElementById('dir').value;
  const gap = Number(document.getElementById('gap').value) || 0;
  const bg = document.getElementById('bg').value;

  let W;
  let H;
  if (dir === 'v') {
    W = Math.max(...images.map((x) => x.bitmap.width));
    H = images.reduce((s, x) => s + x.bitmap.height, 0) + gap * (images.length - 1);
  } else {
    H = Math.max(...images.map((x) => x.bitmap.height));
    W = images.reduce((s, x) => s + x.bitmap.width, 0) + gap * (images.length - 1);
  }
  if (W * H > 4096 * 4096 * 2) {
    toast(t('stitch_too_large'));
    return;
  }
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  let pos = 0;
  for (const item of images) {
    if (dir === 'v') {
      const x = Math.round((W - item.bitmap.width) / 2);
      ctx.drawImage(item.bitmap, x, pos);
      pos += item.bitmap.height + gap;
    } else {
      const y = Math.round((H - item.bitmap.height) / 2);
      ctx.drawImage(item.bitmap, pos, y);
      pos += item.bitmap.width + gap;
    }
  }
  canvas.toBlob((blob) => {
    downloadBlob(blob, `stitched-${dir === 'v' ? 'long' : 'wide'}.png`);
    toast(t('stitch_done'));
  }, 'image/png');
});
