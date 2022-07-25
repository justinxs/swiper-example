<template>
  <div class="on-boarding">
    <div class="paper-onboarding">
      <div class="swiper">
        <div class="swiper-wrapper">
          <!-- specify slide's color with data-paper-bg-color attribute -->
          <div
            class="swiper-slide"
            v-for="(slide, i) in slides"
            :key="i"
            :data-paper-bg-color="slide.color"
          >
            <div class="slide-inner">
              <img class="slide-image" :src="slide.img" />
              <div class="slide-title">{{ slide.title }}</div>
              <div class="slide-text">
                {{ slide.desc }}
              </div>
            </div>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper, { Pagination, EffectCreative } from 'swiper';

export default {
  components: {},
  props: {},
  data() {
    return {
      slides: [
        {
          color: '#6002EE',
          img: require('@/images/banks.svg'),
          title: 'Banks',
          desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.\nAsperiores sed tempora corrupti officia.'
        },
        {
          color: '#008386',
          img: require('@/images/hotels.svg'),
          title: 'Hotels',
          desc: 'Omnis ut voluptate eius. Explicabo, praesentium ea sit tenetur\ninventore delectus.'
        },
        {
          color: '#a41fa8',
          img: require('@/images/business.svg'),
          title: 'Business',
          desc: 'Odio minus cumque sint facere hic accusamus sed quas eius\nrecusandae.'
        },
        {
          color: '#007700',
          img: require('@/images/checkmark.svg'),
          title: 'Done',
          desc: 'Eos, corporis quia sequi ipsam similique nemo nesciunt\nquibusdam.'
        }
      ]
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.init(document.querySelector('.paper-onboarding'), 'vertical');
  },
  beforeDestroy() {
    this.resizer && this.resizer.clear();
  },
  methods: {
    init(parent, direction = 'horizontal') {
      let paper;
      const o = [],
        resizeHandler = () => {
          const { offsetWidth, offsetHeight } = parent,
            a = ((offsetWidth / 2) ** 2 + (offsetHeight / 2) ** 2) ** 0.5;
          paper.style.width = 4 * a + 'px';
          paper.style.height = 4 * a + 'px';
          paper.style.marginLeft =
            'vertical' === direction ? `-${2 * a}px` : `-${a}px`;
          paper.style.marginTop =
            'vertical' === direction ? `-${a}px` : `-${2 * a}px`;
        };
      paper = document.createElement('div');
      paper.classList.add('paper-onboarding-fills');
      parent.prepend(paper);
      parent.querySelectorAll('.swiper-slide').forEach((e) => {
        const bgColor = e.getAttribute('data-paper-bg-color') || '#000',
          bgEl = document.createElement('div');
        bgEl.classList.add('paper-onboarding-fill');
        bgEl.style.backgroundColor = bgColor;
        paper.appendChild(bgEl);
        o.push(bgEl);
      });
      resizeHandler();
      window.addEventListener('resize', resizeHandler);
      this.resizer = {
        clear() {
          window.removeEventListener('resize', resizeHandler);
        }
      };
      new Swiper(parent.querySelector('.swiper'), {
        modules: [Pagination, EffectCreative],
        effect: 'creative',
        direction: direction,
        speed: 500,
        resistanceRatio: false,
        grabCursor: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true
        },
        creativeEffect: {
          progressMultiplier: 2,
          prev: {
            opacity: 0,
            translate: 'vertical' === direction ? [0, -128, 0] : [-128, 0, 0]
          },
          next: {
            opacity: 0,
            translate: 'vertical' === direction ? [0, 128, 0] : [128, 0, 0]
          }
        },
        on: {
          setTranslate: (swiper) => {
            const { slides } = swiper;
            for (let a = 0; a < slides.length; a += 1) {
              const e = slides[a].progress,
                r = 1 - Math.max(Math.min(Math.abs(e), 1), 0);
              o[a].style.transform = e < 0 ? `scale(${r})` : 'scale(1)';
            }
          },
          setTransition: (e, t) => {
            o.forEach((e) => {
              e.style.transitionDuration = `${t}ms`;
            });
          }
        }
      });
    }
  }
};
</script>
