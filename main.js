Math.seedrandom('yo mama.');
var fill = d3.scale.category20();
var cloudWidth = 500;
var cloudHeight = 500;
var selectedGenre;
var selectedGenreIdx;
var curview = "movie"; // if force graph is viewing a person or movie
window.onload = start;
var selected; // movie or person
var allData;
var forceSvg;
var dropdown;

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
        allData = d;
        hideTable();
        drawDropdown();

        forceSvg = d3.select("#force").append("svg")
            .attr("width", 500)
            .attr("height", 500);

        // default selected genre
        // selectedGenre = Object.keys(genreFrequency)[0];
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
            .font("helvetica")
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
        .style("font-family", "helvetica")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; })
              .on('click', function(d,i) {
                selectedGenre = d.text;
                selectedGenreIdx = i;
                selected='';
                drawList(d.text, curview);
                d3.select('#cloud').selectAll("text").classed('clicked', function(a) {
                    return a.text === d.text;
                });
                clearForceGraph();
              });
}

function getMovieNames(data, genre) {
    console.log(data);
    console.log(genre);
    var names = data.filter(function(d) {
        var genres = d['genres'].split('|');
        if (genres.includes(genre)) {
            return d.movie_title.trim();
        }
    });
    return names;
}

function getActorNames(data, genre) {
    var rows = data.filter(function(d) {
        var genres = d['genres'].split('|');
        if (genres.includes(genre)){
            return true;
        }
    });
    var res = []
    rows.forEach(function(r) {
        for (var i = 1; i < 4; i++) {
            curname = r['actor_' + i + '_name'].trim();
            if(curname && res.indexOf(curname) == -1) {
                res.push(curname);
            }
        }
        let director = r['director_name'].trim();
        if (res.indexOf(director) == -1) {
            res.push(director);
        }
    });
    return res;
}


function drawDropdown() {
    console.log("drawing dropdown");
    dropdown = d3.select("#cats")
        .append('select');
    dropdown.append('option').attr('value', 'movie').text('Movie Titles');
    dropdown.append('option').attr('value', 'person').text('Actors/Directors');
    dropdown.on('change', function() {
        clearForceGraph();
        curview = this.value;
        selected = '';
        drawList(selectedGenre, curview);
    })
}

function drawForceGraph(type, lselected, genre, data) {
    // filter data
    var filtered;
    var nodes = [];
    var links = [];
    var payload = {};

    if (type === "person") {
        data.forEach(function(d) {
            for (var i = 1; i < 4; i++) {
                if (d['actor_' + i + '_name'] === lselected) {
                    payload['personfb'] = d['actor_' + i + '_facebook_likes'];
                    payload['isDirector'] = false;
                }
            }
            if (lselected === d['director_name']) {
                payload['personfb'] = d['director_facebook_likes'];
                payload['isDirector'] = true;
            }
        });

        console.log(payload);

        filtered = data.filter(function(d){
            let genres = d['genres'].split('|');
            if (genres.includes(genre) && 
                (lselected===d.actor_1_name || lselected===d.actor_2_name || lselected === d.actor_3_name || lselected === d.director_name)) {
                return true;
            }
        });
        nodes.push({"id":lselected, "type": "center"});
        for (var i = 0; i < filtered.length; i++){
            nodes.push({"id": filtered[i].movie_title.trim(), "type": "leaf", "x": i+10, "y": i+10});
            links.push({"source": 0, "target": i+1})
        }

    } else { // type is movie
        console.log(lselected);
        data.forEach(function(d) {
            if (d.movie_title.trim() === lselected) {
                payload['gross'] = d.gross;
                payload['budget'] = d.budget;
                payload['score'] = d.imdb_score;
                payload['year'] = d.title_year;
                payload['language'] = d.language;
                payload['rating'] = d.content_rating;
                payload['country'] = d.country;
            }
        });


        filtered = data.filter(function(d){
            let genres = d['genres'].split('|');
            if (genres.includes(genre) && d.movie_title.trim() === lselected) {
                return true;
            }
        });
        curMovie = filtered[0];
        nodes.push({"id": lselected, "type": "center"});
        for(var i = 1; i < 4; i++){
            if (curMovie['actor_' + i + '_name']) {
                nodes.push({"id": curMovie['actor_' + i + '_name'], "type": "leaf", "x": i + 20, "y": i + 30});
                links.push({"source": 0, "target": nodes.length - 1});
            }
        }
        if(curMovie['director_name']) {
            nodes.push({"id": curMovie['director_name'], "type": "leaf", "x": 30, "y":40});
            links.push({"source": 0, "target": nodes.length - 1});
        }
    }

    force = d3.layout.force()
        .size([500, 500])
        .linkDistance(200)
        .charge(-400)
        .nodes(nodes)
        .links(links)
        .start();

    var drag = force.drag();
    clearForceGraph();

    updateTable(type, payload);

    console.log(links);
    linkvar = forceSvg.selectAll(".link").data(links, function(d, i) {
        return d.source.id + d.target.id;
    });


    link = linkvar
        .enter().append("line")
        .attr("class", "link");

    nodevar = forceSvg.selectAll(".node").data(nodes, function(d,i) {
        return d.id;
    });
    node = nodevar
        .enter()
        .append("g")
        .attr("class", "node")
        .on("click", function(d) {
            if (d3.event.defaultPrevented) return; // dragged
            if (curview === "person" && (d.id !== selected)) {
                selected = d.id;
                console.log(selected);
                curview = "movie";
                dropdown.property('value', curview);
                drawForceGraph(curview, d.id, selectedGenre, allData);
                drawList(selectedGenre, curview);
            } else if (curview === "movie" && d.id !== selected) {
                selected = d.id;
                console.log(selected);
                curview = "person";
                dropdown.property('value', curview);
                drawForceGraph(curview, d.id, selectedGenre, allData);
                drawList(selectedGenre, curview);
            }
        })
        .call(drag);

    node.append("circle")
        .attr("r", 20)
        .attr("fill", function(d) {
            return fill(selectedGenreIdx);
        })
        .attr("stroke", function(d) {
            if (d.type === "center") { return "black"; }
        })
        .attr("opacity", function(d) {
            if (d.type === "leaf") { return 0.5; }
        })

    node.append("text")
        .text(function(d) { return d.id; });

    force.on("tick", tick);
    function tick() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        node.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    }
}
function hideTable() {
    document.getElementById("persontable").style.display='none';
    document.getElementById("movietable").style.display='none';

}

function updateTable(type, payload) {
    console.log("updateTable");
    console.log(type, payload);
    if (type === "person") {
        document.getElementById("movietable").style.display='none';
        document.getElementById("persontable").style.display='block';
        d3.select("#personfb").text(payload.personfb);
        if (payload.isDirector) {
            d3.select("#role").text("Director");
        } else {
            d3.select("#role").text("Actor/Actress");
        }
    } else {
        document.getElementById("movietable").style.display='block';
        document.getElementById("persontable").style.display='none';
        d3.select("#gross").text(payload.gross);
        d3.select("#budget").text(payload.budget);
        d3.select("#score").text(payload.score);
        d3.select("#year").text(payload.year);
        d3.select("#rating").text(payload.rating);
        d3.select("#language").text(payload.language);
        d3.select("#country").text(payload.country);
    }
}


function drawList(genre, type) {
    if (!genre) {
        return;
    }
    console.log("drawList");
    console.log(selected, type);
    // compile all movie names
    var allTitles;
    var allTitlesNames;
    if (type === "movie") {
        curview = "movie";
        console.log("in here");
        allTitles = getMovieNames(allData, genre);
        console.log(allTitles);
        allTitlesNames = allTitles.map(function(d) {
            return d.movie_title.trim();
        });
    } else {
        console.log("Getting actor names");
        curview = "person";
        allTitlesNames = getActorNames(allData, genre);
    }
    console.log(allTitlesNames);
    var list = d3.select("#list").selectAll("div")
        .data(allTitlesNames, function(d, i) {
            return d;
        });

    list.exit().remove();

    list.enter()
        .append("div")
        .text(function(d) { return d; })
        .on("click", function(d,i) {
            d3.select("#list").selectAll("div").classed("list-item-clicked", function(l,i){
                return l === d;
            });
            selected = d;
            console.log(selected);
            drawForceGraph(curview, selected, selectedGenre, allData);

        });
    d3.select("#list").selectAll("div").classed("list-item-clicked", function(d) {
        return selected === d;
    });
    if (selected) {
        var element = document.getElementsByClassName("list-item-clicked")[0];
        console.log(element);
        element.scrollIntoView();
    }
}

function clearForceGraph() {
    hideTable();
    curnodes = forceSvg.selectAll(".node").data([], function(d,i) { 
        return d.id; 
    });
    curnodes.exit().remove();

    curlinks = forceSvg.selectAll(".link").data([], function(d, i) {
        return d.source.id + d.target.id;
    });
    curlinks.exit().remove();
}