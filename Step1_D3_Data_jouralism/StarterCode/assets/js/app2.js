function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width and
  // height of the browser window.
  var svgWidth = window.innerWidth*0.6;
  var svgHeight = window.innerHeight*0.75;

  var margin = {
    top: 50,
    bottom: 50,
    right: 50,
    left: 50
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  // Append SVG element
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  // Append group element
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  
    // Initial Params
  var chosenXAxis='poverty'
  var chosenYAxis='obesity'

  // function used for updating x-scale var upon click on axis label
  function xScale(healthData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
        d3.max(healthData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);

    return xLinearScale;

  }


// function used for updating y-scale var upon click on axis label
function yScale(healthData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
      d3.max(healthData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height,0]);

  return yLinearScale;

}


// function used for updating yAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}


// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}


// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis,newYScale, chosenYaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

function renderText(textGroup, newXScale, chosenXaxis,newYScale, chosenYaxis) {

  textGroup.transition()
    .duration(1000)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]+3.0);
  return textGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis,circlesGroup) {

  if (chosenXAxis === "age") {
    var label = "Age (Median)";
  }
  else {
    var label = "# of Albums:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.rockband}<br>${label} ${d[chosenXAxis]}`);
    });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(d) {
      toolTip.show(d);
    })
      // onmouseout event
      .on("mouseout", function(d, index) {
        toolTip.hide(d);
      });
  
    return circlesGroup;
  }
  
  


  // Read CSV
  d3.csv("data.csv").then(function(healthData) {


      // parse data
      healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;

        data.age = +data.age;
        data.income = +data.income;

        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;



      });

      // create scales
      var xLinearScale =xScale(healthData,chosenXaxis)
        .domain([8.5,23])
        .range([0, width]);

      var yLinearScale = yScale(healthData,chosenYAxis)
        .domain([19,39])
        .range([height, 0]);

      // create axes
      var xAxis = d3.axisBottom(xLinearScale).ticks(8);
      var yAxis = d3.axisLeft(yLinearScale);

      // append axes
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

      chartGroup.append("g")
        .call(yAxis);


      // append circles
      var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", "15")
        .classed("stateCircle",true)

        var textGroup=chartGroup.selectAll()
            .data(healthData)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]+3.0)
            .text(d=>d.abbr)
            .classed("stateText",true)

  // Create axes labels
      chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y",  - margin.left)
      .attr("x", 0-(height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obese(%)")
      .attr("font-weight","bold");

    chartGroup.append("text")
      .attr("transform", `translate(267,397)`)
      .attr("class", "axisText")
      .text("In Poverty(%)")
      .attr("font-weight","bold");
    })}






// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive)