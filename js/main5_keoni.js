
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.log()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#vis2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
var datalist= [];

for(i in data){
	datalist.push({"name":i, "win":data[i]["win_percent"], "lose":data[i]["lose_percent"],
	"win":data[i]["draw_percent"], "games":data[i]["total_games"]})
};

function lightup(d){
	var box = document.getElementById("infobox");
	box.innerHTML = d.name+"<br>"+"Win Percentage: "+d.win+"%"+"<br>"+"Number of Games Used in: "+d.games;
	d3.select(this).style("stroke", "ffbb99");
	d3.select(this).style("fill", "#b0deb0");
}

function lightout(d){
	var box = document.getElementById("infobox");
	box.innerHTML = "";
	d3.select(this).style("stroke", "44444");
	d3.select(this).style("fill", "#a0bb28");
}

function drawPoint (data) {
  data.forEach(function(d) {
    d["win"] = +d["win"];
    d["games"] = +d["games"];
  });

  x.domain(d3.extent(data, function(d) { return d["games"]; })).nice();
  y.domain(d3.extent(data, function(d) { return d["win"]; })).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Number of Games Used in (log scale)");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Win Percentage")

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 5.5)
      .attr("cx", function(d) { return x(d["games"]); })
      .attr("cy", function(d) { return y(d["win"]); })
      .on("mouseover", lightup)
      .on("mouseout", lightout);

  /*var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });*/
};

drawPoint(datalist);
