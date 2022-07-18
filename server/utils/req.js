function getClientIp(ctx) {
  if (!ctx) return '';
  return (
    ctx.header['x-real-ip'] || ctx.header['x-forwarded-for'] || ctx.ip || ''
  );
}

function getProtocol(ctx) {
  if (!ctx) return '';
  return (ctx.headers['https'] || ctx.headers['http_x_https']) === 'on'
    ? 'https'
    : ctx.protocol;
}

function getHost(ctx) {
  if (!ctx) return '';
  let isHttps = getProtocol(ctx) === 'https';
  let host = ctx.headers['http_x_host'] || ctx.headers['http_host'] || ctx.host;
  let port = ctx.headers['server_port'];
  if (!host) {
    host = ctx.headers['server_name'];
    if (port && !((port === '443' && isHttps) || (port === '80' && !isHttps))) {
      host += `:${port}`;
    }
  }
  return host && (isHttps ? `https://${host}` : `http://${host}`);
}

function getRootHost(ctx) {
  let _hostName = ctx.headers['x-host'] || ctx.hostname;
  if (_hostName == 'localhost' || _hostName == '127.0.0.1') {
    return _hostName;
  }
  let hostArr = _hostName.split('.');
  return hostArr.length === 2 ? hostArr.join('.') : hostArr.slice(1).join('.');
}

function getFullHost(ctx) {
  return ctx.headers['x-host'] || ctx.hostname;
}

module.exports = {
  getClientIp,
  getProtocol,
  getHost,
  getRootHost,
  getFullHost
};
