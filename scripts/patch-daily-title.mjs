import { readFileSync, writeFileSync } from 'node:fs';

let s = readFileSync('src/i18n.js', 'utf8');
for (const [anchor, title] of [
  ["    home_badge3: 'Free forever',", "Everyday calculators"],
  ["    home_badge3: '永久免费',", "日常计算器"],
]) {
  if (!s.includes(anchor)) throw new Error('anchor missing: ' + anchor);
  s = s.replace(anchor, anchor + `\n    home_daily_title: ${JSON.stringify(title)},`);
}
writeFileSync('src/i18n.js', s);
console.log('done');
