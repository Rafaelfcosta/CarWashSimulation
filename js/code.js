function run() {
    toggleBtns();

    let arrivedCars = 0;
    let endTimeInHours = 8;
    let arrivalTimes = 0;
    let maxInQueue = 0;
    let maxEntities = 0;

    endTimeInHours = parseInt(document.getElementById("duration").value)
    workersAmount = parseInt(document.getElementById("workersQt").value)
    queueLimit = parseInt(document.getElementById("queueLimit").value)
    verbose = document.getElementById("verbose").checked
    infiniteRun = document.getElementById("infinite").checked


    let washer = new Washer();
    washer.queue.setLimit(queueLimit);

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
                let res = {
                    "Total Simulation time": arrivalTimes.toFixed(3) + ' mins =  (' + (arrivalTimes / 60).toFixed(3) + ') hrs',
                    "ArrivedCars": arrivedCars,
                    "Washed": washer.washed,
                    "Washing": washer.washing,
                    "In Queue": washer.queue.size(),
                    "Max In Queue": maxInQueue,
                    "Max Entities in System": maxEntities
                }

                clearTimeout(tm);
                clearTimeout(washer.washInterval);

                Object.getOwnPropertyNames(res).forEach(function (val, idx, array) {
                    console.log(val + ' -> ' + res[val]);
                });

                let i = 0;
                washer.workers.forEach(worker => {
                    console.log(`Worker[${i}] busy time: `, parseFloat(worker.workTime).toFixed(3), ' mins = (', ((worker.workTime / arrivalTimes) * 100).toFixed(3), '%)')
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
                    content += `<tr>
                            <td class="tg-0lax">Worker[${j}]</td>
                            <td class="tg-0lax">${parseFloat(worker.workTime).toFixed(3) + ' mins = (' + ((worker.workTime / arrivalTimes) * 100).toFixed(3) + '%)'}</td>
                        </tr>`
                    j++;
                });
                content += `</table></div></div><hr class='mb-4'>`
                $("#results").append(content);

                $('#resultArea').show();
                toggleBtns();
            }
        }
    }

    arriveCars();
    washer.wash();
    simulations++;
}
let simulations = 0;

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
    speed = parseInt(this.value);
});

$("#aDist").change(function(){
    $(this).find("option:selected").each(function(){
        var optionValue = $(this).attr("value");
        if(optionValue){
            $(".arrbox").not("." + optionValue).hide();
            $("." + optionValue + ".arrbox").show();
        }
    });
}).change();

$("#sDist").change(function(){
    $(this).find("option:selected").each(function(){
        var optionValue = $(this).attr("value");
        if(optionValue){
            $(".servbox").not("." + optionValue).hide();
            $("." + optionValue + ".servbox").show();
        }
    });
}).change();

// $(document).ready(function () {
//     console.log(document.getElementById("duration").value)
// })