function Events(sApp) {
    this.sApp = sApp;
    this.events = {};
}

Events.prototype.on = function (eventName, callback) {
    
    const self = this;
    if (this.events[eventName] === undefined) {
        this.events[eventName] = [];
    }
    
    this.events[eventName].push(async function (...args) {
        return await new Promise(function (resolve) {
            resolve(callback.apply(self.sApp, args));
        })
    });
};

// emit(eventname[, ...args])
Events.prototype.emit = async function (...args) {
    const self = this;
    
    let eventName = Array.prototype.shift.call(args);
    
    let callbackList = this.events[eventName] || [];
    let len = callbackList.length;
    let result = [];
    
    for (let i = 0; i < len; i++) {
        let res = await callbackList[i](...args);
        result.push(res);
    }
    
    // 订阅同一个事件的回调函数结果按照订阅顺序存储在一个数组里返回
    return result;
};


module.exports = Events;
