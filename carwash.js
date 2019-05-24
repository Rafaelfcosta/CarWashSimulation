class Car {
    constructor() {}
}

class Washer {
    constructor() {
        this.queue = new Queue();
    }

}

class Worker {
    constructor() {
        this.busy = false;
    }
}

function Queue() {
    this.data = [];
}

Queue.prototype.add = function (object) {
    this.data.unshift(object);
}

Queue.prototype.remove = function () {
    this.data.pop();
}

Queue.prototype.first = function () {
    return this.data[0];
}

Queue.prototype.last = function () {
    return this.data[this.data.length - 1];
}

Queue.prototype.size = function () {
    return this.data.length;
}