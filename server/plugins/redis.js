const redis = require('redis');

/**
 * redis操作类
 */
class Redis {
  constructor(host, port, db = 8) {
    this.host = host;
    this.port = port;
    this.db = db;
    this.open();
    this.redis.on('error', (err) => {
      this.redis.quit();
      this.redis = null;
      console.error(err);
    });
  }

  close() {
    this.redis.quit();
  }

  open() {
    // 如果被关闭则重新打开
    if (!this.redis) {
      console.log('open redis connection=========');
      this.redis = redis.createClient({
        socket_keepalive: true,
        db: this.db,
        port: this.port,
        host: this.host
      });
    }

    return this.redis;
  }

  get(key) {
    return new Promise((resolve, reject) => {
      try {
        this.open();
        this.redis.get(key, (err, reply) => {
          if (err) {
            reject(err);
          } else {
            resolve(reply);
          }
        });
      } catch (ex) {
        reject(ex);
      }
    });
  }

  hmget(key) {
    return new Promise((resolve, reject) => {
      try {
        this.open();
        this.redis.hgetall(key, (err, reply) => {
          if (err) {
            reject(err);
          } else {
            resolve(reply);
          }
        });
      } catch (ex) {
        reject(ex);
      }
    });
  }

  /**
   * 设置redis对象
   * @param {*} key
   * @param {*} value
   * @param {*} expire 单位秒
   */
  hmset(key, value, expire) {
    return new Promise((resolve, reject) => {
      try {
        this.open();
        this.redis.hmset(key, value, (err, reply) => {
          if (err) {
            reject(err);
          } else {
            expire ? this.redis.expire(key, expire) : '';
            resolve(reply);
          }
        });
      } catch (ex) {
        reject(ex);
      }
    });
  }

  /**
   * 设置redis
   * @param {*} key
   * @param {*} value
   * @param {*} expire 单位秒
   */
  set(key, value, expire) {
    return new Promise((resolve, reject) => {
      try {
        this.open();
        this.redis.set(key, value, (err, reply) => {
          if (err) {
            reject(err);
          } else {
            expire ? this.redis.expire(key, expire) : '';
            resolve(reply);
          }
        });
      } catch (ex) {
        reject(ex);
      }
    });
  }

  /**
   * 移除值
   * @param {*} key
   */
  remove(key) {
    return new Promise((resolve, reject) => {
      try {
        this.open();
        resolve(this.redis.expire(key, 1));
      } catch (ex) {
        reject(ex);
      }
    });
  }
}

module.exports = (app, config) => {
  if (config) {
    app.context.redis = new Redis(config.host, config.port, config.db);
  }
};
