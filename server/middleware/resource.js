const path = require('path');
const staticCache = require('koa-static-cache');
const LRU = require('lru-cache');
// 服务器缓存，最多1000个，最大缓存时间1个钟，过期后服务器重新读取对应文件
const files = new LRU({ max: 1000, ttl: 60 * 60 * 1000 });
const resourceMiddleware = staticCache({
  dir: path.join(__dirname, '../../dist'),
  dynamic: true,
  // Cache-Control: max-age=<seconds>
  // 浏览器缓存(served from [memory|disk] cache)，
  // 过期后验证其有效性即协商缓存（对比文件没修改应返回 304 Not Modified）
  // If-Modified-Since === Last-Modified  If-None-Match === ETag
  maxAge: 0,
  // Content-Encoding: gzip
  gzip: false,
  files: files
});

module.exports = async (ctx, next) => {
  if (
    /(vue-ssr-client-manifest\.json$)|(vue-ssr-server-bundle\.json$)/i.test(
      ctx.path
    )
  ) {
    await next();
  } else {
    await resourceMiddleware(ctx, next);
  }
};
