const axios = require('axios');

class Apollo {
  /**
   * 构造函数
   * @param {Object} config 配置对象
   * @param {String} config.url 请求地址
   * @param {String} config.appId appid
   * @param {String} config.namespaceName 请求的命名空间
   * @param {String} config.clusterName 请求的节点名称 默认 default
   * @param {String} config.type 读取到的类型 默认json,可选值json, application
   * @param {String} config.configName 写入的配置名称 默认appConfig
   */
  constructor({
    url,
    appId,
    namespaceName,
    clusterName = 'default',
    configName = 'appConfig',
    type = 'json'
  }) {
    this.namespaceName = namespaceName;
    this.configName = configName;
    this.appId = appId;
    this.url = url;
    this.clusterName = clusterName || 'default';
    this.notificationId = -1;
    this.faileRetryCount = 0;
    this.type = type;
    this.config = {
      timeout: 65000,
      validateStatus: function (status) {
        return status >= 200 && status <= 304;
      }
    };
  }

  /**
   * 应用启动
   */
  start() {
    console.log(
      `request apollo server =====> url:${this.url}  namespaceName:${this.namespaceName}  notificationId: ${this.notificationId}`
    );
    let notifications = JSON.stringify([
      {
        namespaceName: `${this.namespaceName}${
          this.type == 'json' ? '.json' : ''
        }`,
        notificationId: this.notificationId
      }
    ]);
    let url = `${this.url}/notifications/v2?appId=${this.appId}&cluster=${
      this.clusterName
    }&notifications=${encodeURIComponent(notifications)}`;
    let options = {
      ...this.config,
      url
    };

    console.info(`url:${url}  request start`);

    axios
      .request(options)
      .then((result) => {
        console.info(
          `url:${url}  request end status: ${
            result.status
          }  data: ${JSON.stringify(result.data)}`
        );
        // 如果是200代表有需要更新的配置
        if (result.status == 200) {
          // 更新ID
          this.notificationId = result.data[0].notificationId;
          this._requireConfig();
        } else if (result.status == 304) {
          // 如果是304则继续调用重复请求，每60s一次
          this.start();
        }
        return null;
      })
      .catch((ex) => {
        console.error(ex);
        setTimeout(() => {
          this.start();
        }, 60000);
      });
  }

  /**
   * 获取配置
   */
  getConfig() {
    return this._requireConfig(true);
  }

  /**
   * 请求配置
   */
  _requireConfig(first = false) {
    return new Promise((resolve, reject) => {
      let url = `${this.url}/configs/${this.appId}/${this.clusterName}/${
        this.namespaceName
      }${this.type == 'json' ? '.json' : ''}`;
      let options = {
        ...this.config,
        url
      };

      console.info(`url:${url}  request start`);

      // 请求配置
      axios
        .request(options)
        .then((result) => {
          console.info(
            `url:${url}  request end status: ${
              result.status
            }  data: ${JSON.stringify(result.data)}`
          );
          if (result.status == 200) {
            this.faileRetryCount = 0;
            if (this.type == 'json') {
              global[this.configName] = JSON.parse(
                result.data.configurations.content
              );
              resolve(JSON.parse(result.data.configurations.content));
            } else {
              let _config = {};
              for (let item in result.data.configurations) {
                try {
                  _config[item] = JSON.parse(result.data.configurations[item]);
                } catch (error) {
                  _config[item] = result.data.configurations[item];
                }
              }

              global[this.configName] = _config;
              resolve(_config);
            }
          }
          if (!first) {
            this.start();
          }
          return null;
        })
        .catch((ex) => {
          console.error(ex);
          this._retryRequestConfig();
        });
    });
  }

  /**
   * 重试请求
   */
  _retryRequestConfig() {
    console.error(`retry request config ======> ${this.faileRetryCount}`);
    // 一分钟之内请求都失败则停止请求
    if (this.faileRetryCount < 6) {
      this.faileRetryCount++;
      // 如果失败则10s后需要再次请求
      setTimeout(() => {
        this._requireConfig();
      }, 10000);
    } else {
      console.error(
        `retry request config too much times, will restart after 10 minute`
      );
      // 十分钟之后会再次启动
      this.faileRetryCount = 0;
      setTimeout(() => {
        this._requireConfig();
      }, 600000);
    }
  }
}

module.exports = Apollo;
