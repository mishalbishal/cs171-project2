
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 450 - margin.left - margin.right,
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

var vis2 = d3.select("#vis2container")

var svg = vis2.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .classed("span4", true)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
var svg2 = vis2.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .classed("span4", true)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
var svg3 = vis2.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .classed("span4", true)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
var datalist= [];

for(i in data){
	datalist.push({"name":i, "win":data[i]["win_percent"], "lose":data[i]["lose_percent"],
	"draw":data[i]["draw_percent"], "games":data[i]["total_games"]})
};

function lightup(d){
	var box = document.getElementById("infobox");
	box.innerHTML = d.name+"<br>"+"Win Percentage: "+d.win+"%"+"<br>"+"Lose Percentage: "+d.lose+
		"%"+"<br>"+"Draw Percentage: "+d.draw+"%"+"<br>"+"Number of Games Used in: "+d.games;
	console.log(d3.select(this).attr("name"));
	d3.selectAll("[name="+d3.select(this).attr("name")+"]").classed('glow', true);
}

function lightout(d){
	var box = document.getElementById("infobox");
	box.innerHTML = "";
	d3.selectAll("[name="+d3.select(this).attr("name")+"]").classed('glow', false);
}

function drawPoint (data, svg, outcome) {
  data.forEach(function(d) {
    d[outcome] = +d[outcome];
    d["games"] = +d["games"];
  });

  x.domain(d3.extent(data, function(d) { return d["games"]; })).nice();
  y.domain(d3.extent(data, function(d) { return d[outcome]; })).nice();

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
      .text(outcome.charAt(0).toUpperCase()+outcome.slice(1)+" Percentage")

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", function(d) { return "dot";})
      .attr("name", function(d) { return d.name.replace(/ /g,"").replace("'","").replace(".","");})
      .attr("r", 6)
      .attr("cx", function(d) { return x(d["games"]); })
      .attr("cy", function(d) { return y(d[outcome]); })
      .on("mouseover", lightup)
      .on("mouseout", lightout);

};

drawPoint(datalist, svg2, "win");
drawPoint(datalist, svg, "lose");
drawPoint(datalist, svg3, "draw");

