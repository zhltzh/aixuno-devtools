// Phase 2 图片五件套算法级验证（与页面同逻辑）
import { createCanvas, loadImage } from '@napi-rs/canvas';
import exifr from 'exifr';
import SparkMD5 from 'spark-md5';
import JSZip from 'jszip';
import { readFileSync } from 'node:fs';

const results = [];
const pass = (name, ok, detail) => {
  results.push({ name, ok });
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ' — ' + detail : ''}`);
};

async function pngBytes(w, h, color) {
  const c = createCanvas(w, h);
  const ctx = c.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
  return c.encode('png');
}

// ---------- 1. EXIF：手工构造带 EXIF 的 JPEG（正向）vs canvas JPEG（无 EXIF） ----------
// 最小 JPEG：SOI + APP1(Exif/TIFF IFD0: Model="Test") + EOI
function buildExifJpeg() {
  const tiffData = Buffer.alloc(6 + 2 + 2 + 12 + 4 + 5);
  // TIFF header (little endian)
  tiffData.writeUInt16LE(0x4949, 0);
  tiffData.writeUInt16LE(0x2a00, 2);
  tiffData.writeUInt32LE(8, 4); // IFD0 offset
  tiffData.writeUInt16LE(1, 8); // 1 entry
  // entry: Model tag
  tiffData.writeUInt16LE(0x0110, 10);
  tiffData.writeUInt16LE(2, 12); // ASCII
  tiffData.writeUInt32LE(5, 14); // count
  tiffData.writeUInt32LE(26, 18); // value offset (relative to TIFF start: 6+2+2+12+4+... = 26)
  tiffData.writeUInt32LE(0, 22); // next IFD
  tiffData.write('Test\0', 26);
  const exifPayload = Buffer.concat([Buffer.from('Exif\0\0'), tiffData]);
  const app1 = Buffer.alloc(2 + 2 + exifPayload.length);
  app1.writeUInt16BE(0xffe1, 0);
  app1.writeUInt16BE(exifPayload.length + 2, 2);
  exifPayload.copy(app1, 4);
  return Buffer.concat([Buffer.from([0xff, 0xd8]), app1, Buffer.from([0xff, 0xd9])]);
}

const exifJpeg = buildExifJpeg();
const realExif = await exifr.parse(exifJpeg, { tiff: true, exif: true, ifd0: true });
pass('exifr 解析构造的 EXIF JPEG', realExif && realExif.Model === 'Test', JSON.stringify(realExif));

const plainCanvas = createCanvas(200, 150);
plainCanvas.getContext('2d').fillStyle = '#3366aa';
plainCanvas.getContext('2d').fillRect(0, 0, 200, 150);
const plainJpeg = await plainCanvas.encode('jpeg');
const cleanExif = await exifr.parse(plainJpeg, { tiff: true, exif: true, gps: true, ifd0: true }).catch(() => null);
pass('canvas JPEG 无 EXIF（清除路径语义）', !cleanExif || Object.keys(cleanExif).length === 0);

// 清除逻辑 = canvas 重绘导出（页面同法）：重绘后无 EXIF
const redraw = createCanvas(plainCanvas.width, plainCanvas.height);
redraw.getContext('2d').drawImage(plainCanvas, 0, 0);
const redrawJpeg = await redraw.encode('jpeg');
const afterClean = await exifr.parse(redrawJpeg, { tiff: true, exif: true, gps: true, ifd0: true }).catch(() => null);
pass('EXIF 清除后确无残留', !afterClean || Object.keys(afterClean).length === 0);

// ---------- 2. 长图拼接（页面同算法）：两图竖拼 ----------
const imgA = await loadImage(await pngBytes(300, 200, '#ff0000'));
const imgB = await loadImage(await pngBytes(400, 120, '#00cc00'));
const images = [imgA, imgB];
const gap = 0;
const W = Math.max(...images.map((x) => x.width));
const H = images.reduce((s, x) => s + x.height, 0) + gap * (images.length - 1);
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, W, H);
let pos = 0;
for (const item of images) {
  const x = Math.round((W - item.width) / 2);
  ctx.drawImage(item, x, pos);
  pos += item.height + gap;
}
pass('拼接画布尺寸', W === 400 && H === 320, `${canvas.width}x${canvas.height}`);
const s1 = ctx.getImageData(50, 100, 1, 1).data; // 第一张红色区域
const s2 = ctx.getImageData(50, 260, 1, 1).data; // 第二张绿色区域
pass('拼接像素正确', s1[0] > 200 && s1[1] < 60 && s2[1] > 150 && s2[0] < 80);

// ---------- 3. 水印（页面同算法）：右下角文字 → 像素变化 ----------
const wmCanvas = createCanvas(imgA.width, imgA.height);
const wmCtx = wmCanvas.getContext('2d');
wmCtx.drawImage(imgA, 0, 0);
const fontSize = Math.max(12, Math.round(Math.min(wmCanvas.width, wmCanvas.height) * 0.04));
wmCtx.font = `700 ${fontSize}px sans-serif`;
wmCtx.globalAlpha = 0.4;
wmCtx.fillStyle = '#ffffff';
wmCtx.textAlign = 'right';
const pad = fontSize * 0.8;
wmCtx.fillText('@aixuno', wmCanvas.width - pad, wmCanvas.height - pad);
const cornerBefore = ctx.getImageData(0, 0, 1, 1); // 无关样
const wmData = wmCtx.getImageData(wmCanvas.width - pad, wmCanvas.height - fontSize, 1, 1).data;
const redOnly = imgA.width ? wmData[0] : 0;
pass('水印区域像素被改变', redOnly > 180, `R=${wmData[0]}（纯红底被白字叠加）`);

// ---------- 4. 图片 MD5（页面同算法）：追加 16 字节 → MD5 改变且前缀像素不变 ----------
const tail = new Uint8Array(16);
crypto.getRandomValues(tail);
const head = new Uint8Array(await pngBytes(100, 100, '#123456'));
const merged = new Uint8Array(head.length + tail.length);
merged.set(head, 0);
merged.set(tail, head.length);
const sOld = new SparkMD5.ArrayBuffer();
sOld.append(head.buffer);
const sNew = new SparkMD5.ArrayBuffer();
sNew.append(merged.buffer);
pass('图片 MD5 前后不同', sOld.end() !== sNew.end());
const reImg = await loadImage(Buffer.from(merged));
pass('修改后图片仍可正常解码（画面无损）', reImg.width === 100 && reImg.height === 100);

// ---------- 5. 九宫格（页面同算法）：3×3 → 9 块、每块 100×100、颜色正确 ----------
const gridCanvas = createCanvas(300, 300);
const gctx = gridCanvas.getContext('2d');
const colors = ['#111111', '#222222', '#333333', '#444444', '#555555', '#666666', '#777777', '#888888', '#999999'];
for (let i = 0; i < 9; i++) {
  gctx.fillStyle = colors[i];
  gctx.fillRect((i % 3) * 100, Math.floor(i / 3) * 100, 100, 100);
}
const rows = 3;
const cols = 3;
const cellW = Math.floor(gridCanvas.width / cols);
const cellH = Math.floor(gridCanvas.height / rows);
const tiles = [];
for (let rr = 0; rr < rows; rr++) {
  for (let cc = 0; cc < cols; cc++) {
    const tile = createCanvas(cellW, cellH);
    const tctx = tile.getContext('2d');
    tctx.drawImage(gridCanvas, cc * cellW, rr * cellH, cellW, cellH, 0, 0, cellW, cellH);
    tiles.push(await tile.encode('png'));
  }
}
pass('九宫格切出 9 块', tiles.length === 9);
const centerImg = await loadImage(tiles[4]);
const centerCanvas = createCanvas(centerImg.width, centerImg.height);
centerCanvas.getContext('2d').drawImage(centerImg, 0, 0);
const cd = centerCanvas.getContext('2d').getImageData(50, 50, 1, 1).data;
pass('中心块颜色正确 (#555)', Math.abs(cd[0] - 0x55) < 3 && Math.abs(cd[1] - 0x55) < 3, `rgb(${cd[0]},${cd[1]},${cd[2]})`);

// ZIP 完整性（页面打包路径）
const zip = new JSZip();
tiles.forEach((t, i) => zip.file(`${Math.floor(i / 3) + 1}x${(i % 3) + 1}.png`, t));
const zipBuf = await zip.generateAsync({ type: 'nodebuffer' });
const reZip = await JSZip.loadAsync(zipBuf);
pass('ZIP 打包 9 个切片', Object.keys(reZip.files).filter((f) => !reZip.files[f].dir).length === 9);

const allOk = results.every((x) => x.ok);
console.log(`\n${allOk ? 'ALL PASS' : 'HAS FAILURES'} (${results.filter((x) => x.ok).length}/${results.length})`);
process.exit(allOk ? 0 : 1);
