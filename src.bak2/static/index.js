

const fs = require('fs');
const path = require('path');
const mime = require('mime');
const {fileExistSync} = require('../tool');


module.exports = function(ctx) {

    const staticPath = this.config.static;
    const rootPath = this.config.root;
    
    const url = ctx.url;
    
    const requestFileAbsolutePath = path.join(rootPath, url);
    const staticAbsolutePath = path.join(rootPath, staticPath);
    
    let staticFileContent = '';
    
    if(requestFileAbsolutePath.indexOf(staticAbsolutePath) === 0 &&
        fileExistSync(requestFileAbsolutePath)) {
        
        try {
            staticFileContent = fs.readFileSync(requestFileAbsolutePath, {
                encoding: 'utf-8'
            });
            ctx.type = mime.getType(requestFileAbsolutePath);
        }
        catch(e) {
            throw new Error(e);
        }
        
    }
    else {
        return false;
    }

    return staticFileContent;
};
