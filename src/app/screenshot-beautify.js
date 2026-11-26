import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { toast, downloadBlob, makeDropzone } from '../ui.js';
import { drawBeautify } from './canvas-paint.js';

initLayout('screenshot-beautify');

const GRADIENTS = {
  blue: ['#2f6bff', '#8b5cf6'],
  sunset: ['#ff9966', '#ff5e62'],
  mint: ['#43e97b', '#38f9d7'],
  dark: ['#0f172a', '#334155'],
};

const dz = document.getElementById('dz');
const opts = document.getElementById('opts');
const previewOut = document.getElementById('preview-out');
let bitmap = null;
let fileName = 'beautified.png';
let currentBlob = null;

makeDropzone(dz, async (files) => {
  const file = files[0];
  if (!file.type.startsWith('image/')) return;
  bitmap = await createImageBitmap(file);
  fileName = (file.name || 'screenshot').replace(/\.[^.]+$/, '') + '-beautified.png';
  opts.hidden = false;
  dz.hidden = true;
  render();
});

document.getElementById('style').addEventListener('change', render);
document.getElementById('padding').addEventListener('change', render);

function render() {
  if (!bitmap) return;
  const padding = Number(document.getElementById('padding').value);
  const styleKey = document.getElementById('style').value;
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width + padding * 2;
  canvas.height = bitmap.height + padding * 2;
  const ctx = canvas.getContext('2d');
  drawBeautify(ctx, bitmap, { padding, gradient: GRADIENTS[styleKey] });
  previewOut.innerHTML = '';
  canvas.toBlob((blob) => {
    currentBlob = blob;
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    img.style.cssText = 'max-width: 100%; border-radius: 12px; border: 1px solid var(--line)';
    previewOut.appendChild(img);
  }, 'image/png');
}

document.getElementById('btn-run').addEventListener('click', () => {
  if (!currentBlob) return;
  downloadBlob(currentBlob, fileName);
  toast(t('beauty_done'));
});
