const fs = require('fs');
const path = require('path');

module.exports = {
    read: function(absolutePath) {
        return new Promise(function(resolve, reject) {
            fs.readFile(absolutePath, {
                encoding: 'utf-8'
            }, (err, data) => {
                if(err) {
                    console.error(err);
                    reject(err);
                }
                resolve(data);
            });
        });

    },
    getPathType: function(absolutePath) {
        return new Promise(function(resolve, reject) {
            fs.stat(absolutePath, (err, stat) => {
                if(err) {
                    console.error(err);
                    reject(err);
                }
                else if(stat.isDirectory()) {
                    resolve('directory');
                }
                else {
                    resolve('file');
                }
            });
        });
    },
    fileExist: function(absolutePath) {
        try {
            fs.accessSync(absolutePath, fs.constants.F_OK || fs.constants.R_OK);
        }
        catch(e) {
            return false;
        }

        return true;
    }
};