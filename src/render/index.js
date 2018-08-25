const fs = require('fs');
const path = require('path');
const mime = require('mime');

module.exports = async function(filePath, data = {}) {

    let engine = this.config.engine;
    let url = this.request.url;
    let templateMap = this.config.templateData || {};
    let templateFn = templateMap[url] || templateMap[url.substring(1)];
    
    let configTemplateData = typeof templateFn === 'function' && templateFn.call(this);

    let finalData = Object.assign({}, configTemplateData || {}, data);

    try {
        let content = fs.readFileSync(filePath, {
            encoding: 'utf-8'
        });

        content = engine.render.call(this, content, finalData);

        this.data.body = content;
        this.data.contentType = 'text/html';
    }
    catch(e) {
        this.data.body = JSON.stringify(e);
        this.data.contentType = 'text/plain';
        this.data.status = 404;
    }
};