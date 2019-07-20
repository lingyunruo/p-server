const httpProxy = require('http-proxy');

module.exports = function (pCtx) {

    const proxy = httpProxy.createProxyServer();
    let proxyConfig = pCtx.config.proxy;
    let proxyMap = {};

    proxy.on('error', (e) => {
        console.log('proxy error: ', e)
    });

    return async (ctx, next) => {
        let reqPath = ctx.request.path
        let proxyTarget = '';
        let isProxy = false;

        if(proxyMap[reqPath]) {
            proxyTarget = proxyMap[reqPath];
            isProxy = true;
        }
        else {
            Object.keys(proxyConfig).forEach((key) => {
                if(reqPath.indexOf(key) === 0) {
                    proxyTarget = proxyConfig[key];
                    proxyMap[reqPath] = proxyConfig[key];
                    isProxy = true;
                }
            });
        }

        if(!isProxy) {
            await next();
        }
        else {
            ctx.response = false;

            proxy.web(ctx.req, ctx.res, {
                target: proxyTarget,
                body: ctx.request.body
            });
        }
    }
}