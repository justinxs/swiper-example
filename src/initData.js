import { getQueryString } from '@/utils/element';
import { uuid } from '@/utils/common';
import { toSupportCode } from '@/lang';
import { THEME } from '@/utils/theme';

function getCookie(key) {
  const reg = new RegExp(`(?:(?:^|.*;\\s*)${key}\\s*\\=\\s*([^;]*).*$)|^.*$`);
  return document.cookie.replace(reg, '$1');
}

export function initEnterData(enterData) {
  let version = enterData.version || getCookie('SPORTS_VERSION') || '';
  let UUID = enterData.uuid || getCookie('SPORTS_UUID') || uuid();
  let langCode = toSupportCode(enterData.langCode);
  let token = enterData.token || '';
  let theme = enterData.theme || THEME;
  let api = enterData.api || '';
  let ua = enterData['user-agent'] || '';

  let result = {
    version,
    uuid: UUID,
    langCode,
    token,
    theme,
    api,
    ua,
    _enterData: {
      ...enterData
    }
  };

  return result;
}

export function initQueryData() {
  let [version, UUID, langCode, token, theme, api] = getQueryString([
    'version',
    'uuid',
    'langCode',
    'token',
    'theme',
    'api'
  ]);

  version = version || getCookie('SPORTS_VERSION') || '';
  UUID = UUID || getCookie('SPORTS_UUID') || uuid();
  langCode = toSupportCode(langCode || getCookie('SPORTS_LANG_CODE'));
  token = token || '';
  theme = theme || getCookie('SPORTS_THEME') || THEME;
  api = api || '';

  const result = {
    version,
    uuid: UUID,
    langCode,
    token,
    theme,
    api,
    ua: ''
  };

  return result;
}

export function fullQuery(data = {}) {
  const params = {
    ...data
  };
  const querys = Object.keys(params).reduce((arr, key) => {
    const val = params[key];
    if (val !== null && val !== undefined && val !== '') {
      arr.push(`${key}=${val}`);
    }
    return arr;
  }, []);

  return querys.length ? `?${querys.join('&')}` : '';
}
