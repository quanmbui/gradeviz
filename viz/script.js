/////////////////
/// SETUP VIZ ///
/////////////////

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

// create arc and pie generators for donutChart
var radius = Math.min(width/2, height/2) / 2;

var arc = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 30);

var pie = d3.pie()
    .value(function(d) { return d; });

// create line generator for trendChart
var line = d3.line()
    .x(function(d, i) { return xTrend(i); })
    .y(function(d, i) { return yTrend(d); });

// create tooltip 

// create barChart
d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("id", "barChart")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// create donutChart
d3.select("body")
    .append("svg")
    .attr("id", "gradeStats")
    .attr("width", width/2 + margin.left + margin.right)
    .attr("height", height/4 + margin.top + margin.bottom)
    .attr("transform", "translate(0," + (height/2) + ")")
    .append("g")
    .attr("id", "donutChart")
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

d3.select("#donutChart").append("text")
    //.attr("y", 6)
    .attr("dy", ".91em")
    .attr("text-anchor", "middle")
    .text("GPA");

d3.select("#trendChart").append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height/2 + ")")
    .call(d3.axisBottom(xTrend));

d3.select("#trendChart").append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(yTrend));

d3.select("#gradeStats").append("text")
    .attr("x", 200)
    .attr("y", 90)
    .attr("id", "letterGrade")
    .text("No Grade")
//////////////////////////////
/// DATA LOADING FUNCTIONS ///
//////////////////////////////

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

////////////////////////
/// UPDATE FUNCTIONS ///
////////////////////////

// draw all charts with updated data
function update() {
  d3.json("data.json", function(error, data) {
      var ratingsData = [3.71, 4.15, 3.52, 3.8, 4.01, 4.20, 3.9];

      var gpa = getGPA(data["distribution"]);
      var gpaData = [gpa, 4.0 - gpa];

      updateBarChart(data);
      updateDonutChart(gpaData);
      updateTrendChart(ratingsData);
      updateGradeDisplay(data["medianGrade"]);

  })
}

// update barChart
function updateBarChart(data) {
  var freq = getFrequency(data["distribution"]);
  xBar.domain(Object.keys(freq));
  yBar.domain([0, d3.max(Object.values(freq), function(d) { return d})]);

  var barChart = d3.select("#barChart")
      .selectAll(".bar")
      .data(Object.entries(freq))
      .attr("y", height) // might not want
      .attr("height", 0) // this to happen?

  barChart.transition()
      .duration(500)
      .attr("y", function(d) { return yBar(d[1]); })
      .attr("height", function(d) { return height - yBar(d[1]); })

  barChart.enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return xBar(d[0]); })
      .attr("y", height)
      .attr("width", xBar.bandwidth())
      .attr("height", 0)
      .attr("fill", "steelblue")
      .transition().duration(500)
      .attr("y", function(d) { return yBar(d[1]); })
      .attr("height", function(d) { return height - yBar(d[1]); });

  barChart.exit()
      .transition().duration(500)
      .attr("y", height)
      .attr("height", 0)
      .remove();

}

// update donutChart
function updateDonutChart(gpaData) {
  var donutChart = d3.select("#donutChart")
      .selectAll(".donut")
      .data(pie(gpaData))

  donutChart.transition()
      .duration(500)
          .attrTween("d", function(d) {
              var inter = d3.interpolate(d.startAngle + 0.1, d.endAngle);
              return function(t) {
                  d.endAngle = inter(t);
                  return arc(d);
          }});

  donutChart.enter()
      .append("path")
      .attr("class", "donut")
      .attr("d", arc)
      .style("fill", function (d, i) { return i == 0 ? "steelblue" : "none"; })
      .transition()
      .duration(500)
          .attrTween("d", function(d) {
              var inter = d3.interpolate(d.startAngle + 0.1, d.endAngle);
                return function(t) {
                    d.endAngle = inter(t);
                    return arc(d);
          }});

  donutChart.enter()
      .append("text")
      .attr("class", "donut")
      .attr("text-anchor", "middle")
      .attr("class", "donutChartText")
      .text(Math.round(gpaData[0] * 100) / 100);

  donutChart.exit().remove();

}

// update trendChart
function updateTrendChart(ratingsData) {
  xTrend.domain([0, 6]);
  var trendChartPoints = d3.select("#trendChart").selectAll(".point")
      .data(ratingsData)
  var trendChartPath = d3.select("#trendChart").selectAll(".path")
      .data([ratingsData])

  trendChartPoints.transition()
      .duration(500)
      .attr("cx", function(d, i) { return xTrend(i); })
      .attr("cy", function(d, i) { return yTrend(d); });

  trendChartPoints.enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", function(d, i) { return xTrend(i); })
      .attr("cy", function(d, i) { return yTrend(d); })
      .attr("r", 3.5)
      .attr("fill", "steelblue");

  trendChartPath.transition()
      .duration(500)
      .attr("d", line);

  trendChartPath.enter()
      .append("path")
      .attr("class", "path")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);

  trendChartPoints.exit().remove();
  trendChartPath.exit().remove();
}

// update gradeDisplay
function updateGradeDisplay(grade) {
  d3.select("#letterGrade").text(grade)
}

function clear() {
  data = [];
  updateBarChart(data);
}
