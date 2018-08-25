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
    engine: {
        render: function(absolutePath, data) {}
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
    control: {
        'getUserName': function() {}
    },
    templateData: {
        '/template/test.html': {
            userName: 'lingyun'
        }
    }
});

server.get('/kakaka', function() {
    return '哈哈哈';
});

server.post('/hahah', async function() {
    return 'biubiubiu';
});

```

### 请求处理优先级顺序

template > static > directory > get/post/all > mock

### 参数解析：

- port: 监听的端口, 默认值为9000

- root: 服务器根目录, 默认值是当前执行目录

- engine: 默认是ejs模版, 如果想选择其他模版，请填写一个带有render方法的对象，render方法返回值作为响应值，第一个参数是模版文件路径，第二个参数是模版需要的数据

- templateExtensionName: 模板文件的扩展名，按照我的道理讲，不是这个扩展名的文件统统都是静态文件处理，是这个扩展名的文件，统一按照模版文件处理。

- mock: 接受一个对象，对象有type和content属性，type值有如下：
    - string: 返回字符串
    - object: 返回对象
    - file: 返回模拟数据的文件地址，会require这个文件，拿到文件内容然后返回，所以这个文件必须是nodejs模块，或者json文件
    - REQUEST_GET: 会去content内的地址模拟`get`请求拿到内容返回，并且会有一个额外的参数，options来代表发送给对方的参数
    - REQUEST_POST: 回去content内的地址模拟`post`请求拿到内容返回，并且会有一个额外的参数，options来代表发送给对方的参数
    - function: 会执行content的函数，拿到返回值返回，content函数必须是async函数，函数内部this指向PServer实例本身

- ~~control: 接受一个对象。这个配置项还没有实现，我是想如果注册的时候  get/post/all 第二个参数是个字符串的话，可以直接匹配到control里对应的方法~~

- ~~proxy: 想实现跟webpack-dev-serve一样的proxy功能~~

- templateData: 每个模版请求需要的数据，需要对应上模版的请求路径


### 实例方法

this.render(absoluteFilePath, data)

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

~~this.session: 这个方法还没实现，处理session的~~

~~this.cookie: 这个方法也没实现，处理cookie的~~

~~this.localStore: 这个方法也没实现，而且在考虑需不需要~~

~~this.readFile: 没实现，读取文件的，嫁接一下fs的read方法，可能会提供异步/同步/promise等方式~~

~~this.writeFile: 没实现，写文件，嫁接下fs的write方法，可能会提供异步/同步/promise等方式~~

this.httpGet(url, {data: {}, timeout: 3000})

> 发送一个get请求，url是地址，data是发送的数据，timeout是超时的时间，方法很简陋，有待完善

this.httpPost(url, {data: {}, timeout: 3000})

> 发送一个post请求，url是地址，data是发送的数据，timeout是超时的时间，方法很简陋，有待完善 

~~this.socket: 没实现，实现socket链接~~

this.res

> 这个是nodejs的response对象

this.req

> 这个是nodejs的request对象