// 从 npm 提取 ffmpeg.wasm 资源到 public/ffmpeg/（dev 与 CI 构建前运行，不入仓库）
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'ffmpeg');
mkdirSync(outDir, { recursive: true });

const jobs = [
  ['node_modules/@ffmpeg/ffmpeg/dist/esm/worker.js', 'public/ffmpeg/worker.js'],
  ['node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.js', 'public/ffmpeg/ffmpeg-core.js'],
  ['node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.wasm', 'public/ffmpeg/ffmpeg-core.wasm'],
];

for (const [src, rel] of jobs) {
  const abs = join(root, src);
  if (!existsSync(abs)) {
    console.error(`missing: ${src}`);
    process.exit(1);
  }
  copyFileSync(abs, join(root, rel));
  console.log(`ok: ${rel}`);
}
console.log('ffmpeg assets ready');
