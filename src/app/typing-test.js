import { initLayout } from '../layout.js';
import { t } from '../i18n.js';
import { compareChars, typingStats } from './typing-core.js';

initLayout('typing-test');

const PASSAGES = {
  en: 'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!',
  zh: '在线工具箱完全在浏览器本地运行，你的文件永远不会被上传到任何服务器。免费、保护隐私、打开即用，支持中文与英文双语界面。',
};

const display = document.getElementById('display');
const input = document.getElementById('tp-input');
const timerEl = document.getElementById('tp-timer');
const statsEl = document.getElementById('tp-stats');

let target = PASSAGES.en;
let lang = 'en';
let startTime = 0;
let timerId = 0;

input.placeholder = t('typing_placeholder');

function setLang(l) {
  lang = l;
  target = PASSAGES[l];
  reset();
  document.getElementById('btn-en').className = 'btn ' + (l === 'en' ? 'btn-primary' : 'btn-secondary');
  document.getElementById('btn-zh').className = 'btn ' + (l === 'zh' ? 'btn-primary' : 'btn-secondary');
}

function reset() {
  input.value = '';
  startTime = 0;
  clearInterval(timerId);
  timerEl.textContent = '0.0s';
  statsEl.hidden = true;
  render('');
  input.disabled = false;
  input.focus();
}

function render(typed) {
  display.innerHTML = '';
  const chars = [...target];
  const typedChars = [...typed];
  chars.forEach((ch, i) => {
    const span = document.createElement('span');
    if (i < typedChars.length) {
      span.className = typedChars[i] === ch ? 'tp-correct' : 'tp-wrong';
      span.textContent = ch === ' ' && typedChars[i] !== ' ' ? '␣' : ch;
    } else if (i === typedChars.length) {
      span.className = 'tp-current';
      span.textContent = ch;
    } else {
      span.textContent = ch;
    }
    display.appendChild(span);
  });
}

function finish() {
  clearInterval(timerId);
  const seconds = (Date.now() - startTime) / 1000;
  const typed = input.value;
  const { correct } = compareChars(target, typed);
  const stats = typingStats(correct, typed.length, seconds);
  document.getElementById('r-wpm').textContent = stats.wpm;
  document.getElementById('r-cpm').textContent = stats.cpm;
  document.getElementById('r-acc').textContent = `${stats.accuracy}%`;
  document.getElementById('r-time').textContent = `${seconds.toFixed(1)}s`;
  statsEl.hidden = false;
  input.disabled = true;
}

input.addEventListener('input', () => {
  const typed = input.value;
  if (!startTime && typed.length > 0) {
    startTime = Date.now();
    timerId = setInterval(() => {
      timerEl.textContent = `${((Date.now() - startTime) / 1000).toFixed(1)}s`;
    }, 100);
  }
  render(typed);
  if (typed.length >= target.length) {
    render(typed);
    finish();
  }
});

document.getElementById('btn-en').addEventListener('click', () => setLang('en'));
document.getElementById('btn-zh').addEventListener('click', () => setLang('zh'));
document.getElementById('btn-reset').addEventListener('click', reset);

setLang('en');
