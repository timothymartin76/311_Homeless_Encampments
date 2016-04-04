
    var chart;
    var data;
    var verticalBar;

    var apiCall = "https://timothymartin76.cartodb.com/api/v2/sql?format=json&q=SELECT date_trunc('month', created_date) AS \"month\" , count(*) AS \"complaints\" FROM homelessenc GROUP BY 1 ORDER BY 1";
    var cartodbData = [];

    cartodbData = [{
                area: true,
                values: [],
                key: "# complaints",
                color: "#FF9900",
                strokeWidth: 4,
                classed: 'dashed'
            }]



    $.getJSON(apiCall,function(data){

    	data = data.rows;
    	data.forEach(function(row){
    	
    		var value = {
    			x: new Date(row.month),
    			y: row.complaints
			};
		
    		cartodbData[0].values.push(value);

    	})

   

    	nv.addGraph(function() {
        chart = nv.models.lineChart();
            chart
                .duration(0)
                .useInteractiveGuideline(true)
				.xScale(d3.time.scale())
        ;
		
		 var tickMultiFormat = d3.time.format.utc.multi([  //d3.time.format.utc.multi returns a multi-resolution UTC time format

 
            ["%b %Y", function() { return true; }]
        ]);
		
		

        // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
        chart.xAxis
			//.showMaxMin(false)
            //.axisLabel("")
			.tickPadding(10)
            .tickFormat(function (d) { return tickMultiFormat(new Date(d)); })          
        ;

	   
        chart.yAxis
			//.showMaxMin(false)
            .highlightZero(false);
            //.axisLabel('y')
		
			

        chart.margin({
            top: 10,
            right: 30,
            bottom: 30,
            left: 40
        });

		
        var svgElem = d3.select('#chart').append('svg');
        svgElem
            .datum(cartodbData)
            .transition()
            .call(chart);


       
        //initialize a vertical bar on the chart that will indicate current time

         verticalBar = d3.select('svg')
          .append("line")
          .attr("x1", chart.margin().left)
          .attr("y1", chart.margin().top-5)
          .attr("x2", chart.margin().left)
          .attr("y2", 150)
          .style("stroke-width", 2)
          .style("stroke", "gray")
          .style("fill", "none");

        nv.utils.windowResize(chart.update);

        return chart;
    });
    })

    
