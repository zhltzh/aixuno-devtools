import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const pages = [
  'index',
  'md5-modifier',
  'hash-calculator',
  'timestamp',
  'base64',
  'url-encode',
  'json-format',
  'json-csv',
  'text-diff',
  'qrcode',
  'password',
  'date-calculator',
  'tax-calculator',
  'mortgage-calculator',
  'random-picker',
  'word-counter',
  'unit-converter',
  'regex-tester',
  'jwt-decoder',
  'uuid-generator',
  'cron-parser',
  'html-entities',
  'color-tool',
];

export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    rollupOptions: {
      input: Object.fromEntries(pages.map((p) => [p, resolve(__dirname, `${p}.html`)])),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5174,
  },
});
