import { t, setLang, getLang, apply, LANGUAGES } from './i18n.js';

export function initLayout(activeTool) {
  const tools = [
    { id: 'md5-modifier', href: './md5-modifier.html', icon: '🔁', nameKey: 't_md5_name', group: 'files' },
    { id: 'hash-calculator', href: './hash-calculator.html', icon: '🔐', nameKey: 't_hash_name', group: 'files' },
    { id: 'timestamp', href: './timestamp.html', icon: '🕒', nameKey: 't_ts_name', group: 'text' },
    { id: 'base64', href: './base64.html', icon: '🔤', nameKey: 't_b64_name', group: 'text' },
    { id: 'url-encode', href: './url-encode.html', icon: '🔗', nameKey: 't_url_name', group: 'text' },
    { id: 'json-format', href: './json-format.html', icon: '{ }', nameKey: 't_json_name', group: 'text' },
    { id: 'json-csv', href: './json-csv.html', icon: '📊', nameKey: 't_csv_name', group: 'text' },
    { id: 'text-diff', href: './text-diff.html', icon: '±', nameKey: 't_diff_name', group: 'text' },
    { id: 'qrcode', href: './qrcode.html', icon: '⬛', nameKey: 't_qr_name', group: 'dev' },
    { id: 'password', href: './password.html', icon: '🔑', nameKey: 't_pw_name', group: 'dev' },
  ];

  const current = tools.find((x) => x.id === activeTool);
  const bar = document.createElement('header');
  bar.className = 'topbar';
  bar.innerHTML = `
    <a class="brand" href="./index.html">Aixuno <span class="brand-sep">/</span><span class="grad">Devtools</span></a>
    <nav class="topnav">
      <a href="./index.html" data-i18n="nav_home">Home</a>
      <a href="./md5-modifier.html" data-i18n="nav_files">Files</a>
      <a href="./json-format.html" data-i18n="nav_text">Text & Data</a>
    </nav>
    <div class="topbar-right">
      <span class="privacy-badge">🔒 <span data-i18n="badge_privacy">Local processing · nothing is uploaded</span></span>
      <div class="lang-switch" role="group" aria-label="Language"></div>
    </div>`;
  document.body.prepend(bar);

  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <p class="footer-brand">Aixuno <span class="grad">Devtools</span></p>
    <p class="footer-tag" data-i18n="foot_tag">Free local utilities — files never leave your device.</p>
    <nav class="footer-nav">
      <a href="https://aixuno.com/">Markdown Converter</a>
      <a href="https://image.aixuno.com/">Image Tools</a>
      <a href="https://compress.aixuno.com/">File Compress</a>
      <a href="https://pdf.aixuno.com/">PDF Tools</a>
      <a href="https://scan.aixuno.com/">Document Scan</a>
      <a href="https://bg.aixuno.com/">AI Cutout</a>
    </nav>
    <p class="footer-note" data-i18n="footer_note">100% local processing · no accounts · no uploads</p>`;
  document.body.append(footer);

  const langSwitch = bar.querySelector('.lang-switch');
  const renderLang = () => {
    langSwitch.innerHTML = '';
    for (const lang of LANGUAGES) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lang-btn' + (getLang() === lang.id ? ' active' : '');
      btn.textContent = lang.label;
      btn.addEventListener('click', () => setLang(lang.id));
      langSwitch.appendChild(btn);
    }
  };
  renderLang();
  apply();
  const syncTitle = () => {
    document.title = current ? `${t(current.nameKey)} — Aixuno Devtools` : t('home_page_title');
  };
  window.addEventListener('langchange', () => {
    renderLang();
    apply();
    syncTitle();
  });
  syncTitle();
}
