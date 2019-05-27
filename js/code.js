let arrivedCars = 0;

$(document).ready(function () {
    let endTimeInHours = 8;
    let arrivalTimes = 0;
    

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
        // log(arrivalTimes);

        if (!infiniteRun) {
            if (arrivalTimes > endTimeInHours * 60) {
                clearTimeout(tm);
                clearTimeout(washer.washInterval);
                console.log('Total Simulation time: ', arrivalTimes.toFixed(3), 'mins =  (', (arrivalTimes/60).toFixed(3), ') hrs' )
                console.log('ArrivedCars: ', arrivedCars)
                console.log('Washed: ', washer.washed)
                console.log('Washing: ', washer.washing)
                console.log('In Queue: ', washer.queue.size())
                let i = 0;
                washer.workers.forEach(worker => {
                    console.log(`Worker[${i}] busy time: `, parseFloat(worker.workTime).toFixed(3), 'mins = (', ((worker.workTime/arrivalTimes)*100).toFixed(3), '%)' )    
                    i++;
                });
                
            }
        }
    }

    document.querySelector('input[type="range"]').addEventListener('change', function (e) {
        speed = parseInt(this.value);
    });


    arriveCars();
    washer.wash();
})

function infiniteToggle(){
    infiniteRun = false
}