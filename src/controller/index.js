
const path = require('path');
const fs = require('fs');

const tool = require('../tool');


module.exports = async function() {

    let config = this.config;
    let controller = config.controller;
    let root = config.root;

    this.controller = {};
    
    if(typeof controller === 'string') {

        let controllerPath = path.join(root, controller);

        if(tool.fileExist(controllerPath)) {
            try {
                let fileList = fs.readdirSync(controllerPath);

                fileList.map((file, index) => {
                    let fileName = path.basename(file, '.js');
                    let filePath = path.join(controllerPath, file);
                    
                    this.controller[fileName] = require(filePath);
                });
            }
            catch(e) {
                console.error(e);
            }
        }
    }
};