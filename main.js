var fill = d3.scale.category20();
window.onload = start;
var selectedMovie;

function start() {
    d3.csv('movies.csv', function(d) {
        keys = Object.keys(d[0])
        genreFrequency = {};
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
            genres = d[keys[9]].split('|')
            genres.forEach(function(g) {
               genreFrequency[g] = (genreFrequency[g] || 0) + 1;
            });
        });

        // compile all movie names
        var allTitles = getMovieNames(d);
        d3.select("#list").selectAll("div")
            .data(allTitles)
            .enter()
            .append("div")
            .text(function(d) { return d; })
            .on("click", function(d,i) {
                selectedMovie = d;
            });

        console.log(Object.keys(genreFrequency).length);
        d3.layout.cloud().size([300,300])
            .words(Object.keys(genreFrequency).map(function(key, index) {
                return {text: key, size: genreFrequency[key]};
            }))
            .padding(5)
            .rotate(function() { return ~~(Math.random() * 2) * 90; })
            .font("Impact")
            .fontSize(function(d) {
                return d.size;})
            .on("end", draw)
            .start();
    });
}

function draw(words) {
    d3.select("#cloud").append("svg")
        .attr("width", 300)
        .attr("height", 300)
      .append("g")
        .attr("transform", "translate(150,150)")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
}

function getMovieNames(data) {
    console.log("hello");
    // var names = d3.nest()
    //     .key(function(d) { return d.movie_title; })
    //     .entries(data);
    var names = data.map(function(d) { return d.movie_title.trim()});
    console.log(names);
    return names;
}