// Phase 3 视频六件套命令级验证：Node 中运行与页面完全相同的 ffmpeg.wasm
// （把 UMD core 复制到 scripts/ 绕过包 exports 限制；UMD 在 Node 用 fs 读 wasm）
import { readFileSync, copyFileSync } from 'node:fs';
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

const SRC = readFileSync('../e2e-assets/watermark-video.mp4');
const logs = [];
const core = await createFFmpegCore({
  printErr: () => {},
  print: (msg) => logs.push(msg),
  wasmBinary,
});

core.FS.writeFile('in.mp4', SRC);
function run(args) {
  return core.exec(...args);
}
function readOut(name) {
  const data = core.FS.readFile(name);
  return Buffer.from(data.buffer, data.byteOffset, data.byteLength);
}

// ---------- 1. 转 GIF（页面同参） ----------
run(['-ss', '0', '-t', '1', '-i', 'in.mp4', '-vf', 'fps=10,scale=320:-1:flags=lanczos', '-loop', '0', 'out.gif']);
const gif = readOut('out.gif');
pass('转 GIF 输出为 GIF89a', gif.subarray(0, 6).toString('latin1') === 'GIF89a', `${(gif.length / 1024).toFixed(0)} KB`);

// ---------- 2. 截取片段（-c copy 无重编码） ----------
run(['-ss', '0', '-t', '1', '-i', 'in.mp4', '-c', 'copy', 'cut.mp4']);
const cut = readOut('cut.mp4');
pass('截取输出为 MP4 (ftyp)', cut.subarray(4, 8).toString('latin1') === 'ftyp', `${(cut.length / 1024).toFixed(0)} KB`);
pass('截取片段小于原视频', cut.length < SRC.length, `${(cut.length / 1024).toFixed(0)} vs ${(SRC.length / 1024).toFixed(0)} KB`);

// ---------- 3. 提取 MP3（libmp3lame） ----------
run(['-i', 'in.mp4', '-vn', '-c:a', 'libmp3lame', '-b:a', '128k', 'out.mp3']);
const mp3 = readOut('out.mp3');
const isMp3 = (mp3[0] === 0xff && (mp3[1] & 0xe0) === 0xe0) || mp3.subarray(0, 3).toString('latin1') === 'ID3';
pass('提取输出为 MP3', isMp3, `${(mp3.length / 1024).toFixed(0)} KB`);

// ---------- 4. 特效：镜像（hflip 重编码） ----------
run(['-i', 'in.mp4', '-vf', 'hflip', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-c:a', 'aac', 'fx.mp4']);
const fx = readOut('fx.mp4');
pass('镜像输出为有效 MP4', fx.subarray(4, 8).toString('latin1') === 'ftyp' && fx.length > 1000, `${(fx.length / 1024).toFixed(0)} KB`);

// ---------- 5. 截帧：封面（首帧 PNG） ----------
run(['-i', 'in.mp4', '-frames:v', '1', 'cover.png']);
const cover = readOut('cover.png');
pass('封面输出为 PNG', cover.subarray(1, 4).toString('latin1') === 'PNG', `${(cover.length / 1024).toFixed(0)} KB`);

// ---------- 6. 合并（concat demuxer，同源两份） ----------
core.FS.writeFile('in2.mp4', SRC);
core.FS.writeFile('list.txt', "file 'in.mp4'\nfile 'in2.mp4'");
run(['-f', 'concat', '-safe', '0', '-i', 'list.txt', '-c', 'copy', 'merged.mp4']);
const merged = readOut('merged.mp4');
pass('合并输出为 MP4', merged.subarray(4, 8).toString('latin1') === 'ftyp', `${(merged.length / 1024).toFixed(0)} KB`);
pass('合并体积≈双份', Math.abs(merged.length - SRC.length * 2) / (SRC.length * 2) < 0.15, `${(merged.length / 1024).toFixed(0)} vs 2×${(SRC.length / 1024).toFixed(0)} KB`);

const allOk = results.every((x) => x.ok);
console.log(`\n${allOk ? 'ALL PASS' : 'HAS FAILURES'} (${results.filter((x) => x.ok).length}/${results.length})`);
process.exit(allOk ? 0 : 1);
