import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import NotFound from '@/views/NotFound.vue';

Vue.use(Router);

export default function createRouter(options) {
  options = Object.assign({ routeMode: 'history' }, options);
  return new Router({
    mode: options.routeMode,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      {
        path: '/',
        component: Home
      },
      {
        path: '/effect/SlicerSlider',
        component: () => import('@/views/effective/SlicerSlider.vue')
      },
      {
        path: '/simple/navigation',
        component: () => import('@/views/simple/Navigation.vue')
      },
      {
        path: '/simple/scroll',
        component: () => import('@/views/simple/Scroll.vue')
      },
      {
        path: '/simple/nested',
        component: () => import('@/views/simple/Nested.vue')
      },
      {
        path: '*',
        component: NotFound
      }
    ]
  });
}
