import { initLayout } from '../layout.js';
import { t } from '../i18n.js';

initLayout('unit-converter');

const CATEGORIES = {
  length: {
    label: { en: 'Length', zh: '长度' },
    units: {
      mm: 0.001, cm: 0.01, m: 1, km: 1000,
      in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344,
    },
    labels: { en: { mm: 'mm', cm: 'cm', m: 'm', km: 'km', in: 'inch', ft: 'feet', yd: 'yard', mi: 'mile' }, zh: { mm: '毫米', cm: '厘米', m: '米', km: '千米', in: '英寸', ft: '英尺', yd: '码', mi: '英里' } },
  },
  weight: {
    label: { en: 'Weight', zh: '重量' },
    units: { g: 0.001, kg: 1, t: 1000, lb: 0.45359237, oz: 0.028349523 },
    labels: { en: { g: 'g', kg: 'kg', t: 'tonne', lb: 'pound', oz: 'ounce' }, zh: { g: '克', kg: '千克', t: '吨', lb: '磅', oz: '盎司' } },
  },
  temperature: {
    label: { en: 'Temperature', zh: '温度' },
    units: { c: 1, f: 1, k: 1 },
    labels: { en: { c: '°C', f: '°F', k: 'K' }, zh: { c: '摄氏度', f: '华氏度', k: '开尔文' } },
  },
  area: {
    label: { en: 'Area', zh: '面积' },
    units: { m2: 1, ha: 10000, mu: 666.6667, ft2: 0.09290304, acre: 4046.856 },
    labels: { en: { m2: 'm²', ha: 'hectare', mu: 'mu (亩)', ft2: 'ft²', acre: 'acre' }, zh: { m2: '平方米', ha: '公顷', mu: '亩', ft2: '平方英尺', acre: '英亩' } },
  },
  data: {
    label: { en: 'Data size', zh: '数据存储' },
    units: { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 },
    labels: { en: { B: 'B', KB: 'KB', MB: 'MB', GB: 'GB', TB: 'TB' }, zh: { B: '字节', KB: 'KB', MB: 'MB', GB: 'GB', TB: 'TB' } },
  },
  speed: {
    label: { en: 'Speed', zh: '速度' },
    units: { ms: 1, kmh: 0.2777778, mph: 0.44704, kn: 0.5144444 },
    labels: { en: { ms: 'm/s', kmh: 'km/h', mph: 'mph', kn: 'knot' }, zh: { ms: '米/秒', kmh: '千米/时', mph: '英里/时', kn: '节' } },
  },
};

const lang = () => (document.documentElement.lang === 'zh-CN' ? 'zh' : 'en');
const catEl = document.getElementById('cat');
const fromEl = document.getElementById('from');
const toEl = document.getElementById('to');
const inVal = document.getElementById('in-val');
const outVal = document.getElementById('out-val');

function renderCats() {
  catEl.innerHTML = '';
  for (const [id, cat] of Object.entries(CATEGORIES)) {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = cat.label[lang()];
    catEl.appendChild(opt);
  }
}

function renderUnits() {
  const cat = CATEGORIES[catEl.value];
  const units = Object.keys(cat.units);
  fromEl.innerHTML = '';
  toEl.innerHTML = '';
  for (const u of units) {
    for (const sel of [fromEl, toEl]) {
      const opt = document.createElement('option');
      opt.value = u;
      opt.textContent = cat.labels[lang()][u];
      sel.appendChild(opt);
    }
  }
  fromEl.value = units[0];
  toEl.value = units[1] || units[0];
}

function convert() {
  const cat = CATEGORIES[catEl.value];
  const v = Number(inVal.value);
  if (isNaN(v)) {
    outVal.value = '';
    return;
  }
  const from = fromEl.value;
  const to = toEl.value;
  let result;
  if (catEl.value === 'temperature') {
    const celsius = from === 'c' ? v : from === 'f' ? ((v - 32) * 5) / 9 : v - 273.15;
    result = to === 'c' ? celsius : to === 'f' ? (celsius * 9) / 5 + 32 : celsius + 273.15;
  } else {
    result = (v * cat.units[from]) / cat.units[to];
  }
  outVal.value = Number(result.toPrecision(10)).toString();
}

catEl.addEventListener('change', () => {
  renderUnits();
  convert();
});
fromEl.addEventListener('change', convert);
toEl.addEventListener('change', convert);
inVal.addEventListener('input', convert);
document.getElementById('btn-swap').addEventListener('click', () => {
  [fromEl.value, toEl.value] = [toEl.value, fromEl.value];
  convert();
});

renderCats();
renderUnits();
convert();
