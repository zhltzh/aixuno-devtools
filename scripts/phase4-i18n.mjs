import { readFileSync, writeFileSync } from 'node:fs';

const additions = {
  en: {
    t_aconv_name: 'Audio Converter', t_aconv_desc: 'MP3/WAV/OGG/AAC/FLAC interconversion.',
    aconv_h1: 'Audio Converter', aconv_h1_g: 'mp3 · wav · ogg · flac', aconv_lead: 'Convert audio between MP3, WAV, OGG, AAC and FLAC — locally, free, no upload.',
    aconv_drop: 'Drop an audio file here', aconv_drop_hint: 'MP3 · WAV · OGG · AAC · FLAC · M4A',
    aconv_target: 'Convert to', aconv_bitrate: 'Bitrate', aconv_go: 'Convert & download', aconv_done: 'Converted, file downloaded',

    t_atrim_name: 'Audio Trimmer', t_atrim_desc: 'Lossless segment cutting.',
    atrim_h1: 'Audio Trimmer', atrim_h1_g: 'no re-encode', atrim_lead: 'Cut out the part you need — stream copy keeps original quality.',
    atrim_drop: 'Drop an audio file here', atrim_drop_hint: 'MP3 · WAV · OGG · AAC · FLAC · M4A',
    atrim_start: 'Start (s)', atrim_dur: 'Duration (s)', atrim_go: 'Cut & download', atrim_done: 'Clip downloaded',

    t_amerge_name: 'Audio Merger', t_amerge_desc: 'Join audio files into one.',
    amerge_h1: 'Audio Merger', amerge_h1_g: 'tracks into one', amerge_lead: 'Join multiple audio files into one — same-format files keep original quality.',
    amerge_drop: 'Drop audio files here', amerge_drop_hint: 'multiple selection · same format works best',
    amerge_go: 'Merge & download', amerge_done: 'Merged audio downloaded', amerge_need_two: 'Add at least 2 files.',
    amerge_failed_concat: 'Merge failed — files with different formats cannot be joined directly. Convert them to the same format first.',

    t_avol_name: 'Audio Volume', t_avol_desc: 'Boost, reduce or normalize loudness.',
    avol_h1: 'Audio Volume', avol_h1_g: 'boost · normalize', avol_lead: 'Boost or reduce volume in dB, or normalize the whole track to a standard loudness.',
    avol_drop: 'Drop an audio file here', avol_drop_hint: 'MP3 · WAV · OGG · AAC · FLAC · M4A',
    avol_mode: 'Mode', avol_db: 'Adjust (dB)', avol_norm: 'Normalize loudness', avol_dbval: 'Volume',
    avol_go: 'Apply & download', avol_done: 'Done, file downloaded',
  },
  zh: {
    t_aconv_name: '音频转换', t_aconv_desc: 'MP3/WAV/OGG/AAC/FLAC 互转。',
    aconv_h1: '音频格式转换', aconv_h1_g: 'mp3 · wav · ogg · flac', aconv_lead: 'MP3、WAV、OGG、AAC、FLAC 之间互转——全程本地，免费，不上传。',
    aconv_drop: '拖拽音频到此处', aconv_drop_hint: 'MP3 · WAV · OGG · AAC · FLAC · M4A',
    aconv_target: '转换为', aconv_bitrate: '码率', aconv_go: '转换并下载', aconv_done: '转换完成，文件已下载',

    t_atrim_name: '音频截取', t_atrim_desc: '无损截取任意片段。',
    atrim_h1: '音频截取', atrim_h1_g: '不重编码', atrim_lead: '剪出你要的那一段——流复制不重编码，音质与原文件一致。',
    atrim_drop: '拖拽音频到此处', atrim_drop_hint: 'MP3 · WAV · OGG · AAC · FLAC · M4A',
    atrim_start: '起点 (秒)', atrim_dur: '时长 (秒)', atrim_go: '截取并下载', atrim_done: '片段已下载',

    t_amerge_name: '音频合并', t_amerge_desc: '多段音频拼接为一个。',
    amerge_h1: '音频合并', amerge_h1_g: '多段合一', amerge_lead: '把多段音频拼成一个文件——同格式无损合并，音质不变。',
    amerge_drop: '拖拽音频到此处', amerge_drop_hint: '支持多选 · 相同格式效果最佳',
    amerge_go: '合并并下载', amerge_done: '合并音频已下载', amerge_need_two: '请至少添加 2 个文件。',
    amerge_failed_concat: '合并失败——不同格式的音频不能直接拼接，请先转成相同格式。',

    t_avol_name: '音量调节', t_avol_desc: '增益、降低或响度归一化。',
    avol_h1: '音量调节', avol_h1_g: '增益 · 归一化', avol_lead: '按 dB 增益或降低音量，或把整段音频归一到标准响度。',
    avol_drop: '拖拽音频到此处', avol_drop_hint: 'MP3 · WAV · OGG · AAC · FLAC · M4A',
    avol_mode: '模式', avol_db: '调节 (dB)', avol_norm: '响度归一化', avol_dbval: '音量',
    avol_go: '应用并下载', avol_done: '完成，文件已下载',
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
