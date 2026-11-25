import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toast } from '../ui.js';
import { t } from '../i18n.js';

let ffmpeg = null;
let loading = null;

function assetURL(rel) {
  return new URL(rel, document.baseURI).href;
}

async function getFFmpeg() {
  if (ffmpeg) return ffmpeg;
  if (loading) return loading;
  loading = (async () => {
    const instance = new FFmpeg();
    instance.on('log', ({ message }) => {
      if (window.__ffmpegDebug) console.log('[ffmpeg]', message);
    });
    await instance.load({
      classWorkerURL: assetURL('ffmpeg/worker.js'),
      coreURL: assetURL('ffmpeg/ffmpeg-core.js'),
      wasmURL: assetURL('ffmpeg/ffmpeg-core.wasm'),
    });
    ffmpeg = instance;
    return instance;
  })();
  return loading;
}

export async function runFFmpeg(files, args, { onProgress } = {}) {
  const ff = await getFFmpeg();
  ff.on('progress', ({ progress }) => {
    if (onProgress && progress > 0) onProgress(Math.min(1, progress));
  });
  for (const { name, data } of files) {
    ff.writeFile(name, new Uint8Array(data));
  }
  try {
    await ff.exec(args);
  } catch (err) {
    throw new Error(`ffmpeg: ${err.message || err}`);
  }
  const outName = args[args.length - 1];
  const data = await ff.readFile(outName);
  return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
}

export async function cleanupFFmpeg(names) {
  if (!ffmpeg) return;
  for (const n of names) {
    try {
      await ffmpeg.deleteFile(n);
    } catch (err) {
      // ignore
    }
  }
}

export async function listFFmpegFiles() {
  const ff = await getFFmpeg();
  return ff.listDir('.');
}

export async function readFFmpegFile(name) {
  const ff = await getFFmpeg();
  const data = await ff.readFile(name);
  return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
}

export async function withProgress(fn, { onProgress } = {}) {
  try {
    return await fn();
  } catch (err) {
    toast(t('ff_failed') + ' — ' + (err.message || '').slice(0, 80));
    throw err;
  }
}

export async function probeDuration(file) {
  return null;
}
