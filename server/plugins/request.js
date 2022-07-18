const axios = require('axios');
const { getClientIp } = require('../utils/req');
const { md5 } = require('../utils/encodeLib');
const LRU = require('lru-cache');
const CACHE = new LRU({
  max: 50,
  ttl: 1000 * 3
});

/**
 * 日志推送服务
 */
module.exports = (app) => {
  function formatOpt(ctx, options) {
    const baseURL = global.appConfig.api;
    const cip = getClientIp(ctx);

    let defaultOptions = {
      baseURL,
      timeout: 15000
    };

    options = Object.assign(defaultOptions, options);
    options.params = {
      ...(options.params || {})
    };
    options.headers = {
      ...(options.headers || {}),
      'x-token': ctx.token || '',
      'user-agent': ctx.ua || '',
      'X-Real-IP': cip,
      'x-real-ip': cip
    };

    ctx.urlType = urlType;

    return options;
  }

  function formatBody(ctx, body) {
    // { code: 200, data: {}, msg: '' }
    body = {
      code: body.code == 1 ? 200 : body.code,
      data: body.data,
      msg: body.msg || body.message || ''
    };
    return body;
  }

  function createRequest(ctx, options, cacheOpt) {
    return new Promise((resolve, reject) => {
      axios
        .request(options)
        .then((result) => {
          if (
            cacheOpt &&
            cacheOpt.key &&
            cacheOpt.maxAge > 0 &&
            result &&
            result.data
          ) {
            CACHE.set(cacheOpt.key, result.data, { ttl: cacheOpt.maxAge });
          }

          if (process.env.NODE_ENV === 'development') {
            console.log(
              `Api-URL:${options.baseURL}${options.url}--->${JSON.stringify(
                options.params
              )}--------------success`
            );
            console.log(
              `Api-URL:${options.baseURL}${
                options.url
              } result--->${JSON.stringify(result.data)}--------------success`
            );
          }

          if (
            result.data.code == 400 ||
            result.data.ErrorCode == 400 ||
            result.data.Code == 400
          ) {
            console.error(
              `Api-URL:${options.baseURL}${options.url}--->${JSON.stringify(
                options.params
              )}---------------error\r\n${JSON.stringify(result.data)}`
            );
          }

          resolve(result.data);
        })
        .catch((ex) => {
          if (process.env.SEND_LOG) {
            let _exception = ctx.exception
              .createException(ex)
              .setSource('Interface Error')
              .setMessage(`${options.url}`)
              .setProperty('API', `${options.baseURL}${options.url}`)
              .setProperty('Params', JSON.stringify(options.params))
              .setProperty('Data', JSON.stringify(options.data))
              // Set the quote number.
              .setProperty('header', options.headers)
              // Add an order tag.
              .addTags('Interface')
              // Mark critical.
              .markAsCritical();

            if (ex.message.indexOf('404') > -1) {
              _exception.setType('404');
            }

            _exception.submit();
          } else {
            console.error(
              `Api-URL:${options.baseURL}${options.url}` +
                `\r\n[method]          -------->${options.method}` +
                `\r\n[headers]         -------->${JSON.stringify(
                  options.headers
                )}` +
                `\r\n[params]          -------->${JSON.stringify(
                  options.params
                )}` +
                `\r\n[body]            -------->${JSON.stringify(
                  options.data
                )}` +
                `\r\n[status]          -------->${ex.response.status}` +
                `\r\n[response<data>]  -------->${
                  ex.response && ex.response.data
                }` +
                `\r\n[message]         -------->${ex.message}` +
                `\r\n[stack]           -------->\r\n${ex.stack}`
            );
          }
          resolve({
            code: ex.response.status,
            data: ex.response && ex.response.data,
            msg: ex.message
          });
        });
    });
  }

  app.context.requestTo = async function request(httpOpt, cacheOpt) {
    const ctx = this;

    if (cacheOpt && cacheOpt.key) {
      let fromCache = CACHE.get(cacheOpt.key);
      if (fromCache) {
        if (process.env.NODE_ENV === 'development') {
          console.debug(
            `from cache: ${cacheOpt.key}, maxAge: ${cacheOpt.maxAge}`
          );
        }
        return fromCache;
      }
    }

    let options = formatOpt(ctx, httpOpt);

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `Api-URL:${options.baseURL}${options.url}--->method: ${
          options.method
        }; query: ${JSON.stringify(options.params)}; body: ${JSON.stringify(
          options.data
        )}--------------begin`
      );
    }

    return createRequest(ctx, options, cacheOpt);
  };

  // 直接代理请求
  app.context.requestDirectTo = async function requestDirect(
    baseURL,
    cacheOpt
  ) {
    const ctx = this;

    if (cacheOpt && cacheOpt.key) {
      let fromCache = CACHE.get(cacheOpt.key);
      if (fromCache) {
        if (process.env.NODE_ENV === 'development') {
          console.debug(
            `from cache: ${cacheOpt.key}, maxAge: ${cacheOpt.maxAge}`
          );
        }
        return fromCache;
      }
    }

    let proxyOptions = {
      method: ctx.method,
      url: ctx.path,
      headers: ctx.headers,
      params: ctx.query,
      data: ctx.request.body
    };
    let options = formatOpt(
      ctx,
      baseURL ? { ...proxyOptions, baseURL } : proxyOptions
    );

    return createRequest(ctx, options, cacheOpt);
  };

  // 请求成功数据转换
  app.context.successBody = function successBody(body) {
    const ctx = this;
    return formatBody(ctx, body);
  };

  // 请求执行错误统一处理
  app.context.errorBody = function errorBody(body) {
    body = Object.assign(
      { code: 500, data: {}, msg: body ? body.message || body.msg : '' },
      body
    );
    const ctx = this;
    return formatBody(ctx, body);
  };
};
