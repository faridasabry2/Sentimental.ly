//Define bar chart function 
function barChart(dataset, postSentiment){	

	var svg = d3.select("#chart-container").remove();
	$(".full-page").first().next().append($("<div>").attr("id", "chart-container"));

	//Set width and height as fixed variables	
  	var w = $("#chart-container").width();
  	var h = $("#chart-container").height();
 
	var padding = 25;

	//Scale function for axes and radius
	//Y axis use the post sentiment scores
	//X axis used the 'created_time' field.
	var yScale = d3.scale.linear()
					.domain([-1, 1])
					.range([h+padding,padding]);
	yScale.domain([-1,1]);

	var xScale = d3.scale.ordinal()
					.domain(dataset.map(function(d){ return d.created_time;}))
					.rangeRoundBands([padding,w+padding],.5);

	//To format axis as a percent
	var formatPercent = d3.format("%1");

	//Create x and y axis
	var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10).tickFormat(formatPercent);
	var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

	//Define key function
	var key = function(d){return d.created_time};

	//Define tooltip for hover-over info windows
	var div = d3.select("body").append("div")   
							.attr("class", "tooltip")               
							.style("opacity", 0);

	//Create svg element
	var svg = d3.select("#chart-container").append("svg")
			.attr("width", w).attr("height", h)
			.attr("id", "chart")
			.attr("viewBox", "0 0 "+w+ " "+h)
			.attr("preserveAspectRatio", "xMinYMin");
	
	//Resizing function to maintain aspect ratio (uses jquery)
	var aspect = w / h;
	var chart = $("#chart");
		$(window).on("resize", function() {
		    var targetWidth = $("body").width();
		   	
    		if(targetWidth<w){
    			chart.attr("width", targetWidth); 
    			chart.attr("height", targetWidth / aspect); 			
    		}
    		else{
    			chart.attr("width", w);  
    			chart.attr("height", w / aspect);	
    		}

		});

	//Create barchart
	svg.selectAll("rect")
		.data(dataset, key)
		.enter()
	  	.append("rect")
	    .attr("class", function(d){return d.commentSentiment < 0 ? "negative" : "positive";})
	    .attr({
	    	x: function(d){
	    		return xScale(d.created_time);
	    	},
	    	y: function(d){
	    		return yScale(Math.max(0, d.commentSentiment)); 
	    	},
	    	width: xScale.rangeBand(),
	    	height: function(d){
	    		return Math.abs(yScale(d.commentSentiment) - yScale(0)); 
	    	}
	    })
	    .on('mouseover', function(d){
						d3.select(this)
						    .style("opacity", 0.2)
						    .style("stroke", "black")
				
				var info = div
						    .style("opacity", 1)
						    .style("left", (d3.event.pageX+10) + "px")
						    .style("top", (d3.event.pageY-30) + "px")
						    .text(d.created_time+" "+d.message);

					info.append("p")
						    .text(formatPercent(d.commentSentiment));


					})
    				.on('mouseout', function(d){
    					d3.select(this)
						.style({'stroke-opacity':0.5,'stroke':'#a8a8a8'})
						.style("opacity",1);

						div
    						.style("opacity", 0);
    				});

	//Add y-axis
	svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + padding + ",0)")
			.call(yAxis);

	//Add x-axis
	svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + ( (h/2) + padding ) + ")")
			.call(xAxis);
	
};

