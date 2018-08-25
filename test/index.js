

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
        '/jjj': {
            name: 'lingyun'
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
server.router.get('/jjj', function() {
    return 'not async';
});