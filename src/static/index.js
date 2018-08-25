

const path = require('path');
const fs = require('fs');
const mime = require('mime');

module.exports = async function(filePath) {
    
    try {
        let content = fs.readFileSync(filePath);

        this.data.body = content;
        this.data.contentType = mime.getType(filePath);
    }
    catch(e) {
        this.data.body = JSON.stringify(e);
        this.data.status = 404;
    }

}

