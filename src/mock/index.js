const {URL} = require('url');
const path = require('path');
const tool = require('../tool');

const mime = require('mime');

module.exports = async function() {
    
    let url = this.request.url;
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
                this.data.contentType = 'text/plain';
                break;
            case 'file':
                let absolutePath = path.join(root, mockContent); 
                finalReturn = await tool.read(absolutePath);
                this.data.contentType = 'text/plain';
                break;
            case 'function':
                finalReturn = await mockContent.call(this);
                this.data.contentType = 'text/plain';
                break;
            case 'REQUEST_GET': 
                finalReturn = await tool.httpGet(mockContent, mockOptions);
                this.data.contentType = 'text/html';
                break;
            case 'REQUEST_POST':
                finalReturn = await tool.httpPost(mockContent, mockOptions);
                this.data.contentType = 'application/x-www-form-urlencoded';
                break;
            default: 
                break;
        }
    }

    this.data.body = finalReturn;
    this.data.status = 200;
}