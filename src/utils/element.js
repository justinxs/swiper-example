export function isDom(dom) {
  return dom instanceof HTMLElement;
}

/**
 * url 查询参数
 * @param {string|Array} name 键名
 */
export function getQueryString(name) {
  const hashReg = /(\?.*)/;
  const getVal = (key, queryString) => {
    const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i');
    const r = queryString.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  };
  let queryString = window.location.search;
  let hashQueryMatches = hashReg.exec(window.location.hash);
  if (hashQueryMatches && hashQueryMatches[1]) {
    queryString = queryString
      ? queryString + hashQueryMatches[1].replace(/^\?/, '&')
      : hashQueryMatches[1];
  }

  return Array.isArray(name)
    ? name.map((n) => getVal(n, queryString))
    : getVal(name, queryString);
}

/**
 *  iOS系统设备触摸行为
 */
export function iOSTouch(isPreventDouble = false) {
  if (/(iPhone|iPad|iPod|iOS)/gi.test(navigator.userAgent)) {
    //  iOS系统设备激活标签:active状态
    document.body.addEventListener('touchstart', () => {});
    // 阻止iOS双击缩放
    if (isPreventDouble) {
      let lastTouchEnd = 0;
      document.addEventListener(
        'touchend',
        (e) => {
          let now = Date.now();
          if (now - lastTouchEnd <= 300) {
            e.preventDefault();
          }
          lastTouchEnd = now;
        },
        false
      );
    }
  }
}

/**
 * 代理a标签点击默认事件
 * @param {HTMLElement|String} parent 被代理a标签的父元素
 * @param {Function} cb 代理事件回调
 *
 * @returns {Object} clear 解绑事件
 */
export function proxyAtag(parent, cb) {
  parent = isDom(parent) ? parent : document.querySelector(parent);

  if (!parent) return console.error(`parent is undefined!`);
  const getAtag = (target) => {
    if (target.nodeName === 'A') {
      return target;
    }
    if (target === parent || !target) {
      return null;
    }

    return getAtag(target.parentNode);
  };
  const listener = (e) => {
    let target = e.target;
    if ((target = getAtag(target))) {
      e.preventDefault();
      cb &&
        cb(
          {
            href: target.getAttribute('href'),
            target: target.getAttribute('target')
          },
          e
        );
    }
  };

  parent.addEventListener('click', listener);

  return { clear: () => parent.removeEventListener('click', listener) };
}

/**
 * 获取localStorage
 * @param {String} cacheKey 存储key
 *
 * @returns {*} 返回存储数据
 */
export const getLocal = (cacheKey) => {
  let data = localStorage.getItem(cacheKey);
  return data && JSON.parse(data);
};

/**
 * 存储localStorage
 * @param {String} cacheKey 存储key
 * @param {*} data 存储数据
 */
export const setLocal = (cacheKey, data) => {
  if (data !== undefined) {
    localStorage.setItem(cacheKey, JSON.stringify(data));
  }
};

/**
 * 获取sessionStorage
 * @param {String} cacheKey 存储key
 *
 * @returns {*} 返回存储数据
 */
export const getSession = (cacheKey) => {
  let data = sessionStorage.getItem(cacheKey);
  return data && JSON.parse(data);
};

/**
 * 存储sessionStorage
 * @param {String} cacheKey 存储key
 * @param {*} data 存储数据
 */
export const setSession = (cacheKey, data) => {
  if (data !== undefined && data !== null) {
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
  }
};

export function getScrollTop(el) {
  const top = 'scrollTop' in el ? el.scrollTop : el.pageYOffset; // iOS scroll bounce cause minus scrollTop
  return Math.max(top, 0);
}

export function setScrollTop(el, value) {
  if ('scrollTop' in el) {
    el.scrollTop = value;
  } else {
    el.scrollTo(el.scrollX, value);
  }
}
