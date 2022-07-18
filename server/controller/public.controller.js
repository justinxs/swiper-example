const publicService = require('../service/public.service');
const { isSupportCode } = require('../lang');
const { getFullHost } = require('../utils/req');

module.exports = class PublicController {

  async updateLang(ctx, next) {
    let langCode = ctx.request.body.langCode;
    if (isSupportCode(langCode)) {
      const hostname = getFullHost(ctx);
      ctx.langCode = langCode;
      ctx.cookies.set('SWIPER_LANG_CODE', langCode, {
        httpOnly: false,
        domain: hostname,
        path: '/',
        maxAge: 365 * 24 * 60 * 60 * 1000
      });
      return (ctx.body = {
        code: 200,
        data: {
          langCode
        },
        msg: ''
      });
    } else {
      return (ctx.body = {
        code: 500,
        data: null,
        msg: 'langCode is not support!'
      });
    }
  }
};
