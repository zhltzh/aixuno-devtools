import { initLayout } from '../layout.js';

initLayout('html-entities');

const io = document.getElementById('io');

const NAMED = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

document.getElementById('btn-enc').addEventListener('click', () => {
  io.value = io.value.replace(/[&<>"']/g, (c) => NAMED[c]);
});

document.getElementById('btn-dec').addEventListener('click', () => {
  io.value = io.value
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, name) => {
      const map = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
      return map[name];
    });
});

document.getElementById('btn-clear').addEventListener('click', () => {
  io.value = '';
});
