const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./spa.base.conf.js');
const serverConfig = require('../config/server.json');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = merge(baseConfig, {
  // 从 webpack v4 开始, 指定 mode 会自动地配置 process.env.NODE_ENV
  // 如果 mode 未通过配置或 CLI 赋值，CLI 将使用可能有效的 NODE_ENV 值作为 mode
  mode: 'development',
  devtool: 'cheap-source-map',
  // webpack-dev-server 和 webpack-dev-middleware 里 Watch 模式默认开启
  devServer: {
    static: {
      directory: path.resolve(__dirname, '../dist_spa'),
      watch: true
    },
    compress: true,
    host: serverConfig.host,
    port: serverConfig.spaPort,
    hot: false,
    open: [`http://localhost:${serverConfig.spaPort}`],
    client: {
      progress: true
    },
    proxy: {
      '/api': {
        target: `http://localhost:${serverConfig.port}`,
        pathRewrite: { '^/api': '/api' }
      }
    }
  },
  plugins: [
    new ESLintPlugin()
  ]
});
