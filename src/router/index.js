const path = require('path');
const fs = require('fs');
const mime = require('mime');

module.exports = function(pServer) {

    this.callbacks = {
        get: {},
        post: {},
        all: {}
    };

    this.process = async function(filepath, next) {
        let ctx = pServer.ctx;

        let method = ctx.method.toLowerCase();
        let url = ctx.path;
        let query = ctx.query;

        let callbacksList = this.callbacks[method][url] || [];

        callbacksList.concat(this.callbacks['all'][url] || []);

        // 注册了当前路径的回掉函数
        if(callbacksList && callbacksList.length > 0) {
            let responseValue = [];

            for(let i=0;i<callbacksList.length;i++) {
                let returnValue = await callbacksList[i].call(pServer, query);
                if(returnValue !== undefined) {
                    responseValue.push(returnValue);
                }
            }

            if(responseValue.length > 0) {
                pServer.ctx.body = responseValue.length === 1 ? responseValue[0] : responseValue;
                pServer.ctx.type = mime.getType('json');
            }
            return true;
        }
        else {
            // 此处采用mock
            let res = await pServer.mock();
            return res;
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