import { initLayout } from '../layout.js';
import { t } from '../i18n.js';

initLayout('text-diff');

const out = document.getElementById('out');
const summary = document.getElementById('diff-summary');

function diffLines(a, b) {
  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const ops = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ops.push({ type: 'same', line: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: 'del', line: a[i] });
      i++;
    } else {
      ops.push({ type: 'add', line: b[j] });
      j++;
    }
  }
  while (i < n) ops.push({ type: 'del', line: a[i++] });
  while (j < m) ops.push({ type: 'add', line: b[j++] });
  return ops;
}

document.getElementById('btn-diff').addEventListener('click', () => {
  const left = document.getElementById('left').value.split('\n');
  const right = document.getElementById('right').value.split('\n');
  const ops = diffLines(left, right);
  out.innerHTML = '';
  const frag = document.createDocumentFragment();
  let added = 0;
  let removed = 0;
  for (const op of ops) {
    const span = document.createElement('span');
    const text = op.line === '' ? ' ' : op.line;
    if (op.type === 'same') {
      span.className = 'd-same';
      span.textContent = `  ${text}`;
    } else if (op.type === 'add') {
      span.className = 'd-add';
      span.textContent = `+ ${text}`;
      added++;
    } else {
      span.className = 'd-del';
      span.textContent = `- ${text}`;
      removed++;
    }
    frag.appendChild(span);
  }
  out.appendChild(frag);
  summary.textContent = t('diff_summary', { a: added, r: removed });
});

document.getElementById('btn-clear').addEventListener('click', () => {
  document.getElementById('left').value = '';
  document.getElementById('right').value = '';
  out.innerHTML = '';
  summary.textContent = '';
});
