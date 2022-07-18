const { uuid } = require('../utils');
const { toSupportCode } = require('../lang');

/**
 * 获取应用必要信息
 * 优先级 query => headers => cookies => defaultValue
 */
function getVars(ctx, key) {
  switch (key) {
    case 'version':
      // 版本信息
      return (
        ctx.query.version ||
        ctx.headers['version'] ||
        ctx.cookies.get('SWIPER_VERSION') ||
        global.appConfig.version ||
        '1.0.0'
      );
    case 'ua':
      // user-agent 信息
      return (
        ctx.headers['ua'] ||
        ctx.headers['user-agent'] ||
        ctx.headers['useragent'] ||
        ''
      );
    case 'uuid':
      // 客户端唯一ID
      return (
        ctx.query.uuid ||
        ctx.headers['uuid'] ||
        ctx.cookies.get('SWIPER_UUID') ||
        uuid()
      );
    case 'token':
      // token
      return (
        ctx.query.token ||
        ctx.headers['token'] ||
        ctx.cookies.get('SWIPER_TOKEN') ||
        ''
      );
    case 'langCode':
      // 语言code
      return toSupportCode(
        ctx.query.langCode ||
          ctx.headers['langcode'] ||
          ctx.cookies.get('SWIPER_LANG_CODE') ||
          'zh-TW'
      );
    case 'theme':
      // 主题
      return (
        ctx.query.theme ||
        ctx.headers['theme'] ||
        ctx.cookies.get('SWIPER_THEME') ||
        'light'
      );
    default:
      return '';
  }
}

module.exports = async (ctx, next) => {
  ctx.version = getVars(ctx, 'version');
  ctx.ua = getVars(ctx, 'ua');
  ctx.uuid = getVars(ctx, 'uuid');
  ctx.token = getVars(ctx, 'token');
  ctx.langCode = getVars(ctx, 'langCode');
  ctx.theme = getVars(ctx, 'theme');

  await next();
};
