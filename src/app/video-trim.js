import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { toast, downloadBlob, makeDropzone } from '../ui.js';
import { runFFmpeg } from './ffmpeg-client.js';

initLayout('video-trim');

const dz = document.getElementById('dz');
const opts = document.getElementById('opts');
const btn = document.getElementById('btn-run');
const pbarWrap = document.getElementById('pbar-wrap');
const pbar = document.getElementById('pbar');
const statusEl = document.getElementById('status');
let file = null;
let ext = 'mp4';

makeDropzone(dz, (files) => {
  file = files[0];
  ext = (file.name.split('.').pop() || 'mp4').toLowerCase();
  if (!['mp4', 'webm', 'mov', 'mkv'].includes(ext)) ext = 'mp4';
  document.getElementById('f-name').textContent = `✂️ ${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB`;
  opts.hidden = false;
  dz.hidden = true;
});

btn.addEventListener('click', async () => {
  if (!file) return;
  btn.disabled = true;
  pbarWrap.hidden = false;
  statusEl.textContent = t('ff_loading');
  try {
    const start = Math.max(0, Number(document.getElementById('start').value) || 0);
    const dur = Math.max(0.5, Number(document.getElementById('dur').value) || 5);
    const data = await runFFmpeg(
      [{ name: 'in.mp4', data: await file.arrayBuffer() }],
      ['-ss', String(start), '-t', String(dur), '-i', 'in.mp4', '-c', 'copy', `out.${ext}`],
      {
        onProgress: (p) => {
          pbar.style.width = `${Math.round(p * 100)}%`;
          statusEl.textContent = `${t('ff_working')} ${Math.round(p * 100)}%`;
        },
      }
    );
    const blob = new Blob([data], { type: `video/${ext}` });
    downloadBlob(blob, `${(file.name || 'video').replace(/\.[^.]+$/, '')}-cut.${ext}`);
    statusEl.textContent = `${t('vtrim_done')} · ${(blob.size / 1024 / 1024).toFixed(1)} MB`;
    toast('✓');
  } catch (err) {
    statusEl.textContent = t('ff_failed');
  } finally {
    btn.disabled = false;
    pbarWrap.hidden = true;
  }
});
