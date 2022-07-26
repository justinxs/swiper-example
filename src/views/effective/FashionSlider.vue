<template>
  <div class="fashion-slider">
    <div class="swiper">
      <div class="swiper-wrapper">
        <!-- configure slide color with "data-slide-bg-color" attribute -->
        <div
          class="swiper-slide"
          v-for="(slide, i) in slides"
          :key="i"
          :data-slide-bg-color="slide.color"
        >
          <!-- slide title wrap -->
          <div class="fashion-slider-title" data-swiper-parallax="-130%">
            <!-- slide title text -->
            <div class="fashion-slider-title-text">{{ slide.title }}</div>
          </div>
          <!-- slide image wrap -->
          <div class="fashion-slider-scale">
            <!-- slide image -->
            <img :src="slide.img" />
          </div>
        </div>
      </div>
      <!-- right/next navigation button -->
      <div class="fashion-slider-button-prev fashion-slider-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 350 160 90">
          <g class="fashion-slider-svg-wrap">
            <g class="fashion-slider-svg-circle-wrap">
              <circle cx="42" cy="42" r="40"></circle>
            </g>
            <path
              class="fashion-slider-svg-arrow"
              d="M.983,6.929,4.447,3.464.983,0,0,.983,2.482,3.464,0,5.946Z"
            ></path>
            <path class="fashion-slider-svg-line" d="M80,0H0"></path>
          </g>
        </svg>
      </div>
      <!-- left/previous navigation button -->
      <div class="fashion-slider-button-next fashion-slider-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 350 160 90">
          <g class="fashion-slider-svg-wrap">
            <g class="fashion-slider-svg-circle-wrap">
              <circle cx="42" cy="42" r="40"></circle>
            </g>
            <path
              class="fashion-slider-svg-arrow"
              d="M.983,6.929,4.447,3.464.983,0,0,.983,2.482,3.464,0,5.946Z"
            ></path>
            <path class="fashion-slider-svg-line" d="M80,0H0"></path>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper, { Parallax } from 'swiper';

export default {
  components: {},
  props: {},
  data() {
    return {
      slides: [
        {
          img: require('@/images/fashion/nike.jpg'),
          title: 'Nike',
          color: '#9FA051'
        },
        {
          img: require('@/images/fashion/puma.jpg'),
          title: 'Puma',
          color: '#9B89C5'
        },
        {
          img: require('@/images/fashion/yeeze.jpg'),
          title: 'Yeeze',
          color: '#D7A594'
        }
      ]
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.init(document.querySelector('.fashion-slider'));
  },
  beforeDestroy() {},
  methods: {
    init(parent) {
      let o = !1,
        l = !1,
        i;
      const t = (e) => {
          e.addClass('fashion-slider-no-transition');
          l = !0;
          cancelAnimationFrame(i);
          i = requestAnimationFrame(() => {
            e.removeClass('fashion-slider-no-transition');
            l = !1;
            o = !1;
          });
        },
        c = (e) => {
          e.$el.find('.fashion-slider-button-next').on('click', () => {
            o || e.slideNext();
          });
          e.$el.find('.fashion-slider-button-prev').on('click', () => {
            o || e.slidePrev();
          });
        },
        b = (e) => {
          e.$el
            .find('.fashion-slider-button-next, .fashion-slider-button-prev')
            .off('click');
        };
      return new Swiper(parent.querySelector('.swiper'), {
        modules: [Parallax],
        speed: 1300,
        allowTouchMove: false,
        parallax: true,
        on: {
          transitionStart(e) {
            const { slides: r, previousIndex: s, activeIndex: n, $el: a } = e;
            l || (o = true);
            const f = r.eq(n),
              u = r.eq(s),
              v = u.find('.fashion-slider-scale'),
              m = u.find('img'),
              g = f.find('img'),
              p = n - s,
              y = f.attr('data-slide-bg-color');
            a.css('background-color', y);
            v.transform('scale(0.6)');
            m.transition(1e3).transform('scale(1.2)');
            u.find('.fashion-slider-title-text')
              .transition(1e3)
              .css('color', 'rgba(255,255,255,0)');
            m.transitionEnd(() => {
              g.transition(1300).transform('translate3d(0, 0, 0) scale(1.2)');
              m.transition(1300).transform(
                `translate3d(${60 * p}%, 0, 0)  scale(1.2)`
              );
            });
          },
          transitionEnd(e) {
            const { slides: r, activeIndex: s, $el: n } = e,
              a = r.eq(s),
              f = a.find('img');
            a.find('.fashion-slider-scale').transform('scale(1)');
            f.transition(1e3).transform('scale(1)');
            a.find('.fashion-slider-title-text')
              .transition(1e3)
              .css('color', 'rgba(255,255,255,1)');
            f.transitionEnd(() => {
              o = !1;
            });
            s === 0
              ? n
                  .find('.fashion-slider-button-prev')
                  .addClass('fashion-slider-button-disabled')
              : n
                  .find('.fashion-slider-button-prev')
                  .removeClass('fashion-slider-button-disabled');
            s === r.length - 1
              ? n
                  .find('.fashion-slider-button-next')
                  .addClass('fashion-slider-button-disabled')
              : n
                  .find('.fashion-slider-button-next')
                  .removeClass('fashion-slider-button-disabled');
          },
          init(e) {
            const { slides: r, activeIndex: s, $el: n } = e;
            t(n);
            const a = r.eq(s).attr('data-slide-bg-color');
            n.css('background-color', a);
            e.emit('transitionEnd');
            c(e);
          },
          resize(e) {
            t(e.$el);
          },
          destroy(e) {
            b(e);
          }
        }
      });
    }
  }
};
</script>
