import { pathToRegexp } from 'path-to-regexp';
import seoMap from '../config/seo.json';

const pathToSeo = (routePath, curSeo) => {
  let seoData,
    seoPaths,
    curSeoPath = '/';
  if (curSeo && Object.keys(curSeo).length) {
    seoData = Object.assign({}, seoMap, curSeo);
    seoPaths = Object.keys(curSeo).concat(Object.keys(seoMap));
  } else {
    seoData = seoMap;
    seoPaths = Object.keys(seoMap);
  }
  for (let i = 0; i < seoPaths.length; i++) {
    const seoPath = seoPaths[i];
    const reg = pathToRegexp(seoPath);
    if (reg.test(routePath)) {
      curSeoPath = seoPath;
      break;
    }
  }
  return seoData[curSeoPath];
};

function setSeo() {
  let seo = arguments[0];
  if (arguments.length > 1) {
    seo = pathToSeo(...arguments);
  }
  if (!seo) return;
  Object.keys(seo).forEach((key) => {
    let meta;
    switch (key) {
      case 'title':
        document.title = seo[key];
        break;
      default:
        meta = document.head.querySelector(`meta[name=${key}]`);
        if (meta) {
          meta.setAttribute('content', seo[key]);
        } else {
          meta = document.createElement('meta');
          meta.setAttribute('name', key);
          meta.setAttribute('content', seo[key]);
          document.head.appendChild(meta);
        }
        break;
    }
  });
}

export default setSeo;
