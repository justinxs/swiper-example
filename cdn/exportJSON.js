const path = require('path');
const fs = require('fs');
const config = require('./config');
const defaultPaths = config.includePaths || [];

/**
 * 根据config配置导出相应的CDN资源路径JSON
 * npm run export   =>   cdnJSON.json
 */
const loopTree = async (resPath) => {
  let res = {};
  try {
    const stats = await fs.promises.stat(resPath);
    const key = resPath.replace(/.*?[\\/]src[\\/]/, '').replace(/\\/g, '/');
    if (stats.isFile()) {
      if (stats.size >= config.minSize || defaultPaths.includes(key)) {
        res[key] = {
          size: (((stats.size * 100) / 1024) | 0) / 100
        };
      }
    } else if (stats.isDirectory()) {
      const dir = await fs.promises.opendir(resPath);
      for await (const dirent of dir) {
        Object.assign(res, await loopTree(path.resolve(resPath, dirent.name)));
      }
    }
  } catch (err) {
    console.error(err);
  }

  return res;
};

module.exports = Promise.all(
  config.dirs.map((name) => loopTree(path.resolve(__dirname, '../src', name)))
).then((arr) => {
  let result = Object.assign(...arr);
  console.log(result, Object.keys(result).length);
  return new Promise((resolve, reject) => {
    fs.writeFile(
      path.resolve(__dirname, `./cdnJSON.json`),
      JSON.stringify(result),
      (err) => {
        if (err) throw err;
        resolve();
        console.log(`export cdn json success`);
      }
    );
  });
});
