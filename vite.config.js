import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        'md5-modifier': resolve(__dirname, 'md5-modifier.html'),
        'hash-calculator': resolve(__dirname, 'hash-calculator.html'),
        timestamp: resolve(__dirname, 'timestamp.html'),
        base64: resolve(__dirname, 'base64.html'),
        'url-encode': resolve(__dirname, 'url-encode.html'),
        'json-format': resolve(__dirname, 'json-format.html'),
        'json-csv': resolve(__dirname, 'json-csv.html'),
        'text-diff': resolve(__dirname, 'text-diff.html'),
        qrcode: resolve(__dirname, 'qrcode.html'),
        password: resolve(__dirname, 'password.html'),
      },
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5174,
  },
});
