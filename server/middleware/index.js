const error = require('./error');
const entry = require('./entry');
const upload = require('./upload');
const bodyparser = require('./bodyparser');
const resource = require('./resource');
const api = require('./api');

module.exports = (app) => {
  app.use(error);
  app.use(entry);
  app.use(resource);
  app.use(api);
  app.use(upload);
  app.use(bodyparser);
};
