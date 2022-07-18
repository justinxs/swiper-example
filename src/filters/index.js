/**
 * 时间格式化
 * time 时间（s）
 * formatStr 格式
 * defaultVal 默认值
 */
export function formatTime(time, formatStr, defaultVal) {
  formatStr = formatStr || 'YYYY/MM/dd hh:mm:ss';
  time = Number(time);
  return time > 0 ? new Date(time).format(formatStr) : defaultVal || '';
}

formatTime.isRootMethod = true;

/**
 * 格式化秒数
 * seconds 秒数
 * formatStr  格式
 * defaultVal 默认值
 */
export function formatSeconds(seconds, formatStr, defaultVal) {
  let value = defaultVal || '00:00';
  formatStr = formatStr || 'mm:ss';
  seconds = Number(seconds);

  if (seconds > 0) {
    let h = Math.floor(seconds / (60 * 60));
    let hh = h < 10 ? '0' + h : h;
    let m = Math.floor(seconds / 60);
    let mm = m < 10 ? '0' + m : m;
    let s = seconds % 60;
    let ss = s < 10 ? '0' + s : s;

    if (/h/gi.test(formatStr)) {
      m = m - h * 60;
      mm = m < 10 ? '0' + m : m;
    }

    value = formatStr.replace(/(h+)|(m+)|(s+)/gi, (match, p1, p2, p3) => {
      let result = match;
      if (p1) {
        result = p1.length > 1 ? hh : h;
      }
      if (p2) {
        result = p2.length > 1 ? mm : m;
      }
      if (p3) {
        result = p3.length > 1 ? ss : s;
      }
      return result;
    });
  }
  return value;
}

formatSeconds.isRootMethod = true;

/**
 * 数字分割
 * 100000 => 100,000
 */
export function seperateNumber(num, radix = 3) {
  if (!Number(num) || !radix) return num;
  let [initStr, floatStr = ''] = String(num).split('.');
  let prefix = '',
    len = initStr.length;
  floatStr = floatStr ? '.' + floatStr : '';
  if (/^-/.test(initStr)) {
    prefix = '-';
    initStr = initStr.slice(1);
    len--;
  }
  if (len <= radix) {
    return num;
  }
  let times = Math.ceil(len / radix),
    start = len - (times - 1) * radix;
  initStr = Array.from({ length: times }, (v, i) => {
    if (i == 0) {
      return initStr.slice(0, start);
    } else {
      return initStr.slice(radix * (i - 1) + start, radix * i + start);
    }
  }).join(',');

  return prefix + initStr + floatStr;
}

seperateNumber.isRootMethod = true;

/**
 * 金额简写
 * 1k 一千
 * 1M 一百万
 * 1B 一百亿
 */
export function shortAmount(num, steps) {
  let numStr = Number(num) ? String(parseInt(num)) : '';
  let prefix = '';
  if (/^-/.test(numStr)) {
    prefix = '-';
    numStr = numStr.slice(1);
  }
  steps = steps || [
    { len: 3, sub: 'k' },
    { len: 6, sub: 'M' },
    { len: 9, sub: 'B' }
  ];
  steps = steps.slice().sort((a, b) => b.len - a.len);
  for (let i = 0; i < steps.length; i++) {
    const item = steps[i];
    if (numStr.length > item.len) {
      return prefix + numStr.slice(0, -item.len) + item.sub;
    }
  }

  return num;
}

shortAmount.isRootMethod = true;
