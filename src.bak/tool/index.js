
const fs = require('fs');
const path = require('path');

exports.fileExistSync = (filepath) => {
    try {
        fs.accessSync(filepath, fs.constants.R_OK);
        return true;
    }
    catch(e) {
        return false;
    }
};
