import '@/utils/date';
import { createApp } from './app';
import setSeo from './seo';

const { app, store, router, i18n, useVantI18n } = createApp();

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
  // 删除state
  if (process.env.NODE_ENV !== 'development') {
    delete window.__INITIAL_STATE__;
  }
}

function start() {
  const langCode = store.state.langCode;

  i18n.locale = langCode;
  useVantI18n(langCode);
  app.$mount('#app');
}

// 初始化混合原生app
app.$hybird.init();

// 这里假定 App.vue 模板中根元素具有 `id="app"`
router.onReady(() => {
  // 添加路由钩子函数，用于处理 asyncData.
  // 在初始路由 resolve 后执行，
  // 以便我们不会二次预取(double-fetch)已有的数据。
  // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve, 客户端跳转触发。

  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to);
    const prevMatched = router.getMatchedComponents(from);

    // 我们只关心非预渲染的组件
    // 所以我们对比它们，找出两个匹配列表的差异组件
    let diffed = false;
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = prevMatched[i] !== c);
    });

    if (!activated.length) {
      return next();
    }

    // loading start
    Promise.all(
      activated.map((c) => {
        if (c.asyncData) {
          return c.asyncData({ store, route: to });
        }
      })
    )
      .then(() => {
        // loading end

        // 客户端跳转设置 seo
        setSeo(to.path, store.state.curSeo);

        next();
      })
      .catch(next);
  });

  start();
});

if (window.eruda) {
  window.eruda.init();
}
