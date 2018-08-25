const path = require('path');
const fs = require('fs');


module.exports = function(pServer) {

    this.callbacks = {
        get: {},
        post: {},
        all: {}
    };

    // 提供给回调函数的假的返回值和状态码和类型
    // 让用户感觉自己用了个真的 实际上并没有
    this.body = '';
    this.type = 'text/plain';
    this.status = 200;

    this.process = async function(filepath) {
        let req = pServer.request;

        let method = req.method.toLowerCase();
        let url = req.url;

        let callbacksList = this.callbacks[method][url] || [];

        callbacksList.concat(this.callbacks['all'][url] || []);

        if(callbacksList && callbacksList.length > 0) {
            let responseValue = [];
            callbacksList.map(async (fn) => {
                let returnValue = await fn.call(pServer);
                responseValue.push(returnValue);
            });

            pServer.data.body = responseValue;
            pServer.data.contentType = this.type;
            pServer.data.status = this.status;
        }
        else {
            // 此处采用mock
            // await pServer.mock();
            console.log('此处采用了mock处理');
        }

    }.bind(this);

    this.get = async function(url, callback) {
        if(!this.callbacks.get[url]) {
            this.callbacks.get[url] = [];
        }

        this.callbacks.get[url].push(callback);

    }.bind(this);

    this.post = async function(url, callback) {
        if(!this.callbacks.post[url]) {
            this.callbacks.post[url] = [];
        }

        this.callbacks.post[url].push(callback);
    }.bind(this);

    this.all = async function(url, callback) {
        if(!this.callbacks.all[url]) {
            this.callbacks.all[url] = [];
        }

        this.callbacks.all[url].push(callback);
    }.bind(this);
};