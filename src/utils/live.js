import getEnv from './uaEnv';

let AgoraRTC;
let ZegoExpressEngine;

function isDevEnv() {
  return (
    process.env.NODE_ENV === 'development' ||
    (typeof window !== 'undefined' && window.env === 'development')
  );
}

/**
 * 声网Agora
 * https://docs.agora.io/cn/Video/API%20Reference/web_ng/interfaces/iagorartcclient.html#join
 * @param {String} appId 你的 Agora 项目的 App ID
 * @param {String} channel 标识通话的频道名称，长度在 64 字节以内的字符串
 * @param {String|Null} token 用于鉴权的 token
 * @param {String|Null} uid 标识用户的 ID。整数或字符串，ASCII 字符，需保证唯一性。如果不指定或设为 null，服务器会自动分配一个整数型 uid 并在 Promise 中返回
 *
 * @param {Object} clientConfig 客户端的配置，包括通话场景、编码格式等，默认使用 vp8 编码，rtc 通话场景
 * @param {String} clientConfig.codec "vp8": 浏览器使用 VP8 编码。"h264": 浏览器使用 H.264 编码
 * @param {String} clientConfig.mode "live": 直播场景，观众只能订阅音视频轨道，无法发布。"rtc": 通信场景，用于常见的一对一通话或群聊，频道中的任何用户可以自由说话
 * @param {String} clientConfig.role 直播场景中（mode 为 "live" 时）的用户角色。"host"（主播）和 "audience"（观众）
 *
 * @param {Object} callbacks 自定义和官方事件回调
 * @param {Function} callbacks.isJoin 加入房间成功回调，(success, uid) => {}
 * @param {Function} callbacks.mediaSub 订阅成功回调， (user, mediaType) => {}
 *
 * @returns {Instance} Agora 声网实例
 */
export class Agora {
  constructor({ appId, token, channel, clientConfig, uid, callbacks = {} }) {
    (AgoraRTC || (AgoraRTC = require('agora-rtc-sdk-ng'))).setLogLevel(3);
    this.appId = appId;
    this.token = token;
    this.channel = channel;
    this.clientConfig = clientConfig || { codec: 'h264', mode: 'rtc' };
    this.uid = uid;
    this.callbacks = callbacks;
    this.isDev = isDevEnv();
    this.streamListCache = [];
  }
  check() {
    /**
     * fake code
     * 1、支持window.RTCPeerConnection
     * 2、支持window.WebSocket
     * 3、支持navigator.mediaDevices && navigator.mediaDevices.getUserMedia
     *  https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/mediaDevices
     *  mediaDevices 是 Navigator 只读属性，返回一个 MediaDevices 对象，该对象可提供对相机和麦克风等媒体输入设备的连接访问，也包括屏幕共享
     *  navigator.mediaDevices不为undefined 有3种情况 (1、localhost:// 访问时， 2、https://， 3、file://)
     *
     * 4、浏览器支持
     *  CHROME         版本>= 58
     *  FIREFOX        版本>= 56
     *  OPERA          版本>= 45
     *  SAFARI         版本>= 11
     *  QQ
     */

    // const checkSystemRequirements = function () {
    //   const e = wV.reportApiInvoke(null, {
    //     name: gk.CHECK_SYSTEM_REQUIREMENTS,
    //     options: [],
    //     tag: fk.TRACER,
    //   });
    //   let t = !1;
    //   try {
    //     const e = window.RTCPeerConnection,
    //       r = navigator.mediaDevices && navigator.mediaDevices.getUserMedia,
    //       i = window.WebSocket;
    //     t = !!(e && r && i);
    //   } catch (e) {
    //     return cD.error('check system requirement failed: ', e), !1;
    //   }
    //   let r = !1;
    //   const i = oO();
    //   i.name === tO.CHROME && Number(i.version) >= 58 && (!hO() || AO()) && (r = !0);
    //   i.name === tO.FIREFOX && Number(i.version) >= 56 && (r = !0);
    //   i.name === tO.OPERA && Number(i.version) >= 45 && (r = !0);
    //   i.name === tO.SAFARI && Number(i.version) >= 11 && (r = !0);
    //   (vO() || oO().name === tO.QQ) && (r = !0);
    //   cD.debug('checkSystemRequirements, api:', t, 'browser', r);
    //   const n = t && r;
    //   return e.onSuccess(n), n;
    // };

    let isSupport = AgoraRTC.checkSystemRequirements();
    this.isDev && console.warn('checkAgora', isSupport);
    return isSupport;
  }
  checkOnlyPull() {
    if (/http:/.test(location.protocol) && location.hostname !== 'localhost') {
      const uaEnv = getEnv();

      let rtcSupport = !!(window.RTCPeerConnection && window.WebSocket);
      let browserSupport = false;
      // 2345Explorer, 360 Browser, Amaya, Android Browser, Arora, Avant, Avast, AVG,
      // BIDUBrowser, Baidu, Basilisk, Blazer, Bolt, Brave, Bowser, Camino, Chimera,
      // Chrome Headless, Chrome WebView, Chrome, Chromium, Comodo Dragon, Dillo,
      // Dolphin, Doris, Edge, Electron, Epiphany, Facebook, Falkon, Fennec, Firebird,
      // Firefox [Reality], Flock, Flow, GSA, GoBrowser, ICE Browser, IE, IEMobile, IceApe,
      // IceCat, IceDragon, Iceweasel, Instagram, Iridium, Iron, Jasmine, K-Meleon,
      // Kindle, Klar, Konqueror, LBBROWSER, Line, Links, Lunascape, Lynx, MIUI Browser,
      // Maemo Browser, Maemo, Maxthon, MetaSr Midori, Minimo, Mobile Safari, Mosaic,
      // Mozilla, NetFront, NetSurf, Netfront, Netscape, NokiaBrowser, Obigo, Oculus Browser,
      // OmniWeb, Opera Coast, Opera [Mini/Mobi/Tablet], PaleMoon, PhantomJS, Phoenix,
      // Polaris, Puffin, QQ, QQBrowser, QQBrowserLite, Quark, QupZilla, RockMelt, Safari,
      // Sailfish Browser, Samsung Browser, SeaMonkey, Silk, Skyfire, Sleipnir, Slim,
      // SlimBrowser, Swiftfox, Tesla, Tizen Browser, UCBrowser, UP.Browser, Vivaldi,
      // Waterfox, WeChat, Weibo, Yandex, baidu, iCab, w3m, Whale Browser
      if (uaEnv.isChrome) {
        browserSupport = parseInt(uaEnv.browser.version) >= 58;
      } else if (uaEnv.isFirefox) {
        browserSupport = parseInt(uaEnv.browser.version) >= 56;
      } else if (uaEnv.isOpera) {
        browserSupport = parseInt(uaEnv.browser.version) >= 45;
      } else if (uaEnv.isSafari) {
        browserSupport = parseInt(uaEnv.browser.version) >= 11;
      } else if (uaEnv.isQQBrowser || uaEnv.isWeChat) {
        browserSupport = true;
      }
      this.isDev &&
        console.warn('checkAgora onlyPull', rtcSupport && browserSupport);
      return rtcSupport && browserSupport;
    }
    return this.check();
  }
  agEmit(name, ...args) {
    this.callbacks[name] && this.callbacks[name](...args, this);
  }
  init() {
    const ag = AgoraRTC.createClient(this.clientConfig);
    this.ag = ag;
    this.addListens();
    ag.join(this.appId, this.channel, this.token, this.uid || null).then(
      (UID) => {
        console.warn('agora join room', true, this.isDev ? UID : '');
        this.uid = UID;
        return this.agEmit('isJoin', true, UID);
      }
    );

    return ag;
  }
  addListens() {
    const ag = this.ag,
      isDev = this.isDev;
    ag.on('user-joined', (user) => {
      this.agEmit('user-joined', user);
    });
    ag.on('user-left', (user) => {
      this.agEmit('user-left', user);
    });
    ag.on('user-published', async (user, mediaType) => {
      this.streamListCache.push({ user, mediaType });
      this.agEmit('user-published', user, mediaType);
      if (this.callbacks['mediaSub']) {
        await ag.subscribe(user, mediaType);
        console.warn('subscribe', isDev ? { user, mediaType } : mediaType);
        this.agEmit('mediaSub', user, mediaType);
      }
    });
    ag.on('user-unpublished', (user, mediaType) => {
      this.streamListCache = this.streamListCache.filter(
        (sItem) => sItem.user.uid !== user.uid
      );
      this.agEmit('user-unpublished', user, mediaType);
    });

    if (this.callbacks['volume-indicator'] || isDev) {
      ag.enableAudioVolumeIndicator();
      ag.on('volume-indicator', (volumes) => {
        isDev && console.warn('volume-indicator', this.uid, volumes);
        this.agEmit('volume-indicator', volumes);
      });
    }
  }
}

/**
 * Zego
 * https://doc-zh.zego.im/article/7638
 * @param {String} server 接入服务器地址，区分测试环境与正式环境
 * @param {Number} appId zego申请的 AppID
 * @param {String} roomId 房间 ID
 * @param {String} token 登录验证 token，nodejs端通过算法生成
 * @param {String} playMode 拉流类型，all 全部类型，video 视频拉流，audio语音拉流
 *
 * @param {Object} user 登录用户信息
 * @param {String} user.userID 登录用户ID
 * @param {String} user.userName 登录用户名称
 *
 * @param {Object} config 房间相关配置，可选
 * @param {Boolean} config.userUpdate 设置 roomUserUpdate 是否回调，默认为 false 不回调
 * @param {Number} config.maxMemberCount 房间最大用户数量，传 0 视为不限制，默认无限制; 只有第一个登录房间的用户设置生效
 *
 * @param {Object} playOption 拉流附加参数
 * @param {Boolean} playOption.video 是否需要拉取视频，默认为 true
 * @param {Boolean} playOption.audio 是否需要拉取音频，默认为 true
 * @param {String} playOption.videoCodec 拉流选取编码格式，只能传入 'VP8' (string) 或 'H264' (string)
 * @param {Number} playOption.resourceMode 拉流模式，0表示仅从RTC拉流,2表示仅从 L3 拉流，默认为0
 * @param {String} playOption.streamParams 拉流额外参数;鉴权参数 streamParams 格式如下：'zg_expired=XX&zg_nonce=XX&zg_token=XX',只有需要配置鉴权时才传入，否则请忽略
 *
 * @param {Object} callbacks 自定义和官方事件回调
 * @param {Function} callbacks.isJoin 加入房间成功回调，(success, userID) => {}
 * @param {Function} callbacks.streamAdd 拉流成功回调，(streamObj, stream) => {}
 * @param {Function} callbacks.streamDelete 停止拉取远端流回调，(streamObj) => {}
 *
 * @returns {Instance} Zego实例
 */
export class Zego {
  constructor({
    appId,
    roomId,
    server,
    token,
    user,
    config,
    callbacks = {},
    playMode,
    resourceMode = 0,
    playOption
  }) {
    ZegoExpressEngine ||
      (ZegoExpressEngine =
        require('zego-express-engine-webrtc').ZegoExpressEngine);
    this.appId = appId;
    this.roomId = roomId;
    this.server = server;
    this.token = token;
    this.user = user;
    this.config = config;
    this.callbacks = callbacks;
    this.playMode = playMode;
    this.resourceMode = resourceMode;
    this.playOption = playOption || this.getPlayOption();
    this.isDev = isDevEnv();
    this.streamListCache = [];
  }
  async check(checkTypes) {
    let resultMap = {};
    this.createZg();
    try {
      if (!checkTypes) {
        // camera: false
        // customCapture: true
        // errInfo: {
        //   camera: {name: 'NotFoundError', message: 'Requested device not found'},
        //   microphone: {name: 'NotFoundError', message: 'Requested device not found'}
        // }
        // microphone: false
        // screenSharing: true
        // videoCodec: {H264: true, H265: false, VP8: true, VP9: true}
        // webRTC: true
        let allData = await this.zg.checkSystemRequirements();
        resultMap = {
          ...allData,
          ...allData.videoCodec
        };
      } else {
        let data = await Promise.all(
          checkTypes.map((type) => this.zg.checkSystemRequirements(type))
        );
        resultMap = checkTypes.reduce((resultMap, type, i) => {
          resultMap[type] = data[i].result;
          return resultMap;
        }, {});
      }
    } catch (error) {
      console.error(error);
    }

    this.isDev && console.warn('checkZego', resultMap);

    return resultMap;
  }
  async checkOnlyPull() {
    let checkTypes = ['webRTC', this.playOption.videoCodec || 'H264'];
    let result = await this.check(checkTypes);
    return Object.keys(result).every((type) => result[type]);
  }
  zgEmit(name, ...args) {
    this.callbacks[name] && this.callbacks[name](...args, this);
  }
  getPlayOption() {
    const playMode = this.playMode;
    let playOption = {
      videoCodec: 'H264',
      resourceMode: this.resourceMode
    };
    if (playMode == 'all') {
      playOption.video = true;
      playOption.audio = true;
    } else if (playMode == 'video') {
      playOption.audio = false;
    } else if (playMode == 'audio') {
      playOption.video = false;
    }
    return playOption;
  }
  createZg() {
    if (!this.zg) {
      const zg = new ZegoExpressEngine(this.appId, this.server);
      zg.setDebugVerbose(this.isDev);
      zg.setLogConfig({
        logLevel: 'error'
      });
      this.zg = zg;
    }
    return this.zg;
  }
  init() {
    this.createZg();
    this.addListens();
    this.zg
      .loginRoom(this.roomId, this.token, this.user, this.config)
      .then((isJoin) => {
        console.warn(
          'zego join room',
          isJoin,
          this.isDev ? this.user.userID : ''
        );
        this.zgEmit('isJoin', isJoin, this.user.userID);
      });
    return this.zg;
  }
  addStreamHandler(streamList) {
    for (let i = 0; i < streamList.length; i++) {
      this.zg
        .startPlayingStream(streamList[i].streamID, this.playOption)
        .then((stream) => {
          this.zgEmit('streamAdd', streamList[i], stream);
          this.streamListCache.push(streamList[i]);
        })
        .catch((err) => {
          console.error('PlayingStream', err);
        });
    }
  }
  delStreamHandler(streamList) {
    let removeIndexs = [];
    for (let k = 0; k < this.streamListCache.length; k++) {
      let localItem = this.streamListCache[k];
      for (let j = 0; j < streamList.length; j++) {
        let remoteItem = streamList[j];
        if (localItem.streamID === remoteItem.streamID) {
          try {
            this.zg.stopPlayingStream(localItem.streamID);
          } catch (error) {
            console.error('stopPlayingStream', error);
          }
          this.zgEmit('streamDelete', localItem);
          removeIndexs.push(k);
          break;
        }
      }
    }
    this.streamListCache = this.streamListCache.filter(
      (s, i) => !removeIndexs.includes(i)
    );
  }
  addListens() {
    const zg = this.zg,
      isDev = this.isDev;
    // 房间状态更新回调
    // state => DISCONNECTED 与房间断开了连接
    // state => CONNECTING 与房间尝试连接中
    // state => CONNECTED 与房间连接成功
    zg.on('roomStateUpdate', (roomId, state, errorCode, extendedData) => {
      if (state === 'DISCONNECTED') {
        // stop playing
        this.streamListCache = this.streamListCache.filter((s) => {
          s.streamID && zg.stopPlayingStream(s.streamID);
          return false;
        });
      }
      this.zgEmit('roomStateUpdate', roomId, state, errorCode, extendedData);
    });

    // 用户状态更新回调
    zg.on('roomUserUpdate', (roomId, updateType, userList) => {
      this.zgEmit('roomUserUpdate', roomId, updateType, userList);
    });

    // 流状态更新回调
    // updateType => ADD 流新增，开始拉流
    // updateType => DELETE 流删除，停止拉流
    zg.on(
      'roomStreamUpdate',
      (roomId, updateType, streamList, extendedData) => {
        console.warn(
          'roomStreamUpdate',
          isDev ? { roomId, updateType, streamList } : updateType
        );
        if (updateType == 'ADD') {
          this.addStreamHandler(streamList);
        } else if (updateType == 'DELETE') {
          this.delStreamHandler(streamList);
        }

        this.zgEmit(
          'roomStreamUpdate',
          roomId,
          updateType,
          streamList,
          extendedData
        );
      }
    );

    // token 过期时间少于30s时会触发
    zg.on('tokenWillExpire', (roomId) => {
      this.zgEmit('tokenWillExpire', roomId);
    });

    zg.on('playerStateUpdate', (stateInfo) => {
      console.warn('playerStateUpdate', isDev ? stateInfo : stateInfo.state);
      this.zgEmit('playerStateUpdate', stateInfo);
    });
  }
}
