import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { toast, downloadBlob, makeDropzone } from '../ui.js';
import { drawMeme } from './canvas-paint.js';

initLayout('meme-maker');

const dz = document.getElementById('dz');
const opts = document.getElementById('opts');
const sizeEl = document.getElementById('size');
const previewOut = document.getElementById('preview-out');
let bitmap = null;
let fileName = 'meme.png';
let currentBlob = null;

makeDropzone(dz, async (files) => {
  const file = files[0];
  if (!file.type.startsWith('image/')) return;
  bitmap = await createImageBitmap(file);
  fileName = (file.name || 'image').replace(/\.[^.]+$/, '') + '-meme.png';
  opts.hidden = false;
  dz.hidden = true;
  make();
});

sizeEl.addEventListener('input', () => {
  document.getElementById('size-val').textContent = `${sizeEl.value}%`;
  make();
});
document.getElementById('top-text').addEventListener('input', make);
document.getElementById('bottom-text').addEventListener('input', make);

function make() {
  if (!bitmap) return;
  const maxSide = 800;
  const k = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * k);
  const h = Math.round(bitmap.height * k);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, w, h);
  drawMeme(ctx, w, h, {
    topText: document.getElementById('top-text').value,
    bottomText: document.getElementById('bottom-text').value,
    fontSizeRatio: Number(sizeEl.value) / 100,
  });
  previewOut.innerHTML = '';
  canvas.toBlob((blob) => {
    currentBlob = blob;
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    img.style.cssText = 'max-width: 100%; border-radius: 10px; border: 1px solid var(--line)';
    previewOut.appendChild(img);
  }, 'image/png');
}

document.getElementById('btn-make').addEventListener('click', () => {
  if (!currentBlob) return;
  downloadBlob(currentBlob, fileName);
  toast(t('meme_done'));
});
