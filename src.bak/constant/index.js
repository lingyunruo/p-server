module.exports = {
    events: {
        routerEvents: {
            ROUTER_REQUEST: 'ROUTER_REQUEST',
            ROUTER_GET_REQUEST: 'ROUTER_GET_REQUEST',
            ROUTER_POST_REQUEST: 'ROUTER_POST_REQUEST',
            ROUTER_STATIC_REQUEST: 'ROUTER_STATIC_REQUEST'
        },
        renderEvents: {
            RENDER_CONTENT: 'RENDER_CONTENT',
            RENDER_FILE: 'RENDER_FILE'
        }
    },
    staticExtList: ['.js', '.css', '.html', '.png', '.jpg', '.gif']
};
