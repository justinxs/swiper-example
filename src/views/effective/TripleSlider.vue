<template>
  <div class="triple-slider">
    <!-- Duplicate swipers will be created automatically -->
    <!-- Main center swiper -->
    <div class="swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(slide, i) in slides" :key="i">
          <img class="bg-image" :src="slide.bg" alt="" />
          <img
            class="logo-image logo-image-1"
            data-swiper-parallax-x="50%"
            :src="slide.logo"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper, { Controller, Parallax } from 'swiper';

export default {
  components: {},
  props: {},
  data() {
    return {
      slides: [
        {
          bg: require('@/images/triple/guardians-of-the-galaxy.jpg'),
          logo: require('@/images/triple/guardians-of-the-galaxy-logo.png')
        },
        {
          bg: require('@/images/triple/justice-league.jpg'),
          logo: require('@/images/triple/justice-league-logo.png')
        },
        {
          bg: require('@/images/triple/spider-man.jpg'),
          logo: require('@/images/triple/spider-man-logo.png')
        },
        {
          bg: require('@/images/triple/suicide-squad.jpg'),
          logo: require('@/images/triple/suicide-squad-logo.png')
        },
        {
          bg: require('@/images/triple/thor-ragnarok.jpg'),
          logo: require('@/images/triple/thor-ragnarok-logo.png')
        }
      ]
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.init(document.querySelector('.triple-slider'));
  },
  beforeDestroy() {},
  methods: {
    merge(target1, target2) {
      return Object.defineProperties(
        target1,
        Object.getOwnPropertyDescriptors(target2)
      );
    },
    setItem(target, key, val) {
      return key in target
        ? Object.defineProperty(target, key, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: val
          })
        : (target[key] = val);
    },
    mergeConfig(target1, target2) {
      for (const key in target2 || (target2 = {})) {
        Object.prototype.hasOwnProperty.call(target2, key) &&
          this.setItem(target1, key, target2[key]);
      }
      if (Object.getOwnPropertySymbols) {
        for (const key of Object.getOwnPropertySymbols(target2)) {
          Object.prototype.propertyIsEnumerable.call(target2, key) &&
            this.setItem(target1, key, target2[key]);
        }
      }
      return target1;
    },
    init(parent) {
      const swEl = parent.querySelector('.swiper'),
        cloneSwEl = swEl.cloneNode(true);

      cloneSwEl.classList.add('triple-slider-prev');
      parent.insertBefore(cloneSwEl, swEl);

      const cloneSlideEls = cloneSwEl.querySelectorAll('.swiper-slide'),
        lastCloneSlideEl = cloneSlideEls[cloneSlideEls.length - 1];

      cloneSwEl
        .querySelector('.swiper-wrapper')
        .insertBefore(lastCloneSlideEl, cloneSlideEls[0]);

      const cloneSwEl2 = swEl.cloneNode(true);

      cloneSwEl2.classList.add('triple-slider-next');
      parent.appendChild(cloneSwEl2);

      const firstCloneSwEl2SlideEl =
        cloneSwEl2.querySelectorAll('.swiper-slide')[0];

      cloneSwEl2
        .querySelector('.swiper-wrapper')
        .appendChild(firstCloneSwEl2SlideEl);

      swEl.classList.add('triple-slider-main');

      const config = {
        modules: [Controller, Parallax],
        speed: 600,
        loop: true,
        parallax: true
      };

      let f;
      const y = new Swiper(
          cloneSwEl,
          this.merge(this.mergeConfig({}, config), {
            allowTouchMove: false,
            on: {
              click() {
                f.slidePrev();
              }
            }
          })
        ),
        m = new Swiper(
          cloneSwEl2,
          this.merge(this.mergeConfig({}, config), {
            allowTouchMove: false,
            on: {
              click() {
                f.slideNext();
              }
            }
          })
        );
      f = new Swiper(
        swEl,
        this.merge(this.mergeConfig({}, config), {
          grabCursor: true,
          controller: {
            control: [y, m]
          },
          on: {
            destroy() {
              y.destroy();
              m.destroy();
            }
          }
        })
      );
    }
  }
};
</script>
