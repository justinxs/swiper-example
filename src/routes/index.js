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
        path: '/simple/grid',
        component: () => import('@/views/simple/Grid.vue')
      },
      {
        path: '/simple/dynamicPagination',
        component: () => import('@/views/simple/DynamicPagination.vue')
      },
      {
        path: '/simple/progressPagination',
        component: () => import('@/views/simple/ProgressPagination.vue')
      },
      {
        path: '/simple/customPagination',
        component: () => import('@/views/simple/CustomPagination.vue')
      },
      {
        path: '/simple/vertical',
        component: () => import('@/views/simple/Vertical.vue')
      },
      {
        path: '/simple/rewind',
        component: () => import('@/views/simple/Rewind.vue')
      },
      {
        path: '/simple/visibility',
        component: () => import('@/views/simple/Visibility.vue')
      },
      {
        path: '/simple/changeDirection',
        component: () => import('@/views/simple/ChangeDirection.vue')
      },
      {
        path: '/simple/slideableMenu',
        component: () => import('@/views/simple/SlideableMenu.vue')
      },
      {
        path: '/simple/VirtualSlides',
        component: () => import('@/views/simple/VirtualSlides.vue')
      },
      {
        path: '/simple/Zoom',
        component: () => import('@/views/simple/Zoom.vue')
      },
      {
        path: '/simple/Autoheight',
        component: () => import('@/views/simple/Autoheight.vue')
      },
      {
        path: '/simple/ResponsiveBreakpoints',
        component: () => import('@/views/simple/ResponsiveBreakpoints.vue')
      },
      {
        path: '/simple/Lazyload',
        component: () => import('@/views/simple/Lazyload.vue')
      },
      {
        path: '/simple/Parallax',
        component: () => import('@/views/simple/Parallax.vue')
      },
      {
        path: '*',
        component: NotFound
      }
    ]
  });
}
