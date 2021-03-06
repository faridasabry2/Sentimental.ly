function log(text) {
    if (console && console.log) console.log(text);
    return text;
}

function generateDataForLineChart() {

      var postData = [],
          commentData = [];

            //Load data and call bar chart function 
    d3.json("/static/js/fbPageData.json", function(data){   
            var counter = -1;
            data.forEach(function(d) {
                  counter++;
                  postData.unshift([counter,d.sentiment,d.postURL,d.created_time,d.comments]);
                  commentData.unshift([counter,d.commentsAvgSentiments,d.postURL,d.created_time,d.comments]);
              // d.postSentiment = d.sentiment;
              // d.commentSentiment = d.commentsAvgSentiments;
          });
      
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

  var w = $(".post-graph").width();
  var h = $(".post-graph").height();

    var margin = {top: 30, right: 10, bottom: 50, left: 60},
        chart = d3LineWithLegend()
                  .xAxis.label('Time')
                  .width(w)
                  .height(h)
                  .yAxis.label('Sentiment score');


    var svg = d3.select('#test1 svg')
        .datum(data)

    svg.transition().duration(500)
        .attr('width', w)
        .attr('height', h)
        .call(chart);


    chart.dispatch.on('showTooltip', function(e) {
  var offset = $('#test1').offset(), // { left: 0, top: 0 }
        left = e.pos[0] + offset.left,
        top = e.pos[1] + offset.top,
        formatter = d3.format(".04f");

//     var content = '<h3>' + e.series.label + '</h3>' +
//                   '<p>' +
var content =           
'<span class="value"> Time:  ' + e.point[3] + '</span>' +
'</p>'+
'<span class="value"> How happy? ' + formatter(e.point[1])*100 + '% </span>' +
                  '</p>'+
'<a href = "' + e.point[2] +'" target = "_blank">' + e.point[2] + '</a>'
;
console.log("e");
console.log(e);

    nvtooltip.show([left, top], content);
  });

    chart.dispatch.on('hideTooltip', function(e) {
        nvtooltip.cleanup();
    });


  //Resizing function to maintain aspect ratio (uses jquery)
  var aspect = w / h;
  var chart = $("#chart");
  $(window).on("resize", function() {
    var targetWidth = $("body").width();
    
    if(targetWidth<w){
      chart.width(targetWidth); 
      chart.height(targetWidth / aspect);  
      d3.select('#test1 svg')
            .attr('width', targetWidth)
            .attr('height', targetWidth / aspect)
            .call(chart);     
    }
    else{
      chart.width(w);  
      chart.height(w / aspect); 
      d3.select('#test1 svg')
            .attr('width', w)
            .attr('height', w / aspect)
            .call(chart);
    }

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