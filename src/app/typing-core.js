// 打字测速核心（纯函数，页面与测试共用）

export function compareChars(target, typed) {
  let correct = 0;
  let wrong = 0;
  const n = Math.min(target.length, typed.length);
  for (let i = 0; i < n; i++) {
    if (target[i] === typed[i]) correct++;
    else wrong++;
  }
  return {
    correct,
    wrong,
    typedLength: typed.length,
    complete: typed.length >= target.length,
  };
}

export function typingStats(correct, totalTyped, seconds) {
  const minutes = seconds / 60;
  const wpm = minutes > 0 ? Math.round(correct / 5 / minutes) : 0;
  const cpm = minutes > 0 ? Math.round(correct / minutes) : 0;
  const accuracy = totalTyped > 0 ? Math.round((correct / totalTyped) * 100) : 100;
  return { wpm, cpm, accuracy, seconds };
}
