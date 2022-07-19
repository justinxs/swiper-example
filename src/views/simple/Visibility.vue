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
  </div>
</template>
<script>
import Swiper from 'swiper';

export default {
  mounted() {
    this.swiper = new Swiper(this.$refs.swiper, {
      watchSlidesProgress: true,
      slidesPerView: 3
    });
  }
};
</script>
<style scoped>
.swiper-slide {
  height: 30vw;
  background: #882525;
  line-height: 30vw;
  text-align: center;
}
.swiper-slide:nth-child(2) {
  background: #8acc7d;
}
.swiper-slide:nth-child(3) {
  background: #b7cc7d;
}
.swiper-slide:nth-child(4) {
  background: #9eb75c;
}
.swiper-slide:nth-child(5) {
  background: #7da8cc;
}
.swiper-slide:nth-child(6) {
  background: #96cc7d;
}
.swiper-slide:nth-child(7) {
  background: #cc7dae;
}
</style>
