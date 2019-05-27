function run() {
    let arrivedCars = 0;
    let endTimeInHours = 8;
    let arrivalTimes = 0;
    let maxInQueue = 0;
    let maxEntities = 0;

    endTimeInHours = parseInt(document.getElementById("duration").value)
    workersAmount = parseInt(document.getElementById("workersQt").value)
    verbose = document.getElementById("verbose").checked
    infiniteRun = document.getElementById("infinite").checked


    let washer = new Washer();
    // washer.queue.setLimit(-1);

    function arriveCars() {
        let time = exponential(2, 15, 1);

        let tm = setTimeout(arriveCars, time * speed);
        if (washer.queue.limit === -1) {
            washer.queue.add(new Car());
            arrivedCars++;
            log(washer);
        } else {
            if (washer.queue.limit > washer.queue.size()) {
                washer.queue.add(new Car());
                arrivedCars++;
                log(washer);
            }
        }

        arrivalTimes += parseFloat(time);
        if (washer.queue.size() > maxInQueue) {
            maxInQueue = washer.queue.size();
        }
        let sum = washer.queue.size() + washer.washing;
        if (maxEntities < sum) {
            maxEntities = sum;
        }
        // log(arrivalTimes);

        if (!infiniteRun) {
            if (arrivalTimes > endTimeInHours * 60) {
                clearTimeout(tm);
                clearTimeout(washer.washInterval);
                console.log('Total Simulation time: ', arrivalTimes.toFixed(3), 'mins =  (', (arrivalTimes / 60).toFixed(3), ') hrs')
                console.log('ArrivedCars: ', arrivedCars)
                console.log('Washed: ', washer.washed)
                console.log('Washing: ', washer.washing)
                console.log('In Queue: ', washer.queue.size())
                console.log('Max In Queue: ', maxInQueue)
                console.log('Max Entities in System: ', maxEntities)
                let i = 0;
                washer.workers.forEach(worker => {
                    console.log(`Worker[${i}] busy time: `, parseFloat(worker.workTime).toFixed(3), 'mins = (', ((worker.workTime / arrivalTimes) * 100).toFixed(3), '%)')
                    i++;
                });

                let results = []
                results.push(arrivalTimes.toFixed(3))
                results.push(arrivedCars)
                results.push(washer.washed)
                results.push(washer.washing)
                results.push(washer.queue.size())
                results.push(maxInQueue)
                results.push(maxEntities)

                results.forEach(result => {
                    $("#results").append(`<div class='row'> <div class='col-md-6'> ${result}</div></div>`)
                });
                

            }
        }
    }




    arriveCars();
    washer.wash();
}

function stop() {
    infiniteRun = false
}

document.getElementById("runBtn").addEventListener("click", function (event) {
    event.preventDefault()
});

document.getElementById("stopBtn").addEventListener("click", function (event) {
    event.preventDefault()
});

document.querySelector('input[type="range"]').addEventListener('change', function (e) {
    speed = parseInt(this.value);
});

// $(document).ready(function () {
//     console.log(document.getElementById("duration").value)
// })