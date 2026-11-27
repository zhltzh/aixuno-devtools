// 从远程指定 commit 拉取关键文件覆盖本地（修复本地工作区损坏）
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const ref = process.argv[2] || 'main';
const cred = execSync('git credential fill', { input: 'protocol=https\nhost=github.com\n\n' }).toString();
const token = cred.split('\n').find((l) => l.startsWith('password=')).slice('password='.length);
const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' };

const FILES = [
  'index.html',
  'src/i18n.js',
  'src/tools-list.js',
  'package.json',
  'package-lock.json',
  '.github/workflows/deploy.yml',
  '.gitignore',
  'vite.config.js',
  'public/sitemap.xml',
  'src/app/home.js',
];

for (const path of FILES) {
  const r = await fetch(`https://api.github.com/repos/zhltzh/aixuno-devtools/contents/${encodeURIComponent(path)}?ref=${ref}`, { headers });
  if (!r.ok) {
    console.error(`✗ ${path}: HTTP ${r.status}`);
    process.exit(1);
  }
  const data = await r.json();
  const content = Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf8');
  writeFileSync(path, content);
  console.log(`✓ ${path} (${(content.length / 1024).toFixed(1)} KB)`);
}
console.log('\nrestore complete');
