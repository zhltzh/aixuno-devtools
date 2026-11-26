import { readFileSync, writeFileSync } from 'node:fs';

const additions = {
  en: {
    t_typing_name: 'Typing Test', t_typing_desc: 'Measure WPM, CPM and accuracy live.',
    typing_h1: 'Typing Test', typing_h1_g: 'wpm · cpm · accuracy', typing_lead: 'Pick a passage, start typing, and see your speed and accuracy in real time.',
    typing_reset: 'Reset', typing_placeholder: 'Start typing here — the timer starts with your first keystroke…',
    typing_wpm: 'WPM', typing_cpm: 'CPM', typing_acc: 'Accuracy', typing_time: 'Time',

    t_meme_name: 'Meme Maker', t_meme_desc: 'Classic top/bottom text on any image.',
    meme_h1: 'Meme Maker', meme_h1_g: 'classic top & bottom text', meme_lead: 'Drop an image, add top and bottom text, download the meme — all locally.',
    meme_drop: 'Drop an image here', meme_drop_hint: 'JPG · PNG · WebP · GIF (first frame)',
    meme_top: 'Top text', meme_bottom: 'Bottom text', meme_size: 'Text size',
    meme_go: 'Generate & download', meme_done: 'Meme downloaded',

    t_beauty_name: 'Screenshot Beautifier', t_beauty_desc: 'Gradient card with rounded corners and shadow.',
    beauty_h1: 'Screenshot Beautifier', beauty_h1_g: 'gradient · rounded · shadow', beauty_lead: 'Wrap a screenshot in a gradient card with rounded corners and a soft shadow — ready to share.',
    beauty_drop: 'Drop a screenshot here', beauty_drop_hint: 'JPG · PNG · WebP',
    beauty_style: 'Gradient', beauty_padding: 'Padding',
    beauty_go: 'Beautify & download', beauty_done: 'Beautified image downloaded',
  },
  zh: {
    t_typing_name: '打字测速', t_typing_desc: '实时统计 WPM/CPM 与准确率。',
    typing_h1: '打字测速', typing_h1_g: '速度 · 准确率', typing_lead: '选一段文字开始打字，实时查看速度与准确率。',
    typing_reset: '重新开始', typing_placeholder: '在这里开始输入——敲下第一个字符时自动开始计时…',
    typing_wpm: 'WPM', typing_cpm: 'CPM', typing_acc: '准确率', typing_time: '用时',

    t_meme_name: '表情包制作', t_meme_desc: '经典上下文字表情包。',
    meme_h1: '表情包制作', meme_h1_g: '经典上下文字', meme_lead: '拖入图片、加上上下两行文字，下载你的表情包——全程本地。',
    meme_drop: '拖拽图片到此处', meme_drop_hint: 'JPG · PNG · WebP · GIF（取首帧）',
    meme_top: '顶部文字', meme_bottom: '底部文字', meme_size: '文字大小',
    meme_go: '生成并下载', meme_done: '表情包已下载',

    t_beauty_name: '截图美化', t_beauty_desc: '渐变背景圆角卡片，一键出图。',
    beauty_h1: '截图美化', beauty_h1_g: '渐变 · 圆角 · 投影', beauty_lead: '把截图包进渐变背景的圆角卡片里，加上柔和投影——直接可分享。',
    beauty_drop: '拖拽截图到此处', beauty_drop_hint: 'JPG · PNG · WebP',
    beauty_style: '渐变风格', beauty_padding: '边距',
    beauty_go: '美化并下载', beauty_done: '美化图已下载',
  },
};

for (const locale of ['zh', 'en']) {
  const path = 'src/i18n.js';
  let s = readFileSync(path, 'utf8');
  const anchor = locale === 'en' ? "    foot_tag: 'Free local utilities" : "    foot_tag: '免费本地效率工具";
  const idx = s.indexOf(anchor);
  if (idx < 0) throw new Error('anchor not found for ' + locale);
  const block = Object.entries(additions[locale])
    .map(([k, v]) => `    ${k}: ${JSON.stringify(v)},`)
    .join('\n');
  s = s.slice(0, idx) + block + '\n\n' + s.slice(idx);
  writeFileSync(path, s);
  console.log(locale, 'injected', Object.keys(additions[locale]).length, 'keys');
}
