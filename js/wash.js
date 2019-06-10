let speed = 1;
let systemTime = 0;
let servValues;
let op;
let entities = {
    maxEntities: 0,
    inSystem: []
}
let queueData = {
    maxInQueue: 0,
    currentSize: 0,
    queueSizes: []
}

self.importScripts('/js/math.js');
self.onmessage = function (event) {
    let data = event.data;
    if (data[0] == 0) {
        let arr = data[1];
        localQueue.add(arr[0])
        washer.queue = data[1];
        systemTime = arr[0].arrival;

        washer.wash();
    } else {
        if (data[0] == 1) {
            servValues = data[1];
            op = data[2];
        }else{
            speed = data;
        }
    }
}

class Washer {
    constructor() {
        this.queue = new Queue();
        this.worker = new Workerc();
        this.washing = 0;
        this.washed = 0;
    }
    wash() {
        var that = this;

        let math = {
            "const": servValues['constV'],
            "expo": exponential(servValues['expA'], servValues['expB'], 1),
            "tri": triangular(servValues['triA'], servValues['triB'], servValues['triC'], 1),
            "normal": normal(servValues['meanA'], 1),
            "uniform": uniform(servValues['uniformA'], servValues['uniformB'], 1)
        }
        let x = math[op];
        // console.log(x[0]);
        let duration = parseFloat(x) * speed;
        let time = duration / speed;

        if (!that.worker.isBusy() && localQueue.size() > 0) {
            that.worker.setBusy(true);

            if (localQueue.size() > 1) {
                queueData.currentSize = localQueue.size() - 1;
            }

            let currentCar = localQueue.last();
            currentCar.service = time;
            currentCar.attendedTime = systemTime;
            currentCar.timeInQueue = systemTime - currentCar.arrival
            that.worker.carsWashed.push(currentCar);
            localQueue.remove();

            that.worker.workTime += time;
            that.washing++;
            that.washed++;

            if (localQueue.size() > queueData.maxInQueue) {
                queueData.maxInQueue = localQueue.size();
            }

            let sum = localQueue.size() + that.washing;
            if (entities.maxEntities < sum) {
                entities.maxEntities = sum;
            }

            entities.inSystem.push(sum);

            queueData.queueSizes.push(localQueue.size())

            let interval = setInterval(() => {
                clearInterval(interval);

                that.worker.setBusy(false);
                that.washing--;
                that.wash();

                self.postMessage([that, queueData, entities]);
            }, duration);
        }

    }
}

class Workerc {
    constructor() {
        this.busy = false;
        this.workTime = 0;
        this.carsWashed = [];
    }

    setBusy(state) {
        this.busy = state;
    }

    isBusy() {
        return this.busy;
    }
}

function Queue() {
    this.data = [];
    this.limit = -1;
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

Queue.prototype.setLimit = function (value) {
    this.limit = value;
}

function log(msg) {
    if (verbose) {
        console.log(msg)
    }
}

let washer = new Washer();
let localQueue = new Queue();