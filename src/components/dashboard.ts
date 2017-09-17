import { Component, OnInit, ElementRef } from '@angular/core';

import { D3Service, D3, Selection } from 'd3-ng2-service';
import 'd3-tip';

@Component({
	selector: 'dashboard-component',
	templateUrl: './dashboard.html',
	styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
	private d3: D3;
	private parentNativeElement: any;

	constructor(element: ElementRef, d3Service: D3Service) { // <-- pass the D3 Service into the constructor
		this.d3 = d3Service.getD3(); // <-- obtain the d3 object from the D3 Service
		this.parentNativeElement = element.nativeElement;
	}

	ngOnInit() {
		let d3 = this.d3; // <-- for convenience use a block scope variable
		let d3ParentElement: Selection<any, any, any, any>; // <-- Use the Selection interface (very basic here for illustration only)
	}
	/////////////////
	/// SETUP VIZ ///
	/////////////////

	// set up canvas
	margin: any = {top: 80, right: 20, bottom: 110, left: 80};
	width: number = 600 - this.margin.left - this.margin.right;
	height: number  = 600 - this.margin.top - this.margin.bottom;

	// create scales
	xBar = this.d3.scaleBand().rangeRound([0, this.width]).padding(0.2);
	yBar = this.d3.scaleLinear().rangeRound([this.height, 0]);
	xTrend = this.d3.scaleLinear().rangeRound([0, this.width]);
	yTrend = this.d3.scaleLinear().rangeRound([this.height/2, 0]).domain([0, 5]);

	// needed for axes labels
	gradesList = ["A+", "A", "A-", "B+", "B", "B-",
	"C+", "C", "C-", "D+", "D", "F"];
	semestersList = ["S11", "F11", "S12", "F12", "S13", "F13",
	"S14", "F14", "S15", "F15", "S16"];

	// create arc and pie generators for donutChart
	radius = Math.min(this.width/2, this.height/2) / 2;

	arc = this.d3.arc()
	.outerRadius(this.radius - 40)
	.innerRadius(this.radius - 30);

	pie = this.d3.pie().value(d => { return d; });

	// create line generator for trendChart
	line = this.d3.line()
	.x(function(d, i) { return this.xTrend(i); })
	.y(function(d, i) { return this.yTrend(d); });

	// create tooltips
	tipBar = this.d3.tip()
	.attr("class", "d3-tip")
	.offset([-10, 0])
	.html(function(d, i) {
		return "<span style='color:white'>" + Math.round(d[1] * 100) +
		"% people got a(n) " + this.gradesList[i] + "! </span>"
	});

	tipTrend = this.d3.tip()
	.attr("class", "d3-tip")
	.offset([-10, 0])
	.html(function(d, i) {
		return "<strong>Semester:</strong> <span style='color:white'>" + this.semestersList[i] +
		"</span> <br/> <strong>Avg Rating:</strong> <span style='color:white'>" + d + "</span>"
	});

	// create barChart
	this.d3.select("body")
	.append("svg")
	.attr("this.width", this.width + this.margin.left + this.margin.right)
	.attr("this.height", this.height + this.margin.top + this.margin.bottom)
	.append("g")
	.attr("id", "barChart")
	.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

	// tipBar will function on #barChart
	this.d3.select("#barChart").call(this.tipBar);

	// create donutChart
	this.d3.select("body")
	.append("svg")
	.attr("id", "gradeStats")
	.attr("this.width", this.width/2 + this.margin.left + this.margin.right)
	.attr("this.height", this.height/4 + this.margin.top + this.margin.bottom)
	.attr("transform", "translate(0," + (this.height/2) + ")")
	.append("g")
	.attr("id", "donutChart")
	.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

	// create trendChart
	this.d3.select("body")
	.append("svg")
	.attr("this.width", this.width + this.margin.left + this.margin.right)
	.attr("this.height", this.height/2 + this.margin.top + this.margin.bottom)
	//.attr("transform", "translate(0," + (this.height/2) + ")")
	.append("g")
	.attr("id", "trendChart")
	.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

	// tipTrend will function on #trendChart
	this.d3.select("#trendChart").call(this.tipTrend);

	this.d3.select("#barChart").append("g")
	.attr("class", "axis axis--x")
	.attr("transform", "translate(0," + this.height + ")")
	.call(this.d3.axisBottom(this.xBar));

	this.d3.select("#barChart").append("g")
	.attr("class", "axis axis--y")
	.call(this.d3.axisLeft(this.yBar));

	// Text label for the x axis (barChart)
	this.d3.select("#barChart").append("text")
	.attr("class", "axis label")
	.attr("transform", "translate(" + this.width/2 + " ," + 450 + ")")
	.style("text-anchor", "middle")
	.text("Letter Grades");

	// Text label for the y axis (barChart)
	this.d3.select("#barChart").append("text")
	.attr("class", "axis label")
	.attr("transform", "rotate(-90)")
	.attr("y", 10 - this.margin.left)
	.attr("x", 20 - (this.height / 2))
	.attr("dy", "1em")
	.style("text-anchor", "middle")
	.text("Count");

	this.d3.select("#donutChart").append("text")
	//.attr("y", 6)
	.attr("dy", ".91em")
	.attr("text-anchor", "middle")
	.text("GPA");

	this.d3.select("#donutChart").append("text")
	.attr("text-anchor", "middle")
	.attr("id", "donutChartText")
	.text("0.00");

	this.d3.select("#trendChart").append("g")
	.attr("class", "axis axis--x")
	.attr("transform", "translate(0," + this.height/2 + ")")
	.call(this.d3.axisBottom(this.xTrend));

	this.d3.select("#trendChart").append("g")
	.attr("class", "axis axis--y")
	.call(this.d3.axisLeft(this.yTrend));

	// Text label for the x axis
	this.d3.select("#trendChart").append("text")
	.attr("class", "axis label")
	.attr("transform", "translate(" + this.width/2 + " ," + 250 + ")")
	.style("text-anchor", "middle")
	.text("Semesters");

	// Text label for the y axis
	this.d3.select("#trendChart").append("text")
	.attr("class", "axis label")
	.attr("transform", "rotate(-90)")
	.attr("y", -60)
	.attr("x", -100)
	.attr("dy", "1em")
	.style("text-anchor", "middle")
	.text("Average Rating");


	this.d3.select("#gradeStats").append("text")
	.attr("x", 200)
	.attr("y", 90)
	.attr("id", "letterGrade")
	.text("No Grade")

	/////////////////////////////
	/// DATA HELPER FUNCTIONS ///
	/////////////////////////////

	// returns JS object of frequencies of each letter grade
	function getFrequency(distribution) {
		let frequencies = [];
		for (let i = 0; i < distribution.length; i++) {
			let key = distribution[i];
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

		for (let i = 0; i < frequencies.length; i++) {
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
		let total = 0;
		for (let i = 0; i < distribution.length; i++) {
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
		let gpa = total / distribution.length;
		return gpa;
	}

	////////////////////////
	/// UPDATE FUNCTIONS ///
	////////////////////////

	// draw all charts with updated data
	function update1() {
		this.d3.json("data1.json", function(error, data) {
			let ratingsData = [4.11, 4.01, 4.21, 3.86, 3.71, 4.15, 3.52, 3.8, 4.01, 4.20, 3.86];

			let numGrades = getNumGrades(data["distribution"]);
			let gpa = getGPA(data["distribution"]);
			let gpaData = [gpa, 4.0 - gpa];

			updateBarChart(data);
			updateDonutChart(gpaData);
			updateTrendChart(ratingsData);
			updateTextDisplay(gpa, data["medianGrade"]);

		})
	}

	function update2() {
		this.d3.json("data2.json", function(error, data) {
			let ratingsData = [2.55, 2.91, 3.5, 3.2, 2.71, 2.21, 2.89, 3.1, 2.32, 2.91, 3.00];

			let numGrades = getNumGrades(data["distribution"]);
			let gpa = getGPA(data["distribution"]);
			let gpaData = [gpa, 4.0 - gpa];

			updateBarChart(data);
			updateDonutChart(gpaData);
			updateTrendChart(ratingsData);
			updateTextDisplay(gpa, data["medianGrade"]);

		})
	}


	// update barChart
	function updateBarChart(data) {
		let freq = getFrequency(data["distribution"]);
		this.xBar.domain(Object.keys(freq));
		this.yBar.domain([0, this.d3.max(Object.values(freq), function(d) { return d})]);

		this.d3.select("#barChart").select(".axis--x").call(this.d3.axisBottom(this.xBar)
			.tickFormat(function(i) { return this.gradesList[i] }));
		this.d3.select("#barChart").select(".axis--y").call(this.d3.axisLeft(this.yBar));

		let barChart = this.d3.select("#barChart")
		.selectAll(".bar")
		.data(Object.entries(freq))

		barChart.transition()
		.duration(500)
		.attr("y", function(d) { return this.yBar(d[1]); })
		.attr("this.height", function(d) { return this.height - this.yBar(d[1]); })

		barChart.enter()
		.append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { return this.xBar(d[0]); })
		.attr("y", this.height)
		.attr("this.width", this.xBar.bandthis.width())
		.attr("this.height", 0)
		.attr("fill", "steelblue")
		.on("mouseover", this.tipBar.show)
		.on("mouseout", this.tipBar.hide)
		.transition().duration(500)
		.attr("y", function(d) { return this.yBar(d[1]); })
		.attr("this.height", function(d) { return this.height - this.yBar(d[1]); });

		barChart.exit()
		.transition().duration(500)
		.attr("y", this.height)
		.attr("this.height", 0)
		.remove();
	}

	// update donutChart
	function updateDonutChart(gpaData) {
		let donutChart = this.d3.select("#donutChart")
		.selectAll(".donut")
		.data(this.pie(gpaData))

		donutChart.transition()
		.duration(500)
		.attrTween("d", function(d) {
			let inter = this.d3.interpolate(d.startAngle + 0.1, d.endAngle);
			return function(t) {
				d.endAngle = inter(t);
				return this.arc(d);
			}});

		donutChart.enter()
		.append("path")
		.attr("class", "donut")
		.attr("d", this.arc)
		.style("fill", function (d, i) { return i == 0 ? "steelblue" : "none"; })
		.transition()
		.duration(500)
		.attrTween("d", function(d) {
			let inter = this.d3.interpolate(d.startAngle + 0.1, d.endAngle);
			return function(t) {
				d.endAngle = inter(t);
				return this.arc(d);
			}});

		donutChart.exit().remove();

	}

	// update trendChart
	function updateTrendChart(ratingsData) {
		this.xTrend.domain([0, 10]);

		this.d3.select("#trendChart").select(".axis--x").call(this.d3.axisBottom(this.xTrend)
			.tickFormat(function(i) { return this.semestersList[i]; } ));

		let trendChartPath = this.d3.select("#trendChart").selectAll(".path")
		.data([ratingsData])
		let trendChartPoints = this.d3.select("#trendChart").selectAll(".point")
		.data(ratingsData)

		trendChartPath.transition()
		.duration(500)
		.attr("d", this.line);

		trendChartPath.enter()
		.append("path")
		.attr("class", "path")
		.attr("fill", "none")
		.attr("stroke", "steelblue")
		.attr("stroke-this.width", 1.5)
		.attr("d", this.line);

		trendChartPoints.transition()
		.duration(500)
		.attr("cx", function(d, i) { return this.xTrend(i); })
		.attr("cy", function(d, i) { return this.yTrend(d); });

		trendChartPoints.enter()
		.append("circle")
		.attr("class", "point")
		.attr("cx", function(d, i) { return this.xTrend(i); })
		.attr("cy", function(d, i) { return this.yTrend(d); })
		.attr("r", 3.5)
		.attr("fill", "steelblue")
		.on("mouseover", this.tipTrend.show)
		.on("mouseout", this.tipTrend.hide);

		trendChartPath.exit().remove();
		trendChartPoints.exit().remove();
	}

	// update gradeDisplay
	function updateTextDisplay(gpa, grade) {
		this.d3.select("#letterGrade").text(grade)
		this.d3.select("#donutChartText").text(gpa.toFixed(2))
	}
}

