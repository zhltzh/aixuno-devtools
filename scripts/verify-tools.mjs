// 5 个补测工具的算法级验证（与页面同库同逻辑）
import SparkMD5 from 'spark-md5';
import Papa from 'papaparse';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { createHash } from 'node:crypto';

const results = {};
const pass = (name, ok, detail) => {
  results[name] = { ok, detail };
  console.log(`${ok ? '✓' : '✗'} ${name} ${detail ? '— ' + detail : ''}`);
};

// ---------- 1. 哈希校验器（页面算法：SparkMD5 分块 + WebCrypto subtle） ----------
const payload = new TextEncoder().encode('aixuno hash test 2026');
const spark = new SparkMD5.ArrayBuffer();
spark.append(payload.buffer);
const pageMd5 = spark.end();
const nodeMd5 = createHash('md5').update(payload).digest('hex');
pass('hash-MD5 一致性', pageMd5 === nodeMd5, pageMd5.slice(0, 12) + '…');

const algos = { 'SHA-1': 'SHA-1', 'SHA-256': 'SHA-256', 'SHA-512': 'SHA-512' };
let shaOk = true;
for (const [label, algo] of Object.entries(algos)) {
  const digest = await crypto.subtle.digest(algo, payload.buffer);
  const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
  const ref = createHash(algo.toLowerCase().replace('-', '')).update(payload).digest('hex');
  if (hex !== ref) shaOk = false;
}
pass('hash-SHA1/256/512 一致性', shaOk);

// ---------- 2. Base64（页面算法：TextEncoder + btoa） ----------
function encodeB64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}
function decodeB64(b64) {
  const bin = atob(b64.replace(/\s+/g, ''));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
}
const b64Text = '你好世界 ABC 123 🎉';
const b64Round = decodeB64(encodeB64(b64Text));
pass('base64 中文+emoji 往返', b64Round === b64Text, encodeB64(b64Text).slice(0, 16) + '…');

// ---------- 3. URL 编解码（页面算法） ----------
const url = 'https://example.com/search?q=免费工具&lang=zh&page=2';
const urlEnc = encodeURIComponent(url);
const urlDec = decodeURIComponent(urlEnc.replace(/\+/g, '%20'));
pass('url-encode 往返', urlDec === url);
const params = [...new URL(url).searchParams.entries()];
pass('url 参数解析', params.length === 3 && params[0][0] === 'q' && params[0][1] === '免费工具', JSON.stringify(params.map((p) => p[0])));

// ---------- 4. JSON⇄CSV（页面同库 Papa） ----------
const objs = [{ name: '张三', age: 28 }, { name: 'Ada', age: 36 }];
const csv = Papa.unparse(objs, { delimiter: ',' });
const back = Papa.parse(csv.trim(), { delimiter: ',', header: true, skipEmptyLines: true, dynamicTyping: true });
pass('json→csv→json 往返', JSON.stringify(back.data) === JSON.stringify(objs), csv.replace(/\n/g, ' | '));

// ---------- 5. 二维码生成→识别闭环（QRCode.create 模块矩阵 → jsQR） ----------
const qrContent = 'https://aizak.cn/e2e-test';
const qr = QRCode.create(qrContent, { errorCorrectionLevel: 'M' });
const size = qr.modules.size;
const quiet = 4;
const dim = size + quiet * 2;
const rgba = new Uint8ClampedArray(dim * dim * 4);
for (let y = 0; y < dim; y++) {
  for (let x = 0; x < dim; x++) {
    const inQr = x >= quiet && x < quiet + size && y >= quiet && y < quiet + size;
    const dark = inQr && qr.modules.data[(y - quiet) * size + (x - quiet)];
    const v = dark ? 0 : 255;
    const i = (y * dim + x) * 4;
    rgba[i] = rgba[i + 1] = rgba[i + 2] = v;
    rgba[i + 3] = 255;
  }
}
const decoded = jsQR(rgba, dim, dim);
pass('qrcode 生成→识别闭环', decoded && decoded.data === qrContent, decoded ? decoded.data : 'decode failed');

const allOk = Object.values(results).every((x) => x.ok);
console.log(`\n${allOk ? 'ALL PASS (6/6)' : 'HAS FAILURES'}`);
process.exit(allOk ? 0 : 1);
