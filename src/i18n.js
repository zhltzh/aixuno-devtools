const STRINGS = {
  en: {
    nav_home: 'Home',
    nav_files: 'Files',
    nav_text: 'Text & Data',
    nav_dev: 'More',
    badge_privacy: 'Local processing · nothing is uploaded',
    lang_label: 'Language',

    home_title: 'Free Online Dev Utilities',
    home_page_title: 'Aixuno Devtools — Free Local File & Developer Utilities',
    home_title_grad: 'all local, all free',
    home_lead: 'MD5 modifier, hash checker, timestamp, Base64, JSON tools, text diff, QR codes and password generator — every tool runs in your browser, files never leave your device.',
    home_badge1: 'No upload',
    home_badge2: 'No sign-up',
    home_badge3: 'Free forever',
    home_files_title: 'File utilities',
    home_text_title: 'Text & data utilities',
    home_dev_title: 'Everyday utilities',

    t_md5_name: 'MD5 Modifier',
    t_md5_desc: 'Change a file’s MD5 fingerprint without re-encoding — batch supported.',
    t_hash_name: 'Hash Checker',
    t_hash_desc: 'Calculate MD5, SHA-1, SHA-256/512 and verify against expected values.',
    t_ts_name: 'Timestamp Converter',
    t_ts_desc: 'Unix epoch ⇄ date-time, ISO / UTC / local formats, live clock.',
    t_b64_name: 'Base64 Tool',
    t_b64_desc: 'Encode & decode text or files to Base64, UTF-8 safe.',
    t_url_name: 'URL Encoder',
    t_url_desc: 'Percent-encode / decode URLs and inspect query parameters.',
    t_json_name: 'JSON Formatter',
    t_json_desc: 'Beautify, minify, validate and escape JSON.',
    t_csv_name: 'JSON ⇄ CSV',
    t_csv_desc: 'Convert JSON arrays to CSV and back, delimiter options.',
    t_diff_name: 'Text Diff',
    t_diff_desc: 'Compare two texts line by line with added / removed highlights.',
    t_qr_name: 'QR Code',
    t_qr_desc: 'Generate QR codes and decode them from images.',
    t_pw_name: 'Password Generator',
    t_pw_desc: 'Strong random passwords with custom character sets.',

    md5_h1: 'MD5 Modifier',
    md5_h1_g: 'without re-encoding',
    md5_lead: 'Change a file’s MD5 by appending random bytes — instant, local, batch supported. Useful for version tagging and re-upload scenarios.',
    md5_drop: 'Drop files here',
    md5_drop_hint: 'any file type · multiple selection supported',
    md5_old: 'Original MD5',
    md5_new: 'New MD5',
    md5_modify_all: 'Modify all',
    md5_clear: 'Clear',
    md5_download_zip: 'Download all (ZIP)',
    md5_modified: 'Modified',
    md5_working: 'Working…',
    md5_empty: 'Add at least one file first.',

    hash_h1: 'File Hash Checker',
    hash_h1_g: 'MD5 · SHA',
    hash_lead: 'Compute MD5, SHA-1, SHA-256 and SHA-512 locally, then verify against an expected value.',
    hash_drop: 'Drop a file here',
    hash_drop_hint: 'large files supported — hashed in chunks',
    hash_expected: 'Expected value (optional)',
    hash_verify: 'Verify',
    hash_match: 'Match',
    hash_mismatch: 'Mismatch',
    hash_uploading: 'Hashing…',

    ts_h1: 'Timestamp Converter',
    ts_h1_g: 'epoch ⇄ date',
    ts_lead: 'Convert Unix timestamps to human dates and back. Live clock included.',
    ts_now: 'Now',
    ts_to_date: 'Timestamp → Date',
    ts_to_ts: 'Date → Timestamp',
    ts_input_ts: 'Unix timestamp (s or ms)',
    ts_input_date: 'Date & time',
    ts_result: 'Result',
    ts_local: 'Local',
    ts_utc: 'UTC',
    ts_iso: 'ISO 8601',
    ts_rel: 'Relative',
    ts_convert: 'Convert',

    b64_h1: 'Base64 Encoder / Decoder',
    b64_h1_g: 'text & files',
    b64_lead: 'UTF-8 safe Base64 encode / decode, plus file-to-Base64.',
    b64_encode: 'Encode',
    b64_decode: 'Decode',
    b64_swap: 'Swap',
    b64_clear: 'Clear',
    b64_file: 'File → Base64',
    b64_file_hint: 'file is read locally, never uploaded',
    b64_too_large: 'File too large for text output — try a smaller file.',

    url_h1: 'URL Encoder / Decoder',
    url_h1_g: 'percent encoding',
    url_lead: 'Escape and unescape URLs, and inspect query parameters.',
    url_encode: 'Encode (component)',
    url_encode_uri: 'Encode (full URL)',
    url_decode: 'Decode',
    url_clear: 'Clear',
    url_params: 'Query parameters',

    json_h1: 'JSON Formatter',
    json_h1_g: 'beautify & validate',
    json_lead: 'Beautify, minify and validate JSON with precise error locations.',
    json_format: 'Format',
    json_minify: 'Minify',
    json_validate: 'Validate',
    json_escape: 'Escape',
    json_unescape: 'Unescape',
    json_clear: 'Clear',
    json_valid: 'Valid JSON',
    json_error_at: 'Invalid JSON',

    csv_h1: 'JSON ⇄ CSV Converter',
    csv_h1_g: 'two-way',
    csv_lead: 'Turn a JSON array of objects into CSV, or parse CSV back to JSON.',
    csv_to_csv: 'JSON → CSV',
    csv_to_json: 'CSV → JSON',
    csv_delimiter: 'Delimiter',
    csv_header: 'First row is header',
    csv_clear: 'Clear',
    csv_invalid: 'Input is not a JSON array of objects.',

    diff_h1: 'Text Diff',
    diff_h1_g: 'line by line',
    diff_lead: 'Paste two versions and see what was added or removed.',
    diff_left: 'Original',
    diff_right: 'Modified',
    diff_compare: 'Compare',
    diff_clear: 'Clear',
    diff_added: 'added',
    diff_removed: 'removed',
    diff_same: 'unchanged',
    diff_summary: '{a} added · {r} removed',

    qr_h1: 'QR Code Generator & Scanner',
    qr_h1_g: 'make & read',
    qr_lead: 'Generate QR codes from text, or decode a QR image — all locally.',
    qr_content: 'Content',
    qr_generate: 'Generate',
    qr_size: 'Size',
    qr_margin: 'Margin',
    qr_decode_title: 'Decode from image',
    qr_decode: 'Decode',
    qr_decoded: 'Decoded content',
    qr_fail: 'No QR code found in the image.',
    qr_drop: 'Drop a QR image here',

    pw_h1: 'Password Generator',
    pw_h1_g: 'strong & random',
    pw_lead: 'Cryptographically random passwords with the character sets you choose.',
    pw_length: 'Length',
    pw_lower: 'lowercase a-z',
    pw_upper: 'UPPERCASE A-Z',
    pw_digits: 'digits 0-9',
    pw_symbols: 'symbols !@#…',
    pw_exclude: 'Exclude ambiguous (0O1lI)',
    pw_generate: 'Generate',
    pw_copy: 'Copy',
    pw_strength: 'Strength',
    pw_strength_weak: 'Weak',
    pw_strength_fair: 'Fair',
    pw_strength_strong: 'Strong',
    pw_strength_xstrong: 'Very strong',

    foot_tag: 'Free local utilities — files never leave your device.',
    footer_note: '100% local processing · no accounts · no uploads',
  },
  zh: {
    nav_home: '首页',
    nav_files: '文件工具',
    nav_text: '文本数据',
    nav_dev: '更多',
    badge_privacy: '本地处理 · 不上传任何内容',
    lang_label: '语言',

    home_title: '免费在线效率工具箱',
    home_page_title: 'Aixuno Devtools — 免费本地文件与开发者工具箱',
    home_title_grad: '全部本地处理',
    home_lead: 'MD5 修改器、哈希校验、时间戳转换、Base64、JSON 工具、文本对比、二维码与密码生成——每个工具都在浏览器中运行，文件永不离开你的设备。',
    home_badge1: '不上传',
    home_badge2: '免注册',
    home_badge3: '永久免费',
    home_files_title: '文件工具',
    home_text_title: '文本与数据工具',
    home_dev_title: '日常工具',

    t_md5_name: 'MD5 修改器',
    t_md5_desc: '不重编码改变文件 MD5 指纹，支持批量。',
    t_hash_name: '哈希校验器',
    t_hash_desc: '计算 MD5/SHA-1/SHA-256/512 并与期望值比对。',
    t_ts_name: '时间戳转换',
    t_ts_desc: 'Unix 时间戳 ⇄ 日期时间，ISO/UTC/本地格式，实时时钟。',
    t_b64_name: 'Base64 工具',
    t_b64_desc: '文本与文件的 Base64 编解码，UTF-8 安全。',
    t_url_name: 'URL 编解码',
    t_url_desc: '百分号编码/解码，并解析查询参数。',
    t_json_name: 'JSON 格式化',
    t_json_desc: '美化、压缩、校验与转义 JSON。',
    t_csv_name: 'JSON ⇄ CSV',
    t_csv_desc: 'JSON 数组与 CSV 互转，分隔符可选。',
    t_diff_name: '文本对比',
    t_diff_desc: '逐行对比两段文本，高亮增删。',
    t_qr_name: '二维码工具',
    t_qr_desc: '生成二维码，也能从图片识别。',
    t_pw_name: '密码生成器',
    t_pw_desc: '自定义字符集，生成高强度随机密码。',

    md5_h1: 'MD5 修改器',
    md5_h1_g: '不重编码秒改',
    md5_lead: '通过尾部追加随机字节改变文件 MD5——瞬间完成、全程本地、支持批量。适合文件版本标识与重新上传场景。',
    md5_drop: '拖拽文件到此处',
    md5_drop_hint: '任意类型 · 支持多选',
    md5_old: '原 MD5',
    md5_new: '新 MD5',
    md5_modify_all: '全部修改',
    md5_clear: '清空',
    md5_download_zip: '打包下载 (ZIP)',
    md5_modified: '已修改',
    md5_working: '处理中…',
    md5_empty: '请先添加至少一个文件。',

    hash_h1: '文件哈希校验',
    hash_h1_g: 'MD5 · SHA',
    hash_lead: '本地计算 MD5、SHA-1、SHA-256、SHA-512，并与期望值一键比对。',
    hash_drop: '拖拽文件到此处',
    hash_drop_hint: '支持大文件 · 分块计算',
    hash_expected: '期望值（可选）',
    hash_verify: '校验',
    hash_match: '一致',
    hash_mismatch: '不一致',
    hash_uploading: '正在计算…',

    ts_h1: '时间戳转换',
    ts_h1_g: 'epoch ⇄ 日期',
    ts_lead: 'Unix 时间戳与日期时间互转，附实时时钟。',
    ts_now: '当前时间',
    ts_to_date: '时间戳 → 日期',
    ts_to_ts: '日期 → 时间戳',
    ts_input_ts: 'Unix 时间戳（秒或毫秒）',
    ts_input_date: '日期时间',
    ts_result: '转换结果',
    ts_local: '本地',
    ts_utc: 'UTC',
    ts_iso: 'ISO 8601',
    ts_rel: '相对时间',
    ts_convert: '转换',

    b64_h1: 'Base64 编解码',
    b64_h1_g: '文本与文件',
    b64_lead: 'UTF-8 安全的 Base64 编码/解码，支持文件转 Base64。',
    b64_encode: '编码',
    b64_decode: '解码',
    b64_swap: '互换',
    b64_clear: '清空',
    b64_file: '文件 → Base64',
    b64_file_hint: '文件在本地读取，不上传',
    b64_too_large: '文件过大，不适合文本输出——请换小一点的文件。',

    url_h1: 'URL 编解码',
    url_h1_g: '百分号编码',
    url_lead: 'URL 转义与还原，并解析查询参数。',
    url_encode: '编码（组件）',
    url_encode_uri: '编码（完整 URL）',
    url_decode: '解码',
    url_clear: '清空',
    url_params: '查询参数',

    json_h1: 'JSON 格式化',
    json_h1_g: '美化与校验',
    json_lead: '美化、压缩、校验 JSON，错误定位到行。',
    json_format: '格式化',
    json_minify: '压缩',
    json_validate: '校验',
    json_escape: '转义',
    json_unescape: '去转义',
    json_clear: '清空',
    json_valid: 'JSON 有效',
    json_error_at: 'JSON 无效',

    csv_h1: 'JSON ⇄ CSV 转换',
    csv_h1_g: '双向互转',
    csv_lead: 'JSON 对象数组转 CSV，或 CSV 解析回 JSON。',
    csv_to_csv: 'JSON → CSV',
    csv_to_json: 'CSV → JSON',
    csv_delimiter: '分隔符',
    csv_header: '首行为表头',
    csv_clear: '清空',
    csv_invalid: '输入不是 JSON 对象数组。',

    diff_h1: '文本对比',
    diff_h1_g: '逐行比较',
    diff_lead: '粘贴两个版本，一眼看出增删。',
    diff_left: '原始文本',
    diff_right: '修改文本',
    diff_compare: '对比',
    diff_clear: '清空',
    diff_added: '新增',
    diff_removed: '删除',
    diff_same: '相同',
    diff_summary: '新增 {a} 行 · 删除 {r} 行',

    qr_h1: '二维码生成与识别',
    qr_h1_g: '生成与解析',
    qr_lead: '文本生成二维码，或从图片识别二维码——全部本地完成。',
    qr_content: '内容',
    qr_generate: '生成',
    qr_size: '尺寸',
    qr_margin: '边距',
    qr_decode_title: '从图片识别',
    qr_decode: '识别',
    qr_decoded: '识别结果',
    qr_fail: '图片中未识别到二维码。',
    qr_drop: '拖拽二维码图片到此处',

    pw_h1: '密码生成器',
    pw_h1_g: '高强度随机',
    pw_lead: '按你选择的字符集，用加密级随机源生成密码。',
    pw_length: '长度',
    pw_lower: '小写字母 a-z',
    pw_upper: '大写字母 A-Z',
    pw_digits: '数字 0-9',
    pw_symbols: '符号 !@#…',
    pw_exclude: '排除易混字符 (0O1lI)',
    pw_generate: '生成',
    pw_copy: '复制',
    pw_strength: '强度',
    pw_strength_weak: '弱',
    pw_strength_fair: '一般',
    pw_strength_strong: '强',
    pw_strength_xstrong: '极强',

    foot_tag: '免费本地效率工具——文件永不离开你的设备。',
    footer_note: '100% 本地处理 · 无账号 · 无上传',
  },
};

export const LANGUAGES = [
  { id: 'en', label: 'EN' },
  { id: 'zh', label: '中文' },
];

const STORAGE_KEY = 'aixuno-lang';
let current = detect();

function detect() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && STRINGS[saved]) return saved;
  } catch (err) {
    // ignore
  }
  const nav = (navigator.language || 'en').toLowerCase();
  return nav.startsWith('zh') ? 'zh' : 'en';
}

export function t(key, params) {
  let text = (STRINGS[current] && STRINGS[current][key]) || STRINGS.en[key] || key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return text;
}

export function getLang() {
  return current;
}

export function setLang(lang) {
  if (!STRINGS[lang] || lang === current) return;
  current = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (err) {
    // ignore
  }
  apply();
  window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

export function apply() {
  document.documentElement.lang = current === 'zh' ? 'zh-CN' : 'en';
  for (const el of document.querySelectorAll('[data-i18n]')) {
    const v = t(el.dataset.i18n);
    if (v != null) el.textContent = v;
  }
  for (const el of document.querySelectorAll('[data-i18n-placeholder]')) {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  }
}
