const fs = require('fs');
const path = require('path');
const {URL} = require('url');
const http = require('http');
const https = require('https');

module.exports = {
    read: function(absolutePath) {
        return new Promise(function(resolve, reject) {
            fs.readFile(absolutePath, {
                encoding: 'utf-8'
            }, (err, data) => {
                if(err) {
                    console.error(err);
                    reject(err);
                }
                resolve(data);
            });
        });

    },
    getPathType: function(absolutePath) {
        return new Promise(function(resolve, reject) {
            fs.stat(absolutePath, (err, stat) => {
                if(err) {
                    console.error(err);
                    reject(err);
                }
                else if(stat.isDirectory()) {
                    resolve('directory');
                }
                else {
                    resolve('file');
                }
            });
        });
    },
    fileExist: function(absolutePath) {
        try {
            fs.accessSync(absolutePath, fs.constants.F_OK || fs.constants.R_OK);
        }
        catch(e) {
            return false;
        }

        return true;
    },
    isUrl: function isUrl(url) {
        try {
            return new URL(url);
        }
        catch(e) {
            return false;
        }
    },
    request: function(url, method, options) {
        // 这里可以拿到请求的头部，直接填充进去，
        // 但是写累了，记录一下，回头在写
        let myUrl = new URL(url);
        let postData = JSON.stringify(options.data || {});

        let customOptions = {
            method: method || 'GET',
            headers: options.headers,
            timeout: options.timeout || 10000
        };

        let httpObj = myUrl.protocol === 'https:' ? https : http;

        let reqOptions = Object.assign(myUrl, customOptions);

        return new Promise(function(resolve, reject) {
            let body = '';

            const req = httpObj.request(reqOptions, function(res) {
                console.log(res);
                res.setEncoding('utf8');

                res.on('data', function(chunk) {
                    body = body + chunk;
                });
                
                res.on('end', function() {
                    resolve({
                        body: body,
                        headers: res.headers
                    });
                });
            });

            req.on('error', function(e) {
                resolve(JSON.stringify(e));
            });

            req.write(postData);
            req.end();
        });
    },
    httpGet: async function(url, options) {
        return await this.request(url, 'GET', options);
    },
    httpPost: async function(url, options) {
        return await this.request(url, 'POST', options);
    }
};