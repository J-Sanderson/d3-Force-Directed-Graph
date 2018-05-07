d3.json(
  "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json",
  function(data) {
    
    var w = 700;
    var h = 700;
    
    var svg = d3.select("#chart")
      .attr("width", w)
      .attr("height", h);
    
    var simulation = d3.forceSimulation()
      //.force("link", d3.forceLink().id(function(d) {return d.id;}))
      .force("link", d3.forceLink())
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(w/2, h/2))
      
    
    var link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("stroke", "black")
      .attr("stroke-width", "1")
      
    var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("rect")
      .data(data.nodes)
      .enter()
      .append("rect")
      .attr("height", 10) //temp
      .attr("width", 20) //temp
      .attr("fill", "red") //temp, need images later
      .call(d3.drag()
           .on("start", dragstarted)
           .on("drag", dragged)
           .on("end", dragended)
           );
    node.append("title")
      .text(function(d) {return d.country});
    
    simulation.nodes(data.nodes).on("tick", ticked);
    simulation.force("link").links(data.links);
    
    function ticked() {
      link
        .attr("x1", function(d) {return d.source.x;})
        .attr("y1", function(d) {return d.source.y;})
        .attr("x2", function(d) {return d.source.x;})
        .attr("y2", function(d) {return d.source.y;});
      node
        .attr("x", function(d) {return d.x;})
        .attr("y", function(d) {return d.y;})
    }
    
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
    
    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
      
    
  });