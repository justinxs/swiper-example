const Exceptionless = require('exceptionless');
/**
 * 日志推送服务
 */
module.exports = (app, config) => {
  if (config) {
    app.context.exception = new Exceptionless.ExceptionlessClient({
      apiKey: config.apiKey,
      serverUrl: config.host
    });
  }
};
