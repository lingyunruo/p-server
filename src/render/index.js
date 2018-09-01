const fs = require('fs');
const path = require('path');
const mime = require('mime');

// 渲染模版，给一个绝对路径，和需要渲染的数据，就直接响应模版了
module.exports = async function(filePath, data = {}, headers = {}) {
    
    let engine = this.config.engine;
    let url = this.ctx.path;
    let templateMap = this.config.templateData || {};
    let templateFn = templateMap[url] || templateMap[url.substring(1)];
    
    let configTemplateData = typeof templateFn === 'function' && templateFn.call(this);

    let finalData = Object.assign({}, configTemplateData.data || {}, data);
    let finalHeader = Object.assign({}, configTemplateData.headers || {}, headers);

    try {
        let content = fs.readFileSync(filePath, {
            encoding: 'utf-8'
        });

        content = await engine.render.call(this, content, finalData);

        this.ctx.res.writeHeader(200, {
            ...finalHeader,
            'Content-Type': 'text/html'
        });
        this.ctx.body = content;
    }
    catch(e) {
        console.log(e);
        this.ctx.body = e;
        this.ctx.contentType = mime.getType('text/plain');
        this.ctx.status = 404;
    }
};