
/**
 * 
 * 简洁的配置优先，约定优先
 * 
*/

const path = require('path');
const ejs = require('ejs');
const Koa = require('koa');

const tool = require('./tool');

const render = require('./render');
const renderDirectory = require('./renderDirectory');
const Router = require('./router');
const static = require('./static');


const defaultData = {
    body: 'hello world',
    type: 'text/plain',
    status: 200
};


const middleWare = (pServer) => {

    let config = pServer.config;
    // 非模版文件一律按照静态文件处理
    let templateExtensionName = config.templateExtensionName;

    return async (ctx, next) => {
        let url = ctx.url;
        let absolutePath = path.join(config.root, url);
        let pathExtensionName = path.extname(absolutePath);

        let isPathExist = tool.fileExist(absolutePath);
        let pathType = isPathExist && await tool.getPathType(absolutePath);

        // 存储一下当前请求的相关数据
        pServer.request = ctx.req;

        // 文件或目录不存在一律视为异步或同步接口
        if (isPathExist === false) {
            await pServer.router.process(absolutePath);
        }
        else if (pathType === 'file') {
            // 模版解析
            if (templateExtensionName.indexOf(pathExtensionName) >= 0) {
                await pServer.render(absolutePath);
            }
            // 如果不是模版后缀的文件，一律按照静态文件处理
            else {
                await pServer.static(absolutePath);
            }
        }
        else if (pathType === 'directory') {
            await pServer.renderDirectory(absolutePath);
        }

        ctx.body = pServer.data.body;
        ctx.type = pServer.data.contentType;
        ctx.status = pServer.data.status;

        await next();

        pServer.data = {
            ...defaultData
        };
    }
}

function PServer(options) {

    this.config = {
        root: options.root || process.cwd(),
        port: options.port || 9000,
        mock: options.mock || {},
        engine: options.engine || {
            render: ejs.render
        },
        templateExtensionName: options.templateExtensionName || ['.html'],
        mock: options.mock || {},
        control: options.control || {},
        templateData: options.templateData || {}
    };

    this.data = {
        ...defaultData
    };

    this.app = new Koa();
    this.app.use(middleWare(this));

    // 给实例添加方法
    this.router = new Router(this);
    this.render = render;
    this.renderDirectory = renderDirectory;
    this.static = static;

    this.app.listen(this.config.port);
    console.log(`open http://127.0.0.1:${this.config.port}`);
}

module.exports = PServer;