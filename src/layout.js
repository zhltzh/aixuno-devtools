import { t, setLang, getLang, apply, LANGUAGES } from './i18n.js';
import { TOOLS_LIST } from './tools-list.js';

const SITE_NETWORK = [
  { key: 'net_md', href: 'https://aixuno.com/' },
  { key: 'net_img', href: 'https://image.aixuno.com/' },
  { key: 'net_zip', href: 'https://compress.aixuno.com/' },
  { key: 'net_pdf', href: 'https://pdf.aixuno.com/' },
  { key: 'net_scan', href: 'https://scan.aixuno.com/' },
  { key: 'net_bg', href: 'https://bg.aixuno.com/' },
  { key: 'net_idphoto', href: 'https://idphoto.aixuno.com/' },
  { key: 'net_restore', href: 'https://tools.aixuno.com/' },
  { key: 'net_devtools', href: null },
];

const NAV_GROUPS = [
  { key: 'nav_home', href: './index.html' },
  { key: 'nav_files', href: './index.html#sec-files' },
  { key: 'nav_images', href: './index.html#sec-images' },
  { key: 'nav_videos', href: './index.html#sec-videos' },
  { key: 'nav_audios', href: './index.html#sec-audios' },
  { key: 'nav_text', href: './index.html#sec-text' },
  { key: 'nav_daily', href: './index.html#sec-daily' },
  { key: 'nav_dev', href: './index.html#sec-dev' },
];

export function initLayout(activeTool) {
  const current = TOOLS_LIST.find((x) => x.id === activeTool);

  const network = document.createElement('div');
  network.className = 'site-network';
  network.innerHTML = SITE_NETWORK.map(
    (site) =>
      `<a href="${site.href || '#'}"${site.href ? '' : ' class="current" aria-current="page"'}>${t(site.key)}</a>`
  ).join('');

  const bar = document.createElement('header');
  bar.className = 'topbar';
  bar.innerHTML = `
    <a class="brand" href="./index.html">Aixuno <span class="brand-sep">/</span><span class="grad">Devtools</span></a>
    <nav class="topnav">
      ${NAV_GROUPS.map((g) => `<a href="${g.href}" data-i18n="${g.key}">${t(g.key)}</a>`).join('')}
    </nav>
    <div class="topbar-right">
      <span class="privacy-badge">🔒 <span data-i18n="badge_privacy">Local processing · nothing is uploaded</span></span>
      <div class="lang-switch" role="group" aria-label="Language"></div>
    </div>`;

  const headerWrap = document.createElement('div');
  headerWrap.className = 'site-head';
  headerWrap.append(network, bar);
  document.body.prepend(headerWrap);

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
      <a href="https://idphoto.aixuno.com/">ID Photo</a>
      <a href="https://tools.aixuno.com/">AI Tools</a>
    </nav>
    <p class="footer-note" data-i18n="footer_note">100% local processing · no accounts · no uploads</p>`;
  document.body.append(footer);

  const langSwitch = bar.querySelector('.lang-switch');
  const renderNetwork = () => {
    network.innerHTML = SITE_NETWORK.map(
      (site) =>
        `<a href="${site.href || '#'}"${site.href ? '' : ' class="current" aria-current="page"'}>${t(site.key)}</a>`
    ).join('');
  };
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
    renderNetwork();
  };
  window.addEventListener('langchange', () => {
    renderLang();
    apply();
    syncTitle();
  });
  syncTitle();
}
