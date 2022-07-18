<template>
  <div class="swiper-app"></div>
</template>
<script>
export default {
  name: 'SwiperHome',
  /**
   * 组件前置数据处理，进来组件之前由 server router.onReady后调用，或者由 client router.beforeResolve后调用
   * 只会被调用一次，server调用了 client不再调用，只有在客户端中使用vue-router方式进行页面跳转（也就是单页面跳转）才被 client 调用
   * @param {Object} store vuex store
   * @param {Object} route 当前路由对象
   * @param {*} routeData 从server controller 传进来的当前路由数据（server端才存在，client端undefined）
   * @returns {Promise} 异步promise，router.beforeResolve钩子或者router.onReady钩子中被 await 调用，fulfilled后执行钩子 next()
   */
  asyncData({ store, route, routeData }) {
    return Promise.resolve();
  }
};
</script>
