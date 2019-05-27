function uniform(a, b, qtd) {
    let results = []
    for (let i = 0; i < qtd; i++) {
        results.push((Math.random() * (b - a)) + a)
    }
    return results
}

function triangular(a, b, c, qtd) {
    let results = []
    for (let i = 0; i < qtd; i++) {
        let rand = Math.random()
        if (rand < ((c - a) / (b - a))) {
            let v = a + Math.sqrt(rand * (c - a) * (b - a))
            results.push(v)
        } else {
            let v = b - Math.sqrt((1 - rand) * (b - c) * (b - a))
            results.push(v)
        }
    }
    return results
}

function exponential(limitInf, mean, qtd) {
    let results = []
    let alfa = 1.0 / (mean - limitInf)
    for (let i = 0; i < qtd; i++) {
        let rand = Math.random()
        let v = limitInf - (1 / alfa) * Math.log(rand)
        results.push(v)
    }
    return results
}

function normal(mean, qtd) {
    let results = []
    for (let i = 0; i < qtd; i++) {
        let Z = calcZ(mean)
        results.push(Z)
    }
    return results
}

function calcZ(mean) {
    let delta = 2
    let sum12 = 0
    for (let i = 0; i < 12; i++) {
        sum12 += Math.random()
    }

    return mean + delta * (sum12 - 6.0);
}