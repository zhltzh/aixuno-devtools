import exifr from 'exifr';
import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { toast, downloadBlob, makeDropzone } from '../ui.js';

initLayout('exif-tool');

const dz = document.getElementById('dz');
const card = document.getElementById('exif-card');
const thumb = document.getElementById('thumb');
const listEl = document.getElementById('exif-list');
const gpsWarn = document.getElementById('gps-warn');
let currentFile = null;

makeDropzone(dz, (files) => void process(files[0]));

async function process(file) {
  currentFile = file;
  card.hidden = false;
  document.getElementById('f-name').textContent = file.name;
  document.getElementById('f-size').textContent = `${(file.size / 1024).toFixed(1)} KB`;
  const url = URL.createObjectURL(file);
  thumb.src = url;

  let data = {};
  try {
    data = await exifr.parse(file, { tiff: true, exif: true, gps: true, ifd0: true, iptc: false, xmp: false, translateValues: true });
  } catch (err) {
    data = null;
  }
  listEl.innerHTML = '';
  gpsWarn.hidden = true;

  if (!data || Object.keys(data).length === 0) {
    const el = document.createElement('div');
    el.className = 'result-item';
    el.innerHTML = `<code>${t('exif_none')}</code>`;
    listEl.appendChild(el);
    return;
  }

  const LABELS = {
    Make: { en: 'Camera make', zh: '相机品牌' },
    Model: { en: 'Camera model', zh: '相机型号' },
    LensModel: { en: 'Lens', zh: '镜头' },
    DateTimeOriginal: { en: 'Taken at', zh: '拍摄时间' },
    ISO: { en: 'ISO', zh: 'ISO' },
    FNumber: { en: 'Aperture', zh: '光圈' },
    ExposureTime: { en: 'Exposure', zh: '曝光时间' },
    FocalLength: { en: 'Focal length', zh: '焦距' },
    Orientation: { en: 'Orientation', zh: '方向' },
    Software: { en: 'Software', zh: '软件' },
    latitude: { en: 'GPS latitude', zh: 'GPS 纬度' },
    longitude: { en: 'GPS longitude', zh: 'GPS 经度' },
  };
  const lang = document.documentElement.lang === 'zh-CN' ? 'zh' : 'en';
  const keys = [...Object.keys(LABELS).filter((k) => data[k] != null), ...Object.keys(data).filter((k) => !(k in LABELS) && typeof data[k] !== 'object')];

  for (const key of keys.slice(0, 40)) {
    let value = data[key];
    if (key === 'DateTimeOriginal' || key === 'CreateDate' || key === 'ModifyDate') {
      const d = new Date(value);
      if (!isNaN(d)) value = d.toLocaleString();
    }
    if (key === 'ExposureTime' && typeof value === 'number') value = `1/${Math.round(1 / value)}s`;
    if (key === 'FNumber' && typeof value === 'number') value = `f/${value}`;
    const label = LABELS[key] ? LABELS[key][lang] : key;
    const el = document.createElement('div');
    el.className = 'result-item';
    const isGps = key === 'latitude' || key === 'longitude';
    el.innerHTML = `<span class="label">${label}</span><code>${String(value).slice(0, 60)}</code>`;
    if (isGps) {
      el.style.background = '#fff4f4';
      gpsWarn.hidden = false;
    }
    listEl.appendChild(el);
  }
}

document.getElementById('btn-clean').addEventListener('click', async () => {
  if (!currentFile) return;
  try {
    const bitmap = await createImageBitmap(currentFile);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext('2d').drawImage(bitmap, 0, 0);
    canvas.toBlob((blob) => {
      const name = currentFile.name.replace(/(\.[^.]+)?$/, (ext) => `-clean${ext || '.jpg'}`);
      downloadBlob(blob, name);
      toast(t('exif_cleaned'));
    }, 'image/jpeg', 0.95);
  } catch (err) {
    toast('Failed: ' + err.message);
  }
});
