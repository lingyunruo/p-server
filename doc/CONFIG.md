## 配置参数

#### port

> 数字，默认9000

> 监听的端口号, 不写的话默认是9000

#### root 

> 字符串，必填

> 服务器根目录，必须是一个绝对路径

#### templateExtensionName

> 数组，默认是 `['.html']`

> 决定模版文件的后缀，采用此后缀的文件，会经过渲染引擎解析

#### engine

> 对象，必须拥有一个render方法， render方法的第一个参数是读取的模版内容，第二个参数是输入给模版的值。默认是ejs的渲染

> 渲染引擎函数，会覆盖掉默认的ejs渲染引擎，render返回值会返回给客户端。

#### mock

> 对象， 键是请求路径，值是一个对象，对象包含两个属性，`type`和`content`,`type`表示返回值是什么类型，可选值有`string(字符串)`、`object(对象)`、`file(文件)`、`function(函数)`。content则是跟type对应的返回值

> 模拟数据请求，在content里的值会返回给客户端。并且mock的配置低于router，如果有对于当前请求配置router，mock会被忽略。

#### controller

> 代表一个目录路径的字符串

> controller的目录地址，会自动读取controller里的js文件，并且将文件导出的方法挂载server对象的controller属性上。挂载路径是，`server.controller.<你的文件名字>.<你的方法名字>`。controller可以当作router的回调函数，返回值会直接返回给客户端。

 #### proxy

 > 对象，键是需要匹配的请求路径开头的字符串，值是要代理的目标地址

 > 配置proxy之后会将以配置的key开头的所有请求都代理到对应的地址。代理请求高于router和mock
