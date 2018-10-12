const PServer = require('../src/index.js');

const server = new PServer({
    port: 9000,
    root: __dirname,
    templateExtensionName: ['.html'],
    // engine: {
    //     render: async function(content, data) {
    //         return content;
    //     }
    // },
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
        '/get': 'https://reactjs.org',
        '/langdetect': 'https://fanyi.baidu.com/langdetect',
        '/api': 'http://api.fanyi.baidu.com',
        '/nccloud': 'http://172.20.9.80:6600/'
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
