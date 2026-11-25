import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { toast, downloadBlob, makeDropzone } from '../ui.js';
import { runFFmpeg } from './ffmpeg-client.js';

initLayout('video-fx');

const dz = document.getElementById('dz');
const opts = document.getElementById('opts');
const btn = document.getElementById('btn-run');
const pbarWrap = document.getElementById('pbar-wrap');
const pbar = document.getElementById('pbar');
const statusEl = document.getElementById('status');
const modeEl = document.getElementById('mode');
const speedBox = document.getElementById('speed-box');
let file = null;

makeDropzone(dz, (files) => {
  file = files[0];
  document.getElementById('f-name').textContent = `⚡ ${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB`;
  opts.hidden = false;
  dz.hidden = true;
});

modeEl.addEventListener('change', () => {
  speedBox.style.display = modeEl.value === 'speed' ? '' : 'none';
});

btn.addEventListener('click', async () => {
  if (!file) return;
  btn.disabled = true;
  pbarWrap.hidden = false;
  statusEl.textContent = t('ff_loading');
  try {
    const mode = modeEl.value;
    let args;
    if (mode === 'speed') {
      const f = Number(document.getElementById('factor').value);
      args = ['-i', 'in.mp4', '-vf', `setpts=${(1 / f).toFixed(4)}*PTS`, '-af', `atempo=${f}`, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-c:a', 'aac', 'out.mp4'];
    } else if (mode === 'reverse') {
      args = ['-i', 'in.mp4', '-vf', 'reverse', '-af', 'areverse', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-c:a', 'aac', 'out.mp4'];
    } else {
      args = ['-i', 'in.mp4', '-vf', 'hflip', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-c:a', 'aac', 'out.mp4'];
    }
    const data = await runFFmpeg([{ name: 'in.mp4', data: await file.arrayBuffer() }], args, {
      onProgress: (p) => {
        pbar.style.width = `${Math.round(p * 100)}%`;
        statusEl.textContent = `${t('ff_working')} ${Math.round(p * 100)}%`;
      },
    });
    const blob = new Blob([data], { type: 'video/mp4' });
    const suffix = mode === 'speed' ? `${document.getElementById('factor').value}x` : mode;
    downloadBlob(blob, `${(file.name || 'video').replace(/\.[^.]+$/, '')}-${suffix}.mp4`);
    statusEl.textContent = `${t('vfx_done')} · ${(blob.size / 1024 / 1024).toFixed(1)} MB`;
    toast('✓');
  } catch (err) {
    statusEl.textContent = t('ff_failed');
  } finally {
    btn.disabled = false;
    pbarWrap.hidden = true;
  }
});
