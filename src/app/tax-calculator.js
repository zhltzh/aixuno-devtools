import { initLayout } from '../layout.js';
import { t } from '../i18n.js';

initLayout('tax-calculator');

const BRACKETS = [
  [36000, 0.03, 0],
  [144000, 0.1, 2520],
  [300000, 0.2, 16920],
  [420000, 0.25, 31920],
  [660000, 0.3, 52920],
  [960000, 0.35, 85920],
  [Infinity, 0.45, 181920],
];

function fmt(v) {
  return `¥ ${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function row(label, value, highlight) {
  const el = document.createElement('div');
  el.className = 'result-item';
  el.innerHTML = `<span class="label">${label}</span><code>${value}</code>`;
  if (highlight) el.style.background = '#eef3ff';
  document.getElementById('tax-out').appendChild(el);
}

document.getElementById('btn-tax').addEventListener('click', () => {
  const gross = Number(document.getElementById('gross').value);
  const social = Number(document.getElementById('social').value);
  const special = Number(document.getElementById('special').value);
  const outCard = document.getElementById('tax-out-card');
  document.getElementById('tax-out').innerHTML = '';
  outCard.hidden = false;

  const monthlyTaxable = gross - social - 5000 - special;
  if (monthlyTaxable <= 0) {
    row(t('tax_annual_taxable'), fmt(0));
    row(t('tax_monthly_tax'), fmt(0));
    row(t('tax_after_tax'), fmt(gross - social), true);
    return;
  }
  const annualTaxable = monthlyTaxable * 12;
  let tax = 0;
  let rate = 0;
  for (const [limit, r, quick] of BRACKETS) {
    if (annualTaxable <= limit) {
      tax = annualTaxable * r - quick;
      rate = r;
      break;
    }
  }
  const monthlyTax = tax / 12;
  row(t('tax_annual_taxable'), `${fmt(annualTaxable)} · ${Math.round(rate * 100)}%`);
  row(t('tax_monthly_taxable'), fmt(monthlyTaxable));
  row(t('tax_monthly_tax'), fmt(monthlyTax));
  row(t('tax_after_tax'), fmt(gross - social - monthlyTax), true);
});
