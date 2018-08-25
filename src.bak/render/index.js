
const constant = require('../constant');
const ejs = require('ejs');


const enginesList = {
    ejs: ejs
};

function Render(sApp) {
    
    let engine = sApp.config.engine;
    
    Object.assign(enginesList, sApp.config.engineList || {});
    
    return async (content, data = {}, options = {}) => {
        let eventRes = await sApp.event.emit(constant.events.renderEvents.RENDER_CONTENT, data, options);
        
        if(eventRes.length > 0) {
            return eventRes;
        }
        else {
            return enginesList[engine].render(content, data, options);
        }
    };
}




module.exports = Render;
