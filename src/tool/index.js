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
        let myUrl = new URL(url);
        let postData = JSON.stringify(options.data || {});

        let customOptions = {
            method: method || 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData),
                "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
            },
            timeout: options.timeout || 10000
        };

        let httpObj = myUrl.protocol === 'https:' ? https : http;

        let reqOptions = Object.assign(myUrl, customOptions);

        return new Promise(function(resolve, reject) {
            let body = '';
            const req = httpObj.request(reqOptions, function(res) {
                res.setEncoding('utf8');
                res.on('data', function(chunk) {
                    body = body + chunk;
                });
                res.on('end', function() {
                    resolve(body);
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