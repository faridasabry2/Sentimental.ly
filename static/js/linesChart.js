function log(text) {
  if (console && console.log) console.log(text);
  return text;
}



$(document).ready(function() {
  var margin = {top: 30, right: 10, bottom: 50, left: 60},
      chart = d3LineWithLegend()
                .xAxis.label('Time')
                .width(width(margin))
                .height(height(margin))
                .yAxis.label('Sentiment score');


  var svg = d3.select('#test1 svg')
      .datum(generateData())

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


  //data
  function generateData() {
    var sin = [],
        cos = [],
        r1 = Math.random(),
        r2 = Math.random(),
        r3 = Math.random(),
        r4 = Math.random();

    for (var i = 0; i < 50; i++) {
      sin.push([ i, r1 * Math.sin( r2 +  i / (10 * (r4 + .5) ))]);
      cos.push([ i, r2 * Math.cos( r3 + i / (10 * (r3 + .5) ))]);
    }

    return [
      {
        data: sin,
        label: "Posts"
      },
      {
        data: cos,
        label: "Comments"
      }
    ];
  }

});

