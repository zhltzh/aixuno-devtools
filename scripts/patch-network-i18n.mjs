import { readFileSync, writeFileSync } from 'node:fs';

const additions = {
  en: {
    nav_home: 'Home',
    nav_files: 'Files',
    nav_images: 'Images',
    nav_videos: 'Video',
    nav_audios: 'Audio',
    nav_text: 'Text & Data',
    nav_daily: 'Calculators',
    nav_dev: 'More',
    net_md: 'Markdown Converter',
    net_img: 'Image Tools',
    net_zip: 'File Compress',
    net_pdf: 'PDF Tools',
    net_scan: 'Document Scan',
    net_bg: 'AI Cutout',
    net_idphoto: 'ID Photo',
    net_restore: 'AI Tools',
    net_devtools: 'Devtools',
  },
  zh: {
    nav_home: '首页',
    nav_files: '文件',
    nav_images: '图片',
    nav_videos: '视频',
    nav_audios: '音频',
    nav_text: '文本数据',
    nav_daily: '计算器',
    nav_dev: '更多',
    net_md: 'Markdown 转换',
    net_img: '图片批量处理',
    net_zip: '文件压缩',
    net_pdf: 'PDF 工具',
    net_scan: '文档扫描',
    net_bg: 'AI 抠图',
    net_idphoto: '证件照制作',
    net_restore: 'AI 工具箱',
    net_devtools: '效率工具箱',
  },
};

let s = readFileSync('src/i18n.js', 'utf8');
for (const locale of ['zh', 'en']) {
  const anchor = locale === 'en' ? "    foot_tag: 'Free local utilities" : "    foot_tag: '免费本地效率工具";
  const idx = s.indexOf(anchor);
  if (idx < 0) throw new Error('anchor not found for ' + locale);
  const block = Object.entries(additions[locale])
    .map(([k, v]) => `    ${k}: ${JSON.stringify(v)},`)
    .join('\n');
  s = s.slice(0, idx) + block + '\n\n' + s.slice(idx);
}
writeFileSync('src/i18n.js', s);
console.log('network + nav keys injected');
