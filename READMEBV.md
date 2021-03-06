### 简介

> 基于koa2开发的服务器。

### 以下删除线的都是没实现的

### 使用环境 

- macOS 

- nodejs  v8.11.2

### 使用方法

```js

const PServer = require('../src/index.js');

const server = new PServer({
    port: 9000,
    root: __dirname,
    templateExtensionName: ['.html'],
    engine: {
        render: async function(content, data) {
            return content;
        }
    },
    mock: {
        '/string': {
            type: 'string',
            content: '我是一个字符串'
        },
        'object': {
            type: 'object',
            content: {
                name: '我是一个名字',
                age: '18'
            }
        },
        '/file': {
            type:'file',
            content: './mock/index.json'
        },
        '/function': {
            type: 'function',
            content: function(query) {
                return '我是一个函数返回的值'
            }
        }
    },
    templateData: {
        '/template/test.html': function() {
            return {
                data: {
                    userName: '名字'
                },
                headers: {}
            }
        }
    },
    controller: './controller',
    proxy: {
        '/get': 'http://www.baidu.com'
    }
});


server.router.get('/jjj', async function(query) {
    return 'async'
});
server.router.get('/lll', function() {
    return 'not async';
});

server.router.get('/getuser', server.controller.getUserName.getname);

server.router.post('/getuse', async function() {

    let result = await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('这是一个post请求');
        }, 2000);
    });
    
    return result;
});


```

### 参数解析：

- port: 监听的端口, 默认值为9000

- root: 服务器根目录, 默认值是当前执行目录

- engine: 默认是ejs模版, 如果想选择其他模版，请填写一个带有render方法的对象，render方法返回值作为响应值，第一个参数是模版文件内容，第二个参数是模版需要的数据

- templateExtensionName: 模板文件的扩展名，按照我的道理讲，不是这个扩展名的文件统统都是静态文件处理，是这个扩展名的文件，统一按照模版文件处理。

- mock: 接受一个对象，对象有type和content属性，type值有如下：
    - string: 返回字符串
    - object: 返回对象
    - file: 返回模拟数据的文件地址，会require这个文件，拿到文件内容然后返回，所以这个文件必须是nodejs模块，或者json文件
    - function: 会执行content的函数，拿到返回值返回，content函数必须是async函数，函数内部this指向PServer实例本身

- controller: 接收一个字符串，这个字符串是你controller的目录地址，服务器会在启动的时候自动读取这个地址里的js文件，然后把文件名字当作key值，挂载到server.controller 对象上，你可以在router里这样使用：
```js
// 注：server为PServer的实例
// 假设项目根目录下有一个controller目录，目录下有一个getUser.js文件
// getUser.js文件导出了一个 getName 函数方法
// 方法的返回值就会是响应值
// 可以参照test目录下的例子
server.router.get('/getUser', server.controller.getUser.getName);
```
> 注意：因为router调用方法的时候会自动的将方法的上下文（this）绑定到server，所以如果你用了箭头函数，那么绑定会不成功。

- templateData: 每个模版请求需要的数据，需要对应上模版的请求路径


### 实例属性

this.config 

> 配置项

this.app

> Koa实例

this.controller

> 定义的controller

this.ctx

> 本次请求的 koa 的ctx 对象


### 实例方法

this.render(absoluteFilePath, data, header)

> 讲道理这个方法返回编译后的模版字符串

this.router

> 这个是个router对象

this.router.get(url, callback)

> 这个方法就是注册一个get请求

this.router.post(url, callback)

> 这个方法看名字就知道是注册post请求

this.router.all(url, callback)

> 这个就是不管get还是post请求都会执行

this.renderDirectory(ctx.path, absolutePath)

> 这个方法，是根据请求的路径和目录的绝对路径，如果这个路径是个目录，会列出这个目录下的所有文件和文件夹

this.static(staticFileAbsolutePath)

> 这个方法就是给一个静态文件，然后返回静态文件的内容，没有任何特别之处


### 注意事项：

> 因为是基于koa2实现，并且将koa2的上下文的ctx赋给了 PServer实例（server.ctx），所以一些功能和细节，都可以使用koa的API实现。

> 第二点要注意的是，函数都用了async await函数，不过不用也行，还有要注意的是，controller和router的回调函数，都是以返回的值作为响应的值，直接设置ctx的body值并不能生效。

> test目录下是一些例子，基本上比较完整，可以参考

> 木有单元测试的模块，以后考虑会添加