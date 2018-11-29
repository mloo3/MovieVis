window.onload = start;

function start() {
    d3.csv('movies.csv', function(d) {
        keys = Object.keys(d[0])
        d.forEach(function(d) {
            d[keys[2]] = +d[keys[2]];
            d[keys[3]] = +d[keys[3]];
            d[keys[4]] = +d[keys[4]];
            d[keys[5]] = +d[keys[5]];
            d[keys[7]] = +d[keys[7]];
            d[keys[8]] = +d[keys[8]];
            d[keys[12]] = +d[keys[12]];
            d[keys[13]] = +d[keys[13]];
            d[keys[15]] = +d[keys[15]];
            d[keys[18]] = +d[keys[18]];
            d[keys[18]] = +d[keys[18]];
            d[keys[22]] = +d[keys[22]];
            d[keys[23]] = +d[keys[23]];
            d[keys[24]] = +d[keys[24]];
            d[keys[25]] = +d[keys[25]];
            d[keys[26]] = +d[keys[26]];
            d[keys[27]] = +d[keys[27]];
        })

        // console.log(keys);
        // d[0].keys[2] = +d[0].keys[2];
        console.log(d[0]);
        console.log(keys[2]);

    })
}