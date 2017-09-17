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

// needed for axes labels
var gradesList = ["A+", "A", "A-", "B+", "B", "B-",
                  "C+", "C", "C-", "D+", "D", "F"];
var semestersList = ["S11", "F11", "S12", "F12", "S13", "F13",
                      "S14", "F14", "S15", "F15", "S16"];

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

// create tooltips
var tipBar = d3.tip()
    .attr("class", "tip")
    .offset([-10, 0])
    .html(function(d, i) {
      return "<span style='color:white'>" + Math.round(d[1] * 100) +
      "% people got a(n) " + gradesList[i] + "! </span>";
    })

var tipTrend = d3.tip()
    .attr("class", "tip")
    .offset([-10, 0])
    .html(function(d, i) {
      return "<strong>Semester:</strong> <span style='color:white'>" + semestersList[i] +
      "</span> <br/> <strong>Avg Rating:</strong> <span style='color:white'>" + d + "</span>";
    })

// create barChart
d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("id", "barChart")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// tipBar will function on #barChart
d3.select("#barChart").call(tipBar);

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

// tipTrend will function on #trendChart
d3.select("#trendChart").call(tipTrend);

d3.select("#barChart").append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xBar));

d3.select("#barChart").append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(yBar));

// Text label for the x axis (barChart)
d3.select("#barChart").append("text")
  .attr("class", "axis label")
  .attr("transform", "translate(" + width/2 + " ," + 450 + ")")
  .style("text-anchor", "middle")
  .text("Letter Grades");

// Text label for the y axis (barChart)
d3.select("#barChart").append("text")
  .attr("class", "axis label")
  .attr("transform", "rotate(-90)")
  .attr("y", 10 - margin.left)
  .attr("x", 20 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Count");

d3.select("#donutChart").append("text")
    //.attr("y", 6)
    .attr("dy", ".91em")
    .attr("text-anchor", "middle")
    .text("GPA");

d3.select("#donutChart").append("text")
    .attr("text-anchor", "middle")
    .attr("id", "donutChartText")
    .text("0.00");

d3.select("#trendChart").append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height/2 + ")")
    .call(d3.axisBottom(xTrend));

d3.select("#trendChart").append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(yTrend));

// Text label for the x axis
d3.select("#trendChart").append("text")
  .attr("class", "axis label")
  .attr("transform", "translate(" + width/2 + " ," + 250 + ")")
  .style("text-anchor", "middle")
  .text("Semesters");

// Text label for the y axis
d3.select("#trendChart").append("text")
  .attr("class", "axis label")
  .attr("transform", "rotate(-90)")
  .attr("y", -60)
  .attr("x", -100)
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Average Rating");


d3.select("#gradeStats").append("text")
    .attr("x", 200)
    .attr("y", 90)
    .attr("id", "letterGrade")
    .text("No Grade")

/////////////////////////////
/// DATA HELPER FUNCTIONS ///
/////////////////////////////

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

    for (var i = 0; i < frequencies.length; i++) {
        if (frequencies[i] === undefined) {
            frequencies[i] = 0;
        }
    }

    frequencies = frequencies.map(function(x) { return x/distribution.length; })

    return frequencies;
}
// returns total number of letter grades available
function getNumGrades(distribution) {
  return distribution.length;
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
function update1() {
  d3.json("data1.json", function(error, data) {
      var ratingsData = [4.11, 4.01, 4.21, 3.86, 3.71, 4.15, 3.52, 3.8, 4.01, 4.20, 3.86];

      var numGrades = getNumGrades(data["distribution"]);
      var gpa = getGPA(data["distribution"]);
      var gpaData = [gpa, 4.0 - gpa];

      updateBarChart(data);
      updateDonutChart(gpaData);
      updateTrendChart(ratingsData);
      updateTextDisplay(gpa, data["medianGrade"]);

  })
}

function update2() {
  d3.json("data2.json", function(error, data) {
      var ratingsData = [2.55, 2.91, 3.5, 3.2, 2.71, 2.21, 2.89, 3.1, 2.32, 2.91, 3.00];

      var numGrades = getNumGrades(data["distribution"]);
      var gpa = getGPA(data["distribution"]);
      var gpaData = [gpa, 4.0 - gpa];

      updateBarChart(data);
      updateDonutChart(gpaData);
      updateTrendChart(ratingsData);
      updateTextDisplay(gpa, data["medianGrade"]);

  })
}


// update barChart
function updateBarChart(data) {
  var freq = getFrequency(data["distribution"]);
  xBar.domain(Object.keys(freq));
  yBar.domain([0, d3.max(Object.values(freq), function(d) { return d})]);

  d3.select("#barChart").select(".axis--x").call(d3.axisBottom(xBar)
      .tickFormat(function(i) { return gradesList[i] }));
  d3.select("#barChart").select(".axis--y").call(d3.axisLeft(yBar));

  var barChart = d3.select("#barChart")
      .selectAll(".bar")
      .data(Object.entries(freq))

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
      .on("mouseover", tipBar.show)
      .on("mouseout", tipBar.hide)
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

  donutChart.exit().remove();

}

// update trendChart
function updateTrendChart(ratingsData) {
  xTrend.domain([0, 10]);

  d3.select("#trendChart").select(".axis--x").call(d3.axisBottom(xTrend)
      .tickFormat(function(i) { return semestersList[i]; } ));

  var trendChartPath = d3.select("#trendChart").selectAll(".path")
      .data([ratingsData])
  var trendChartPoints = d3.select("#trendChart").selectAll(".point")
      .data(ratingsData)

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
      .attr("fill", "steelblue")
      .on("mouseover", tipTrend.show)
      .on("mouseout", tipTrend.hide);

  trendChartPath.exit().remove();
  trendChartPoints.exit().remove();
}

// update gradeDisplay
function updateTextDisplay(gpa, grade) {
  d3.select("#letterGrade").text(grade)
  d3.select("#donutChartText").text(gpa.toFixed(2))
}
