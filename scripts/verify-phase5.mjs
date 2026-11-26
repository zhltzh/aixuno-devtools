// Phase 5 三件套算法级验证：typing-core 纯函数 + canvas-paint 同逻辑绘制
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { compareChars, typingStats } from '../src/app/typing-core.js';
import { drawMeme, drawBeautify } from '../src/app/canvas-paint.js';
import { writeFileSync } from 'node:fs';

const results = [];
const pass = (name, ok, detail) => {
  results.push({ name, ok });
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ' — ' + detail : ''}`);
};

// ---------- 1. typing-core：字符比对 ----------
const target = 'hello world';
const typed = 'hello wxrld';
const cmp = compareChars(target, typed);
pass('打字比对 正确数', cmp.correct === 10, `correct=${cmp.correct}`);
pass('打字比对 错误数', cmp.wrong === 1, `wrong=${cmp.wrong}`);

// ---------- 2. typing-core：统计 ----------
const stats = typingStats(300, 320, 60);
pass('WPM 计算 (300 正确字符 / 60s = 60wpm)', stats.wpm === 60, `wpm=${stats.wpm}`);
pass('CPM 计算', stats.cpm === 300, `cpm=${stats.cpm}`);
pass('准确率 计算', stats.accuracy === 94, `acc=${stats.accuracy}%`);
const zero = typingStats(100, 100, 0);
pass('零时长除零保护', zero.wpm === 0 && zero.cpm === 0 && zero.accuracy === 100);

// ---------- 3. drawMeme：上下文字渲染像素验证 ----------
const memeCanvas = createCanvas(400, 400);
const mctx = memeCanvas.getContext('2d');
mctx.fillStyle = '#808080';
mctx.fillRect(0, 0, 400, 400);
drawMeme(mctx, 400, 400, { topText: 'when it works', bottomText: 'nothing uploaded', fontSizeRatio: 0.09 });

function countNonBg(ctx, x0, x1, y0, y1, bg = 128) {
  let n = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const d = ctx.getImageData(x, y, 1, 1).data;
      if (Math.abs(d[0] - bg) > 12 || Math.abs(d[1] - bg) > 12) n++;
    }
  }
  return n;
}
const topInk = countNonBg(mctx, 100, 300, 5, 45);
const bottomInk = countNonBg(mctx, 100, 300, 350, 395);
pass('表情包顶部文字已渲染', topInk > 200, `${topInk} 个文字像素`);
pass('表情包底部文字已渲染', bottomInk > 200, `${bottomInk} 个文字像素`);

// ---------- 4. drawBeautify：渐变背景+圆角+投影 ----------
const imgCanvas = createCanvas(300, 200);
const ictx = imgCanvas.getContext('2d');
ictx.fillStyle = '#ff3366';
ictx.fillRect(0, 0, 300, 200);
const img = await loadImage(await imgCanvas.encode('png'));

const bCanvas = createCanvas(300 + 80, 200 + 80);
const bctx = bCanvas.getContext('2d');
const size = drawBeautify(bctx, img, { padding: 40, gradient: ['#2f6bff', '#8b5cf6'] });
pass('美化输出尺寸 (380x280)', size.width === 380 && size.height === 280, `${size.width}x${size.height}`);

const corner = bctx.getImageData(2, 2, 1, 1).data;
const edge = bctx.getImageData(40, 10, 1, 1).data;
const center = bctx.getImageData(190, 140, 1, 1).data;
pass('左上角被圆角裁掉（背景=渐变蓝）', Math.abs(corner[0] - 0x2f) < 40 && corner[2] > 100, `rgb(${corner[0]},${corner[1]},${corner[2]})`);
pass('上边距为渐变背景（非截图粉红）', edge[2] > 150 && edge[0] < 150, `rgb(${edge[0]},${edge[1]},${edge[2]})`);
pass('中心为截图内容（粉红）', center[0] > 200 && center[1] < 100, `rgb(${center[0]},${center[1]},${center[2]})`);

writeFileSync('scripts/tmp-meme.png', await memeCanvas.encode('png'));
writeFileSync('scripts/tmp-beauty.png', await bCanvas.encode('png'));
pass('输出 PNG 可编码', true);

const allOk = results.every((x) => x.ok);
console.log(`\n${allOk ? 'ALL PASS' : 'HAS FAILURES'} (${results.filter((x) => x.ok).length}/${results.length})`);
process.exit(allOk ? 0 : 1);
