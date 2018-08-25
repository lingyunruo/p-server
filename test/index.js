

/*
*
* - render
*
* */
const PServer = require('../src/index.js');

const server = new PServer({
    port: 9000,
    root: __dirname,
    templateExtensionName: ['.html'],
    mock: {
        '/string': {
            type: 'string',
            content: '我是一个字符串'
        },
        'object': {
            type: 'object',
            content: {
                name: 'lingyun',
                age: '18'
            }
        },
        '/file': {
            type:'file',
            content: './mock/index.json'
        },
        '/function': {
            type: 'function',
            content: function() {
                return '我是一个函数返回的值'
            }
        },
        'get': {
            type: 'REQUEST_GET',
            content: 'http://www.baidu.com',
            options: {
                data: {},
                timeout: 3000
            }
        }
    },
    templateData: {
        '/template/test.html': function() {
            return {
                userName: 'lingyun'
            }
        }
    }
});


server.router.get('/jjj', async function() {
    return 'async'
});
server.router.get('/lll', function() {
    return 'not async';
});

