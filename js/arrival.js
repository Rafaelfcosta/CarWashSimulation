self.importScripts('/js/math.js');

let speed = 1;
let end = 8 * 60;
let iteration = 0;
let carid = 0;
let arrValues;
let op;

self.onmessage = function (event) {
    let data = event.data;
    if (data == null) {
        arrive();
    } else {
        if (data[3] == 0) {
            arrValues = data[0];
            end = data[1] * 60;
            op = data[2];
        }else{
            speed = data
        }
    }

}

class Car {
    constructor(id) {
        this.id = id;
        this.arrival = 0;
        this.service = 0;
        this.attendedTime = 0;
        this.timeInQueue = 0;
    }

    getId() {
        return this.id;
    }
}

function arrive() {
    let math = {
        "const": arrValues['constV'],
        "expo": exponential(arrValues['expA'], arrValues['expB'], 1),
        "tri": triangular(arrValues['triA'], arrValues['triB'], arrValues['triC'], 1),
        "normal": normal(arrValues['meanA'], 1),
        "uniform": uniform(arrValues['uniformA'], arrValues['uniformB'], 1)
    }
    let x = math[op];
    // console.log(x)
    let duration = parseFloat(x) * speed;
    iteration += duration / speed;
    carid++;
    let res = [];
    let interval = setInterval(() => {
        clearInterval(interval);

        if (iteration < end + (end * 0.03)) {
            let car = new Car(carid);
            car.arrival = iteration;

            res = [0, car]
            self.postMessage(res);

            arrive();
        } else {
            res = [1, 'end']
            self.postMessage(res);
            self.close();
        }

    }, duration);
}