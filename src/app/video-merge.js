import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { toast, downloadBlob, makeDropzone } from '../ui.js';
import { runFFmpeg } from './ffmpeg-client.js';

initLayout('video-merge');

const dz = document.getElementById('dz');
const opts = document.getElementById('opts');
const queueEl = document.getElementById('queue');
const btn = document.getElementById('btn-run');
const pbarWrap = document.getElementById('pbar-wrap');
const pbar = document.getElementById('pbar');
const statusEl = document.getElementById('status');
const clips = [];

makeDropzone(dz, (files) => void add(files));

async function add(files) {
  for (const f of files.filter((x) => x.type.startsWith('video/'))) {
    clips.push(f);
  }
  render();
}

function render() {
  opts.hidden = clips.length === 0;
  queueEl.innerHTML = '';
  clips.forEach((f, i) => {
    const el = document.createElement('div');
    el.className = 'result-item';
    el.innerHTML = `<span class="label">#${i + 1}</span><code>${f.name} · ${(f.size / 1024 / 1024).toFixed(1)} MB</code>`;
    const mv = document.createElement('button');
    mv.className = 'copy-btn';
    mv.textContent = '↑';
    mv.disabled = i === 0;
    mv.addEventListener('click', () => {
      [clips[i - 1], clips[i]] = [clips[i], clips[i - 1]];
      render();
    });
    const rm = document.createElement('button');
    rm.className = 'copy-btn';
    rm.textContent = '✕';
    rm.addEventListener('click', () => {
      clips.splice(i, 1);
      render();
    });
    el.append(mv, rm);
    queueEl.appendChild(el);
  });
}

btn.addEventListener('click', async () => {
  if (clips.length < 2) {
    toast(t('vmerge_need_two'));
    return;
  }
  btn.disabled = true;
  pbarWrap.hidden = false;
  statusEl.textContent = t('ff_loading');
  try {
    const ext = (clips[0].name.split('.').pop() || 'mp4').toLowerCase();
    const inputs = [];
    const textLines = [];
    for (let i = 0; i < clips.length; i++) {
      inputs.push({ name: `in${i}.${ext}`, data: await clips[i].arrayBuffer() });
      textLines.push(`file 'in${i}.${ext}'`);
    }
    const listBlob = new TextEncoder().encode(textLines.join('\n'));
    inputs.push({ name: 'list.txt', data: listBlob.buffer });

    const data = await runFFmpeg(inputs, ['-f', 'concat', '-safe', '0', '-i', 'list.txt', '-c', 'copy', `out.${ext}`], {
      onProgress: (p) => {
        pbar.style.width = `${Math.round(p * 100)}%`;
        statusEl.textContent = `${t('ff_working')} ${Math.round(p * 100)}%`;
      },
    });
    const blob = new Blob([data], { type: `video/${ext}` });
    downloadBlob(blob, `merged.${ext}`);
    statusEl.textContent = `${t('vmerge_done')} · ${(blob.size / 1024 / 1024).toFixed(1)} MB`;
    toast('✓');
  } catch (err) {
    statusEl.textContent = t('vmerge_failed_concat');
  } finally {
    btn.disabled = false;
    pbarWrap.hidden = true;
  }
});
