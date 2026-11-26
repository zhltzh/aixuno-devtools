import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { toast, downloadBlob, makeDropzone } from '../ui.js';
import { runFFmpeg } from './ffmpeg-client.js';

initLayout('audio-convert');

const dz = document.getElementById('dz');
const opts = document.getElementById('opts');
const btn = document.getElementById('btn-run');
const pbarWrap = document.getElementById('pbar-wrap');
const pbar = document.getElementById('pbar');
const statusEl = document.getElementById('status');
const targetEl = document.getElementById('target');
const bitrateBox = document.getElementById('bitrate-box');
let file = null;

makeDropzone(dz, (files) => {
  file = files[0];
  document.getElementById('f-name').textContent = `🎧 ${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB`;
  opts.hidden = false;
  dz.hidden = true;
});

targetEl.addEventListener('change', () => {
  bitrateBox.style.display = targetEl.value === 'wav' || targetEl.value === 'flac' ? 'none' : '';
});

btn.addEventListener('click', async () => {
  if (!file) return;
  btn.disabled = true;
  pbarWrap.hidden = false;
  statusEl.textContent = t('ff_loading');
  try {
    const target = targetEl.value;
    const srcExt = (file.name.split('.').pop() || 'mp3').toLowerCase();
    let args;
    if (target === 'mp3') {
      args = ['-i', 'in.mp4', '-vn', '-c:a', 'libmp3lame', '-b:a', `${document.getElementById('bitrate').value}k`, 'out.mp3'];
    } else if (target === 'wav') {
      args = ['-i', 'in.mp4', '-vn', '-c:a', 'pcm_s16le', 'out.wav'];
    } else if (target === 'ogg') {
      args = ['-i', 'in.mp4', '-vn', '-c:a', 'libvorbis', '-b:a', `${document.getElementById('bitrate').value}k`, 'out.ogg'];
    } else if (target === 'aac') {
      args = ['-i', 'in.mp4', '-vn', '-c:a', 'aac', '-b:a', `${document.getElementById('bitrate').value}k`, 'out.aac'];
    } else {
      args = ['-i', 'in.mp4', '-vn', '-c:a', 'flac', 'out.flac'];
    }
    void srcExt;
    const data = await runFFmpeg([{ name: 'in.mp4', data: await file.arrayBuffer() }], args, {
      onProgress: (p) => {
        pbar.style.width = `${Math.round(p * 100)}%`;
        statusEl.textContent = `${t('ff_working')} ${Math.round(p * 100)}%`;
      },
    });
    const mime = { mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg', aac: 'audio/aac', flac: 'audio/flac' }[target];
    const blob = new Blob([data], { type: mime });
    downloadBlob(blob, `${(file.name || 'audio').replace(/\.[^.]+$/, '')}.${target}`);
    statusEl.textContent = `${t('aconv_done')} · ${(blob.size / 1024 / 1024).toFixed(1)} MB`;
    toast('✓');
  } catch (err) {
    statusEl.textContent = t('ff_failed');
  } finally {
    btn.disabled = false;
    pbarWrap.hidden = true;
  }
});
