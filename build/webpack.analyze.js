process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const { merge } = require('webpack-merge');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const serverConfig = require('../config/server.json');
const buildConfig = require('./webpack.client.conf');

module.exports = merge(buildConfig({ NODE_ENV: process.env.NODE_ENV }), {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerHost: '127.0.0.1',
      analyzerPort: serverConfig.analyzerPort
    })
  ]
});
