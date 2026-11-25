import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { toast, downloadBlob, makeDropzone } from '../ui.js';
import { runFFmpeg } from './ffmpeg-client.js';

initLayout('video-to-mp3');

const dz = document.getElementById('dz');
const opts = document.getElementById('opts');
const btn = document.getElementById('btn-run');
const pbarWrap = document.getElementById('pbar-wrap');
const pbar = document.getElementById('pbar');
const statusEl = document.getElementById('status');
let file = null;

makeDropzone(dz, (files) => {
  file = files[0];
  document.getElementById('f-name').textContent = `🎵 ${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB`;
  opts.hidden = false;
  dz.hidden = true;
});

btn.addEventListener('click', async () => {
  if (!file) return;
  btn.disabled = true;
  pbarWrap.hidden = false;
  statusEl.textContent = t('ff_loading');
  try {
    const kbps = document.getElementById('quality').value;
    const data = await runFFmpeg(
      [{ name: 'in.mp4', data: await file.arrayBuffer() }],
      ['-i', 'in.mp4', '-vn', '-c:a', 'libmp3lame', '-b:a', `${kbps}k`, 'out.mp3'],
      {
        onProgress: (p) => {
          pbar.style.width = `${Math.round(p * 100)}%`;
          statusEl.textContent = `${t('ff_working')} ${Math.round(p * 100)}%`;
        },
      }
    );
    const blob = new Blob([data], { type: 'audio/mpeg' });
    downloadBlob(blob, `${(file.name || 'video').replace(/\.[^.]+$/, '')}.mp3`);
    statusEl.textContent = `${t('vmp3_done')} · ${(blob.size / 1024 / 1024).toFixed(1)} MB`;
    toast('✓');
  } catch (err) {
    statusEl.textContent = t('ff_failed');
  } finally {
    btn.disabled = false;
    pbarWrap.hidden = true;
  }
});
