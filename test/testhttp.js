const http = require('http');

const {URL} = require('url');

let req = http.request(new URL('http://www.baidu.com'), function(res) {

    res.on('data', function(chunk) {
        console.log(chunk);
    });

    res.on('end', function() {
        console.log('结束了请求');
    });

});

req.on('error', function(e) {
    console.log('error', e);
});

req.write('');
req.end();