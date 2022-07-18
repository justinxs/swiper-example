const exception = require('./exception');
const logger = require('./logger');
const redis = require('./redis');
const ssrRender = require('./ssrRender');
const request = require('./request');

module.exports = (app, config = {}) => {
  exception(app, config.exception);
  logger(app);
  redis(app, config.redis);
  ssrRender(app);
  request(app);
};
