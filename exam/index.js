const PServer = require('../src/index.js');

const path = require('path');

const server = new PServer({
    port: 9000,
    root: path.join(__dirname, './'),
    templateExtensionName: ['.html'],
    engine: {
        render: async function(content, data) {
            return 'asdfasdf'; 
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
                    userName: 'gfgf'
                },
                headers: {}
            }
        }
    },
    controller: './controller',
    proxy: {
        "/baidu": 'http://www.baidu.com'
    }
});


server.router.get('/jjj', async function(query) {
    console.log(this.res);
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

server.router.post('/proxy/bd', async function() {

    return {
        name: 'fff'
    }
});


server.router.get('/redi', async function() {
    server.ctx.response.redirect('http://www.baidu.com');
});