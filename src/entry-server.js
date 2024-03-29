import { createApp } from './app';
import { toSupportCode } from '@/lang';

export default (context) => {
  // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
  // 以便服务器能够等待所有的内容在渲染前，
  // 就已经准备就绪。
  return new Promise((resolve, reject) => {
    const { app, router, store, i18n, useVantI18n } = createApp();

    // 全局注入服务端数据到store
    const langCode = toSupportCode(context.langCode);
    store.commit('setCurSeo', context.curSeo);
    store.commit('setLangCode', langCode);

    i18n.locale = langCode;
    useVantI18n(langCode);

    router.push(context.url);

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();
      if (!matchedComponents.length) {
        return reject({ code: 404 });
      }

      // 对所有匹配的路由组件调用 `asyncData()`
      Promise.all(
        matchedComponents.map((Component) => {
          if (Component.asyncData) {
            return Component.asyncData({
              store,
              route: router.currentRoute,
              routeData: context.routeData
            });
          }
        })
      )
        .then(() => {
          // 在所有预取钩子(preFetch hook) resolve 后，
          // 我们的 store 现在已经填充入渲染应用程序所需的状态。
          // 当我们将状态附加到上下文，
          // 并且 `template` 选项用于 renderer 时，
          // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
          context.state = store.state;

          resolve(app);
        })
        .catch(reject);
    }, reject);
  });
};
