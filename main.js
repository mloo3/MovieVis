Math.seedrandom('yo mama.');
var fill = d3.scale.category20();
var cloudWidth = 500;
var cloudHeight = 500;
var selectedGenre;
window.onload = start;

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
        // default selected genre
        selectedGenre = Object.keys(genreFrequency)[0];
        var genreCounts = Object.values(genreFrequency);
        var bins = d3.layout.histogram()
            .bins(8)
            .range([Math.min(...genreCounts), Math.max(...genreCounts)])
            (genreCounts);

        d3.layout.cloud().size([cloudWidth,cloudHeight])
            .words(Object.keys(genreFrequency).map(function(key) {
                return {text: key, size: genreFrequency[key]};
            }))
            .padding(5)
            .rotate(function() { return ~~(Math.random() * 2) * 90; })
            .font("Impact")
            .fontSize(function(d) {
                for (var i = 0; i < bins.length; i++) {
                    if (bins[i].includes(d.size)) {
                        return ((cloudWidth / 8) * (i+1))/5;
                    }
                }
                return d.size;})
            .on("end", draw)
            .start();
    });
}

function draw(words) {
    d3.select("#cloud").append("svg")
        .attr("width", cloudWidth)
        .attr("height", cloudHeight)
      .append("g")
        .attr("transform", "translate(250,250)")
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
        .text(function(d) { return d.text; })
      .on('click', function(d,i) {
        selectedGenre =d.text;
        d3.select('#cloud').selectAll("text").classed('clicked', function(a) {
            return a.text === d.text;
        });
        // d3.select(this).style('fill','red');
      });
}