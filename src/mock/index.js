const {URL} = require('url');
const path = require('path');
const tool = require('../tool');

const mime = require('mime');

module.exports = async function() {
    
    let url = this.ctx.path;
    let query = this.ctx.query;
    let urlBeginWithoutSlant = url.substring(1);
    let mockConfig = this.config.mock;
    let root = this.config.root;
    let header  = this.ctx.header;

    let mockReturn = mockConfig[url] || mockConfig[urlBeginWithoutSlant];
    let finalReturn = null;

    if(mockReturn) {
        let mockType = mockReturn['type'];
        let mockContent = mockReturn['content'];
        let mockOptions = mockReturn['options'] || {};

        (!('headers' in mockOptions)) && (mockOptions['headers'] = {});

        Object.assign(mockOptions.headers, {
            ...header
        });

        switch(mockType) {
            case 'string': 
            case 'object': 
                finalReturn = mockContent;
                this.ctx.type = mime.getType('json');
                break;
            case 'file':
                let absolutePath = path.join(root, mockContent); 
                finalReturn = await tool.read(absolutePath);
                this.ctx.type = mime.getType('json');
                break;
            case 'function':
                finalReturn = await mockContent.call(this, query);
                break;
            case 'REQUEST_GET': 
                let getResponse = await tool.httpGet(mockContent, mockOptions);
                finalReturn = getResponse.body;
                this.ctx.res.writeHead(200, getResponse.headers);
                break;
            case 'REQUEST_POST':
                let postResponse = await tool.httpPost(mockContent, mockOptions);
                finalReturn = postResponse.body;
                this.ctx.res.writeHead(200, postResponse.headers);
                break;
            default: 
                break;
        }
        this.ctx.body = finalReturn;
        this.ctx.status = 200;
    }
    else {
        this.ctx.body = `${url} not found`;
        this.ctx.status = 404;
    }
}