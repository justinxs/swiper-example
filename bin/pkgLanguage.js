const fsPromises = require('fs/promises');
const path = require('path');
const MODEL_PATH = path.resolve(__dirname, '../language/model.json');
const PACKAGE_PATH = path.resolve(__dirname, '../src/lang/package');
const NAMESPACE_PATH = (namespace) =>
  path.resolve(__dirname, `../src/lang/package/${namespace}.json`);
const UPDATE_TIME = 1000;

let timerID;

const packageLang = async (isWatch) => {
  try {
    const langData = require(MODEL_PATH);
    const langkeys = Object.keys(langData);
    const categoryData = langkeys.reduce((res, keyCode) => {
      const values = langData[keyCode],
        categorys = Object.keys(values);
      for (let i = 0, len = categorys.length; i < len; i++) {
        const category = categorys[i];
        if (!res[category]) {
          res[category] = {};
        }
        res[category][keyCode] = values[category];
      }
      return res;
    }, {});

    const categorys = Object.keys(categoryData);
    await fsPromises.mkdir(PACKAGE_PATH, {
      recursive: true
    });
    const writePromises = categorys.map((namespace) => {
      let tempData = JSON.stringify(categoryData[namespace]);
      return fsPromises
        .writeFile(NAMESPACE_PATH(namespace), tempData)
        .then((_) => {
          console.log(`package ${namespace}.json success`);
          return _;
        });
    });

    if (isWatch) {
      watchLang();
    }

    return writePromises;
  } catch (error) {
    console.error('language package error', error);
  }
};

async function watchLang() {
  const watcher = fsPromises.watch(MODEL_PATH);
  for await (const { eventType, filename } of watcher) {
    console.log(
      `language watch event emit! [eventType: ${eventType}][filename: ${filename}]`
    );
    timerID && clearTimeout(timerID);
    timerID = setTimeout(() => {
      delete require.cache[require.resolve(MODEL_PATH)];
      packageLang();
    }, UPDATE_TIME);
  }
}

module.exports = packageLang;
