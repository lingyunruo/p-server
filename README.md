### 简介

> 这是一个基于koa实现的一个为开发环境准备的服务器，总的来说，还是有些简陋，大概实现的功能有：1、定制模版引擎，2、多格式模拟数据，3、可以自定义get/post/all请求，4、自动的列出服务器文件列表，5、静态文件也可以传输，6、服务器端模拟请求抓取别人的接口或者页面(比较简陋)，7、剩下的没实现。整体来说功能有了，但是功能的实现比较简陋，估计容错性是不高的，只能是之后用起来看看了。不过，这个倒是可以让搭建开发服务器简单了很多，如果只有基本需求，基本只需要实例化一个对象，传入一些参数，就可以跑起来服务器了。即使不传任何参数也能正常跑起来。各种资源和请求的响应头设置有些混乱，有待优化加强。

### 以下删除线的都是没实现的

### 对于http请求的处理还是不够完善，回头会给补上的

### 使用环境 

- macOS 

- nodejs  v8.11.2

### 使用方法

```js

const PServer = require('../src/index.js');

const server = new PServer({
    port: 9000,
    root: __dirname,
    engine: {
        render: async function(content, data) {}
    },
    templateExtensionName: ['.html'],
    mock: {
        '/test': {
            type: 'string',
            content: '返回一个字符串'
        },
        '/test2': {
            type: 'object',
            content: {
                name: '返回一个对象'
            }
        },
        '/test3': {
            type: 'file',
            content: './config.json' // 相对于根目录的文件地址，最终返回文件内容
        },
        '/test4': {
            type: 'REQUEST_GET',
            content: 'http://www.baidu.com', // 网址，返回get请求的内容
            options: {
                data: {
                    name: '我是发送给对方服务器的参数'
                }
            }
        },
        '/test5': {
            type: 'REQUEST_POST',
            content: 'http://www.cometopostme.com/action.do', // 网址，返回post请求的内容，前提是人家支持获取数据哦
            options: {
                data: {
                    name: '我是发送给对方的数据'
                }
            }
        },
        '/test6': {
            type: 'function',
            // 可以是函数，如果是函数的会执行函数然后获取结果返回
            content: async function() {
                return {}
            }
        }
    },
    controller: './controller',
    templateData: {
        '/template/test.html': function() {
            return {
                data: {
                    name: '名字'
                },
                headers: {}
            }
        }
    }
});

server.router.get('/kakaka', function() {
    return '哈哈哈';
});

server.router.post('/hahah', async function() {
    return 'biubiubiu';
});

server.router.post('/getuse', async function() {

    let result = await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('这是一个post请求');
        }, 2000);
    });
    
    return result;
});

```

### 请求处理优先级顺序

template --> static --> directory --> router --> mock

### 参数解析：

- port: 监听的端口, 默认值为9000

- root: 服务器根目录, 默认值是当前执行目录

- engine: 默认是ejs模版, 如果想选择其他模版，请填写一个带有render方法的对象，render方法返回值作为响应值，第一个参数是模版文件内容，第二个参数是模版需要的数据

- templateExtensionName: 模板文件的扩展名，按照我的道理讲，不是这个扩展名的文件统统都是静态文件处理，是这个扩展名的文件，统一按照模版文件处理。

- mock: 接受一个对象，对象有type和content属性，type值有如下：
    - string: 返回字符串
    - object: 返回对象
    - file: 返回模拟数据的文件地址，会require这个文件，拿到文件内容然后返回，所以这个文件必须是nodejs模块，或者json文件
    - REQUEST_GET: 会去content内的地址模拟`get`请求拿到内容返回，并且会有一个额外的参数，options来代表发送给对方的参数
    - REQUEST_POST: 回去content内的地址模拟`post`请求拿到内容返回，并且会有一个额外的参数，options来代表发送给对方的参数
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

- ~~proxy: 想实现跟webpack-dev-serve一样的proxy功能~~

- templateData: 每个模版请求需要的数据，需要对应上模版的请求路径


### 实例方法

this.render(absoluteFilePath, data, header)

> 讲道理这个方法返回编译后的模版字符串

this.router

> 这个是个router对象，我还想写个control配置项，配置下control的方法，然后router根据字符串名字自动匹配到control

this.router.get(url, callback)

> 这个方法就是注册一个get请求

this.router.post(url, callback)

> 这个方法看名字就知道是注册post请求

this.router.all(url, callback)

> 这个就是不管get还是post请求都会执行

this.renderDirectory()

> 这个方法，是根据请求的路径，如果这个路径是个目录，会列出这个目录下的所有文件和文件夹

this.static(staticFileAbsolutePath)

> 这个方法就是给一个静态文件，然后返回静态文件的内容，没有任何特别之处

this.ctx.cookies:

> 因为直接把koa的请求上下文对象挂载到实例上了，所以操作cookie可以直接调用koa的方法

~~this.localStore: 这个方法也没实现，而且在考虑需不需要~~

~~this.readFile: 没实现，读取文件的，嫁接一下fs的read方法，可能会提供异步/同步/promise等方式~~

~~this.writeFile: 没实现，写文件，嫁接下fs的write方法，可能会提供异步/同步/promise等方式~~

~~this.log: 没实现，需要实现错误日志之类的，不过这方面经验欠缺~~

this.httpGet(url, {data: {}, timeout: 3000})

> 发送一个get请求，url是地址，data是发送的数据，timeout是超时的时间，方法很简陋，有待完善

this.httpPost(url, {data: {}, timeout: 3000})

> 发送一个post请求，url是地址，data是发送的数据，timeout是超时的时间，方法很简陋，有待完善 

~~this.socket: 没实现，实现socket链接~~

~~this.exec: 执行一些脚本命令，简化一下执行命令行的操作，设想场景是服务器接收到某些请求后，执行某个编译命令~~

this.res

> 这个是nodejs的response对象

this.req

> 这个是nodejs的request对象


### 注意事项：

> 因为是基于koa2实现，并且将koa2的上下文的ctx赋给了 PServer实例，所以一些功能和细节，都可以使用koa的API实现。

> 第二点要注意的是，函数都用了async await函数，不过不用也行，还有要注意的是，controller和router的回调函数，都是以返回的值作为响应的值，直接设置ctx的body值并不能生效。

> 不过这样结合，看起来有些怪怪的和乱乱的