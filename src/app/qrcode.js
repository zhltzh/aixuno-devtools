import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { toast, copyText, makeDropzone } from '../ui.js';

initLayout('qrcode');

const qrText = document.getElementById('qr-text');
const qrOut = document.getElementById('qr-out');

async function generate() {
  qrOut.innerHTML = '';
  if (!qrText.value.trim()) return;
  const size = Number(document.getElementById('qr-size').value);
  const margin = Number(document.getElementById('qr-margin').value);
  const dataUrl = await QRCode.toDataURL(qrText.value, {
    width: size,
    margin,
    errorCorrectionLevel: 'M',
    color: { dark: '#101522ff', light: '#ffffffff' },
  });
  const img = new Image();
  img.alt = 'QR';
  img.src = dataUrl;
  img.style.cssText = 'max-width: 100%; border: 1px solid var(--line); border-radius: 10px';
  qrOut.appendChild(img);
  const dl = document.createElement('button');
  dl.className = 'btn btn-secondary';
  dl.style.marginTop = '12px';
  dl.textContent = '⤓ PNG';
  dl.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'qrcode.png';
    a.click();
  });
  qrOut.appendChild(dl);
}

document.getElementById('btn-gen').addEventListener('click', () => void generate());
qrText.addEventListener('input', () => void generate());
void generate();

const dz = document.getElementById('dz');
const decodedEl = document.getElementById('qr-decoded');

makeDropzone(dz, async (files) => {
  const file = files[0];
  if (!file.type.startsWith('image/')) {
    toast('Not an image');
    return;
  }
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext('2d').drawImage(bitmap, 0, 0);
  const imgData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imgData.data, imgData.width, imgData.height);
  decodedEl.innerHTML = '';
  if (code && code.data) {
    const span = document.createElement('span');
    span.textContent = `${t('qr_decoded')}: ${code.data}`;
    decodedEl.appendChild(span);
    const cp = document.createElement('button');
    cp.className = 'copy-btn';
    cp.style.marginLeft = '8px';
    cp.textContent = '⧉';
    cp.addEventListener('click', () => void copyText(code.data));
    decodedEl.appendChild(cp);
  } else {
    decodedEl.className = 'err-text';
    decodedEl.textContent = `✗ ${t('qr_fail')}`;
  }
});
