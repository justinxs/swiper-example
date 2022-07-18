const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConf = require('./webpack.base.conf.js')('client');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = (env) => {
  const isProd = env.NODE_ENV === 'production';
  const commonOptimization = {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          name: 'vendor', // node_modules内的依赖库
          chunks: 'initial', // 只打包初始时依赖，异步引入单独打包
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          minChunks: 1,
          minSize: 0
        }
      }
    }
  };

  const prodOptimization = {
    minimize: true,
    minimizer: [
      // webpack v5 开箱即带有最新版本的 terser-webpack-plugin，自定义配置仍需安装
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false
          }
        },
        extractComments: false,
        parallel: true
      }),
      // 这个插件使用 cssnano 优化和压缩 CSS
      new CssMinimizerPlugin()
    ]
  };

  const plugins = [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          filter: (resourcePath) => {
            return !/public\/index\.html$/.test(resourcePath);
          },
          to: path.resolve(__dirname, '../dist'),
          noErrorOnMissing: true
        }
      ]
    }),
    // 提取style生成 css文件
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
      ignoreOrder: true
    }),
    new webpack.DefinePlugin({
      'process.env.VUE_ENV': '"client"'
    }),
    // 此插件在输出目录中
    // 生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin()
  ];

  // 目前只在开发时进行 eslint 检查
  !isProd && plugins.unshift(new ESLintPlugin());

  return merge(baseConf, {
    mode: env.NODE_ENV,
    entry: './src/entry-client.js',
    plugins,
    optimization: isProd
      ? Object.assign(commonOptimization, prodOptimization)
      : commonOptimization
  });
};
