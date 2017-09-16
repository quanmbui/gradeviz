// set up canvas
var margin = {top: 80, right: 20, bottom: 110, left: 80},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// create scales
var xBar = d3.scaleBand().rangeRound([0, width]).padding(0.2),
    yBar = d3.scaleLinear().rangeRound([height, 0]),
    xTrend = d3.scaleLinear().rangeRound([0, width])
    yTrend = d3.scaleLinear().rangeRound([height/2, 0]).domain([0, 5]);

// possible letter grade options
var gradesList = ["A+", "A", "A-", "B+", "B", "B-",
                  "C+", "C", "C-", "D+", "D", "F"];
// create axes
var xAxis = d3.axisBottom(xBar)
              .tickFormat(function(d, i) { return gradesList[i] }),
    yAxis = d3.axisLeft(yBar);

// create line generator
var line = d3.line()
    .x(function(d, i) { return xTrend(i); })
    .y(function(d, i) { return yTrend(d); });

// create barChart
d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("id", "barChart")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// create trendChart
d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height/2 + margin.top + margin.bottom)
    //.attr("transform", "translate(0," + (height/2) + ")")
    .append("g")
    .attr("id", "trendChart")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("data.json", function(error, data) {
    var ratings = [3.71, 4.15, 3.52, 3.8, 4.01, 4.20, 3.9];
    xTrend.domain([0, ratings.length]);
    var freq = getFrequency(data["distribution"]);
    var gpa = getGPA(data["distribution"]);
    xBar.domain(Object.keys(freq));
    yBar.domain([0, d3.max(Object.values(freq), function(d) { return d})]);

    d3.select("#barChart").append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xBar));

    d3.select("#barChart").append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yBar).ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Frequency");

    d3.select("#barChart").selectAll(".bar")
        .data(Object.entries(freq))
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xBar(d[0]); })
        .attr("y", function(d) { return yBar(d[1]); })
        .attr("width", xBar.bandwidth())
        .attr("height", function(d) { return height - yBar(d[1]); })
        .attr("fill", "steelblue");

    d3.select("#trendChart").append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height/2 + ")")
        .call(d3.axisBottom(xTrend));

    d3.select("#trendChart").append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yTrend));

    d3.select("#trendChart").selectAll(".point")
        .data(ratings)
        .enter().append("circle")
        .attr("class", "point")
        .attr("cx", function(d, i) { return xTrend(i); })
        .attr("cy", function(d, i) { return yTrend(d); })
        .attr("r", 3.5)
        .attr("fill", "steelblue");

    d3.select("#trendChart").append("path")
        .datum(ratings)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

})

// returns JS object of frequencies of each letter grade
function getFrequency(distribution) {
    var frequencies = [];
    for (var i = 0; i < distribution.length; i++) {
        var key = distribution[i];
        if (frequencies[key]) {
            frequencies[key]++;
        } else {
            frequencies[key] = 1;
        }
    }

    // sort by grades
    frequencies = [frequencies["A+"], frequencies["A"], frequencies["A-"],
                  frequencies["B+"], frequencies["B"], frequencies["B-"],
                  frequencies["C+"], frequencies["C"], frequencies["C-"],
                  frequencies["D+"], frequencies["D"], frequencies["F"]];

    return frequencies;
}

// returns GPA for class
function getGPA(distribution) {
    var total = 0;
    for (var i = 0; i < distribution.length; i++) {
        if (distribution[i] == "A+" || distribution[i] == "A") {
            total = total + 4.0;
        } else if (distribution[i] == "A-") {
            total = total + 3.7;
        } else if (distribution[i] == "B+") {
            total = total + 3.3;
        } else if (distribution[i] == "B") {
            total = total + 3.0;
        } else if (distribution[i] == "B-") {
            total = total + 2.7;
        } else if (distribution[i] == "C+") {
            total = total + 2.3;
        } else if (distribution[i] == "C") {
            total = total + 2.0;
        } else if (distribution[i] == "C-") {
            total = total + 1.7;
        } else if (distribution[i] == "D+") {
            total = total + 1.3;
        } else if (distribution[i] == "D") {
            total = total + 1.0;
        } else if (distribution[i] == "F") {
            total = total + 0.0;
        }
    }
    var gpa = total / distribution.length;
    return gpa;
}
