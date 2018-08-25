const constant = require('../constant/index');
const mime = require('mime');

function Router(sApp) {

	this.app = sApp;

	this.middleware = async (ctx, next) => {

		let type = ctx.method;

		let eventData = {
			type: type.toUpperCase(),
			url: ctx.url,
			ctx: ctx
		};

		let eventName = '';

		if(type.toUpperCase() === 'GET') {
			eventName = `${constant.events.routerEvents.ROUTER_GET_REQUEST}/${ctx.url}`;
		}
		else if(type.toUpperCase() === 'POST') {
			eventName = `${constant.events.routerEvents.ROUTER_POST_REQUEST}/${ctx.url}`;
		}

		let responseValue = await sApp.event.emit(eventName, eventData);

		let bodyList = [];
        
        responseValue.map((item, index) => {
            bodyList.push(item && item.body);
        });

		ctx.body = bodyList.join() || '';
		ctx.type = responseValue[0].type || mime.getType(ctx.url)

		await next();
	}
}

Router.prototype.get = function (url, callback) {
	const self = this;

	let eventName = `${constant.events.routerEvents.ROUTER_GET_REQUEST}/${url}`;

	this.app.event.on(eventName, function (...args) {
		return callback.apply(self.app, args);
	});
};

Router.prototype.post = function (url, callback) {
	const self = this;
	let eventName = `${constant.events.routerEvents.ROUTER_POST_REQUEST}/${url}`;

	this.app.event.on(eventName, function (...args) {
		return callback.apply(self.app, args);
	});
};

module.exports = Router;
