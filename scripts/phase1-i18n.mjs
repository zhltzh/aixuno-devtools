import { readFileSync, writeFileSync } from 'node:fs';

const additions = {
  en: {
    t_date_name: 'Date Calculator', t_date_desc: 'Difference between two dates, workdays, add/subtract days.',
    date_h1: 'Date Calculator', date_h1_g: 'diff & countdown', date_lead: 'Date differences, day arithmetic and countdowns — all in your browser.',
    date_diff_title: 'Difference between two dates', date_from: 'From', date_to: 'To', date_calc: 'Calculate',
    date_days: 'Days', date_weeks: 'Weeks', date_months: 'Months', date_workdays: 'Workdays (Mon–Fri)',
    date_add_title: 'Add / subtract days', date_base: 'Base date', date_offset: 'Days (±)', date_result: 'Result',

    t_tax_name: 'Income Tax Calculator', t_tax_desc: 'China IIT estimate from salary, social insurance and deductions.',
    tax_h1: 'Income Tax Calculator', tax_h1_g: 'China IIT', tax_lead: 'Estimate monthly individual income tax from gross salary, social insurance and special deductions.',
    tax_gross: 'Gross monthly salary (¥)', tax_social: 'Social insurance & housing fund (¥/month)', tax_special: 'Special additional deductions (¥/month)', tax_calc: 'Calculate',
    tax_result: 'Result (monthly average)', tax_annual_taxable: 'Annual taxable income', tax_monthly_taxable: 'Monthly taxable income', tax_monthly_tax: 'Monthly tax', tax_after_tax: 'Net after tax', tax_note: 'Reference only — actual withholding uses the cumulative method.',

    t_mort_name: 'Mortgage Calculator', t_mort_desc: 'Monthly payment, interest and amortization for both methods.',
    mort_h1: 'Mortgage Calculator', mort_h1_g: 'annuity & principal', mort_lead: 'Monthly payment, total interest and amortization details for both repayment methods.',
    mort_amount: 'Loan amount (¥)', mort_rate: 'Annual rate (%)', mort_years: 'Term (years)', mort_calc: 'Calculate',
    mort_annuity: 'Equal installment (等额本息)', mort_principal: 'Equal principal (等额本金)',
    mort_result: 'Result', mort_monthly_pay: 'Monthly payment', mort_total_interest: 'Total interest', mort_total_pay: 'Total payment',
    mort_first_pay: 'First month payment', mort_last_pay: 'Last month payment', mort_decrease: 'Decreases each month', mort_each_month: 'avg',
    mort_sched: 'Amortization (first 12 months)', mort_month: '#', mort_payment: 'Payment', mort_interest: 'Interest', mort_principal_col: 'Principal', mort_balance: 'Balance',

    t_rand_name: 'Random Picker', t_rand_desc: 'Draw random names or items from a list — no repeats.',
    rand_h1: 'Random Picker', rand_h1_g: 'fair draw', rand_lead: 'Paste a list (one item per line) and draw random winners.',
    rand_list: 'List — one item per line', rand_count: 'How many?', rand_unique: 'No repeats', rand_pick: 'Draw', rand_clear: 'Clear', rand_result: 'Winners',

    t_word_name: 'Word Counter', t_word_desc: 'Characters, CJK, words, sentences and bytes — live.',
    word_h1: 'Word Counter', word_h1_g: 'live stats', word_lead: 'Paste text and get every useful count instantly.',
    word_chars_all: 'Characters', word_chars_no_space: 'No spaces', word_cjk: 'Chinese chars', word_words_en: 'English words', word_lines: 'Lines', word_paragraphs: 'Paragraphs', word_sentences: 'Sentences', word_punct: 'Punctuation',

    t_unit_name: 'Unit Converter', t_unit_desc: 'Length, weight, temperature, area, data, speed.',
    unit_h1: 'Unit Converter', unit_h1_g: 'everyday units', unit_lead: 'Length, weight, temperature, area, data and speed — instant conversion.',
    unit_category: 'Category', unit_from: 'From', unit_to: 'To', unit_swap: 'Swap',

    t_regex_name: 'Regex Tester', t_regex_desc: 'Live pattern matching with highlights and capture groups.',
    rx_h1: 'Regex Tester', rx_h1_g: 'live matches', rx_lead: 'Type a pattern, paste text, see matches and capture groups instantly.',
    rx_matches: 'Matches', rx_matches_count: 'matches', rx_groups: 'Capture groups',

    t_jwt_name: 'JWT Decoder', t_jwt_desc: 'Inspect token header, payload and expiry — locally.',
    jwt_h1: 'JWT Decoder', jwt_h1_g: 'header & payload', jwt_lead: 'Paste a JWT to inspect its header, payload and expiry — signature is not verified.',
    jwt_decode: 'Decode', jwt_exp: 'Expiry', jwt_iat: 'Issued at', jwt_nbf: 'Not before', jwt_expired: 'expired',

    t_uuid_name: 'UUID Generator', t_uuid_desc: 'Bulk random UUID v4, cryptographically secure.',
    uuid_h1: 'UUID Generator', uuid_h1_g: 'v4 bulk', uuid_lead: 'Cryptographically random RFC 4122 v4 UUIDs — generate in bulk and copy.',
    uuid_generate: 'Generate', uuid_count: 'Count', uuid_copy_all: 'Copy all',

    t_cron_name: 'Cron Tool', t_cron_desc: 'Plain-language cron explanation and next run times.',
    cron_h1: 'Cron Expression Tool', cron_h1_g: 'explain & preview', cron_lead: 'Plain-language explanation plus the next 5 run times for any cron expression.',
    cron_parse: 'Parse', cron_next: 'Next 5 runs',

    t_html_name: 'HTML Entities', t_html_desc: 'Escape and unescape HTML named/numeric entities.',
    html_h1: 'HTML Entities Tool', html_h1_g: 'escape & unescape', html_lead: 'Escape HTML for safe embedding, or convert entities back to text.',
    html_encode: 'Escape', html_decode: 'Unescape', html_clear: 'Clear',

    t_color_name: 'Color Tool', t_color_desc: 'HEX/RGB/HSL conversion with shades and complements.',
    color_h1: 'Color Tool', color_h1_g: 'HEX · RGB · HSL', color_lead: 'Pick a color, get every format plus shades and a complementary color.',
    color_formats: 'Formats', color_shades: 'Shades & complementary', color_complement: 'Complementary — click to copy',
  },
  zh: {
    t_date_name: '日期计算器', t_date_desc: '两日期差值、工作日、日期加减。',
    date_h1: '日期计算器', date_h1_g: '差值与倒推', date_lead: '日期差值、工作日统计、日期加减——全部在浏览器中完成。',
    date_diff_title: '两个日期的差值', date_from: '开始日期', date_to: '结束日期', date_calc: '计算',
    date_days: '天数', date_weeks: '周数', date_months: '月数', date_workdays: '工作日（周一至周五）',
    date_add_title: '日期加减', date_base: '基准日期', date_offset: '天数（±）', date_result: '结果',

    t_tax_name: '个税计算器', t_tax_desc: '输入月薪、五险一金，估算个人所得税。',
    tax_h1: '个税计算器', tax_h1_g: '2024 税率表', tax_lead: '输入税前月薪、五险一金与专项附加扣除，估算每月个人所得税。',
    tax_gross: '税前月薪（¥）', tax_social: '五险一金（¥/月）', tax_special: '专项附加扣除（¥/月）', tax_calc: '计算',
    tax_result: '结果（月均）', tax_annual_taxable: '年度应纳税所得额', tax_monthly_taxable: '月度应纳税所得额', tax_monthly_tax: '每月应缴税额', tax_after_tax: '税后到手', tax_note: '结果仅供参考——实际以累计预扣法为准。',

    t_mort_name: '房贷计算器', t_mort_desc: '等额本息/等额本金月供、利息与还款明细。',
    mort_h1: '房贷计算器', mort_h1_g: '本息 & 本金', mort_lead: '等额本息与等额本金两种方式的月供、总利息和还款明细。',
    mort_amount: '贷款总额（¥）', mort_rate: '年利率（%）', mort_years: '期限（年）', mort_calc: '计算',
    mort_annuity: '等额本息', mort_principal: '等额本金',
    mort_result: '计算结果', mort_monthly_pay: '每月月供', mort_total_interest: '总利息', mort_total_pay: '还款总额',
    mort_first_pay: '首月月供', mort_last_pay: '末月月供', mort_decrease: '每月递减', mort_each_month: '平均',
    mort_sched: '还款明细（前 12 期）', mort_month: '期数', mort_payment: '月供', mort_interest: '利息', mort_principal_col: '本金', mort_balance: '剩余本金',

    t_rand_name: '随机抽取器', t_rand_desc: '从名单中随机抽取，抽奖点名都可用。',
    rand_h1: '随机抽取器', rand_h1_g: '公平随机', rand_lead: '粘贴名单（一行一个），一键随机抽取。',
    rand_list: '名单——一行一个', rand_count: '抽取数量', rand_unique: '不允许重复', rand_pick: '抽取', rand_clear: '清空', rand_result: '抽取结果',

    t_word_name: '字数统计', t_word_desc: '字符、汉字、单词、句子、字节，实时统计。',
    word_h1: '字数统计', word_h1_g: '实时统计', word_lead: '粘贴文本，所有常用统计一目了然。',
    word_chars_all: '字符数', word_chars_no_space: '不含空格', word_cjk: '中文汉字', word_words_en: '英文单词', word_lines: '行数', word_paragraphs: '段落数', word_sentences: '句子数', word_punct: '标点符号',

    t_unit_name: '单位换算', t_unit_desc: '长度、重量、温度、面积、数据、速度。',
    unit_h1: '单位换算', unit_h1_g: '常用单位', unit_lead: '长度、重量、温度、面积、数据存储与速度——即时换算。',
    unit_category: '类别', unit_from: '从', unit_to: '到', unit_swap: '互换',

    t_regex_name: '正则测试器', t_regex_desc: '实时匹配高亮与捕获组，开发调试利器。',
    rx_h1: '正则测试器', rx_h1_g: '实时匹配', rx_lead: '输入表达式、粘贴文本，即时查看匹配与捕获组。',
    rx_matches: '匹配结果', rx_matches_count: '处匹配', rx_groups: '捕获组',

    t_jwt_name: 'JWT 解码', t_jwt_desc: '本地解析 Token 的头部、载荷与过期时间。',
    jwt_h1: 'JWT 解码器', jwt_h1_g: '头部与载荷', jwt_lead: '粘贴 JWT 查看头部、载荷与过期时间——不做签名验证。',
    jwt_decode: '解码', jwt_exp: '过期时间', jwt_iat: '签发时间', jwt_nbf: '生效时间', jwt_expired: '已过期',

    t_uuid_name: 'UUID 生成器', t_uuid_desc: '批量生成加密级随机 UUID v4。',
    uuid_h1: 'UUID 生成器', uuid_h1_g: 'v4 批量', uuid_lead: '加密级随机的 RFC 4122 v4 标识符——批量生成一键复制。',
    uuid_generate: '生成', uuid_count: '数量', uuid_copy_all: '复制全部',

    t_cron_name: 'Cron 工具', t_cron_desc: '用大白话解释 Cron 并预览下次执行时间。',
    cron_h1: 'Cron 表达式工具', cron_h1_g: '解释与预览', cron_lead: '任意 Cron 表达式，白话解释 + 未来 5 次执行时间。',
    cron_parse: '解析', cron_next: '未来 5 次执行',

    t_html_name: 'HTML 实体', t_html_desc: 'HTML 实体转义与还原。',
    html_h1: 'HTML 实体工具', html_h1_g: '转义与还原', html_lead: '把 HTML 转义成安全文本，或把实体还原回原文。',
    html_encode: '转义', html_decode: '还原', html_clear: '清空',

    t_color_name: '颜色工具', t_color_desc: 'HEX/RGB/HSL 互转，含色阶与互补色。',
    color_h1: '颜色工具', color_h1_g: 'HEX · RGB · HSL', color_lead: '选一个颜色，得到全部格式、色阶变体与互补色。',
    color_formats: '格式', color_shades: '色阶与互补色', color_complement: '互补色——点击复制',
  },
};

for (const locale of ['zh', 'en']) {
  const path = `src/i18n.js`;
  let s = readFileSync(path, 'utf8');
  const anchor = locale === 'en' ? "    foot_tag: 'Free local utilities" : "    foot_tag: '免费本地效率工具";
  const idx = s.indexOf(anchor);
  if (idx < 0) throw new Error('anchor not found for ' + locale);
  const block = Object.entries(additions[locale])
    .map(([k, v]) => `    ${k}: ${JSON.stringify(v)},`)
    .join('\n');
  s = s.slice(0, idx) + block + '\n\n' + s.slice(idx);
  writeFileSync(path, s);
  console.log(locale, 'injected', Object.keys(additions[locale]).length, 'keys');
}
