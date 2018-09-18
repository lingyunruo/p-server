
const axios = require('axios');

const http = require('http');

module.exports = function(pServer) {
    
    let proxyMap = {};

    return {
        isProxyUrl: function(url, config) {

            if(proxyMap[url]) {
                return true;
            }

            if('*' in config) {
                proxyMap['*'] = config['*'];
                return true;
            }

            let isProxy = false;
            
            Object.keys(config).map((item) => {
                let re = new RegExp(`^${item}`);

                if(re.test(url)) {
                    proxyMap[url] = config[item];
                    isProxy = true;
                }
            });

            return isProxy;
        },
    
        proxy: async function() {
            let ctx = pServer.ctx;
            let url = ctx.url;
            let method = ctx.method;
            let query = ctx.query;
            let proxyTarget = proxyMap[url];
            let header = ctx.header;

            try {
                res = await axios({
                    url: proxyTarget,
                    method: method,
                    headers: header,
                    params: query
                });
            }
            catch(e) {
                res = e;
            }
            
            Object.keys(res.headers).map((key) => {
                ctx.response.set(key, res.headers[key]);
            });

            ctx.status = res.status;
            ctx.body = res.data;
        }
    };
}