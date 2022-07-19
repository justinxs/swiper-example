<template>
  <div ref="swiper" class="swiper" style="width: 100%; height: 100%">
    <div class="swiper-wrapper">
      <div class="swiper-slide">Resize me!</div>
      <div class="swiper-slide">Resize me!</div>
      <div class="swiper-slide">Resize me!</div>
      <div class="swiper-slide">Resize me!</div>
      <div class="swiper-slide">Resize me!</div>
      <div class="swiper-slide">Resize me!</div>
      <div class="swiper-slide">Resize me!</div>
      <div class="swiper-slide">Resize me!</div>
      <div class="swiper-slide">Resize me!</div>
      <div class="swiper-slide">Resize me!</div>
    </div>
    <div class="swiper-button-next reactive"></div>
    <div class="swiper-button-prev reactive"></div>
  </div>
</template>
<script>
import Swiper, { Navigation } from 'swiper';

export default {
  mounted() {
    function getDirection() {
      return window.innerWidth <= 760 ? 'vertical' : 'horizontal';
    }
    this.swiper = new Swiper(this.$refs.swiper, {
      modules: [Navigation],
      slidesPerView: 3,
      direction: getDirection(),
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      on: {
        resize: function (swiper) {
          swiper.changeDirection(getDirection());
        }
      }
    });
  }
};
</script>
<style scoped>
.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<style>
@media (max-width: 760px) {
  .reactive.swiper-button-next {
    right: 20px;
    transform: rotate(90deg);
  }

  .reactive.swiper-button-prev {
    left: 20px;
    transform: rotate(90deg);
  }
}
</style>
