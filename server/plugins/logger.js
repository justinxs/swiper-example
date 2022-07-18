const log4js = require('log4js');

const loggerConfig = {
  appenders: {
    console: {
      type: 'console'
    },
    dateFile: {
      type: 'dateFile',
      filename: 'logs/log.log',
      pattern: 'yyyy-MM-dd',
      compress: false
    }
  },
  categories: {
    default: {
      appenders: ['console', 'dateFile'],
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug'
    }
  },
  disableClustering: true
};

function wrapMsg(msg, level) {
  return `Project: Lottery pk10 H5 \r\nTime: ${new Date()}\r\nLevel: ${level}\r\nException: ${msg}`;
}

log4js.configure(loggerConfig);

module.exports = (app) => {
  const logger = log4js.getLogger('console');
  const errorLog = logger.error.bind(logger);

  console.debug = logger.debug.bind(logger);
  console.log = logger.info.bind(logger);
  console.info = logger.info.bind(logger);
  console.warn = logger.warn.bind(logger);
  console.error = ((_error) => {
    return (...e) => {
      const ctx = app.context;

      if (!e) return;

      try {
        const message = e
          .reduce((msgArr, msg) => {
            if (msg) {
              if (typeof msg === 'string') {
                msgArr.push(msg);
              } else if (msg.stack) {
                msgArr.push(msg.stack);
              } else if (msg.message) {
                msgArr.push(msg.message);
              }
              return msgArr;
            }
          }, [])
          .join('\r\n');

        if (message.replace(/[\r\n\s]/g, '')) {
          errorLog(message);
          // 发送远程日志
          if (process.env.SEND_LOG) {
            ctx.exception
              .createLog(
                `chatroom:${process.env.NODE_ENV}`,
                wrapMsg(message, 'Error'),
                'Error'
              )
              .addTags('console')
              .submit();
          }
        }
      } catch (ex) {
        console.warn(`记录日志错误:${ex.stack}`);
      }
    };
  })(console.error);

  return logger;
};
