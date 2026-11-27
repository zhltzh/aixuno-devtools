// 从远程 main 拉取全部文件，覆盖本地（排除本地已更新的文件）
import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';

const cred = execSync('git credential fill', { input: 'protocol=https\nhost=github.com\n\n' }).toString();
const token = cred.split('\n').find((l) => l.startsWith('password=')).slice('password='.length);
const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' };
const API = 'https://api.github.com/repos/zhltzh/aixuno-devtools';

// 本地刚更新过、不能被远程旧版覆盖
const SKIP = new Set([
  'index.html',
  'src/i18n.js',
  'src/style.css',
  'src/layout.js',
  'scripts/patch-network-i18n.mjs',
  'scripts/restore-from-remote.mjs',
  'scripts/restore-all.mjs',
  '.gitseed',
]);

const treeResp = await fetch(`${API}/git/trees/main?recursive=1`, { headers });
const tree = await treeResp.json();
if (tree.truncated) {
  console.error('tree truncated — aborting');
  process.exit(1);
}

const blobs = tree.tree.filter((n) => n.type === 'blob' && !SKIP.has(n.path) && !n.path.startsWith('public/ffmpeg/'));
console.log(`remote files: ${blobs.length} (skipping ${SKIP.size})`);

let ok = 0;
for (const node of blobs) {
  const blobResp = await fetch(node.url, { headers });
  const blob = await blobResp.json();
  const content = Buffer.from(blob.content.replace(/\n/g, ''), 'base64').toString('utf8');
  const dir = dirname(node.path);
  if (dir !== '.' && !existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(node.path, content);
  ok++;
}
console.log(`restored ${ok} files`);
