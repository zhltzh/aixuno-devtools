import { readFileSync, writeFileSync } from 'node:fs';

const additions = {
  en: {
    t_exif_name: 'EXIF Tool', t_exif_desc: 'View and strip photo metadata (GPS, camera, dates).',
    exif_h1: 'EXIF Viewer & Remover', exif_h1_g: 'strip your privacy', exif_lead: 'Photos carry GPS location, device and timestamps. View all metadata and download a clean copy with everything removed — locally.',
    exif_drop: 'Drop a photo here', exif_drop_hint: 'JPG · HEIC · TIFF · PNG · WebP',
    exif_download_clean: 'Download clean copy', exif_none: 'No EXIF metadata found in this image.',
    exif_gps_warn: 'This photo contains GPS coordinates — removed in the clean copy.',
    exif_cleaned: 'Clean copy downloaded — metadata stripped.',

    t_stitch_name: 'Image Stitcher', t_stitch_desc: 'Combine screenshots into one long image.',
    stitch_h1: 'Image Stitcher', stitch_h1_g: 'chat logs, made one', stitch_lead: 'Combine screenshots into a long image — order, spacing and alignment under your control.',
    stitch_drop: 'Drop images here', stitch_drop_hint: 'multiple selection · drag order = stitch order',
    stitch_dir: 'Direction', stitch_v: 'Vertical', stitch_h: 'Horizontal', stitch_gap: 'Gap (px)', stitch_bg: 'Background',
    stitch_go: 'Stitch & download', stitch_need_two: 'Add at least 2 images.', stitch_too_large: 'Result too large — use fewer or smaller images.', stitch_done: 'Stitched image downloaded.',

    t_wm_name: 'Image Watermark', t_wm_desc: 'Batch text watermark with position and opacity.',
    wm_h1: 'Watermark Images', wm_h1_g: 'text · batch · local', wm_lead: 'Stamp a text watermark on your photos — batch supported, everything stays on your device.',
    wm_text: 'Watermark text', wm_pos: 'Position', wm_br: 'Bottom right', wm_bl: 'Bottom left', wm_tr: 'Top right', wm_tl: 'Top left', wm_tile: 'Tile',
    wm_opacity: 'Opacity', wm_color: 'Color', wm_size: 'Size %',
    wm_drop: 'Drop images here', wm_drop_hint: 'multiple selection supported',
    wm_run: 'Add watermark & download', wm_done: '{n} image(s) watermarked and downloaded.',

    t_imd5_name: 'Image MD5', t_imd5_desc: 'Batch change image MD5, pixels untouched.',
    imd5_h1: 'Image MD5 Modifier', imd5_h1_g: 'batch, pixel-identical', imd5_lead: 'Change image MD5 fingerprints without touching pixels — batch, instant, local. Zips automatically.',
    imd5_drop: 'Drop images here', imd5_drop_hint: 'JPG · PNG · WebP · GIF · multiple selection',
    imd5_run: 'Modify & download',

    t_grid_name: 'Grid Cutter', t_grid_desc: 'Nine-grid (3×3) or any rows × columns.',
    grid_h1: 'Grid Cutter', grid_h1_g: '九宫格 · any grid', grid_lead: 'Cut one image into a grid — 3×3 for social feeds or any custom rows × columns, downloaded as a ZIP.',
    grid_drop: 'Drop an image here', grid_drop_hint: 'one image · square works best',
    grid_rows: 'Rows', grid_cols: 'Columns', grid_square: 'Center-crop to square',
    grid_go: 'Cut & download ZIP', grid_done: '{n} tiles downloaded.',
  },
  zh: {
    t_exif_name: 'EXIF 工具', t_exif_desc: '查看并清除照片元数据（GPS/相机/时间）。',
    exif_h1: 'EXIF 查看与清除', exif_h1_g: '把隐私收回来', exif_lead: '照片可能携带 GPS 位置、设备型号与拍摄时间。这里可以查看全部元数据，并下载一份完全清除的干净副本——全程本地。',
    exif_drop: '拖拽照片到此处', exif_drop_hint: 'JPG · HEIC · TIFF · PNG · WebP',
    exif_download_clean: '下载干净副本', exif_none: '这张图片中没有 EXIF 元数据。',
    exif_gps_warn: '⚠ 此照片包含 GPS 坐标——干净副本中已清除。',
    exif_cleaned: '干净副本已下载，元数据已清除。',

    t_stitch_name: '长图拼接', t_stitch_desc: '多张截图拼成一张长图。',
    stitch_h1: '长图拼接', stitch_h1_g: '聊天记录一键合体', stitch_lead: '多张截图合成一张长图——顺序、间距与背景色完全由你控制。',
    stitch_drop: '拖拽图片到此处', stitch_drop_hint: '支持多选 · 排列顺序即拼接顺序',
    stitch_dir: '方向', stitch_v: '竖向', stitch_h: '横向', stitch_gap: '间距 (px)', stitch_bg: '背景色',
    stitch_go: '拼接并下载', stitch_need_two: '请至少添加 2 张图片。', stitch_too_large: '结果图过大——请减少数量或缩小图片。', stitch_done: '拼接图已下载。',

    t_wm_name: '图片加水印', t_wm_desc: '批量文字水印，位置透明度可控。',
    wm_h1: '图片加水印', wm_h1_g: '文字 · 批量 · 本地', wm_lead: '给照片批量盖上文字水印——全程不离开你的设备。',
    wm_text: '水印文字', wm_pos: '位置', wm_br: '右下', wm_bl: '左下', wm_tr: '右上', wm_tl: '左上', wm_tile: '平铺',
    wm_opacity: '不透明度', wm_color: '颜色', wm_size: '大小 %',
    wm_drop: '拖拽图片到此处', wm_drop_hint: '支持多选',
    wm_run: '加水印并下载', wm_done: '已处理并下载 {n} 张图片。',

    t_imd5_name: '图片 MD5', t_imd5_desc: '批量修改图片 MD5，画面零变化。',
    imd5_h1: '图片 MD5 修改器', imd5_h1_g: '批量 · 画面无损', imd5_lead: '不改动任何像素的情况下批量修改图片 MD5 指纹——瞬间完成、全程本地、自动打包 ZIP。',
    imd5_drop: '拖拽图片到此处', imd5_drop_hint: 'JPG · PNG · WebP · GIF · 支持多选',
    imd5_run: '修改并下载',

    t_grid_name: '九宫格切图', t_grid_desc: '3×3 或任意行列切图，发图利器。',
    grid_h1: '九宫格切图', grid_h1_g: '3×3 · 任意行列', grid_lead: '把一张图切成宫格——3×3 发朋友圈，或任意自定义行列，打包 ZIP 下载。',
    grid_drop: '拖拽图片到此处', grid_drop_hint: '单张 · 方图效果最佳',
    grid_rows: '行', grid_cols: '列', grid_square: '居中裁成方图',
    grid_go: '切割并下载 ZIP', grid_done: '已下载 {n} 张切片。',
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
