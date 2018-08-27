
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const mime = require('mime');

const templateFilePath = path.join(__dirname, '../template/index.ejs');

let template = '';

try {
    template = fs.readFileSync(templateFilePath, {
        encoding: 'utf-8'
    });
}
catch(e) {
    template = '<%= errorMsg %>';
}


module.exports = async function(filePath) {

    try {
        const url = this.ctx.path;

        let fileList = fs.readdirSync(filePath);

        let result = [];

        fileList.map((item, index) => {
            result.push({
                name: item,
                path: `${url === '/' ? '' : url}/${item}`
            });
        });

        let content = ejs.render(template, {
            fileList: result
        });

        this.ctx.body = content;
        this.ctx.contentType = mime.getType('.html');
    }
    catch(e) {
        console.log(`render directory error: ${e}`);
        this.data.body = `render directory ${JSON.stringify(e)}`;
        this.data.contentType = 'text/plain';
        this.data.status = 404;
    }

};