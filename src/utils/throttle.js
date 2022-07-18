import { getDataType } from './common';
import debounce from './debounce';

/**
 * 节流函数 间隔wait时间执行
 */
export function throttle(func, wait, options) {
  let leading = true;
  let trailing = true;

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  if (getDataType(options) === 'object') {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    leading,
    trailing,
    maxWait: wait
  });
}

export default throttle;
