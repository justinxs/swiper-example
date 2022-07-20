import { QWebChannel } from 'qwebchannel';
import Events from './events';

/**
 * qtchannel建立通信通道，bridgeName => 通道属性名，connectName => 接收qt消息属性名, sendName => 发送消息属性名 isDev => 是否开发环境
 * 发送消息 sendMessage(msg)
 * 回调方式使用 getBridge(qtBridge => {})
 * 接收消息事件绑定 on(eventName, callback) once(eventName, callback) off(eventName, callback)
 */
class QT extends Events {
  constructor({ bridgeName, connectName, sendName }, isDev = true) {
    this.isDev = isDev;
    this.bridgeName = bridgeName;
    this.connectName = connectName;
    this.sendName = sendName;
    this.qtBridge = null;
    this.waitQueue = [];
    this.buildBridge();
  }
  buildBridge() {
    const install = () => {
      new QWebChannel(window.qt.webChannelTransport, (channel) => {
        this.qtBridge = channel.objects[this.bridgeName];
        this.waitQueue.forEach((cb) => cb(this.qtBridge));
        this.waitQueue = [];
        // this.connectName && this.qtBridge[this.connectName].connect(this.eventHandle.bind(this));
      });
      // 接收qt消息
      window[this.connectName] = this.eventHandle.bind(this);
    };
    if (
      document.readyState === 'complete' ||
      (document.readyState !== 'loading' &&
        window.qt &&
        window.qt.webChannelTransport)
    ) {
      window.setTimeout(install);
    } else {
      window.addEventListener('load', install);
    }
  }
  getBridge(callback) {
    if (!this.qtBridge) {
      console.warn('qtBridge is not inited now');
      callback && this.waitQueue.push(callback);
    } else {
      callback && callback(this.qtBridge);
    }
  }
  sendMessage(message) {
    this.getBridge((qtBridge) => {
      qtBridge[this.sendName](JSON.stringify(message));
    });
  }
  eventHandle(message) {
    this.emit(message.action, message, message.callbackId);
  }
  destroy() {
    this.qtBridge = null;
    this.waitQueue = [];
    this.clearEvent();
  }
}
export default QT;
