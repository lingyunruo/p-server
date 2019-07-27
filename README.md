# dono-server

> dono-server定位于前端开发服务器，基于koa2开发，集合了一些前端开发过程中常用的一些功能，如模版渲染，静态文件请求，自定义模拟数据，自定义路由，代理等功能。

## 使用方式

### 示例


#### 最简形式的服务器
```js
const PServer = require('../src/index.js');
const path = require('path');

let server = new PServer({
    root: path.join(__dirname, '../exam')
});
```
> 以上简短的代码,即可启用一个简单服务器,默认监听9000端口,服务器会将根目录下的文件都列出来返回给客户端,除非设定了路由器。


#### 可以指定端口

```js
const PServer = require('../src/index.js');
const path = require('path');

let server = new PServer({
    root: path.join(__dirname, '../exam'),
    port: 8080
});
```

> 以上代码通过设置port参数,来定义想要监听的端口,不设置端口,默认监听9000端口。


#### 可以进行模拟数据

```js
const PServer = require('../src/index.js');
const path = require('path');

let server = new PServer({
    root: path.join(__dirname, '../exam'),
    port: 8080,
    mock: {
        '/string': {
            type: 'string',
            content: '我是一个字符串'
        }
    }
});
```
> 以上代码,当客户端请求`/string`接口的时候,会返回`我是一个字符串`内容


#### 可以给模版内的变量赋值

```js
const PServer = require('../src/index.js');
const path = require('path');

let server = new PServer({
    root: path.join(__dirname, '../exam'),
    port: 8080,
    templateData: {
        '/template/test.html': function() {
            return {
                data: {
                    userName: '凌云'
                }
            }
        }
    }
});
```

> 以上代码,在客户端进行请求/template/test.html模版的时候,会执行对应函数,将返回值插入到模版对应位置,模版采用ejs编写。


#### 可以自己配置渲染引擎的render方法,并且通过配置决定哪个后缀的文件是模版文件

```js
const PServer = require('../src/index.js');
const path = require('path');

let server = new PServer({
    root: path.join(__dirname, '../exam'),
    port: 8080,
    templateExtensionName: ['.html'],
    engine: {
        render: async function(content, data) {
            return '<html><body><div>我是一个页面</div></body></html>'; 
        }
    },
});
```

> 以上代码,不论访问哪个模版,都会返回固定的内容，并且可以通过配置，决定哪个后缀的文件才是模版文件


#### 可以写一些逻辑函数

```js
const PServer = require('../src/index.js');
const path = require('path');

let server = new PServer({
    root: path.join(__dirname, '../exam'),
    port: 8080,
    controller: './controller'
});

server.router.get('/getuser', server.controller.getUserName.getname);

// ./controller/getUserName.js
module.exports = {
    getname: async function() {
        return '我是那个谁';
    }
};
```

> 以上代码,会自动查找配置的controller地址,读取目录下的文件,并且将js文件里的方法挂到server.controller上

#### 可以配置代理


```js
const PServer = require('../src/index.js');
const path = require('path');

let server = new PServer({
    root: path.join(__dirname, '../exam'),
    port: 8080,
    proxy: {
        '/proxy': 'http:www.baidu.com/'
    }
});
```

> 以上代码,会将以`/proxy`开头的请求,统统代理到`http:www.baidu.com/`地址


#### 可以自己写router

```js
const PServer = require('../src/index.js');
const path = require('path');

let server = new PServer({
    root: path.join(__dirname, '../exam'),
    port: 8080
});

// 示例1
server.router.get('/router', async function(query) {
    return 'async'
});
// 示例2
server.router.post('/getuse', async function() {

    let result = await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('这是一个post请求');
        }, 2000);
    });
    
    return result;
});
// 示例3
server.router.get('/', async function(pServer) {

    let page = await server.render(path.join(__dirname, './static/index.html'));
});
// 示例4
server.router.get('/', async function(pServer) {

    let page = await server.static(path.join(__dirname, './static/index.html'));
});
```

> 以上代码,会拦截客户端的请求`/router`,然后执行回调函数,将函数返回值返回给客户端,函数必须是async函数。并且可以拦截post请求和get请求,并且也可以像`示例3`那样,在回调函数里,直接渲染一个模版,只需要调用render方法,并且传入一个绝对路径。也可以像`示例4`一样会直接返回一个静态文件

> 注意：router函数在proxy之后,所以如果请求地址配有代理,则路由不会生效



## 详细文档见`doc/`, 或访问 http://www.amiling.com:8080/
