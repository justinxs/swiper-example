<template>
  <div class="effect-creative">
    <div class="swiper mySwiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide">Slide 1</div>
        <div class="swiper-slide">Slide 2</div>
        <div class="swiper-slide">Slide 3</div>
        <div class="swiper-slide">Slide 4</div>
        <div class="swiper-slide">Slide 5</div>
        <div class="swiper-slide">Slide 6</div>
        <div class="swiper-slide">Slide 7</div>
        <div class="swiper-slide">Slide 8</div>
        <div class="swiper-slide">Slide 9</div>
      </div>
    </div>
    <div class="swiper mySwiper2">
      <div class="swiper-wrapper">
        <div class="swiper-slide">Slide 1</div>
        <div class="swiper-slide">Slide 2</div>
        <div class="swiper-slide">Slide 3</div>
        <div class="swiper-slide">Slide 4</div>
        <div class="swiper-slide">Slide 5</div>
        <div class="swiper-slide">Slide 6</div>
        <div class="swiper-slide">Slide 7</div>
        <div class="swiper-slide">Slide 8</div>
        <div class="swiper-slide">Slide 9</div>
      </div>
    </div>
    <div class="swiper mySwiper3">
      <div class="swiper-wrapper">
        <div class="swiper-slide">Slide 1</div>
        <div class="swiper-slide">Slide 2</div>
        <div class="swiper-slide">Slide 3</div>
        <div class="swiper-slide">Slide 4</div>
        <div class="swiper-slide">Slide 5</div>
        <div class="swiper-slide">Slide 6</div>
        <div class="swiper-slide">Slide 7</div>
        <div class="swiper-slide">Slide 8</div>
        <div class="swiper-slide">Slide 9</div>
      </div>
    </div>
    <div class="swiper mySwiper4">
      <div class="swiper-wrapper">
        <div class="swiper-slide">Slide 1</div>
        <div class="swiper-slide">Slide 2</div>
        <div class="swiper-slide">Slide 3</div>
        <div class="swiper-slide">Slide 4</div>
        <div class="swiper-slide">Slide 5</div>
        <div class="swiper-slide">Slide 6</div>
        <div class="swiper-slide">Slide 7</div>
        <div class="swiper-slide">Slide 8</div>
        <div class="swiper-slide">Slide 9</div>
      </div>
    </div>
    <div class="swiper mySwiper5">
      <div class="swiper-wrapper">
        <div class="swiper-slide">Slide 1</div>
        <div class="swiper-slide">Slide 2</div>
        <div class="swiper-slide">Slide 3</div>
        <div class="swiper-slide">Slide 4</div>
        <div class="swiper-slide">Slide 5</div>
        <div class="swiper-slide">Slide 6</div>
        <div class="swiper-slide">Slide 7</div>
        <div class="swiper-slide">Slide 8</div>
        <div class="swiper-slide">Slide 9</div>
      </div>
    </div>
    <div class="swiper mySwiper6">
      <div class="swiper-wrapper">
        <div class="swiper-slide">Slide 1</div>
        <div class="swiper-slide">Slide 2</div>
        <div class="swiper-slide">Slide 3</div>
        <div class="swiper-slide">Slide 4</div>
        <div class="swiper-slide">Slide 5</div>
        <div class="swiper-slide">Slide 6</div>
        <div class="swiper-slide">Slide 7</div>
        <div class="swiper-slide">Slide 8</div>
        <div class="swiper-slide">Slide 9</div>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper, { EffectCreative } from 'swiper';

export default {
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {
    var swiper = new Swiper('.mySwiper', {
      modules: [EffectCreative],
      grabCursor: true,
      effect: 'creative',
      creativeEffect: {
        prev: {
          shadow: true,
          translate: [0, 0, -400]
        },
        next: {
          translate: ['100%', 0, 0]
        }
      }
    });
    var swiper2 = new Swiper('.mySwiper2', {
      modules: [EffectCreative],
      grabCursor: true,
      effect: 'creative',
      creativeEffect: {
        prev: {
          shadow: true,
          translate: ['-120%', 0, -500]
        },
        next: {
          shadow: true,
          translate: ['120%', 0, -500]
        }
      }
    });
    var swiper3 = new Swiper('.mySwiper3', {
      modules: [EffectCreative],
      grabCursor: true,
      effect: 'creative',
      creativeEffect: {
        prev: {
          shadow: true,
          translate: ['-20%', 0, -1]
        },
        next: {
          translate: ['100%', 0, 0]
        }
      }
    });
    var swiper4 = new Swiper('.mySwiper4', {
      modules: [EffectCreative],
      grabCursor: true,
      effect: 'creative',
      creativeEffect: {
        prev: {
          shadow: true,
          translate: [0, 0, -800],
          rotate: [180, 0, 0]
        },
        next: {
          shadow: true,
          translate: [0, 0, -800],
          rotate: [-180, 0, 0]
        }
      }
    });
    var swiper5 = new Swiper('.mySwiper5', {
      modules: [EffectCreative],
      grabCursor: true,
      effect: 'creative',
      creativeEffect: {
        prev: {
          shadow: true,
          translate: ['-125%', 0, -800],
          rotate: [0, 0, -90]
        },
        next: {
          shadow: true,
          translate: ['125%', 0, -800],
          rotate: [0, 0, 90]
        }
      }
    });
    var swiper6 = new Swiper('.mySwiper6', {
      modules: [EffectCreative],
      grabCursor: true,
      effect: 'creative',
      creativeEffect: {
        prev: {
          shadow: true,
          origin: 'left center',
          translate: ['-5%', 0, -200],
          rotate: [0, 100, 0]
        },
        next: {
          origin: 'right center',
          translate: ['5%', 0, -200],
          rotate: [0, -100, 0]
        }
      }
    });
  },
  beforeDestroy() {},
  methods: {}
};
</script>
<style scoped>
.swiper {
  margin: 100px auto;
  width: 320px;
  height: 240px;
}

.swiper-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: bold;
  color: #fff;
}

.swiper-slide:nth-child(1n) {
  background-color: rgb(206, 17, 17);
}

.swiper-slide:nth-child(2n) {
  background-color: rgb(0, 140, 255);
}

.swiper-slide:nth-child(3n) {
  background-color: rgb(10, 184, 111);
}

.swiper-slide:nth-child(4n) {
  background-color: rgb(211, 122, 7);
}

.swiper-slide:nth-child(5n) {
  background-color: rgb(118, 163, 12);
}

.swiper-slide:nth-child(6n) {
  background-color: rgb(180, 10, 47);
}

.swiper-slide:nth-child(7n) {
  background-color: rgb(35, 99, 19);
}

.swiper-slide:nth-child(8n) {
  background-color: rgb(0, 68, 255);
}

.swiper-slide:nth-child(9n) {
  background-color: rgb(218, 12, 218);
}

.swiper-slide:nth-child(10n) {
  background-color: rgb(54, 94, 77);
}
</style>
