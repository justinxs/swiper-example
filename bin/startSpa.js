const { getLocalIP } = require('./lib');
process.env.LOCAL_IP = getLocalIP();
const webpack = require('webpack');
const spaConf = require('../build/spa.dev.conf.js');
const themeConf = require('../build/webpack.theme.conf.js');
const WebpackDevServer = require('webpack-dev-server');
const nodemon = require('nodemon');
const serverConfig = require('../config/server.json');
const pkgLanguage = require('./pkgLanguage');

const compiler = webpack([spaConf, themeConf]);
const devServerOptions = { ...spaConf.devServer };
const server = new WebpackDevServer(devServerOptions, compiler);

const runServer = async () => {
  console.log('Starting server...');
  await server.start();
};

pkgLanguage(true);
nodemon(
  `-e js,json,html --watch server --watch config --ignore node_modules/**node_modules --inspect=${serverConfig.inspectPort} ./server/index.js`
);
runServer();

nodemon
  .on('start', function () {
    console.log('App has started');
  })
  .on('quit', function () {
    console.log('App has quit');
    process.exit();
  })
  .on('restart', function (files) {
    console.log('App restarted due to: ', files);
  });
