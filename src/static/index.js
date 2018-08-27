

const path = require('path');
const fs = require('fs');
const mime = require('mime');

module.exports = async function(filePath) {
    
    try {
        let content = fs.readFileSync(filePath);

        this.ctx.body = content;
        this.ctx.type = mime.getType(filePath);
    }
    catch(e) {
        this.ctx.body = JSON.stringify(e);
        this.ctx.status = 404;
    }

}

