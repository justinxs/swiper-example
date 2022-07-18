const path = require('path');
const fs = require('fs');
const LRU = require('lru-cache');
const { pathToRegexp } = require('path-to-regexp');
const { createBundleRenderer } = require('vue-server-renderer');
const serverBundle = require('../../dist/vue-ssr-server-bundle.json');
const clientManifest = require('../../dist/vue-ssr-client-manifest.json');
const template = fs.readFileSync(
  path.resolve(__dirname, '../template/index.html'),
  'utf-8'
);
const microCache = new LRU({
  max: 100,
  ttl: 1000 // 重要提示：条目在 1 秒后过期。
});
const seoMap = require('../../config/seo.json');

const isCacheable = (ctx) => {
  // 实现逻辑为，检查请求是否是用户特定(user-specific)。
  // 只有非用户特定 (non-user-specific) 页面才会缓存
  return false;
};

const pathToSeo = (routePath, seoMap) => {
  const seoPaths = Object.keys(seoMap);
  let curSeoPath = '/';
  for (let i = 0; i < seoPaths.length; i++) {
    const seoPath = seoPaths[i];
    const reg = pathToRegexp(seoPath);
    if (reg.test(routePath)) {
      curSeoPath = seoPath;
      break;
    }
  }
  return seoMap[curSeoPath];
};

const setSeo = (seo, context, ctx) => {
  seo = seo || { ...pathToSeo(ctx.path, seoMap) };
  Object.keys(seo).forEach((k) => {
    let val = seo[k] || '';
    switch (k) {
      case 'title':
        context[k] = val;
        break;
      default:
        if (val) {
          context.meta =
            (context.meta || '') + `<meta name="${k}" content="${val}">`;
        }
        break;
    }
  });
  context.curSeo = {
    [ctx.path]: seo
  };
};

const mergeContext = (ctx, options) => {
  const timestamp = global.START_TIME || Date.now();
  const appName = 'Swiper Vue';
  const env = process.env.NODE_ENV;
  const cdn = global.appConfig.cdn;
  const theme = ctx.theme;
  const isDebug = process.env.VERSION !== 'release';
  const context = Object.assign(
    {
      title: appName,
      routeData: {}
    },
    options
  );

  // value 需注入到 window 下的数据
  let value = Object.assign({}, context.value, { cdn, env });
  value = Object.keys(value)
    .map((key) => `var ${key} = ${JSON.stringify(value[key] || '')}`)
    .join(';');

  // ssr render 上下文默认属性，更多动态属性可通过 options 传进来
  context.appName = appName;
  context.env = env;
  context.cdn = cdn;
  context.langCode = ctx.langCode;
  context.url = ctx.url;
  context.theme = theme;
  context.meta =
    (context.meta || '') +
    `<meta name="application-name" content="${appName}"></meta><meta name="resource-version" content="${timestamp}"></meta>`;
  context.link =
    (context.link || '') +
    (!theme || theme === 'light'
      ? ``
      : `<link rel="stylesheet" href="${cdn}/themes/${theme}.css?v=${timestamp}">`);
  context.script =
    (context.script || '') +
    (isDebug ? `<script src="/assets/eruda.js"></script>` : '');
  context.value = value ? `<script>${value};</script>` : '';

  setSeo(options.seo, context, ctx);

  return context;
};

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false, // 推荐
  template, // （可选）页面模板
  clientManifest, // （可选）客户端构建 manifest
  inject: false
});

async function ssrRender(_context) {
  const ctx = this;
  const cacheable = isCacheable(ctx);
  if (cacheable) {
    const hit = microCache.get(ctx.url);
    if (hit) {
      ctx.type = 'html';
      ctx.body = hit;
      return;
    }
  }

  const context = mergeContext(ctx, _context);

  return renderer
    .renderToString(context)
    .then((html) => {
      if (cacheable) {
        microCache.set(ctx.url, html);
      }
      ctx.type = 'html';
      ctx.body = html;
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 404) {
        ctx.status = 404;
        ctx.body = 'Page not found';
      } else {
        ctx.status = 500;
        ctx.body = 'Internal Server Error';
      }
    });
}

module.exports = (app) => {
  app.context.ssrRender = ssrRender;
};
