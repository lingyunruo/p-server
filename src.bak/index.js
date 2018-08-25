const Koa = require('koa');


const constant = require('./constant');
const Router = require('./router');
const Events = require('./events');
const Control = require('./control');
const Static = require('./static');
const Render = require('./render');

const Sapp = function Sapp(options) {
    
    
    this.config = {
        root: options.root || process.cwd(),
        engine: options.engine || 'ejs',
        // 通过扩展engineList 可以扩展渲染引擎
        // 渲染引擎必须有render方法
        engineList: {},
        staticFiles: constant.staticExtList.concat(options.statics || [])
    };
    
    this.app = new Koa();
    this.event = new Events(this);
    this.router = new Router(this);
    this.control = new Control(this);
    this.render = new Render(this);
    this.static = new Static(this);
    
    
    this.mock = null;
    this.errorHandle = null;
    this.logs = null;
    this.crossOrigin = null;
    this.session = null;
    this.cookie = null;
    
    this.app.use(this.router.middleware);
};

Sapp.prototype.listen = function (port) {
    console.log(`listen http://127.0.0.1:${port}`);
    this.app.listen(port);
};


module.exports = Sapp;




