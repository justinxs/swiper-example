const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const cdnConfig = require('../cdn/config.js');
const cdnJSON = require('../cdn/cdnJSON.json');
const cdnPaths = Object.keys(cdnJSON).map(
  (p) => new RegExp(p.replace(/[\\/]/g, '[\\\\/]'))
);

module.exports = {
  entry: './src/entry-spa.js',
  performance: {
    // 资源文件最大限制大小warning提示 1100kb
    maxAssetSize: 1100 * 1024,
    maxEntrypointSize: 1000 * 1024
  },
  output: {
    filename: '[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].js',
    path: path.resolve(__dirname, '../dist_spa'),
    publicPath: ''
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compiler: require('vue-template-compiler'),
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.m?js$/,
        loader: 'babel-loader',
        exclude: (file) => {
          return /node_modules/.test(file) || /src[\\/]assets/.test(file);
        }
      },
      {
        test: /\.s?css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // 相对路径，针对本地打开
              publicPath: '../'
            }
          },
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'autoprefixer',
                    {
                      // Options
                    }
                  ]
                ]
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              // Prefer dart-sass or node-sass defalut: dart-sass
              // dart-sass比node-sass编译慢一倍左右
              implementation: require('node-sass')
            }
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                path.resolve(__dirname, '../src/styles/_variables.scss'),
                path.resolve(__dirname, '../src/styles/_functions.scss'),
                path.resolve(__dirname, '../src/styles/_mixins.scss')
              ]
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpe?g|gif|webp)$/i,
        // asset 自动地在 asset/resource 和 asset/inline 之间进行选择, 默认size < 8kb 实行asset/inline
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 // 4kb
          }
        },
        generator: {
          filename: ({
            module,
            runtime,
            filename,
            chunkGraph,
            contentHash
          }) => {
            return 'images/[name].[hash][ext]';
            /* hack filename 比 publicPath要早执行，提前修改 publicPath */
            // module.generator.publicPath = undefined;
            // if (cdnPaths.some((r) => r.test(filename))) {
            //   module.generator.publicPath = cdnConfig.URL;
            // }
            // return (
            //   'images' +
            //   filename.replace(/^src[\\/]images/, '') +
            //   '?v=' +
            //   contentHash.slice(0, 8)
            // );
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        // asset 自动地在 asset/resource 和 asset/inline 之间进行选择, 默认size < 8kb 实行asset/inline
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 // 4kb
          }
        },
        generator: {
          filename: ({
            module,
            runtime,
            filename,
            chunkGraph,
            contentHash
          }) => {
            return 'fonts/[name].[hash][ext]';
            /* hack filename 比 publicPath要早执行，提前修改 publicPath */
            // module.generator.publicPath = undefined;
            // if (cdnPaths.some((r) => r.test(filename))) {
            //   module.generator.publicPath = cdnConfig.URL;
            // }
            // return (
            //   'fonts' +
            //   filename.replace(/^src[\\/]fonts/, '') +
            //   '?v=' +
            //   contentHash.slice(0, 8)
            // );
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
    // 自动注入js、css等入口资源生成html文件
    new HtmlWebpackPlugin({
      inject: true,
      title: 'Swiper Vue',
      filename: 'index.html',
      template: path.resolve(__dirname, '../public/index.html')
    }),
    new VueLoaderPlugin(),
    // 注入webpack编译时js中的全局变量
    new webpack.DefinePlugin({
      'process.env.APP_NAME': JSON.stringify('Swiper Vue'),
      'process.env.BUILD_MODE': JSON.stringify('spa'),
      'process.env.THEME': JSON.stringify(process.env.THEME || 'light'),
      'process.env.DEBUG': JSON.stringify(process.env.DEBUG || '0'),
      'process.env.API': JSON.stringify(process.env.API || 'prod')
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          filter: (resourcePath) => {
            return (
              !/public\/index\.html$/.test(resourcePath) &&
              (process.env.DEBUG == 1 ||
                !/public\/assets\/eruda\.js$/.test(resourcePath))
            );
          },
          to: path.resolve(__dirname, '../dist_spa'),
          noErrorOnMissing: true
        }
      ]
    }),
    // 提取style生成 css文件
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
      ignoreOrder: true
    })
  ],
  resolve: {
    // 路径别名以及文件默认查找后缀数组
    // vue 同时引入require和import两种方式导致webpack打包两份vue.js
    alias: {
      vue: 'vue/dist/vue.runtime.common.js',
      '@': path.resolve(__dirname, '../src'),
      '@styles': path.resolve(__dirname, '../src/styles'),
      '@images': path.resolve(__dirname, '../src/images'),
      '@assets': path.resolve(__dirname, '../src/assets'),
      '@theme': path.resolve(
        __dirname,
        `../src/styles/themes/${process.env.THEME || 'light'}.scss`
      )
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.vue', '.json']
  },
  optimization: {
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
  }
};
