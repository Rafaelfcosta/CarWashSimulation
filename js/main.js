function run() {
    toggleBtns();
    var arrival = new Worker('/js/arrival.js');
    var wash = new Worker('/js/wash.js');

    let endTimeInHours = parseInt(document.getElementById("duration").value)
    let totaltime = 0;
    let speed = 1001 - parseInt(document.getElementById("customRange1").value);
    let funcionario;
    let entities;
    let verbose = document.getElementById("verbose").checked;
    let arrOP = document.getElementById('aDist').value;
    let servOP = document.getElementById('sDist').value;
    
    let arrValues = {
        "constV": parseInt(document.getElementById("aConst").value),

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
        "constV": parseInt(document.getElementById("sConst").value),

        "expA": parseInt(document.getElementById("sLimExpo").value),
        "expB": parseInt(document.getElementById("sMeanExpo").value),

        "triA": parseInt(document.getElementById("sATri").value),
        "triB": parseInt(document.getElementById("sBTri").value),
        "triC": parseInt(document.getElementById("sCTri").value),

        "meanA": parseInt(document.getElementById("sMeanNormal").value),

        "uniformA": parseInt(document.getElementById("sAUniform").value),
        "uniformB": parseInt(document.getElementById("sBUniform").value)
    }

    arrival.postMessage([arrValues, endTimeInHours, arrOP, 0]);
    wash.postMessage([1, servValues, servOP]);
    arrival.postMessage(speed);
    wash.postMessage(speed);

    function MyObject() {
        this._cars = 0;
        this._queue = [];
    }

    Object.defineProperty(MyObject.prototype, "arrivedCars", {
        set: function (val) {
            this._cars = val;
            wash.postMessage([0, this._queue]);
        },
        get: function () {
            return this._cars;
        }
    });

    var m = new MyObject();
    arrival.postMessage(null);

    arrival.addEventListener('message', function (event) {
        let data = event.data
        if (verbose) {
            console.log('arrival msg received => ', data);
        }
        if (data[0] == 0) {
            m._queue.unshift(data[1])
            m.arrivedCars++;
            totaltime = m._queue[0].arrival;
            let progress = (totaltime / (endTimeInHours * 60)) * 100;
            $(".progress-bar").width(progress + '%');
        }

        if (data[0] == 1) {
            wash.terminate();
            results();
        }
    });

    wash.addEventListener('message', function (event) {
        let data = event.data
        if (verbose) {
            console.log('wash msg received => ', data);
        }
        funcionario = data[0].worker;
        w = data[0];
        q = data[1];
        entities = data[2];
    });


    arrival.addEventListener('error', function (event) {
        console.log('error received => ', event);
    });

    wash.addEventListener('error', function (event) {
        console.log('error received => ', event);
    });


    function results() {
        toggleBtns();
        let totalQueueTimes = 0;
        funcionario.carsWashed.forEach(car => {
            totalQueueTimes += car.timeInQueue
        });
        let res = {
            "Total Simulation time": totaltime.toFixed(3) + ' mins =  (' + (totaltime / 60).toFixed(3) + ') hrs',
            "ArrivedCars": m.arrivedCars,
            "Washed": funcionario.carsWashed.length,
            "Washing": w.washing,
            "In Queue": q.currentSize,
            "Max In Queue": q.maxInQueue,
            "Mean In Queue": q.queueSizes.length == 0 ? 0 : q.queueSizes.reduce((total, amount, index, array) => {
                total += amount;
                if (index === array.length - 1) {
                    return total / array.length;
                } else {
                    return total;
                }
            }).toFixed(3),
            "Mean Time In Queue": (totalQueueTimes / funcionario.carsWashed.length).toFixed(3) + ' mins',
            "Mean Time in System": ((totaltime / getUnique(funcionario.carsWashed, 'id').length) + (totalQueueTimes / funcionario.carsWashed.length)).toFixed(3) + ' mins',
            "Mean Entities in System": entities.inSystem.reduce((total, amount, index, array) => {
                total += amount;
                if (index === array.length - 1) {
                    return total / array.length;
                } else {
                    return total;
                }
            }).toFixed(3),
            "Max Entities in System": entities.maxEntities,
            "Worker Occupation": ((funcionario.workTime / totaltime) * 100).toFixed(3) > 100 ? '100.000%' : ((funcionario.workTime / totaltime) * 100).toFixed(3) + '%'
        }

        Object.getOwnPropertyNames(res).forEach(function (val, idx, array) {
            console.log(val + ' -> ' + res[val]);
        });

        let content = `<h5>Simulation [${simulations}]</h5> <div class="row">
                <div class="col-md-12">
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
        content += `</table></div></div><hr class='mb-4'>`
        $("#results").prepend(content);

        if (verbose) {
            console.log(funcionario.carsWashed)
        }

    }
    simulations++;

    document.querySelector('input[type="range"]').addEventListener('change', function (e) {
        speed = 1001 - parseInt(this.value);
        arrival.postMessage(speed);
        wash.postMessage(speed);
    });
}

let simulations = 0;

function getUnique(arr, comp) {

    const unique = arr
        .map(e => e[comp])

        // store the keys of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)

        // eliminate the dead keys & store unique objects
        .filter(e => arr[e]).map(e => arr[e]);

    return unique;
}


$("#aDist").change(function () {
    $(this).find("option:selected").each(function () {
        var optionValue = $(this).attr("value");
        if (optionValue) {
            $(".arrbox").not("." + optionValue).hide();
            $("." + optionValue + ".arrbox").show();
        }
    });
}).change();

$("#sDist").change(function () {
    $(this).find("option:selected").each(function () {
        var optionValue = $(this).attr("value");
        if (optionValue) {
            $(".servbox").not("." + optionValue).hide();
            $("." + optionValue + ".servbox").show();
        }
    });
}).change();

function clearR() {
    $("#results").empty();
}

document.getElementById("runBtn").addEventListener("click", function (event) {
    event.preventDefault()
});

function toggleBtns() {
    $('#runBtn').prop('disabled', function (i, v) {
        return !v;
    });
}