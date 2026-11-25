import { initLayout } from '../layout.js';
import { t } from '../i18n.js';

initLayout('mortgage-calculator');

function fmt(v) {
  return `¥ ${Math.round(v).toLocaleString()}`;
}

function row(label, value, highlight) {
  const el = document.createElement('div');
  el.className = 'result-item';
  el.innerHTML = `<span class="label">${label}</span><code>${value}</code>`;
  if (highlight) el.style.background = '#eef3ff';
  document.getElementById('mort-out').appendChild(el);
}

document.getElementById('btn-mort').addEventListener('click', () => {
  const P = Number(document.getElementById('amount').value);
  const annualRate = Number(document.getElementById('rate').value) / 100;
  const n = Number(document.getElementById('years').value) * 12;
  const mode = document.getElementById('mode').value;
  document.getElementById('mort-out').innerHTML = '';
  document.getElementById('sched-body').innerHTML = '';
  document.getElementById('mort-out-card').hidden = false;
  document.getElementById('sched-card').hidden = false;

  const r = annualRate / 12;
  const rows = [];

  if (mode === 'annuity') {
    const pay = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    let balance = P;
    let totalInterest = 0;
    for (let m = 0; m < n && m < 12; m++) {
      const interest = balance * r;
      const principal = pay - interest;
      balance -= principal;
      totalInterest += interest;
      rows.push([m + 1, pay, interest, principal, Math.max(0, balance)]);
    }
    const totalPay = pay * n;
    row(t('mort_monthly_pay'), `${fmt(pay)} × ${n}`, true);
    row(t('mort_total_interest'), fmt(totalPay - P));
    row(t('mort_total_pay'), fmt(totalPay));
  } else {
    const principalFixed = P / n;
    let balance = P;
    const rowsAll = [];
    let first = null;
    let last = null;
    for (let m = 0; m < n; m++) {
      const interest = balance * r;
      const pay = principalFixed + interest;
      balance -= principalFixed;
      const item = [m + 1, pay, interest, principalFixed, Math.max(0, balance)];
      if (m < 12) rows.push(item);
      if (m === 0) first = pay;
      if (m === n - 1) last = pay;
      rowsAll.push(item);
      void rowsAll;
    }
    const totalInterest = (principalFixed + (P * r)) * 0 + (function () {
      let s = 0;
      let b = P;
      for (let m = 0; m < n; m++) {
        s += b * r;
        b -= principalFixed;
      }
      return s;
    })();
    row(t('mort_first_pay'), fmt(first), true);
    row(t('mort_last_pay'), fmt(last));
    row(t('mort_decrease'), `${t('mort_each_month')} −${fmt((first - last) / Math.max(1, n - 1))}`);
    row(t('mort_total_interest'), fmt(totalInterest));
    row(t('mort_total_pay'), fmt(P + totalInterest));
  }

  const tbody = document.getElementById('sched-body');
  for (const [m, pay, interest, principal, balance] of rows) {
    const tr = document.createElement('tr');
    tr.className = 'border-t';
    tr.innerHTML = `<td>${m}</td><td>${fmt(pay)}</td><td>${fmt(interest)}</td><td>${fmt(principal)}</td><td>${fmt(balance)}</td>`;
    tbody.appendChild(tr);
  }
});
