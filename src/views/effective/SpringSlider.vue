<template>
  <div class="spring-slider">
    <div class="swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(slide, i) in slides" :key="i">
          <img :src="slide.img" alt="" />
        </div>
      </div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
</template>
<script>
import Swiper, { Pagination, Navigation, EffectCreative } from 'swiper';

export default {
  components: {},
  props: {},
  data() {
    return {
      slides: [
        { img: require('@/images/spring/1.jpg') },
        { img: require('@/images/spring/2.jpg') },
        { img: require('@/images/spring/3.jpg') },
        { img: require('@/images/spring/4.jpg') },
        { img: require('@/images/spring/5.jpg') },
        { img: require('@/images/spring/6.jpg') },
        { img: require('@/images/spring/7.jpg') },
        { img: require('@/images/spring/8.jpg') },
        { img: require('@/images/spring/9.jpg') },
        { img: require('@/images/spring/10.jpg') }
      ]
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.init(document.querySelector('.spring-slider'), {
      modules: [Pagination, Navigation],
      loop: !0,
      slidesPerView: 1,
      navigation: {
        prevEl: '.swiper-button-prev',
        nextEl: '.swiper-button-next'
      },
      pagination: {
        el: '.swiper-pagination'
      },
      breakpoints: {
        640: {
          slidesPerView: 2
        },
        800: {
          slidesPerView: 3
        },
        1100: {
          slidesPerView: 4
        }
      }
    });
  },
  beforeDestroy() {},
  methods: {
    init(parent, config) {
      var b = Object.defineProperty,
        w = Object.defineProperties;
      var D = Object.getOwnPropertyDescriptors;
      var S = Object.getOwnPropertySymbols;
      var L = Object.prototype.hasOwnProperty,
        N = Object.prototype.propertyIsEnumerable;
      var E = (s, e, o) =>
          e in s
            ? b(s, e, {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: o
              })
            : (s[e] = o),
        p = (s, e) => {
          for (var o in e || (e = {})) L.call(e, o) && E(s, o, e[o]);
          if (S) for (var o of S(e)) N.call(e, o) && E(s, o, e[o]);
          return s;
        },
        d = (s, e) => w(s, D(e));

      let a = 0,
        t = !1;
      const r = (n) => {
          n.slides.forEach((u) => {
            u.style.transitionDelay = '0ms';
          });
        },
        i = new Swiper(
          parent.querySelector('.swiper'),
          d(
            p(
              {
                effect: 'creative',
                speed: 720,
                followFinger: !1
              },
              config
            ),
            {
              modules: [EffectCreative, ...(config.modules || [])],
              creativeEffect: {
                limitProgress: 100,
                prev: {
                  translate: ['-100%', 0, 0]
                },
                next: {
                  translate: ['100%', 0, 0]
                }
              },
              on: d(p({}, config.on || {}), {
                touchStart(...n) {
                  (t = !0),
                    config.on &&
                      config.on.touchStart &&
                      config.on.touchStart(...n);
                },
                touchEnd(...n) {
                  (t = !1),
                    config.on &&
                      config.on.touchStart &&
                      config.on.touchEnd(...n);
                },
                progress(n, u) {
                  if (t) return;
                  config.on && config.on.progress && config.on.progress(n, u);
                  const g = n.progress > a ? 'next' : 'prev';
                  a = n.progress;
                  const y = n.params.speed / 16,
                    f = n.visibleSlidesIndexes,
                    h = f[0],
                    m = f[f.length - 1],
                    v = (l, c) => {
                      g === 'next' && c >= h
                        ? (l.style.transitionDelay = `${(c - h + 1) * y}ms`)
                        : g === 'prev' && c <= m + 1
                        ? (l.style.transitionDelay = `${(m - c + 1) * y}ms`)
                        : (l.style.transitionDelay = `${0}ms`);
                    };
                  n.slides.forEach((l, c) => {
                    n.animating
                      ? ((l.style.transitionDelay = '0ms'),
                        requestAnimationFrame(() => {
                          v(l, c);
                        }))
                      : v(l, c);
                  });
                }
              })
            }
          )
        );
      return (
        i.on('transitionEnd resize touchStart', () => {
          r(i);
        }),
        i
      );
    }
  }
};
</script>
