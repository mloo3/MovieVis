var fill = d3.scale.category20();
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