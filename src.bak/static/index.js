const path = require('path');
const fs = require('fs');
const mime = require('mime');

const {fileExistSync} = require('../tool');

function Static(sApp) {
    
    const rootDir = sApp.config.root;
    
    let staticFiles = sApp.config.staticFiles;
    
    return async (filePath) => {
        const fileAbsolutePath = path.join(rootDir, filePath);
        
        let extname = path.extname(filePath);
        
        if(staticFiles.indexOf(extname) >= 0 && fileExistSync(fileAbsolutePath)) {
            
            let result = {};
            
            try {
                result.content = fs.readFileSync(fileAbsolutePath, {
                    encoding: 'utf-8'
                });
                
                result.type = mime.getType(extname.substring(1))
            }
            catch(e) {
                throw new Error(e);
            }
            return result;
        }
        
        return false;
    }
}


module.exports = Static;
