<template>
  <div class="carousel-slider">
    <div class="swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(slide, i) in slides" :key="i">
          <!-- elements with  "swiper-carousel-animate-opacity" class will have animated opacity -->
          <div class="swiper-carousel-animate-opacity">
            <img :src="slide.img" alt="" />
            <div class="slide-content">
              <h2>{{ slide.title }}</h2>
              <p>{{ slide.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
    <div class="swiper-pagination"></div>
  </div>
</template>
<script>
import Swiper, { Pagination, Navigation, Autoplay } from 'swiper';

const Carousel = ({ swiper, on }) => {
  on('beforeInit', () => {
    if ('carousel' !== swiper.params.effect) return;
    swiper.classNames.push(`${swiper.params.containerModifierClass}carousel`);
    const config = {
      watchSlidesProgress: !0,
      centeredSlides: !0
    };
    Object.assign(swiper.params, config);
    Object.assign(swiper.originalParams, config);
  });
  on('progress', () => {
    if ('carousel' !== swiper.params.effect) return;
    const s = swiper.slides.length;
    for (let r = 0; r < swiper.slides.length; r += 1) {
      const t = swiper.slides[r],
        o = swiper.slides[r].progress,
        i = Math.abs(o);
      let a = 1;
      i > 1 && (a = 0.3 * (i - 1) + 1);
      const n = t.querySelectorAll('.swiper-carousel-animate-opacity'),
        l = o * a * 50 + '%',
        c = 1 - 0.2 * i,
        u = s - Math.abs(Math.round(o));
      t.style.transform = `translateX(${l}) scale(${c})`;
      t.style.zIndex = u;
      t.style.opacity = i > 3 ? 0 : 1;
      n.forEach((el) => {
        el.style.opacity = 1 - i / 3;
      });
    }
  });
  on('setTransition', (s, r) => {
    if ('carousel' === swiper.params.effect)
      for (let t = 0; t < swiper.slides.length; t += 1) {
        const s = swiper.slides[t],
          o = s.querySelectorAll('.swiper-carousel-animate-opacity');
        s.style.transitionDuration = `${r}ms`;
        o.forEach((el) => {
          el.style.transitionDuration = `${r}ms`;
        });
      }
  });
};

export default {
  components: {},
  props: {},
  data() {
    return {
      slides: [
        {
          img: require('@/images/triple/guardians-of-the-galaxy.jpg'),
          title: 'Guardians Of The Galaxy',
          desc: 'A group of intergalactic criminals must pull together to stop a\nfanatical warrior with plans to purge the universe.'
        },
        {
          img: require('@/images/triple/justice-league.jpg'),
          title: 'Justice League',
          desc: "Determined to ensure Superman's ultimate sacrifice was not in\nvain, Bruce Wayne aligns forces with Diana Prince with plans to\nrecruit a team of metahumans to protect the world from an\napproaching threat of catastrophic proportions."
        },
        {
          img: require('@/images/triple/spider-man.jpg'),
          title: 'Spider-Man: Far from Home',
          desc: 'Following the events of Avengers: Endgame (2019), Spider-Man\nmust step up to take on new threats in a world that has changed\nforever.'
        },
        {
          img: require('@/images/triple/suicide-squad.jpg'),
          title: 'The Suicide Squad',
          desc: 'Supervillains Harley Quinn, Bloodsport, Peacemaker and a\ncollection of nutty cons at Belle Reve prison join the\nsuper-secret, super-shady Task Force X as they are dropped off\nat the remote, enemy-infused island of Corto Maltese.'
        },
        {
          img: require('@/images/triple/thor-ragnarok.jpg'),
          title: 'Thor: Ragnarok',
          desc: 'Imprisoned on the planet Sakaar, Thor must race against time to\nreturn to Asgard and stop Ragnarök, the destruction of his\nworld, at the hands of the powerful and ruthless villain Hela.'
        }
      ]
    };
  },
  computed: {},
  created() {},
  mounted() {
    new Swiper('.swiper', {
      modules: [Pagination, Navigation, Autoplay, Carousel],
      effect: 'carousel',
      grabCursor: !0,
      loop: !0,
      loopedSlides: 5,
      slidesPerView: 'auto',
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      pagination: {
        el: '.swiper-pagination'
      },
      autoplay: {
        delay: 3e3
      }
    });
  },
  beforeDestroy() {},
  methods: {}
};
</script>
