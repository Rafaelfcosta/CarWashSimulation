let infiniteRun = false

let verbose = true;
let workersAmount = 1;

let speed = 1;

let mathT;
let servOP;

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
    constructor() {

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

        this.washInterval = setInterval(function() {
            for (let i = 0; i < workersAmount; i++) {
                if (!that.workers[i].isBusy()) {
                    if (that.queue.size() > 0) {
                        that.workers[i].setBusy(true);
                        that.queue.remove();
                        that.washing++;
                        // let workTime = exponential(10, 15, 1);
                        let workTime = mathT[servOP];
                        // console.log(servOP , mathT[servOP]);
                        setTimeout(function () {
                            that.workers[i].setBusy(false);
                            that.workers[i].workTime += parseFloat(workTime);
                            that.washing--;
                            that.washed++;
                        }, workTime * speed);
                    }
                }
            }
        }, 1/10);
    }
}

class Workerc {
    constructor() {
        this.busy = false;
        this.workTime = 0;
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

function log(msg){
    if(verbose){
        console.log(msg)
    }
}


// $(document).ready(function () {
    
// })