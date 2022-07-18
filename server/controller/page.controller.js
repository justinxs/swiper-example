const { getFullHost } = require('../utils/req');

function setPageCookies(ctx) {
  const hostname = getFullHost(ctx);

  ctx.cookies.set('SWIPER_UUID', ctx.uuid, {
    httpOnly: false,
    domain: hostname,
    path: '/',
    maxAge: 365 * 24 * 60 * 60 * 1000
  });

  ctx.cookies.set('SWIPER_VERSION', ctx.version, {
    httpOnly: false,
    domain: hostname,
    path: '/'
  });

  ctx.cookies.set('SWIPER_LANG_CODE', ctx.langCode, {
    httpOnly: false,
    domain: hostname,
    path: '/',
    maxAge: 365 * 24 * 60 * 60 * 1000
  });


  ctx.cookies.set('SWIPER_TOKEN', ctx.token, {
    httpOnly: true,
    domain: hostname,
    path: '/'
  });

  ctx.cookies.set('SWIPER_THEME', ctx.theme, {
    httpOnly: false,
    domain: hostname,
    path: '/'
  });
}

module.exports = class PageController {
  constructor() {}

  async page(ctx, next) {
    // ssr 上下文对象
    let ssrContext = {
      routeData: {}
    };
    // page url参数是 cookies 值的来源，在 page 中写入 cookies
    setPageCookies(ctx);

    return ctx.ssrRender(ssrContext);
  }
  async notFound(ctx, next) {
    try {
      setPageCookies(ctx);
      return ctx.ssrRender({
        routeData: {}
      });
    } catch (ex) {
      console.error(ex);
    }
  }
};
