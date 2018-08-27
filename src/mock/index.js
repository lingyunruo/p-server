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

    let mockReturn = mockConfig[url] || mockConfig[urlBeginWithoutSlant];
    let finalReturn = null;

    if(mockReturn) {
        let mockType = mockReturn['type'];
        let mockContent = mockReturn['content'];
        let mockOptions = mockReturn['options'] || {};

        switch(mockType) {
            case 'string': 
            case 'object': 
                finalReturn = mockContent;
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
                finalReturn = await tool.httpGet(mockContent, mockOptions);
                break;
            case 'REQUEST_POST':
                finalReturn = await tool.httpPost(mockContent, mockOptions);
                break;
            default: 
                break;
        }
    }

    this.ctx.body = finalReturn;
    this.ctx.status = 200;
}