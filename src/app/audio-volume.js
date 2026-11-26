import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { toast, downloadBlob, makeDropzone } from '../ui.js';
import { runFFmpeg } from './ffmpeg-client.js';

initLayout('audio-volume');

const dz = document.getElementById('dz');
const opts = document.getElementById('opts');
const btn = document.getElementById('btn-run');
const pbarWrap = document.getElementById('pbar-wrap');
const pbar = document.getElementById('pbar');
const statusEl = document.getElementById('status');
const modeEl = document.getElementById('mode');
const dbBox = document.getElementById('db-box');
let file = null;
let ext = 'mp3';

makeDropzone(dz, (files) => {
  file = files[0];
  ext = (file.name.split('.').pop() || 'mp3').toLowerCase();
  if (!['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'].includes(ext)) ext = 'mp3';
  document.getElementById('f-name').textContent = `🔊 ${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB`;
  opts.hidden = false;
  dz.hidden = true;
});

modeEl.addEventListener('change', () => {
  dbBox.style.display = modeEl.value === 'db' ? '' : 'none';
});

btn.addEventListener('click', async () => {
  if (!file) return;
  btn.disabled = true;
  pbarWrap.hidden = false;
  statusEl.textContent = t('ff_loading');
  try {
    let args;
    let outExt = ext;
    if (ext === 'm4a' || ext === 'aac') outExt = 'mp3';
    if (modeEl.value === 'db') {
      const db = document.getElementById('dbval').value;
      args = ['-i', 'in.mp4', '-vn', '-af', `volume=${db}dB`, '-c:a', 'libmp3lame', '-b:a', '192k', 'out.mp3'];
    } else {
      args = ['-i', 'in.mp4', '-vn', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-c:a', 'libmp3lame', '-b:a', '192k', 'out.mp3'];
    }
    void outExt;
    const data = await runFFmpeg([{ name: 'in.mp4', data: await file.arrayBuffer() }], args, {
      onProgress: (p) => {
        pbar.style.width = `${Math.round(p * 100)}%`;
        statusEl.textContent = `${t('ff_working')} ${Math.round(p * 100)}%`;
      },
    });
    const blob = new Blob([data], { type: 'audio/mpeg' });
    const suffix = modeEl.value === 'db' ? `${document.getElementById('dbval').value}dB` : 'normalized';
    downloadBlob(blob, `${(file.name || 'audio').replace(/\.[^.]+$/, '')}-${suffix}.mp3`);
    statusEl.textContent = `${t('avol_done')} · ${(blob.size / 1024 / 1024).toFixed(1)} MB`;
    toast('✓');
  } catch (err) {
    statusEl.textContent = t('ff_failed');
  } finally {
    btn.disabled = false;
    pbarWrap.hidden = true;
  }
});
