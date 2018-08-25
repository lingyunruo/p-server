const fs = require('fs');
const path = require('path');
const mime = require('mime');

module.exports = async function(filePath, data = {}) {

    let engine = this.config.engine;
    
    try {
        let content = fs.readFileSync(filePath, {
            encoding: 'utf-8'
        });

        content = engine.render.call(this, content, data);

        this.data.body = content;
        this.data.contentType = 'text/html';
    }
    catch(e) {
        this.data.body = JSON.stringify(e);
        this.data.contentType = 'text/plain';
        this.data.status = 404;
    }
};