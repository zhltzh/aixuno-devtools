// canvas 绘制核心（纯 ctx 函数，页面与测试共用）

function wrapText(ctx, text, maxWidth) {
  const lines = [];
  let line = '';
  for (const ch of text) {
    if (ch === '\n') {
      lines.push(line);
      line = '';
      continue;
    }
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line.length > 0) {
      lines.push(line);
      line = ch === ' ' ? '' : ch;
    } else {
      line = test;
    }
  }
  lines.push(line);
  return lines;
}

/**
 * 经典表情包：图片 + 上下白色描边大写文字
 * canvas 尺寸需预先设置为绘制尺寸（img fit 后）。
 */
export function drawMeme(ctx, canvasW, canvasH, { topText = '', bottomText = '', fontSizeRatio = 0.09 } = {}) {
  const fontSize = Math.max(14, Math.round(Math.min(canvasW, canvasH) * fontSizeRatio));
  ctx.font = `bold ${fontSize}px Impact, "Arial Black", sans-serif`;
  ctx.textAlign = 'center';
  ctx.lineWidth = Math.max(2, fontSize * 0.12);
  ctx.strokeStyle = '#000';
  ctx.fillStyle = '#fff';
  const maxWidth = canvasW * 0.94;

  const draw = (rawText, fromTop) => {
    const text = (rawText || '').toUpperCase().trim();
    if (!text) return;
    const lines = wrapText(ctx, text, maxWidth);
    const startY = fromTop
      ? fontSize * 1.1
      : canvasH - (fontSize * 0.45) - (lines.length - 1) * fontSize * 1.1;
    lines.forEach((line, i) => {
      const y = startY + i * fontSize * 1.1;
      ctx.strokeText(line, canvasW / 2, y);
      ctx.fillText(line, canvasW / 2, y);
    });
  };
  draw(topText, true);
  draw(bottomText, false);
}

/**
 * 截图美化：渐变背景 + 圆角截图 + 投影
 * 返回输出画布尺寸，由调用方设置 canvas。
 */
export function beautifySize(imgW, imgH, padding) {
  return {
    width: imgW + padding * 2,
    height: imgH + padding * 2,
  };
}

export function drawBeautify(ctx, img, { padding = 40, gradient = ['#2f6bff', '#8b5cf6'], radius = 16 } = {}) {
  const W = img.width + padding * 2;
  const H = img.height + padding * 2;
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, gradient[0]);
  grad.addColorStop(1, gradient[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const r = Math.min(radius, Math.min(img.width, img.height) / 2);
  const x = padding;
  const y = padding;
  const w = img.width;
  const h = img.height;
  const roundPath = () => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  ctx.save();
  ctx.shadowColor = 'rgba(10, 15, 30, 0.35)';
  ctx.shadowBlur = padding * 0.5;
  ctx.shadowOffsetY = padding * 0.12;
  roundPath();
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundPath();
  ctx.clip();
  ctx.drawImage(img, x, y, w, h);
  ctx.restore();

  return { width: W, height: H };
}
