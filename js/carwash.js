let infiniteRun = false

let verbose = true;
let workersAmount = 1;
let speed = 1;

let arrivalTimes = 0;
let arrivedCars = 0;
let endTimeInHours = 8;
let maxInQueue = 0;
let maxEntities = 0;
let simulations = 0;
let end = false;

let mathT;
let arrOP;
let servOP;

let arrValues = {
    "expA": parseInt(document.getElementById("aLimExpo").value),
    "expB": parseInt(document.getElementById("aMeanExpo").value),

    "triA": parseInt(document.getElementById("aATri").value),
    "triB": parseInt(document.getElementById("aBTri").value),
    "triC": parseInt(document.getElementById("aCTri").value),

    "meanA": parseInt(document.getElementById("aMeanNormal").value),

    "uniformA": parseInt(document.getElementById("aAUniform").value),
    "uniformB": parseInt(document.getElementById("aBUniform").value)
}

let servValues = {
    "expA": parseInt(document.getElementById("sLimExpo").value),
    "expB": parseInt(document.getElementById("sMeanExpo").value),

    "triA": parseInt(document.getElementById("sATri").value),
    "triB": parseInt(document.getElementById("sBTri").value),
    "triC": parseInt(document.getElementById("sCTri").value),

    "meanA": parseInt(document.getElementById("sMeanNormal").value),

    "uniformA": parseInt(document.getElementById("sAUniform").value),
    "uniformB": parseInt(document.getElementById("sBUniform").value)
}

class Car {
    constructor(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }
}

class Washer {
    constructor() {
        this.queue = new Queue();
        this.workers = [];
        this.washing = 0;
        this.washed = 0;
        this.washInterval;
        for (let i = 0; i < workersAmount; i++) {
            this.workers[i] = new Workerc();
        }
    }
    wash() {
        var that = this

        this.washInterval = setInterval(function () {
            for (let i = 0; i < workersAmount; i++) {
                if (!that.workers[i].isBusy()) {
                    if (that.queue.size() > 0) {
                        that.workers[i].setBusy(true);
                        let currentCar = that.queue.first().getId();
                        that.workers[i].carsWashed.push(currentCar);
                        that.queue.remove();
                        that.washing++;
                        let workTime = mathT[servOP];
                        setTimeout(function () {
                            that.workers[i].setBusy(false);
                            that.workers[i].workTime += parseFloat(workTime);
                            that.washing--;
                            that.washed++;
                        }, workTime * speed);
                    }
                }
            }
        }, 1 / 1000);
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

// $(document).ready(function () {

// })