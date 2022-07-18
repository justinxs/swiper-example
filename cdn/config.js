const { getLocalIP } = require('../bin/lib');

const urlMap = {
  dev: `http://${getLocalIP() || 'localhost'}:9960/cdn/`,
  fat: 'http://ob-sports.aa5111.com/',
  beta: 'http://ob-sports.1391dh.com/',
  prod: 'https://ob-sports.591dyd.com/'
};
/**
 * CDN配置
 * URL CDN域名，根据环境不同使用不同的域名，若没新增资源（图片/字体...）的情况下可全部使用生产环境作CDN
 * minSize CDN的最小资源大小（主要用于导出CDN资源限制）
 * dirs CDN资源所在文件夹（主要用于导出CDN资源搜索来源）
 * includePaths 必须使用CDN的资源路径集合
 *
 * 注：CDN服务器一定需要先存在这些资源才可请求到
 */
const config = {
  URL: urlMap[process.env.VERSION] || urlMap.prod,
  minSize: 40 * 1024,
  dirs: ['images', 'fonts'],
  includePaths: []
};

module.exports = config;
