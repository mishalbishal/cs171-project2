window.onload = function() {
    chart = d3.select('#chart');

    var height = 500,
        width = 1200;

    chart.attr("width", width)
         .attr("height", height);

    var group1 = chart.append("g");
    var group2 = chart.append("g");

    var messageDiv = d3.select('#message');

    var margin = {
        left: 70,
        top: 30,
        right: 30,
        bottom: 30
    };

    var x = d3.scale.linear()
            .domain([0, chartData.length])
            .range([0, width - margin.left]);

    var y = d3.scale.log()
            // .domain([d3.max(chartData, function(d) { return d.total_games; }), 0])
            .range([height - margin.top, margin.top]);

y.domain(d3.extent(chartData, function(d) { return d.total_games;}));

    var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

    chart.append("g")
        .attr("transform", "translate(50, 0)")
        .attr("class", "axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("x", -margin.top)
        .classed("title", true)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Number of Openings");

    function messageForD(d, messageDiv) {
        messageDiv.select("#name .stuff").text(d.name);
        messageDiv.select("#numgames .stuff").text(d.total_games);
    }

    function clearMessageArea(messageDiv) {
        messageDiv.select("#name .stuff").text("");
        messageDiv.select("#numgames .stuff").text("");
    }

    // make chart data sorted
    chartData = chartData.sort(function(a, b) {
        return d3.descending(a.total_games, b.total_games);
    });

    // this function called when a bar of the higher openings is called
    // animates and redraws the graph in order to show detailed view of functions 
    function focusOpening(d, i) {
        var curBar = d3.select(this); // current bar
        var curBarX = curBar.attr('x');
        var curBarHeight = curBar.attr('height');
        var curBarWidth = curBar.attr('width');
        var variantList = openingVariantData[d.name];

        // this makes it sorted
        variantList = variantList.sort(function(a, b) {
            return d3.descending(a.total_games, b.total_games);
        });
        var vsh = d3.scale.linear()
                    .domain([d.total_games, 0])
                    .range([curBarHeight, 0]),
            vy = d3.scale.log()
                    .range([height - margin.top, margin.top]),
            vyAxis = d3.svg.axis()
                    .scale(vy)
                    .orient("left");
        vy.domain(d3.extent(variantList, function(d) { return d.total_games; }));

        // update the scales to reflect current data
        chart.select(".axis").transition().call(vyAxis);

        var selection = group2.selectAll('rect')
            .data(variantList);

        selection.enter().append('rect')

        // first make it a stacked bar graph
        var shucks = margin.top;
        selection
            .attr('y', function(d) { shucks += vsh(d.total_games); return height - shucks; })
            .attr('x', curBarX)
            .attr('height', function(d) { return vsh(d.total_games)})
            .classed('blue', true)
            .classed("green", false) // remove green coloring
            .attr('width', (width/variantList.length > width / 5) ? width/5 : width/variantList.length);

        // then make it a real bar graph
        var interval = width / variantList.length;
        interval = (interval > width/ 5) ? width/5 : interval; // prevent one huge bar
        selection.transition()
            .duration(1000)
                .attr('y', function(d) { return height - margin.top - vsh(d.total_games); })
                .attr('x', function(d, i) { return margin.left + i * interval; })
                .attr('height', function(d) { return vsh(d.total_games)})
                .attr('width', interval)
                .transition()
                .ease('linear')
                .duration(1000)
                .delay(1000)
                    .attr('y', function(d) { return vy(d.total_games); })
                    .attr('height', function(d) { return height - margin.top - vy(d.total_games)});

        selection
            .classed('blue', true)
            .on('mouseover.color', function(d) { d3.select(this).classed('orange', true); })
            .on('mouseout.color', function(d) { d3.select(this).classed('orange', false); })
            .on('mouseover.text', function(d) { messageForD(d, messageDiv); })
            .on('mouseout.text', function(d) { clearMessageArea(messageDiv); })
            .on('click', null);

        selection
            .exit()
                .classed('blue', false)
                .remove();

        d3.select('#back').style('display', 'block');
        d3.select('#back').on('click', function() {
            shucks = margin.top;
            selection.transition()
                .ease('linear')
                .duration(1000)
                    .attr('width', curBarWidth)
                    .attr('y', function(d) { shucks += vsh(d.total_games); return height - shucks; })
                    .attr('x', curBarX)
                    .style('fill', '#7FC97F')
                    .attr('height', function(d) { return vsh(d.total_games)})
                    .remove()

            selection.exit()
                .remove();

            drawMain();
        });
    }

    function drawMain() {

        chart.select(".axis").transition().call(yAxis);

        d3.select('#back').style('display', 'none');

        var selection = group1.selectAll('rect')
            .data(chartData);

        selection.classed('invis', false);

        selection.enter().append('rect');
        selection
                .attr('y', height - margin.top)
                .attr('height', 0)
                .attr('x', function(d, i) { return margin.left + x(i); })
                .attr('width', width/chartData.length)
                .classed('green', true)                
                .transition()
                    .ease('linear')
                    .duration(1000)
                    .attr('y', function(d) { return y(d.total_games); })
                    .attr('height', function(d) { return height - margin.top - y(d.total_games); })

        selection.classed('blue', false);

        selection
                .on('click', focusOpening)
                .on('click.hi', function() { selection.classed('invis', true); })
                .on('mouseover.text', function(d) { messageForD(d, messageDiv); })
                .on('mouseout.text', function(d) { clearMessageArea(messageDiv); })
                .on('mouseover.color', function(d) { d3.select(this).classed('orange', true); })
                .on('mouseout.color', function(d) { d3.select(this).classed('orange', false); });
        selection.exit()
            .classed('green', false)
            .remove();

    }

    drawMain();
}