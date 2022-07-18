/**
 * 唯一id
 */
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function hasOwnProperty(target, prop) {
  return Object.prototype.hasOwnProperty.call(target, prop);
}

function isObj(target) {
  return Object.prototype.toString.call(target) === '[object Object]';
}

/**
 * 筛选真实参数
 */
function getRealParams(params) {
  if (!params || !isObj(params)) {
    return params;
  }
  return Object.keys(params).reduce((result, key) => {
    const value = params[key];
    if (value !== null && value !== undefined) {
      result[key] = value;
    }
    return result;
  }, {});
}

// 判断一个数是否是素数
function isPrinme(num) {
  if (num <= 3) {
    return num > 1;
  } else {
    let sq = Math.sqrt(num);
    for (let i = 2; i <= sq; i++) {
      if (num % i === 0) {
        return false;
      }
    }
    return true;
  }
}

/**
 * 获取字符串中下标为素数/质数的字符集合
 * @param {String} str
 */
function prinme(str) {
  return str
    ? str
        .split('')
        .filter((v, i) => isPrinme(i))
        .join('')
    : '';
}

module.exports = {
  uuid,
  getRealParams,
  hasOwnProperty,
  isObj,
  prinme
};
