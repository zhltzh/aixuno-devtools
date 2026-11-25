import { initLayout } from '../layout.js';
import { t } from '../i18n.js';

initLayout('word-counter');

const io = document.getElementById('io');
const out = document.getElementById('stats');

function render() {
  const s = io.value;
  const stats = [
    [t('word_chars_all'), s.length],
    [t('word_chars_no_space'), s.replace(/\s/g, '').length],
    [t('word_cjk'), (s.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length],
    [t('word_words_en'), (s.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length],
    [t('word_lines'), s ? s.split('\n').length : 0],
    [t('word_paragraphs'), s.split(/\n\s*\n/).filter((x) => x.trim()).length],
    [t('word_sentences'), (s.match(/[^。！？.!?…]+[。！？.!?…]*/g) || []).filter((x) => x.trim()).length],
    [t('word_punct'), (s.match(/[，。！？；：、""''（）,.!?;:'"()\[\]{}…—-]/g) || []).length],
    ['UTF-8 bytes', new TextEncoder().encode(s).length],
  ];
  out.innerHTML = '';
  for (const [label, value] of stats) {
    const el = document.createElement('div');
    el.className = 'result-item';
    el.innerHTML = `<span class="label">${label}</span><code>${value}</code>`;
    out.appendChild(el);
  }
}

io.addEventListener('input', render);
render();
