<template>
  <div class="swiper-app">
    <div v-for="g in groups" :key="g.key">
      <h3>{{ g.title }}</h3>
      <ul class="route-list">
        <li class="route-item" v-for="c in g.children" :key="c.path">
          <RouterLink :to="c.path">{{ c.text }}</RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import routes from '@/routes/routes';

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
  },
  data() {
    return {
      groups: routes.reduce((g, r) => {
        const [key, text] = r.path
          .replace(/^\/(.+)?\/(.+)$/, '$1,$2')
          .split(',');
        const existItem = g.filter((gItem) => gItem.key === key)[0];
        if (existItem) {
          existItem.children.push({
            path: r.path,
            text
          });
        } else {
          g.push({
            key: key,
            title: key
              .split('')
              .map((k, i) => (i ? k : k.toUpperCase()))
              .join(''),
            children: [
              {
                path: r.path,
                text
              }
            ]
          });
        }
        return g;
      }, [])
    };
  }
};
</script>
<style scoped lang="scss">
.route-list {
  display: flex;
  flex-wrap: wrap;
  .route-item {
    padding: 10px;
    background-color: skyblue;
    margin: 5px;
    font-size: 18px;
  }
}
</style>
