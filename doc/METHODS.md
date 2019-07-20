## 实例上的方法

#### server.router.get(path, callback)

> 接受两个参数，第一个是拦截的请求地址，第二个是拦截后的回调函数

> 会拦截对应的GET请求，然后执行回调函数将函数返回值返回给客户端

#### server.router.post(path, callback)

> 接受两个参数，第一个是拦截的请求地址，第二个是拦截后的回调函数

> 会拦截对应的POST请求，然后执行回调函数将函数返回值返回给客户端

#### server.router.all(path, callback)

> 接受两个参数，第一个是拦截的请求地址，第二个是拦截后的回调函数

> 会拦截对应的所有请求，不论是GET还是POST，然后执行回调函数将函数返回值返回给客户端。如果同时调用了get/post和all，all对应的回调函数会最后执行


#### server.static(staticAbsolutePath)

> 接受一个静态文件的绝对路径地址

> 会读取静态文件然后返回给客户端，如果出错会返回false

#### server.render(filePath, data, headers)

> 接受三个参数，后两个参数可选。第一个参数是一个模版相对于root的地址，第二个参数是传给模版的参数，第三个参数是需要返回的headers

> 调用这个方法会直接将模版解析后返回给客户端

