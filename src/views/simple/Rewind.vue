<template>
  <div ref="swiper" class="swiper" style="width: 100%; height: 100%">
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
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</template>
<script>
import Swiper, { Navigation } from 'swiper';

export default {
  mounted() {
    this.swiper = new Swiper(this.$refs.swiper, {
      modules: [Navigation],
      rewind: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
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
