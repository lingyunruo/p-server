const path = require('path');
const fs = require('fs');


module.exports = function(pServer) {

    this.callbacks = {
        get: {},
        post: {},
        all: {}
    };

    this.process = async function(filepath) {
        let req = pServer.request;

        let method = req.method.toLowerCase();
        let url = req.url;

        let callbacksList = this.callbacks[method][url] || [];

        callbacksList.concat(this.callbacks['all'][url] || []);

        if(callbacksList && callbacksList.length > 0) {
            let responseValue = [];

            for(let i=0;i<callbacksList.length;i++) {
                let returnValue = await callbacksList[i].call(pServer);
                responseValue.push(returnValue);
            }
            
            pServer.data.body = responseValue.length === 1 ? responseValue[0] : responseValue;
            pServer.data.contentType = this.type || 'application/x-www-form-urlencoded';
            pServer.data.status = this.status || 200;
        }
        else {
            // 此处采用mock
            await pServer.mock();
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