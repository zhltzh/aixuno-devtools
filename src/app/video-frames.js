import JSZip from 'jszip';
import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { toast, downloadBlob, makeDropzone } from '../ui.js';
import { runFFmpeg, listFFmpegFiles, readFFmpegFile } from './ffmpeg-client.js';

initLayout('video-frames');

const dz = document.getElementById('dz');
const opts = document.getElementById('opts');
const btn = document.getElementById('btn-run');
const pbarWrap = document.getElementById('pbar-wrap');
const pbar = document.getElementById('pbar');
const statusEl = document.getElementById('status');
const resultEl = document.getElementById('result');
const modeEl = document.getElementById('mode');
const intervalBox = document.getElementById('interval-box');
let file = null;

makeDropzone(dz, (files) => {
  file = files[0];
  document.getElementById('f-name').textContent = `🖼 ${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB`;
  opts.hidden = false;
  dz.hidden = true;
});

modeEl.addEventListener('change', () => {
  intervalBox.style.display = modeEl.value === 'interval' ? '' : 'none';
});

btn.addEventListener('click', async () => {
  if (!file) return;
  btn.disabled = true;
  pbarWrap.hidden = false;
  statusEl.textContent = t('ff_loading');
  resultEl.innerHTML = '';
  try {
    const mode = modeEl.value;
    const interval = Math.max(0.5, Number(document.getElementById('interval').value) || 2);
    let args;
    let outPattern;
    if (mode === 'cover') {
      args = ['-i', 'in.mp4', '-frames:v', '1', 'out.png'];
      outPattern = 'out.png';
    } else if (mode === 'grid') {
      args = ['-i', 'in.mp4', '-vf', 'fps=1,scale=320:-1,tile=3x3', 'grid.png'];
      outPattern = 'grid.png';
    } else {
      args = ['-i', 'in.mp4', '-vf', `fps=${(1 / interval).toFixed(4)}`, 'out_%04d.png'];
      outPattern = 'out_%04d.png';
    }

    const data = await runFFmpeg([{ name: 'in.mp4', data: await file.arrayBuffer() }], args, {
      onProgress: (p) => {
        pbar.style.width = `${Math.round(p * 100)}%`;
        statusEl.textContent = `${t('ff_working')} ${Math.round(p * 100)}%`;
      },
    });

    if (outPattern === 'out_%04d.png') {
      const frames = [];
      const names = await listFFmpegFiles();
      for (const n of names.sort()) {
        if (!n.startsWith('out_') || !n.endsWith('.png')) continue;
        const buf = await readFFmpegFile(n);
        frames.push({ name: n, buf });
      }
      const zip = new JSZip();
      for (const f of frames) zip.file(f.name, f.buf);
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(zipBlob, `${(file.name || 'video').replace(/\.[^.]+$/, '')}-frames.zip`);
      for (const f of frames.slice(0, 12)) {
        const img = new Image();
        img.src = URL.createObjectURL(new Blob([f.buf], { type: 'image/png' }));
        img.style.cssText = 'width: 100%; border-radius: 8px; border: 1px solid var(--line)';
        resultEl.appendChild(img);
      }
      statusEl.textContent = `${t('vframes_done')} · ${frames.length} PNG → ZIP`;
    } else {
      const blob = new Blob([data], { type: 'image/png' });
      downloadBlob(blob, `${(file.name || 'video').replace(/\.[^.]+$/, '')}-${mode === 'grid' ? 'grid' : 'cover'}.png`);
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      img.style.cssText = 'width: 100%; max-width: 480px; border-radius: 8px; border: 1px solid var(--line); grid-column: span 2';
      resultEl.appendChild(img);
      statusEl.textContent = t('vframes_done');
    }
    toast('✓');
  } catch (err) {
    statusEl.textContent = t('ff_failed');
  } finally {
    btn.disabled = false;
    pbarWrap.hidden = true;
  }
});
