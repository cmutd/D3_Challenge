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
  
    // Read CSV
    d3.csv("data.csv").then(function(healthData) {
  
  
        // parse data
        healthData.forEach(function(data) {
          data.poverty = +data.poverty;
          data.healthcare = +data.obesity;
        });
  
        // create scales
        var xLinearScale = d3.scaleLinear()
          .domain([8.5,23])
          .range([0, width]);
  
        var yLinearScale = d3.scaleLinear()
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
          .attr("cx", d => xLinearScale(d.poverty))
          .attr("cy", d => yLinearScale(d.obesity))
          .attr("r", "15")
          .classed("stateCircle",true)


          // append text
          chartGroup.selectAll()
              .data(healthData)
              .enter()
              .append("text")
              .attr("x", d => xLinearScale(d.poverty))
              .attr("y", d => yLinearScale(d.obesity)+3.0)
              .text(d=>d.abbr)
              .classed("stateText",true)

          // Initialize tool tip

          var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function(d) {
              return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}%`);
            });

  
          // Create tooltip in the chart
          chartGroup.call(toolTip);

          // Step 8: Create event listeners to display and hide the tooltip
          // ==============================
          circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
          })
            // onmouseout event
            .on("mouseout", function(data, index) {
              toolTip.hide(data);
            });



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