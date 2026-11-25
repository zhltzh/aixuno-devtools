import JSZip from 'jszip';
import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { toast, downloadBlob, makeDropzone } from '../ui.js';

initLayout('grid-cutter');

const dz = document.getElementById('dz');
const opts = document.getElementById('grid-opts');
const preview = document.getElementById('preview');
let file = null;
let bitmap = null;

makeDropzone(dz, async (files) => {
  file = files[0];
  if (!file.type.startsWith('image/')) return;
  bitmap = await createImageBitmap(file);
  preview.src = URL.createObjectURL(file);
  opts.hidden = false;
});

document.getElementById('btn-cut').addEventListener('click', async () => {
  if (!bitmap) return;
  const rows = Math.min(8, Math.max(1, Number(document.getElementById('rows').value) || 3));
  const cols = Math.min(8, Math.max(1, Number(document.getElementById('cols').value) || 3));
  const square = document.getElementById('square').checked;

  let srcW = bitmap.width;
  let srcH = bitmap.height;
  let sx = 0;
  let sy = 0;
  if (square) {
    const side = Math.min(srcW, srcH);
    sx = Math.round((srcW - side) / 2);
    sy = Math.round((srcH - side) / 2);
    srcW = side;
    srcH = side;
  }
  const cellW = Math.floor(srcW / cols);
  const cellH = Math.floor(srcH / rows);

  const zip = new JSZip();
  const canvas = document.createElement('canvas');
  canvas.width = cellW;
  canvas.height = cellH;
  const ctx = canvas.getContext('2d');
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.clearRect(0, 0, cellW, cellH);
      ctx.drawImage(bitmap, sx + c * cellW, sy + r * cellH, cellW, cellH, 0, 0, cellW, cellH);
      const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
      zip.file(`${r + 1}x${c + 1}.png`, blob);
    }
  }
  const out = await zip.generateAsync({ type: 'blob' });
  const name = (file.name || 'image').replace(/\.[^.]+$/, '');
  downloadBlob(out, `${name}-${rows}x${cols}.zip`);
  toast(t('grid_done', { n: rows * cols }));
});
