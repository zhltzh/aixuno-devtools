// Phase 4 音频四件套命令级验证：从真实视频提取音频，再跑四条完整命令
import { readFileSync, copyFileSync, unlinkSync } from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

globalThis.self = globalThis;
globalThis.location = { href: pathToFileURL('scripts/').href };

copyFileSync('node_modules/@ffmpeg/core/dist/umd/ffmpeg-core.js', 'scripts/ffmpeg-core.umd.cjs');
copyFileSync('node_modules/@ffmpeg/core/dist/umd/ffmpeg-core.wasm', 'scripts/ffmpeg-core.wasm');

const require = createRequire(import.meta.url);
const createFFmpegCore = require('./ffmpeg-core.umd.cjs');
const wasmBinary = readFileSync('scripts/ffmpeg-core.wasm');

const results = [];
const pass = (name, ok, detail) => {
  results.push({ name, ok });
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ' — ' + detail : ''}`);
};

const VIDEO = readFileSync('../e2e-assets/watermark-video.mp4');
const core = await createFFmpegCore({ printErr: () => {}, print: () => {}, wasmBinary });

core.FS.writeFile('in.mp4', VIDEO);
function run(args) {
  return core.exec(...args);
}
function readOut(name) {
  const data = core.FS.readFile(name);
  return Buffer.from(data.buffer, data.byteOffset, data.byteLength);
}

// 0. 源音频：MP3 提取（页面 video-to-mp3 同命令）
run(['-i', 'in.mp4', '-vn', '-c:a', 'libmp3lame', '-b:a', '192k', 'src.mp3']);
const SRC = readOut('src.mp3');
pass('源 MP3 提取', (SRC[0] === 0xff && (SRC[1] & 0xe0) === 0xe0) || SRC.subarray(0, 3).toString('latin1') === 'ID3', `${(SRC.length / 1024).toFixed(0)} KB`);

// 1. 音频转换：MP3 → WAV（RIFF/WAVE 魔数）
run(['-i', 'src.mp3', '-vn', '-c:a', 'pcm_s16le', 'out.wav']);
const wav = readOut('out.wav');
pass('转 WAV 输出 RIFF/WAVE', wav.subarray(0, 4).toString('latin1') === 'RIFF' && wav.subarray(8, 12).toString('latin1') === 'WAVE', `${(wav.length / 1024).toFixed(0)} KB`);

// 2. 音频转换：MP3 → FLAC（fLaC 魔数）
run(['-i', 'src.mp3', '-vn', '-c:a', 'flac', 'out.flac']);
const flac = readOut('out.flac');
pass('转 FLAC 输出 fLaC', flac.subarray(0, 4).toString('latin1') === 'fLaC', `${(flac.length / 1024).toFixed(0)} KB`);

// 3. 音频截取：-c copy 无重编码
run(['-ss', '0', '-t', '1', '-i', 'src.mp3', '-vn', '-c', 'copy', 'cut.mp3']);
const cut = readOut('cut.mp3');
pass('截取 MP3 有效且短于原', cut.length < SRC.length && cut.length > 1000, `${(cut.length / 1024).toFixed(0)} vs ${(SRC.length / 1024).toFixed(0)} KB`);

// 4. 音频合并：concat 同编码
core.FS.writeFile('src2.mp3', SRC);
core.FS.writeFile('list.txt', "file 'src.mp3'\nfile 'src2.mp3'");
run(['-f', 'concat', '-safe', '0', '-i', 'list.txt', '-vn', '-c', 'copy', 'merged.mp3']);
const merged = readOut('merged.mp3');
pass('合并 MP4 体积≈双份', Math.abs(merged.length - SRC.length * 2) / (SRC.length * 2) < 0.15, `${(merged.length / 1024).toFixed(0)} vs 2×${(SRC.length / 1024).toFixed(0)} KB`);

// 5. 音量：+6dB 重编码
run(['-i', 'src.mp3', '-vn', '-af', 'volume=6dB', '-c:a', 'libmp3lame', '-b:a', '192k', 'vol.mp3']);
const vol = readOut('vol.mp3');
pass('音量调整输出有效 MP3', vol.length > 1000 && ((vol[0] === 0xff && (vol[1] & 0xe0) === 0xe0) || vol.subarray(0, 3).toString('latin1') === 'ID3'), `${(vol.length / 1024).toFixed(0)} KB`);

// 6. 归一化 loudnorm
run(['-i', 'src.mp3', '-vn', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-c:a', 'libmp3lame', '-b:a', '192k', 'norm.mp3']);
const norm = readOut('norm.mp3');
pass('归一化输出有效 MP3', norm.length > 1000, `${(norm.length / 1024).toFixed(0)} KB`);

unlinkSync('scripts/ffmpeg-core.umd.cjs');
unlinkSync('scripts/ffmpeg-core.wasm');

const allOk = results.every((x) => x.ok);
console.log(`\n${allOk ? 'ALL PASS' : 'HAS FAILURES'} (${results.filter((x) => x.ok).length}/${results.length})`);
process.exit(allOk ? 0 : 1);
