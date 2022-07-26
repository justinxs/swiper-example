<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view />
    </transition>
    <div v-show="loading" class="loading-view">
      <van-loading class="primary-loading" size="1.2rem" />
    </div>
  </div>
</template>

<script>
import { Loading } from 'vant';
import { iOSTouch } from '@/utils/element';

export default {
  name: 'SwiperVue',
  components: {
    [Loading.name]: Loading
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    },
    firstLoadPath() {
      return this.$store.state.firstLoadPath;
    },
    transitionName() {
      return this.$store.state.transitionName;
    },
    nextGo() {
      return this.$store.state.nextGo;
    }
  },
  watch: {
    $route: {
      handler(to, from) {
        return;
        // 首屏无需切换动画
        if (!this.isFirstLoad) {
          this.isFirstLoad = to.path === this.firstLoadPath || !!from;
          return;
        }
        // 重定向刷新无需切换动画
        if (
          to.path.replace(/^\/redirect\//, '/') ===
          (from ? from.path : '').replace(/^\/redirect\//, '/')
        ) {
          return this.$store.commit('changeRouteAnimation', '');
        }

        if (this.nextGo) {
          this.$store.dispatch(this.nextGo == -1 ? 'back' : 'foraward');
          this.$store.commit('setNextGo', 0);
        } else {
          const toDepth = to.path.split('/').length;
          const fromDepth = from.path.split('/').length;
          this.$store.dispatch(
            to.path == '/' || toDepth < fromDepth ? 'back' : 'foraward'
          );
        }
      },
      immediate: true
    }
  },
  mounted() {
    iOSTouch();
  }
};
</script>
