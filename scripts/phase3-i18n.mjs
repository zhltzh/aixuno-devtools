import { readFileSync, writeFileSync } from 'node:fs';

const additions = {
  en: {
    t_vgif_name: 'Video to GIF', t_vgif_desc: 'Convert any video clip into a GIF.',
    vgif_h1: 'Video to GIF', vgif_h1_g: 'local, free', vgif_lead: 'Convert a video clip into a GIF — range, width and frame rate under your control, all in your browser.',
    vgif_drop: 'Drop a video here', vgif_drop_hint: 'MP4 · WebM · MOV — first run loads the engine (~30 MB)',
    vgif_start: 'Start (s)', vgif_dur: 'Duration (s)', vgif_width: 'Width', vgif_fps: 'FPS',
    vgif_go: 'Convert to GIF', vgif_done: 'GIF downloaded',

    t_vtrim_name: 'Video Trimmer', t_vtrim_desc: 'Cut a segment without re-encoding.',
    vtrim_h1: 'Video Trimmer', vtrim_h1_g: 'no re-encode', vtrim_lead: 'Cut out the part you need — stream copy keeps the original quality, no re-encoding.',
    vtrim_drop: 'Drop a video here', vtrim_drop_hint: 'MP4 · WebM · MOV',
    vtrim_start: 'Start (s)', vtrim_dur: 'Duration (s)', vtrim_go: 'Cut & download', vtrim_done: 'Clip downloaded',

    t_vmp3_name: 'Video to MP3', t_vmp3_desc: 'Extract the audio track as MP3.',
    vmp3_h1: 'Video to MP3', vmp3_h1_g: 'extract the audio', vmp3_lead: 'Pull the audio out of any video as MP3 — BGM, podcasts, voice notes. All local.',
    vmp3_drop: 'Drop a video here', vmp3_drop_hint: 'MP4 · WebM · MOV · MKV',
    vmp3_quality: 'Bitrate', vmp3_go: 'Extract MP3', vmp3_done: 'MP3 downloaded',

    t_vfx_name: 'Video FX', t_vfx_desc: 'Speed, reverse or mirror a video.',
    vfx_h1: 'Video FX', vfx_h1_g: 'speed · reverse · mirror', vfx_lead: 'Change playback speed, reverse the video, or flip it — one operation at a time, runs locally.',
    vfx_drop: 'Drop a video here', vfx_drop_hint: 'MP4 · WebM · MOV',
    vfx_mode: 'Effect', vfx_speed: 'Speed', vfx_reverse: 'Reverse', vfx_mirror: 'Mirror',
    vfx_factor: 'Factor', vfx_go: 'Apply & download', vfx_done: 'Done, file downloaded',
    vfx_note: 'Note: reverse re-encodes the video and can take a while for long clips.',

    t_vframes_name: 'Frame Extractor', t_vframes_desc: 'Stills every N seconds, cover or grid.',
    vframes_h1: 'Video Frame Extractor', vframes_h1_g: 'covers & stills', vframes_lead: 'Pull stills from any video — one frame every N seconds, or just the first frame as a cover.',
    vframes_drop: 'Drop a video here', vframes_drop_hint: 'MP4 · WebM · MOV',
    vframes_mode: 'Mode', vframes_interval: 'One frame every N s', vframes_cover: 'Cover (first frame)', vframes_grid: 'Grid thumbnail',
    vframes_every: 'Every (s)', vframes_go: 'Extract frames', vframes_done: 'Frames downloaded',

    t_vmerge_name: 'Video Merger', t_vmerge_desc: 'Join clips into one, no re-encode.',
    vmerge_h1: 'Video Merger', vmerge_h1_g: 'clips into one', vmerge_lead: 'Join multiple clips into one file — same-codec clips keep original quality with no re-encoding.',
    vmerge_drop: 'Drop videos here', vmerge_drop_hint: 'multiple selection · same format works best',
    vmerge_go: 'Merge & download', vmerge_done: 'Merged video downloaded', vmerge_need_two: 'Add at least 2 clips.',
    vmerge_failed_concat: 'Merge failed — clips with different resolutions/codecs cannot be joined directly. Convert them to the same format first.',

    ff_loading: 'Loading engine (first run only)…',
    ff_working: 'Processing',
    ff_failed: 'Processing failed',
    home_videos_title: 'Video utilities',
  },
  zh: {
    t_vgif_name: '视频转 GIF', t_vgif_desc: '任意视频片段一键转 GIF。',
    vgif_h1: '视频转 GIF', vgif_h1_g: '本地 · 免费', vgif_lead: '把视频片段转成 GIF——起止范围、宽度与帧率都由你控制，全程在浏览器完成。',
    vgif_drop: '拖拽视频到此处', vgif_drop_hint: 'MP4 · WebM · MOV — 首次使用需加载引擎（约 30 MB）',
    vgif_start: '起点 (秒)', vgif_dur: '时长 (秒)', vgif_width: '宽度', vgif_fps: '帧率',
    vgif_go: '转换为 GIF', vgif_done: 'GIF 已下载',

    t_vtrim_name: '视频截取', t_vtrim_desc: '无损截取任意片段。',
    vtrim_h1: '视频截取', vtrim_h1_g: '不重编码', vtrim_lead: '剪出你要的那一段——流复制不重编码，画质与原视频完全一致。',
    vtrim_drop: '拖拽视频到此处', vtrim_drop_hint: 'MP4 · WebM · MOV',
    vtrim_start: '起点 (秒)', vtrim_dur: '时长 (秒)', vtrim_go: '截取并下载', vtrim_done: '片段已下载',

    t_vmp3_name: '视频提取 MP3', t_vmp3_desc: '提取音轨保存为 MP3。',
    vmp3_h1: '视频提取 MP3', vmp3_h1_g: '把声音拿出来', vmp3_lead: '把视频里的声音提取成 MP3——BGM、播客、人声备忘都适用，全程本地。',
    vmp3_drop: '拖拽视频到此处', vmp3_drop_hint: 'MP4 · WebM · MOV · MKV',
    vmp3_quality: '码率', vmp3_go: '提取 MP3', vmp3_done: 'MP3 已下载',

    t_vfx_name: '视频特效', t_vfx_desc: '变速、倒放、镜像。',
    vfx_h1: '视频特效', vfx_h1_g: '变速 · 倒放 · 镜像', vfx_lead: '改变播放速度、倒放或水平镜像——一次一个效果，全程本地。',
    vfx_drop: '拖拽视频到此处', vfx_drop_hint: 'MP4 · WebM · MOV',
    vfx_mode: '效果', vfx_speed: '变速', vfx_reverse: '倒放', vfx_mirror: '镜像',
    vfx_factor: '倍速', vfx_go: '应用并下载', vfx_done: '完成，文件已下载',
    vfx_note: '提示：倒放需要重编码，长视频会花一些时间。',

    t_vframes_name: '视频截帧', t_vframes_desc: '每 N 秒一帧、封面或九宫格。',
    vframes_h1: '视频截帧', vframes_h1_g: '封面与素材图', vframes_lead: '从视频中抽图——每 N 秒一帧，或只取首帧当封面。',
    vframes_drop: '拖拽视频到此处', vframes_drop_hint: 'MP4 · WebM · MOV',
    vframes_mode: '模式', vframes_interval: '每 N 秒一帧', vframes_cover: '封面（首帧）', vframes_grid: '网格缩略图',
    vframes_every: '间隔 (秒)', vframes_go: '开始截帧', vframes_done: '截帧完成',

    t_vmerge_name: '视频合并', t_vmerge_desc: '多段视频拼接为一个。',
    vmerge_h1: '视频合并', vmerge_h1_g: '多段合一', vmerge_lead: '把多段视频拼成一个文件——同编码片段无损合并，画质不变。',
    vmerge_drop: '拖拽视频到此处', vmerge_drop_hint: '支持多选 · 相同格式效果最佳',
    vmerge_go: '合并并下载', vmerge_done: '合并视频已下载', vmerge_need_two: '请至少添加 2 个视频。',
    vmerge_failed_concat: '合并失败——分辨率或编码不同的视频不能直接拼接，请先转成相同格式。',

    ff_loading: '正在加载引擎（仅首次）…',
    ff_working: '处理中',
    ff_failed: '处理失败',
    home_videos_title: '视频工具',
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
