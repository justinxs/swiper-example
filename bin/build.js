const env = process.env;
const webpack = require('webpack');
const clientConf = require('../build/webpack.client.conf.js')(env);
const serverConf = require('../build/webpack.server.conf.js')(env);
const themeConf = require('../build/webpack.theme.conf.js');
const rm = require('rimraf');
const path = require('path');
const { loadESMoudle } = require('./lib');
const pkgLanguage = require('./pkgLanguage');

const compiler = webpack([clientConf, serverConf, themeConf]);

Promise.all([loadESMoudle(['chalk', 'ora']), pkgLanguage()])
  .then(([[chalk, ora]]) => {
    const spinner = ora('building...').start();

    rm.sync(path.resolve(__dirname, '../dist'));
    compiler.run((err, stats) => {
      spinner.stop();
      if (err) {
        console.error(chalk.red(err.stack || err));
        if (err.details) {
          console.log(chalk.red(err.details));
        }
      } else {
        process.stdout.write(
          stats.toString({
            colors: true,
            modules: false,
            children: true, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
            chunks: false,
            chunkModules: false,
            cachedAssets: false,
            entrypoints: false
          }) + '\n\n'
        );

        // 删除无关的themes js
        rm.sync(path.resolve(__dirname, '../dist/themes/js'));

        console.log(chalk.cyan('  Build complete.\n'));
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.error(info.errors);
      }

      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }
    });
  })
  .catch((err) => {
    console.error(err);
  });
