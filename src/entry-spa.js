import '@/utils/date';
import { createApp } from './app';
import { changeTheme } from '@/utils/theme';
import request from '@/utils/request';
import { initEnterData, initQueryData } from './initData';
import spaConfig from '../config/spa.json';

const { app, store, i18n, useVantI18n } = createApp({ routeMode: 'hash' });
const envApi = process.env.API || 'prod';
const apiMap = spaConfig.api;

function start(initData = {}) {
  let { version, uuid, langCode, token, api, ua, theme } = initData;
  const baseURL = /^https?:\/\/.+/i.test(api) ? api : apiMap[envApi];
  const CDN = baseURL.replace(/\/$/, '') + '/';

  // axios 请求拦截
  request.interceptors.request.use((config) => {
    config.baseURL = baseURL;
    config.headers = Object.assign(
      {
        version,
        uuid,
        token,
        langCode,
        ua
      },
      config.headers
    );
    return config;
  });

  store.commit('setLangCode', langCode);
  store.commit('setCDN', CDN);

  i18n.locale = langCode;
  useVantI18n(langCode);
  changeTheme(theme);
  app.$mount('#app');
}

if (window.eruda) {
  window.eruda.init();
}

// 初始化混合原生app
app.$hybird.init();

// 初始化
if (app.$hybird.isSupport()) {
  console.log('start config', Date.now() - window.startTime);
  app.$hybird.initConfig((config) => {
    console.log(config);
    console.log('receive config', Date.now() - window.startTime);
    start(initEnterData(config));
  });
  console.log('app.js end', Date.now() - window.startTime);
} else {
  start(initQueryData());
}
