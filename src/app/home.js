import { initLayout } from '../layout.js';
import { TOOLS_LIST } from '../tools-list.js';
import { t } from '../i18n.js';

initLayout(null);

function renderGrids() {
  const groups = { files: 'grid-files', images: 'grid-images', videos: 'grid-videos', text: 'grid-text', daily: 'grid-daily', dev: 'grid-dev' };
  for (const [group, elId] of Object.entries(groups)) {
    const el = document.getElementById(elId);
    if (!el) continue;
    el.innerHTML = '';
    for (const tool of TOOLS_LIST.filter((x) => x.group === group)) {
      const a = document.createElement('a');
      a.className = 'tool-tile';
      a.href = tool.href;
      a.innerHTML = `
        <span class="t-icon" aria-hidden="true">${tool.icon}</span>
        <span>
          <h3>${t(tool.nameKey)}</h3>
          <p>${t(tool.descKey)}</p>
        </span>`;
      el.appendChild(a);
    }
  }
}

renderGrids();
window.addEventListener('langchange', renderGrids);
