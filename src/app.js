import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import 'swiper/css/bundle';
import '@/styles/index.scss';
import App from './App.vue';
import createStore from './store';
import createRouter from './routes';
import * as filters from './filters';
import globalMixin from '@/mixins/global';
import i18n, { useVantI18n } from './lang';
import { Icon, Toast, Popup, Dialog } from 'vant';
import hybird from './utils/hybird';
import Events from './utils/events';
import NoData from '@/components/NoData.vue';

Vue.use(Icon);
Vue.use(Toast);
Vue.use(Popup);
Vue.use(Dialog);

// root methods
Vue.prototype.$toastError = (msg) => {
  msg = typeof msg === 'object' && 'msg' in msg ? msg.msg : msg;
  return Toast(typeof msg === 'object' && 'message' in msg ? msg.message : msg);
};
Vue.prototype.$hybird = hybird;
Vue.prototype.$eventBus = new Events();

// register global utility filters.
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
  if (filters[key].isRootMethod) {
    Vue.prototype[key] = filters[key];
  }
});

Vue.mixin(globalMixin);

// global components
Vue.component('NoData', NoData);

// vue config
Vue.config.productionTip = false;

export function createApp(options = {}) {
  const router = createRouter(options);
  const store = createStore(options);
  // 同步路由状态(route state)到 store
  sync(store, router);

  router.beforeEach((to, from, next) => {
    const backAction = to.query.backAction,
      isRedirect = /^\/redirect\/.*/.test(to.path);
    if (!store.state.firstLoadPath && !isRedirect) {
      store.commit('setFirstLoadPath', to.path);
    }
    // url指定 ?backAction=[app|web]，首次加载返回操作肯定是 app，其他都是 web
    store.commit(
      'changeBackAction',
      backAction
        ? backAction
        : store.state.firstLoadPath === to.path
        ? 'app'
        : 'web'
    );
    next();
  });

  const app = new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App)
  });

  return { app, router, store, i18n, useVantI18n };
}
