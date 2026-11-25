import { readFileSync, writeFileSync } from 'node:fs';

let s = readFileSync('src/i18n.js', 'utf8');
for (const [anchor, title] of [
  ["    home_badge3: 'Free forever',", 'Image utilities'],
  ["    home_badge3: '永久免费',", '图片工具'],
]) {
  if (!s.includes(anchor)) throw new Error('missing: ' + anchor);
  s = s.replace(anchor, anchor + `\n    home_images_title: ${JSON.stringify(title)},`);
}
writeFileSync('src/i18n.js', s);
console.log('done');
