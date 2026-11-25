import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { toast, downloadBlob, makeDropzone } from '../ui.js';
import { runFFmpeg } from './ffmpeg-client.js';

initLayout('video-to-gif');

const dz = document.getElementById('dz');
const opts = document.getElementById('opts');
const btn = document.getElementById('btn-run');
const pbarWrap = document.getElementById('pbar-wrap');
const pbar = document.getElementById('pbar');
const statusEl = document.getElementById('status');
let file = null;

makeDropzone(dz, (files) => {
  file = files[0];
  document.getElementById('f-name').textContent = `🎞 ${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB`;
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
    const dur = Math.max(0.5, Number(document.getElementById('dur').value) || 3);
    const width = Math.min(1080, Math.max(80, Number(document.getElementById('width').value) || 480));
    const fps = Number(document.getElementById('fps').value);
    const data = await runFFmpeg(
      [{ name: 'in.mp4', data: await file.arrayBuffer() }],
      [
        '-ss', String(start),
        '-t', String(dur),
        '-i', 'in.mp4',
        '-vf', `fps=${fps},scale=${width}:-1:flags=lanczos`,
        '-loop', '0',
        'out.gif',
      ],
      {
        onProgress: (p) => {
          pbar.style.width = `${Math.round(p * 100)}%`;
          statusEl.textContent = `${t('ff_working')} ${Math.round(p * 100)}%`;
        },
      }
    );
    const blob = new Blob([data], { type: 'image/gif' });
    document.getElementById('result').innerHTML = '';
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    img.style.cssText = 'max-width: 100%; border-radius: 10px; border: 1px solid var(--line)';
    document.getElementById('result').appendChild(img);
    downloadBlob(blob, `${(file.name || 'video').replace(/\.[^.]+$/, '')}.gif`);
    statusEl.textContent = `${t('vgif_done')} · ${(blob.size / 1024 / 1024).toFixed(1)} MB`;
    toast('✓');
  } catch (err) {
    statusEl.textContent = t('ff_failed');
  } finally {
    btn.disabled = false;
    pbarWrap.hidden = true;
  }
});
