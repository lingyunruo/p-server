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
        render: function() {}
    },
    templateExtensionName: ['.html'],
    mock: {
        '/jjj': {
            name: 'lingyun'
        },
        '/index.html': {
            userList: [{
                name: 'lngyn'
            }]
        },
        '/lll': './config.json',
        '/kkk': function() {
            console.log(this);
            return 'hahah';
        },
        '/hjhjh': 'http://www.baidu.com'
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

```

### 请求处理优先级顺序

template > static > directory > get/post/all > mock

### 参数解析：

- port: 监听的端口, 默认值为9000

- root: 服务器根目录, 默认值是当前执行目录

- engine: 默认是ejs模版, 如果想选择其他模版，请填写一个带有render方法的对象，render方法返回值作为响应值

- templateExtensionName: 模板文件的扩展名，按照我的道理讲，不是这个扩展名的文件统统都是静态文件处理，是这个扩展名的文件，统一按照模版文件处理。

- mock: 接受一个对象，对于路径对应的不同的值类型，处理逻辑和优先级是这样的:
    - 如果是字符串
        - 先判断是不是一个http路径，如果是的话会请求这个路径，拿到返回值响应请求
        - 如果不是http路径，判断是不是一个文件路径，如果是读取这个文件然后返回文件内容
        - 如果不是文件，直接返回字符串
    - 如果是一个对象，直接返回这个对象
    - 如果是一个函数，执行这个函数，函数返回啥，咱就返回啥，这个函数的内部this指向server实例

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

~~this.httpGet: 没实现，发送一个get请求~~

~~this.httpPost: 没实现，发送要一个post请求~~

~~this.socket: 没实现，实现socket链接~~