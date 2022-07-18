const { isObj } = require('../utils');
const language = require('../../language/model.json');
const langCodes = require('../../language/langCodes.json');
/**
 * 系统支持的语言
 * [aliaCode, code]
 * aliaCode    别名
 * code        ctx、query、header和cookie中存在的langCode
 */
const supportLangCodesMap = new Map(Object.entries(langCodes));

function localLangText(key, langCode) {
  // { key: { 'zh-TW': val } }
  if (language && isObj(language[key])) {
    return language[key][langCode];
  }
}

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

function isSupportCode(langCode) {
  return !!getMapItem(langCode);
}

function toSupportCode(langCode) {
  let curMapItem = getMapItem(langCode);
  return curMapItem ? curMapItem[1] : 'zh-TW';
}

module.exports = {
  localLangText,
  isSupportCode,
  toSupportCode
};
