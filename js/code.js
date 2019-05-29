function run() {
    toggleBtns();

    arrivalTimes = 0;
    arrivedCars = 0;
    endTimeInHours = 8;
    maxInQueue = 0;
    maxEntities = 0;

    endTimeInHours = parseInt(document.getElementById("duration").value)
    workersAmount = parseInt(document.getElementById("workersQt").value)
    queueLimit = parseInt(document.getElementById("queueLimit").value)
    verbose = document.getElementById("verbose").checked
    infiniteRun = document.getElementById("infinite").checked

    let washer = new Washer();
    washer.queue.setLimit(queueLimit);

    let queueSizes = [];

    function arriveCars() {

        let math = {
            "expo": exponential(arrValues['expA'], arrValues['expB'], 1),
            "tri": triangular(arrValues['triA'], arrValues['triB'], arrValues['triC'], 1),
            "normal": normal(arrValues['meanA'], 1),
            "uniform": uniform(arrValues['uniformA'], arrValues['uniformB'], 1)
        }

        mathT = {
            "expo": exponential(servValues['expA'], servValues['expB'], 1),
            "tri": triangular(servValues['triA'], servValues['triB'], servValues['triC'], 1),
            "normal": normal(servValues['meanA'], 1),
            "uniform": uniform(servValues['uniformA'], servValues['uniformB'], 1)
        }

        time = math[arrOP];

        let tm = setTimeout(arriveCars, time * speed);
        let car = new Car(arrivedCars)
        car.arrival = parseFloat(time);
        if (washer.queue.limit === -1) {
            washer.queue.add(car);
            arrivedCars++;
            log(washer);
        } else {
            if (washer.queue.limit > washer.queue.size()) {
                washer.queue.add(car);
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

        queueSizes.push(washer.queue.size());

        let progress = (arrivalTimes / (endTimeInHours * 60)) * 100;
        $(".progress-bar").width(progress + '%');

        if (!infiniteRun) {
            if (arrivalTimes > endTimeInHours * 60) {

                let carsTotalTime = 0;
                let totalWashedCars = 0;

                washer.workers.forEach(worker => {
                    worker.carsWashed = getUnique(worker.carsWashed, 'id');
                    worker.carsWashed.forEach(car => {
                        carsTotalTime += car.arrival + car.service;
                    })
                    totalWashedCars += worker.carsWashed.length;
                });

                let res = {
                    "Total Simulation time": arrivalTimes.toFixed(3) + ' mins =  (' + (arrivalTimes / 60).toFixed(3) + ') hrs',
                    "ArrivedCars": arrivedCars,
                    "Washed": washer.washed,
                    "Washing": washer.washing,
                    "In Queue": washer.queue.size(),
                    "Max In Queue": maxInQueue,
                    "Mean In Queue": queueSizes.reduce((total, amount, index, array) => {
                        total += amount;
                        if (index === array.length - 1) {
                            return total / array.length;
                        } else {
                            return total;
                        }
                    }).toFixed(3),
                    "Mean Time in System": (carsTotalTime / totalWashedCars).toFixed(3) + ' mins',
                    "Max Entities in System": maxEntities
                }

                clearTimeout(tm);
                clearTimeout(washer.washInterval);

                Object.getOwnPropertyNames(res).forEach(function (val, idx, array) {
                    console.log(val + ' -> ' + res[val]);
                });

                let i = 0;
                washer.workers.forEach(worker => {
                    let sum = 0;
                    getUnique(worker.carsWashed, 'id').forEach(car => {
                        sum += car.service;
                    })
                    console.log(`Worker[${i}] busy time: `, parseFloat(sum).toFixed(3), ' mins = (', ((sum / arrivalTimes) * 100).toFixed(3), '%)')
                    i++;
                });

                let content = `<h5>Simulation [${simulations}]</h5> <div class="row">
                <div class="col-md-6">
                    <table class="tg">
                        <tr>
                            <th class="tg-7btt">Detail</th>
                            <th class="tg-amwm">Result</th>
                        </tr>`

                Object.getOwnPropertyNames(res).forEach(function (val, idx, array) {
                    content += `<tr>
                            <td class="tg-0lax">${val}</td>
                            <td class="tg-0lax">${res[val]}</td>
                        </tr>`
                });
                content += `</table></div><div class="col-md-6">
                <table class="tg">
                    <tr>
                        <th class="tg-7btt">Worker ID</th>
                        <th class="tg-amwm">Ocupation</th>
                    </tr>`;

                let j = 0;
                washer.workers.forEach(worker => {
                    let sum = 0;
                    getUnique(worker.carsWashed, 'id').forEach(car => {
                        sum += car.service;
                    })
                    content += `<tr>
                            <td class="tg-0lax">Worker[${j}]</td>
                            <td class="tg-0lax">${parseFloat(sum).toFixed(3) + ' mins = (' + ((sum / arrivalTimes) * 100).toFixed(3) + '%)'}</td>
                        </tr>`
                    j++;
                });

                content += `</table></div></div><hr class='mb-4'>`
                $("#results").append(content);

                toggleBtns();
            }
        }
    }

    arriveCars();
    washer.wash();
    simulations++;
}

function stop() {
    infiniteRun = false
}

function toggleBtns() {
    $('#runBtn').prop('disabled', function (i, v) {
        return !v;
    });
    if (document.getElementById("infinite").checked) {
        $('#stopBtn').prop('disabled', function (i, v) {
            return !v;
        });
    }
}

function clearR() {
    $("#results").empty();
}

document.getElementById("runBtn").addEventListener("click", function (event) {
    event.preventDefault()
});

document.getElementById("stopBtn").addEventListener("click", function (event) {
    event.preventDefault()
});

document.querySelector('input[type="range"]').addEventListener('change', function (e) {
    speed = 1001 - parseInt(this.value);
    console.log(speed)
});

$("#aDist").change(function () {
    $(this).find("option:selected").each(function () {
        var optionValue = $(this).attr("value");
        arrOP = $(this).attr("value");
        if (optionValue) {
            $(".arrbox").not("." + optionValue).hide();
            $("." + optionValue + ".arrbox").show();
        }
    });
}).change();

$("#sDist").change(function () {
    $(this).find("option:selected").each(function () {
        var optionValue = $(this).attr("value");
        servOP = $(this).attr("value");
        if (optionValue) {
            $(".servbox").not("." + optionValue).hide();
            $("." + optionValue + ".servbox").show();
        }
    });
}).change();

function getUnique(arr, comp) {

    const unique = arr
        .map(e => e[comp])

        // store the keys of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)

        // eliminate the dead keys & store unique objects
        .filter(e => arr[e]).map(e => arr[e]);

    return unique;
}


$(document).ready(function () {
    // console.log(document.getElementById("duration").value)
    // let x = 0;
    // setInterval(function(){
    //     $(".progress-bar").width(x+'%');
    //     x++;
    // }, 500)
})