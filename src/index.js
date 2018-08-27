const path = require('path');
const ejs = require('ejs');
const Koa = require('koa');

const tool = require('./tool');

const render = require('./render');
const renderDirectory = require('./renderDirectory');
const Router = require('./router');
const static = require('./static');
const mock = require('./mock');


const middleWare = (pServer) => {

    // 用户的配置项
    let config = pServer.config;
    // 非模版文件一律按照静态文件处理
    let templateExtensionName = config.templateExtensionName;

    return async (ctx, next) => {
        // 拿到请求的url
        let url = ctx.url;
        // 凭拼接出请求的绝对路径
        let absolutePath = path.join(config.root, url);
        // 拿到请求的后缀名
        let pathExtensionName = path.extname(absolutePath);

        // 判断请求路径是否存在
        let isPathExist = tool.fileExist(absolutePath);
        // 如果存在路径，判断路径是文件还是目录
        let pathType = isPathExist && await tool.getPathType(absolutePath);
        
        // 将koa的ctx挂在到pServer上
        pServer.ctx = ctx;

        // 文件或目录不存在一律视为异步或同步接口
        if (isPathExist === false) {
            // 路径不存在就走路由处理
            await pServer.router.process(absolutePath);
        }
        // 如果是文件就按照模版或者静态文件处理
        else if (pathType === 'file') {
            // 模版解析
            if (templateExtensionName.indexOf(pathExtensionName) >= 0) {
                // 直接渲染
                await pServer.render(absolutePath);
            }
            // 如果不是模版后缀的文件，一律按照静态文件处理
            else {
                // 直接读取静态文件
                await pServer.static(absolutePath);
            }
        }
        // 如果是目录，则输出目录
        else if (pathType === 'directory') {
            await pServer.renderDirectory(absolutePath);
        }

        await next();
    }
}

function PServer(options) {

    // 基本的配置，有默认值也有用户的配置
    this.config = {
        // 项目的根目录，默认是进程执行的路径
        root: options.root || process.cwd(),
        // 服务器的监听端口
        port: options.port || 9000,
        // 模拟数据
        mock: options.mock || {},
        // 模版引擎
        engine: options.engine || {
            render: ejs.render
        },
        // 模版的扩展名
        templateExtensionName: options.templateExtensionName || ['.html'],
        // 控制器
        control: options.control || {},
        // 模版的配置数据
        templateData: options.templateData || {}
    };

    this.app = new Koa();
    this.app.use(middleWare(this));

    // 给实例添加方法
    this.router = new Router(this);
    this.render = render;
    this.renderDirectory = renderDirectory;
    this.static = static;
    this.mock = mock;

    this.app.listen(this.config.port);
    console.log(`open http://127.0.0.1:${this.config.port}`);
}

PServer.prototype.httpGet = tool.httpGet.bind(tool);
PServer.prototype.httpPost = tool.httpPost.bind(tool);

module.exports = PServer;