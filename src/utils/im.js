import { getQueryString } from './element';
import { uuid, prinme } from './common';
import Events from './events';

let Chatroom;

/**
 * 聊天室im
 * 初始化并连接上im  init(options)
 * 绑定im接收事件 on(msgType, callback)  once(msgType, callback)  off(msgType, callback)
 * 发送自定义消息 sendCustomMsg(msg, options = {})
 *
 * 注：绑定im接收事件后，需要关注解绑事件的时机避免重复绑定事件问题
 */
class IM extends Events {
  constructor() {
    super();
    this.instance = null;
    this.xxteaKey = '';
  }
  /**
   * 初始化聊天室
   * @param {Boolean | Object} secure <optional> secure 模式下会通过 https 协议跟服务器建立连接, 非 secure 模式下会通过 http 协议跟服务器建立连接, 默认 true
   * @param {String} appKey 在云信管理后台查看应用的 appKey
   * @param {String} account 帐号, 应用内唯一
   * @param {String} token 帐号的 token, 用于建立连接
   * @param {String} chatroomId 聊天室 id
   * @param {Array} chatroomAddresses 聊天室地址列表
   * @param {String} pathdata im消息加解密key
   */
  init({
    secure = true,
    appKey,
    account,
    token,
    chatroomId,
    chatroomAddresses,
    pathdata
  }) {
    this.isDebug = getQueryString('debug');
    this.clientId = uuid();
    this.secure = secure;
    this.appKey = appKey;
    this.account = account;
    this.token = token;
    this.chatroomAddresses = chatroomAddresses;
    this.chatroomId = chatroomId;
    this.pathdata = pathdata;
    // 是否游客登录
    this.isAnonymous = !this.token;
    return this.initChatroom();
  }
  getXxteaKey() {
    return this.xxteaKey || (this.xxteaKey = prinme(this.pathdata));
  }
  xxteaEncode(str) {
    return window.XXTEA.encryptToBase64(str, this.getXxteaKey());
  }
  xxteaDecode(str) {
    return window.XXTEA.decryptFromBase64(str, this.getXxteaKey());
  }
  /**
   * 云信IMListener
   * https://dev.yunxin.163.com/docs/interface/即时通讯Web端/NIMSDK-Web/Chatroom.html#Chatroom__anchor
   */
  initChatroom() {
    // 此接口为单例模式, 对于同一个账号, 永远返回同一份实例, 即只有第一次调用会初始化一个实例
    // 后续调用此接口会直接返回初始化过的实例, 同时也会调用接口setOptions更新传入的配置
    // 后续调用此接口时, 如果连接已断开, 会自动建立连接
    // 当发生掉线时，SDK会自动进行重连
    if (!Chatroom) {
      Chatroom = require('@/assets/NIM_Web_Chatroom_v9.0.1');
    }

    const options = {
      secure: this.secure,
      appKey: this.appKey,
      chatroomId: this.chatroomId,
      chatroomAddresses: this.chatroomAddresses,
      chatroomNick: this.account || 'nickname',
      chatroomAvatar: 'avatar',
      isAnonymous: this.isAnonymous,
      onconnect: this.onconnect.bind(this),
      onwillreconnect: this.onwillreconnect.bind(this),
      ondisconnect: this.ondisconnect.bind(this),
      onerror: this.onerror.bind(this),
      onmsgs: this.onmsgs.bind(this)
    };
    if (!this.isAnonymous) {
      options.account = this.account;
      options.token = this.token;
    }
    this.instance = (this.Chatroom = Chatroom).getInstance(options);

    return this.instance;
  }
  onconnect(obj) {
    console.log(`进入聊天室`);
    if (this.isAnonymous) {
      this.account = obj.member.account;
    }
    this.emit('connect', obj);
  }
  onwillreconnect(obj) {
    console.warn(`连接断开重连中......`);
    this.emit('onwillreconnect', obj);
  }
  ondisconnect(obj) {
    console.warn('连接被断开');
    this.emit('disconnect', obj);
  }
  onerror(err) {
    console.error(err);
    this.emit('error', err);
  }
  onmsgs(msgs) {
    try {
      let _that = this;
      for (let item of msgs) {
        // 闭包防止污染全局
        (function (data) {
          let _tmp = _that.xxteaDecode(JSON.parse(data.custom).ext);
          if (_that.isDebug) {
            console.log(_tmp);
          }
          _that.receive(JSON.parse(_tmp));
        })(item);
      }
    } catch (ex) {
      console.error(`接受消息异常：${ex}`, msgs);
    }
  }
  /**
   * 聊天室消息
   * @param {String} msgUuid 消息uuid
   * @param {Number} msgType 消息类型
   * @param {Number} anchorId 主播id
   * @param {Object} data 消息体
   * @param {Number} sendTime 消息发送时刻 ms
   *
   *  100	普通文本消息
   *  101	艾特某个人
   *  102	运营商公告
   *  103	弹幕
   *
   *  500	异常闪退
   *  501	用户全局禁言状态
   *  502	用户房间禁言状态
   *  503	用户踢出房间状态
   *  504	用户禁播状态
   *  505	用户账号禁用状态
   *  506	添加取消房管
   *  507	拉黑状态
   *
   *  521	屏蔽消息(消息状态)
   *  541	直播状态
   *  542	常规房间上播
   *  543	常规房间复播
   *  551	房间锁消息
   *  552	房间主播离开
   *
   *  1114	推送房间人数统计
   *  1115	进入房间
   *  1116	打赏（礼物）结果
   *  1117	打赏榜前三
   *  1118	在线列表前二十
   *  1119	打赏中奖全房间通知
   *  1201	红包雨
   *
   *  1301	弹幕（作废）
   *  1302	跑马灯
   *  1303	置顶
   *  1304	主播被关注
   *  1305	删除跑马灯
   *  1306	晋升通知
   *  1307	进场特效
   *
   */
  receive(msg) {
    let { msgType } = msg;
    // console.log(msgType, msg)
    this.emit(msgType, msg);
  }

  /**
   * 云信api推送自定义消息
   * https://dev.yunxin.163.com/docs/interface/即时通讯Web端/NIMSDK-Web/Chatroom.html#sendCustomMsg__anchor
   * @param {Object} msg 自定义消息体
   * @param {Object} options 配置参数
   */
  sendCustomMsg(msg, options = {}) {
    return new Promise((resolve, reject) => {
      const defaultOptions = {
        content: 'LiveChat'
      };
      const ext = JSON.stringify(Object.assign({ msgUuid: uuid() }, msg));
      this.instance.sendCustomMsg(
        Object.assign(defaultOptions, options, {
          custom: JSON.stringify({
            ext: this.xxteaEncode(ext)
          }),
          done: (error, data) => {
            options.done && options.done(error, data);
            if (error) {
              reject(error);
            } else {
              this.onmsgs([data]);
              resolve(data);
            }
          }
        })
      );
    });
  }

  destroy() {
    this.instance && this.instance.disconnect();
    this.clearEvent();
    this.instance = null;
    this.xxteaKey = '';
  }
}

export default IM;
