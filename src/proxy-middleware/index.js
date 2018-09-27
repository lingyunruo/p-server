const proxy = require('koa-proxy');

module.exports = function() {
    const that = this;
    let proxyConfig = this.config.proxy;

    Object.keys(proxyConfig).map(function(key) {
        that.app.use(proxy({
            host: proxyConfig[key],
            match: new RegExp(`^${key}`)
        }));
    });
}