import UAParser from 'ua-parser-js';

// # Possible 'browser.name':
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
// Waterfox, WeChat, Weibo, Yandex, baidu, iCab, w3m, Whale Browser...

// # 'browser.version' determined dynamically

// # Possible 'device.type':
// console, mobile, tablet, smarttv, wearable, embedded

// # Possible 'device.vendor':
// Acer, Alcatel, Amazon, Apple, Archos, ASUS, AT&T, BenQ, BlackBerry, Dell,
// Essential, Fairphone, GeeksPhone, Google, HP, HTC, Huawei, Jolla, Lenovo, LG,
// Meizu, Microsoft, Motorola, Nexian, Nintendo, Nokia, Nvidia, OnePlus, OPPO, Ouya,
// Palm, Panasonic, Pebble, Polytron, Realme, RIM, Roku, Samsung, Sharp, Siemens,
// Sony[Ericsson], Sprint, Tesla, Vivo, Vodafone, Xbox, Xiaomi, Zebra, ZTE, ...

// # 'device.model' determined dynamically

// # Possible 'engine.name'
// Amaya, Blink, EdgeHTML, Flow, Gecko, Goanna, iCab, KHTML, Links, Lynx, NetFront,
// NetSurf, Presto, Tasman, Trident, w3m, WebKit

// # 'engine.version' determined dynamically

// # Possible 'os.name'
// AIX, Amiga OS, Android[-x86], Arch, Bada, BeOS, BlackBerry, CentOS, Chromium OS,
// Contiki, Fedora, Firefox OS, FreeBSD, Debian, Deepin, DragonFly, elementary OS,
// Fuchsia, Gentoo, GhostBSD, GNU, Haiku, HP-UX, Hurd, iOS, Joli, KaiOS, Linpus, Linspire,
// Linux, Mac OS, Maemo, Mageia, Mandriva, Manjaro, MeeGo, Minix, Mint, Morph OS, NetBSD,
// Nintendo, OpenBSD, OpenVMS, OS/2, Palm, PC-BSD, PCLinuxOS, Plan9, PlayStation, QNX,
// Raspbian, RedHat, RIM Tablet OS, RISC OS, Sabayon, Sailfish, Series40, Slackware, Solaris,
// SUSE, Symbian, Tizen, Ubuntu, Unix, VectorLinux, WebOS, Windows [Phone/Mobile], Zenwalk, ...

// # 'os.version' determined dynamically

// # Possible 'cpu.architecture'
// 68k, amd64, arm[64/hf], avr, ia[32/64], irix[64], mips[64], pa-risc, ppc, sparc[64]

export default function getEnv(uastring) {
  const uaEnv = {
    ...UAParser(uastring),
    get isiOS() {
      return uaEnv.os.name === 'iOS';
    },
    get isAndroid() {
      return uaEnv.os.name === 'Android';
    },
    get isChrome() {
      const names = ['Chrome Headless', 'Chrome WebView', 'Chrome', 'Chromium'];
      return names.includes(uaEnv.browser.name);
    },
    get isFirefox() {
      return /^Firefox/.test(uaEnv.browser.name);
    },
    get isOpera() {
      return /^Opera/.test(uaEnv.browser.name);
    },
    get isSafari() {
      return /Safari/.test(uaEnv.browser.name);
    },
    get isIE() {
      const names = ['IE', 'IEMobile'];
      return names.includes(uaEnv.browser.name);
    },
    get isEdge() {
      return uaEnv.browser.name === 'Edge';
    },
    get isMobile() {
      return uaEnv.device.type === 'mobile';
    },
    get isQQ() {
      return uaEnv.browser.name === 'QQ';
    },
    get isUC() {
      return uaEnv.browser.name === 'UCBrowser';
    },
    get isQQBrowser() {
      const names = ['QQ', 'QQBrowser', 'QQBrowserLite'];
      return names.includes(uaEnv.browser.name);
    },
    get isWeibo() {
      return uaEnv.browser.name === 'WeiBo';
    },
    get isDing() {
      return /DingTalk/i.test(uaEnv.ua);
    },
    get isMail() {
      return /Mail/i.test(uaEnv.ua);
    },
    get isWeChat() {
      return uaEnv.browser.name === 'WeChat';
    }
  };

  return uaEnv;
}
