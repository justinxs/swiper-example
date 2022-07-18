require('./utils/date');
const Koa = require('koa');
const app = new Koa();
const config = require('../config/server.json');
const router = require('./routes');
const plugins = require('./plugins');
const middleware = require('./middleware');

global.appConfig = {
  "cdn": '//cdn.com',
  "version": "1.0.0",
  "api": 'http://api.com',
  "process" :{
      "env": "development",
      "version": "development",
      "site": "Swiper Vue",
      "sendLog": false
  }
};

const setProcess = (processData) => {
  let keys;
  if (processData && (keys = Object.keys(processData)).length) {
    keys.forEach((k) => {
      let val = processData[k];
      if (val === undefined || val === null) return;
      switch (k) {
        case 'env':
          process.env.NODE_ENV = val;
          break;
        case 'port':
          process.env.HTTP_PORT = val;
          break;
        case 'version':
          process.env.VERSION = val;
          break;
        case 'sendLog':
          // 在 process.env 上分配属性会将值隐式转换为字符串
          if (val) {
            process.env.SEND_LOG = val;
          }
          break;
        default:
          break;
      }
    });
  }
};

async function start() {
  let port = config.port,
    host = config.host,
    localIP = process.env.LOCAL_IP;
  // 服务开启时间戳
  global.START_TIME = Date.now();

  // 重写进程环境变量
  setProcess(global.appConfig.process);

  port = process.env.HTTP_PORT || port;

  // 允许代理
  app.proxy = true;

  // 插件
  plugins(app);

  // koa中间件
  middleware(app);

  // 路由中间件
  app.use(router.routes());
  app.use(router.allowedMethods());

  app.listen(port, host);
  console.log('listening http://localhost:' + port);
  console.log(`listening http://${localIP}:` + port);
}

start();
