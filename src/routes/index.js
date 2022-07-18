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
        path: '/SlicerSlider',
        component: () => import('@/views/effective/SlicerSlider.vue')
      },
      {
        path: '*',
        component: NotFound
      }
    ]
  });
}
