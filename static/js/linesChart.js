function log(text) {
  if (console && console.log) console.log(text);
  return text;
}

function generateDataForLineChart() {

    var postData = [],
        commentData = [];

            //Load data and call bar chart function 
    ////d3.json("/static/js/fbPageData.json", function(error, data){
    d3.json("/static/js/fbPageData.json", function(data){   
        //// if(error){
          //// console.log("error:")
          //// console.log(error);
        //// }
        //// else{
          data.forEach(function(d) {
              postData.push([d.created_time,d.sentiment]);
              commentData.push([d.created_time,d.commentsAvgSentiments])
              console.log("d.sentiment");
              console.log(d.sentiment);
              console.log("d.created_time");
              console.log(d.created_time);
              console.log("d.commentsAvgSentiments");
              console.log(d.commentsAvgSentiments);
              // d.postSentiment = d.sentiment;
              // d.commentSentiment = d.commentsAvgSentiments;
          });

          console.log('postData1');
          console.log(postData);
          console.log('commentData1');
          console.log(commentData);  
    
        var result = [
            {
              data: postData,
              label: "Posts"
            },
            {
              data: commentData,
              label: "Comments"
            }
        ];

        var lineChart = createLineChart(result);

    });

}

var createLineChart = function(data) {


  var margin = {top: 30, right: 10, bottom: 50, left: 60},
      chart = d3LineWithLegend()
                .xAxis.label('Time')
                .width(width(margin))
                .height(height(margin))
                .yAxis.label('Sentiment score');


  var svg = d3.select('#test1 svg')
      .datum(data)

  svg.transition().duration(500)
      .attr('width', width(margin))
      .attr('height', height(margin))
      .call(chart);


  chart.dispatch.on('showTooltip', function(e) {
  var offset = $('#test1').offset(), // { left: 0, top: 0 }
        left = e.pos[0] + offset.left,
        top = e.pos[1] + offset.top,
        formatter = d3.format(".04f");

    var content = '<h3>' + e.series.label + '</h3>' +
                  '<p>' +
                  '<span class="value">[' + e.point[0] + ', ' + formatter(e.point[1]) + ']</span>' +
                  '</p>';

    nvtooltip.show([left, top], content);
  });

  chart.dispatch.on('hideTooltip', function(e) {
    nvtooltip.cleanup();
  });




  $(window).resize(function() {
    var margin = chart.margin();

    chart
      .width(width(margin))
      .height(height(margin));

    d3.select('#test1 svg')
      .attr('width', width(margin))
      .attr('height', height(margin))
      .call(chart);

    });




  function width(margin) {
    var w = $(window).width() - 20;

    return ( (w - margin.left - margin.right - 20) < 0 ) ? margin.left + margin.right + 2 : w;
  }

  function height(margin) {
    var h = $(window).height() - 20;

    return ( h - margin.top - margin.bottom - 20 < 0 ) ? 
              margin.top + margin.bottom + 2 : h;
  }

};

