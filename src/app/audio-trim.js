import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { toast, downloadBlob, makeDropzone } from '../ui.js';
import { runFFmpeg } from './ffmpeg-client.js';

initLayout('audio-trim');

const dz = document.getElementById('dz');
const opts = document.getElementById('opts');
const btn = document.getElementById('btn-run');
const pbarWrap = document.getElementById('pbar-wrap');
const pbar = document.getElementById('pbar');
const statusEl = document.getElementById('status');
let file = null;
let ext = 'mp3';

makeDropzone(dz, (files) => {
  file = files[0];
  ext = (file.name.split('.').pop() || 'mp3').toLowerCase();
  if (!['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'].includes(ext)) ext = 'mp3';
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
    const dur = Math.max(0.5, Number(document.getElementById('dur').value) || 10);
    const data = await runFFmpeg(
      [{ name: 'in.mp4', data: await file.arrayBuffer() }],
      ['-ss', String(start), '-t', String(dur), '-i', 'in.mp4', '-vn', '-c', 'copy', `out.${ext}`],
      {
        onProgress: (p) => {
          pbar.style.width = `${Math.round(p * 100)}%`;
          statusEl.textContent = `${t('ff_working')} ${Math.round(p * 100)}%`;
        },
      }
    );
    const mime = { mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg', aac: 'audio/aac', flac: 'audio/flac', m4a: 'audio/mp4' }[ext];
    const blob = new Blob([data], { type: mime });
    downloadBlob(blob, `${(file.name || 'audio').replace(/\.[^.]+$/, '')}-cut.${ext}`);
    statusEl.textContent = `${t('atrim_done')} · ${(blob.size / 1024 / 1024).toFixed(1)} MB`;
    toast('✓');
  } catch (err) {
    statusEl.textContent = t('ff_failed');
  } finally {
    btn.disabled = false;
    pbarWrap.hidden = true;
  }
});
