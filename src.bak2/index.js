

const Koa = require('koa');
const staticFn = require('./static');
const mockFn = require('./mock');


/*
*       request -> static --> mock --> router -> control --> response
* */

/*
* 主文件只负责返回body，其余配置由各个插件完成
*
* */

function PServer(options) {
    
    const self = this;
    
    
    this.app = new Koa();
    
    this.staticData = {};
    this.mockData = {};
    this.routerData = {};
    
    
    this.config = {
        port: options.port || 9000,
        static: options.static || './',
        root: options.root || process.cwd(),
        mockFile: options.mockFile || null
    };
    
    this.middleware = async (ctx, next) => {
        let staticReturn = this.static && this.static(ctx);
        let mockReturn = this.mock && this.mock(ctx);
        
        
        if(staticReturn !== false) {
            ctx.body = staticReturn;
        }
        else if(mockReturn !== false) {
            ctx.body = mockReturn;
        }
        else {
            ctx.body = '这是一个普通内容';
        }
        
        await next();
    };
    
    this.app.use(this.middleware);
    this.app.listen(this.config.port);
    console.log(`open http://127.0.0.1:${this.config.port}`);
}

PServer.prototype.static = staticFn;
PServer.prototype.mock = mockFn;

module.exports = PServer;
