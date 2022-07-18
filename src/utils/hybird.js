import Events from './events';
import getEnv from './uaEnv';
import { getQueryString } from './element';

let isInitedConfig = false;
class Hybird extends Events {
  constructor() {
    super();
    this.timeout = 3000;
    this.appNames = [
      'ry',
      'rywvip',
      'maxlive',
      'higo',
      'mallwin',
      'cclive',
      'morewin'
    ];
    this.config = {};
    this.context = {};
  }
  get isInitedConfig() {
    return isInitedConfig;
  }
  get bridgeInstance() {
    return this.context.instance;
  }

  init() {
    this.env = getEnv();
    this.context = this.getContext();
  }

  isSupport() {
    const bool = !!(this.context && this.context.instance);
    bool || console.warn('native hybird is not support!');
    return bool;
  }

  getContext() {
    let contextName = '',
      isDynamic = false,
      instance = null;
    if (this.env.isAndroid) {
      // url动态设置app name (?app=maxlive)
      let dynamicNames = [];
      let appName = getQueryString('app');
      let cacheName = localStorage.getItem('APP_NAME');

      if ((appName = appName && appName.replace(/\s+/g, ''))) {
        dynamicNames.push(appName);
      }
      if ((cacheName = cacheName && cacheName.replace(/\s+/g, ''))) {
        dynamicNames.push(cacheName);
      }

      const allNames = dynamicNames.concat(this.appNames);

      for (let i = 0; i < allNames.length; i++) {
        // window[#id]可能获取到DOM元素
        const name = allNames[i];
        if (
          typeof window[name] === 'object' &&
          !(window[name] instanceof HTMLElement)
        ) {
          instance = window[name];
          contextName = name;
          isDynamic = !this.appNames.includes(name);
          break;
        }
      }

      localStorage.setItem('APP_NAME', contextName);
    } else {
      instance = window.webkit ? window.webkit.messageHandlers : null;
    }

    return {
      instance,
      name: contextName,
      isDynamic
    };
  }

  initConfig(cb) {
    const action = 'webConfig';
    this.timeoutBinding(action, (data) => {
      cb && cb(data.data);
      isInitedConfig = true;
      this.config = data.data;
      this.emit('init');
      if (data.isTimeout) {
        alert('webview initConfig is timeout!');
      }
    });
    if (this.isSupport()) {
      this.callApp(action);
    } else {
      this.emit(action, {});
    }
  }

  getConfig() {
    return new Promise((resolve, reject) => {
      if (this.isInitedConfig) {
        resolve(this.config);
      } else {
        this.once('init', (_) => resolve(this.config));
      }
    });
  }
  updateConfig(conf) {
    this.config = Object.assign({}, this.config, conf);
  }

  timeoutBinding(action, cb, timeout) {
    let isCalled = false,
      timeID = null;
    this.once(action, (data) => {
      isCalled = true;
      cb({ isTimeout: false, data });
      timeID && clearTimeout(timeID);
    });
    timeID = setTimeout(() => {
      if (!isCalled) {
        cb({ isTimeout: true });
      }
    }, timeout || this.timeout);
  }

  /**
   * APP调用web函数通信
   * @param {String} action 操作key
   * @param {Object} data 通信数据
   */
  callWeb(action, data) {
    this.emit(action, JSON.parse(data));
  }

  /**
   * 向APP通信
   * @param {String} action 操作key
   * @param {Array} dataArr 通信数据 [{k: 'prop', v: 'val'}]
   * @param {Boolean} multiple 安卓是否多参数调用
   */
  callApp(action, dataArr, multiple = true) {
    try {
      if (this.env.isAndroid) {
        if (dataArr) {
          if (multiple) {
            this.bridgeInstance[action](...dataArr.map((d) => d.v));
          } else {
            this.bridgeInstance[action](
              JSON.stringify(
                dataArr.reduce((obj, d) => {
                  obj[d.k] = d.v;
                  return obj;
                }, {})
              )
            );
          }
        } else {
          this.bridgeInstance[action]();
        }
      } else {
        if (dataArr) {
          this.bridgeInstance[action].postMessage(
            dataArr.reduce((obj, d) => {
              obj[d.k] = d.v;
              return obj;
            }, {})
          );
        } else {
          this.bridgeInstance[action].postMessage({});
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * 返回APP
   */
  back() {
    this.callApp('back');
  }

  /**
   * 打开浏览器
   * @param {*} url
   */
  openBrowser(url) {
    this.callApp('openBrowser', [{ k: 'url', v: url }]);
  }

  /**
   * 打开webview
   * @param {*} url
   * @param {*} title
   */
  openWebview(url, title = '') {
    const { name, isDynamic } = this.context;
    const api = this.config.api;
    if (
      name &&
      isDynamic &&
      (url.indexOf(location.origin) == 0 || url.indexOf(api) == 0) &&
      url.indexOf(`app=${name}`) < 0
    ) {
      url = /\?/.test(url) ? `${url}&app=${name}` : `${url}?app=${name}`;
    }

    this.callApp('openWebview', [
      { k: 'url', v: url },
      { k: 'title', v: title }
    ]);
  }

  /**
   * 打开聊天室房间
   * @param {*} roomId
   */
  openRoom(roomId) {
    this.callApp('openRoom', [{ k: 'roomId', v: roomId }]);
  }

  /**
   * 打开比赛房间
   * @param {*} roomId
   * @param {*} scheduleId
   */
  openMatchRoom(roomId, scheduleId) {
    this.callApp('openMatchRoom', [
      { k: 'roomId', v: roomId },
      { k: 'scheduleId', v: scheduleId }
    ]);
  }

  /**
   * 打开app支付
   * @param {*} type 充值类型 1: apple pay 2: google pay
   * @param {*} orderNo 充值订单号
   * @param {*} pId 产品id
   * @param {String} callback 成功回调函数全局名称
   */
  openPay({ type, orderNo, pId, callback }) {
    this.callApp(
      'openPay',
      [
        { k: 'type', v: type },
        { k: 'orderNo', v: orderNo },
        { k: 'pId', v: pId },
        { k: 'callback', v: callback }
      ],
      false
    );
  }

  /**
   * 获取状态栏高度
   * @param {*} 回调函数名称，调用的时候需要返回对应的状态栏高度
   */
  getStatusBarHeight(callback) {
    this.callApp('getStatusBarHeight', [{ k: 'callback', v: callback }]);
  }

  /**
   * 打开绑定手机框
   */
  openBindPhone(state = false) {
    this.callApp('openBindPhone', [{ k: 'state', v: state }]);
  }

  /**
   * 打开登陆页面
   */
  openLogin() {
    this.callApp('openLogin');
  }

  /**
   * 打开个人信息主页
   * @param {*} id
   * @returns
   */
  openPersonal(id) {
    this.callApp('openPersonal', [{ k: 'id', v: id }]);
  }

  /**
   * 打开模块
   * @param {*} actionPath
   * @returns
   */
  openActionPath(actionPath) {
    this.callApp('openActionPath', [{ k: 'actionPath', v: actionPath }]);
  }

  /**
   * 打开分享
   * @param {String} title 分享标题
   * @param {String} href 分享href
   * @param {String} img 分享图片base64
   * @returns
   */
  openShare(title, href, img) {
    this.callApp('openShare', [
      { k: 'title', v: title },
      { k: 'href', v: href },
      { k: 'img', v: img }
    ]);
  }

  /**
   * 发送归因事件
   * @param {String} eventName 事件名称
   * @param {Object} para 归因内容
   * @returns
   */
  sendAFEvent(eventName, para) {
    this.callApp('sendAFEvent', [
      { k: 'eventName', v: eventName },
      { k: 'para', v: JSON.stringify(para) }
    ]);
  }
}

const hybird = new Hybird();
if (typeof window !== 'undefined' && window) {
  window.callWeb = hybird.callWeb.bind(hybird);
}

export default hybird;
