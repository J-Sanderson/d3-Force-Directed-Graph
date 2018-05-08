d3.json(
  "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json",
  function(data) {
    var w = document.body.offsetWidth;
    var h = 900;
    var flagWidth = 24;
    var flagHeight = 24;

    var svg = d3
      .select("#chart")
      .attr("width", w)
      .attr("height", h);
    
    //disallows boxes from leaving the chart area
    function box_force() {
      for (var i = 0, n = data.nodes.length; i < n; ++i) {
        data.nodes[i].x = Math.max(
          flagWidth, Math.min(w - flagWidth, data.nodes[i].x)
        );
        data.nodes[i].y = Math.max(
          flagWidth, Math.min(w - flagWidth, data.nodes[i].y)
        );
      }
    }

    var simulation = d3
      .forceSimulation()
      .force("link", d3.forceLink())
      .force("charge", d3.forceManyBody().distanceMax(200))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force("box_force", box_force);

    var link = svg
      .selectAll("g")
      .data(data.links)
      .enter()
      .append("line")
      .attr("class", "links");

    var node = svg
      .selectAll("g")
      .data(data.nodes)
      .enter()
      .append("rect")
      .attr("class", "nodes")
      .attr("height", flagHeight)
      .attr("width", flagWidth)
      .attr("stroke", "black") //temp
      .attr("fill", "transparent") //temp
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );
    node.append("title").text(function(d) {
      return d.country;
    });
    
    svg.append("text")
      .text("Force Directed Graph of State Contiguity")
      .attr("x", 10)
      .attr("y", 30)

    simulation.nodes(data.nodes).on("tick", ticked);
    simulation.force("link").links(data.links);

    function ticked() {
      link
        .attr("x1", function(d) {
          return d.source.x + flagWidth / 2;
        })
        .attr("y1", function(d) {
          return d.source.y + flagHeight / 2;
        })
        .attr("x2", function(d) {
          return d.target.x + flagWidth / 2;
        })
        .attr("y2", function(d) {
          return d.target.y + flagHeight / 2;
        });
      node
        .attr("x", function(d) {
          return d.x;
        })
        .attr("y", function(d) {
          return d.y;
        });
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      //d.fx = d3.event.x;
      //d.fy = d3.event.y;
      d.fx = Math.max(flagWidth, Math.min(w - flagWidth, d3.event.x));
      d.fy = Math.max(flagHeight, Math.min(h - flagHeight, d3.event.y));
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }
);