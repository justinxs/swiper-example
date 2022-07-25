<template>
  <div class="expanding-collection">
    <div class="swiper">
      <div class="swiper-wrapper">
        <!-- First slide -->
        <div class="swiper-slide" v-for="(slide, i) in slides" :key="i">
          <!-- Expanding collection container, required element -->
          <div class="expanding-collection-container">
            <!-- Expanding collection content that opens underneath the cover image on click -->
            <div class="expanding-collection-content">
              <div class="expanding-collection-content-inner">
                <!-- Put any required content here -->
                <div class="demo-content">
                  <div class="demo-content-title">{{ slide.title }}</div>
                  <div class="demo-content-avatars">
                    <img :src="slide.imgs.a1" />
                    <img :src="slide.imgs.a2" />
                    <img :src="slide.imgs.a3" />
                    <img :src="slide.imgs.a4" />
                  </div>
                  <div class="demo-content-rating">
                    <img :src="slide.imgs.starOrange" />
                    <img :src="slide.imgs.starOrange" />
                    <img :src="slide.imgs.starOrange" />
                    <img :src="slide.imgs.starOrange" />
                    <img :src="slide.imgs.starGray" />
                  </div>
                </div>
              </div>
            </div>
            <!-- Expanding collection cover, can contain any HTML content -->
            <div class="expanding-collection-cover">
              <img :src="slide.imgs.cover" />
              <div class="demo-cover-title">{{ slide.coverTitle }}</div>
              <div class="demo-cover-coords">{{ slide.coverDesc }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper from 'swiper';

export default {
  components: {},
  props: {},
  data() {
    return {
      slides: [
        {
          title: 'Jameson Street, CA90030',
          coverTitle: 'Tokyo',
          coverDesc: 'North LAT 36\nEast LON 37',
          imgs: {
            a1: require('@/images/collection/a1.jpg'),
            a2: require('@/images/collection/a2.jpg'),
            a3: require('@/images/collection/a3.jpg'),
            a4: require('@/images/collection/a4.jpg'),
            starOrange: require('@/images/collection/star-orange.svg'),
            starGray: require('@/images/collection/star-gray.svg'),
            cover: require('@/images/collection/tokyo.jpg')
          }
        },
        {
          title: 'Jameson Street, CA90030',
          coverTitle: 'San Francisco',
          coverDesc: 'North LAT 36\nEast LON 37',
          imgs: {
            a1: require('@/images/collection/a1.jpg'),
            a2: require('@/images/collection/a2.jpg'),
            a3: require('@/images/collection/a3.jpg'),
            a4: require('@/images/collection/a4.jpg'),
            starOrange: require('@/images/collection/star-orange.svg'),
            starGray: require('@/images/collection/star-gray.svg'),
            cover: require('@/images/collection/san-francisco.jpg')
          }
        },
        {
          title: 'Jameson Street, CA90030',
          coverTitle: 'London',
          coverDesc: 'North LAT 36\nEast LON 37',
          imgs: {
            a1: require('@/images/collection/a1.jpg'),
            a2: require('@/images/collection/a2.jpg'),
            a3: require('@/images/collection/a3.jpg'),
            a4: require('@/images/collection/a4.jpg'),
            starOrange: require('@/images/collection/star-orange.svg'),
            starGray: require('@/images/collection/star-gray.svg'),
            cover: require('@/images/collection/london.jpg')
          }
        },
        {
          title: 'Jameson Street, CA90030',
          coverTitle: 'Moscow',
          coverDesc: 'North LAT 36\nEast LON 37',
          imgs: {
            a1: require('@/images/collection/a1.jpg'),
            a2: require('@/images/collection/a2.jpg'),
            a3: require('@/images/collection/a3.jpg'),
            a4: require('@/images/collection/a4.jpg'),
            starOrange: require('@/images/collection/star-orange.svg'),
            starGray: require('@/images/collection/star-gray.svg'),
            cover: require('@/images/collection/moscow.jpg')
          }
        }
      ]
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.init(document.querySelector('.expanding-collection'));
  },
  beforeDestroy() {},
  methods: {
    init(parant) {
      const n = parant.querySelector('.swiper'),
        o = (e) => {
          const i = e.querySelector('.expanding-collection-cover'),
            n = e.querySelector('.expanding-collection-content');
          if (!n || !i) return;
          const { offsetWidth: o, offsetHeight: t } = i;
          e.style.setProperty('--expanding-collection-cover-height', `${t}px`);
          const { offsetHeight: c, offsetWidth: l } = n,
            r = {
              '--expanding-collection-scale-x': (o / l) * 0.95,
              '--expanding-collection-scale-y': (t / c) * 0.95
            };
          Object.keys(r).forEach((i) => {
            e.style.setProperty(i, r[i]);
          });
        };
      new Swiper(n, {
        speed: 600,
        resistanceRatio: 0,
        slidesPerView: 'auto',
        centeredSlides: !0,
        on: {
          init(e) {
            e.slides.forEach((e) => {
              o(e);
            });
            requestAnimationFrame(() => {
              parant.classList.add('expanding-collection-initialized');
            });
            e.slides.forEach((e) => {
              const i = e.querySelector('.expanding-collection-container'),
                n = e.querySelector('.expanding-collection-cover'),
                o = e.querySelector('.expanding-collection-content');
              n.expandingCollectionClickHandler = () => {
                o &&
                  e.classList.contains('swiper-slide-active') &&
                  i.classList.toggle('expanding-collection-opened');
              };
              n.addEventListener('click', n.expandingCollectionClickHandler);
            });
          },
          slideChange(e) {
            const i = e.wrapperEl.querySelector('.expanding-collection-opened');
            i && i.classList.remove('expanding-collection-opened');
          },
          imagesReady(e) {
            parant.classList.remove('expanding-collection-initialized');
            e.slides.forEach((e) => {
              o(e);
            });
            parant.classList.add('expanding-collection-initialized');
          },
          resize(e) {
            parant.classList.remove('expanding-collection-initialized');
            e.slides.forEach((e) => {
              o(e);
            });
            parant.classList.add('expanding-collection-initialized');
          },
          beforeDestroy(e) {
            e.slides.forEach((e) => {
              const i = e.querySelector('.expanding-collection-cover');
              i &&
                i.expandingCollectionClickHandler &&
                i.removeEventListener(
                  'click',
                  i.expandingCollectionClickHandler
                );
            });
          }
        }
      });
    }
  }
};
</script>
