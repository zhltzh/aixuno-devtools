import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { copyText } from '../ui.js';

initLayout('color-tool');

const picker = document.getElementById('picker');
const hexInput = document.getElementById('hex');
const preview = document.getElementById('preview');
const formatsEl = document.getElementById('formats');
const shadesEl = document.getElementById('shades');

function parseColor(input) {
  const m = input.trim().match(/^#?([0-9a-f]{6})$/i) || input.trim().match(/^#?([0-9a-f]{3})$/i);
  if (!m) return null;
  let hex = m[1];
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

function toHsl({ r, g, b }) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToCss({ h, s, l }) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function withLight({ h, s, l }, newL) {
  return { h, s, l: Math.max(0, Math.min(100, newL)) };
}

function complement(hsl) {
  return { ...hsl, h: (hsl.h + 180) % 360 };
}

function render() {
  const rgb = parseColor(hexInput.value) || parseColor(picker.value);
  if (!rgb) return;
  const hex = `#${((rgb.r << 16) | (rgb.g << 8) | rgb.b).toString(16).padStart(6, '0')}`;
  preview.style.background = hex;
  picker.value = hex;

  const hsl = toHsl(rgb);
  const rows = [
    ['HEX', hex],
    ['RGB', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`],
    ['HSL', hslToCss(hsl)],
  ];
  formatsEl.innerHTML = '';
  for (const [label, value] of rows) {
    const el = document.createElement('div');
    el.className = 'result-item';
    el.innerHTML = `<span class="label">${label}</span><code>${value}</code>`;
    const cp = document.createElement('button');
    cp.className = 'copy-btn';
    cp.textContent = '⧉';
    cp.addEventListener('click', () => void copyText(value));
    el.appendChild(cp);
    formatsEl.appendChild(el);
  }

  const variants = [
    { l: 90, name: 'lightest' },
    { l: 75, name: 'lighter' },
    { l: hsl.l, name: 'base' },
    { l: 30, name: 'darker' },
    { l: 15, name: 'darkest' },
  ];
  const comp = complement(hsl);
  shadesEl.innerHTML = '';
  for (const v of variants) {
    const color = hslToCss(withLight(hsl, v.l));
    const div = document.createElement('button');
    div.className = 'copy-btn';
    div.style.cssText = `height: 64px; border-radius: 10px; border: 1px solid var(--line); background: ${color}; cursor: pointer`;
    div.title = color;
    div.addEventListener('click', () => void copyText(color));
    shadesEl.appendChild(div);
  }
  const compDiv = document.createElement('button');
  compDiv.className = 'copy-btn';
  compDiv.style.cssText = `height: 64px; border-radius: 10px; border: 1px solid var(--line); background: ${hslToCss(comp)}; cursor: pointer; grid-column: span 2`;
  compDiv.title = t('color_complement');
  compDiv.addEventListener('click', () => void copyText(hslToCss(comp)));
  shadesEl.appendChild(compDiv);
}

picker.addEventListener('input', () => {
  hexInput.value = picker.value;
  render();
});
hexInput.addEventListener('input', render);
render();
