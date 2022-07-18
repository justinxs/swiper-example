import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { Locale } from 'vant';
import langCodes from '../../language/langCodes.json';
import en_US from './package/en-US.json';
import zh_CN from './package/zh-CN.json';
import zh_TW from './package/zh-TW.json';
import vi_VN from './package/vi-VN.json';
import th_TH from './package/th-TH.json';

Vue.use(VueI18n);

const messages = {
  'zh-TW': {
    ...zh_TW
  },
  'zh-CN': {
    ...zh_CN
  },
  'en-US': {
    ...en_US
  },
  'vi-VN': {
    ...vi_VN
  },
  'th-TH': {
    ...th_TH
  }
};

const i18n = new VueI18n({
  // set locale
  // options: en-US | th-TH | vi-VN | zh-CN | zh-TW
  locale: 'zh-TW',
  fallbackLocale: 'zh-TW',
  // set locale messages
  messages
});

export default i18n;

// 引入vant语言包
const vantLang = {
  'en-US': require('vant/lib/locale/lang/en-US').default,
  'vi-VN': require('vant/lib/locale/lang/vi-VN').default,
  'zh-CN': require('vant/lib/locale/lang/zh-CN').default,
  'zh-TW': require('vant/lib/locale/lang/zh-TW').default,
  'th-TH': require('vant/lib/locale/lang/th-TH').default
};

function getVantLang(langCode) {
  let lang = vantLang[langCode];
  if (!lang) {
    lang = vantLang['zh-TW'];
    console.warn(`vant language has not ${langCode},Fall back to zh-TW!`);
  }
  return lang;
}

export const useVantI18n = (langCode) => {
  Locale.use(langCode, getVantLang(langCode));
};

/**
 * 系统支持的语言
 * [aliaCode, code]
 * aliaCode    别名
 * code        ctx、query、header和cookie中存在的langCode
 */
const supportLangCodesMap = new Map(Object.entries(langCodes));

/**
 * 获取 等于code 或者 等于 aliaCode 的项
 * 返回命中的项 [aliaCode, code]
 */
function getMapItem(langCode) {
  for (const [aliaCode, code] of supportLangCodesMap) {
    if (langCode === code || langCode === aliaCode) {
      return [aliaCode, code];
    }
  }
}

export function toSupportCode(langCode) {
  let curMapItem = getMapItem(langCode);
  if (curMapItem) {
    return curMapItem[1];
  }
  return 'zh-TW';
}
