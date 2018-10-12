const http = require('http');
const https = require('https');
const querystring = require('querystring');
const { URL } = require('url');


module.exports = function (pCtx) {

    let proxyConfig = pCtx.config.proxy;
    let proxyMap = {};

    return async (ctx, next) => {

        let reqUrl = ctx.url;
        let reqPath = ctx.path;
        let header = ctx.header;
        let host = header.host;
        let method = ctx.method;
        let reqData = ctx.request.body;
        let reqQuerystring = ctx.querystring;

        let isProxyReq = true;

        let proxyUrl = proxyMap[reqPath];

        if (proxyUrl === undefined) {
            isProxyReq = false
            Object.keys(proxyConfig).map((key) => {
                let reg = new RegExp(`^${key}`);
                if (reg.test(reqPath)) {
                    isProxyReq = true;
                    proxyUrl = proxyMap[reqPath] = proxyConfig[key];
                }
            });
        }


        if (isProxyReq === false) {
            await next();
        }
        else {
            let url = new URL(proxyUrl);
            let { protocol } = url;
            let requestFn = http.request;

            protocol === 'https' && (requestFn = https.request);

            let postData = '';
            let resHeader = {};
            let resStatus = 0;


            if (method === 'POST') {
                postData = querystring.stringify(reqData);
            }
            else {
                postData = reqQuerystring;
            }

            let options = {
                hostname: url.hostname,
                port: url.port,
                path: reqUrl,
                method: method,
                headers: Object.assign({}, header, {
                    'Content-Length': Buffer.byteLength(postData) - 1
                })
            };

            let res = await new Promise((resolve, reject) => {
                
                let req = requestFn(options, (res) => {
                    let body = '';
                    resHeader = res.headers;
                    resStatus = res.statusCode;
                    res.setEncoding('utf8');

                    res.on('data', (chunk) => {
                        body += chunk.toString()
                    });

                    res.on('end', () => {
                        resolve(body);
                    });
                });

                req.on('error', (err) => {
                    console.error('err', err);
                });
                
                req.write(postData);
                req.end();

            });

            Object.keys(resHeader).map((key) => {
                ctx.set(key, resHeader[key]);
            });
            console.log(res);
            ctx.status = resStatus
            ctx.body = res;
        }

    }

}