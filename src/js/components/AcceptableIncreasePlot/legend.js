const createLegend = ({ svg, height, width }) => {
  svg.append("rect")
  .attr("class", "legend")
  .attr("x", width-260)
  .attr("y", height-150)
  .attr("rx", "5px")
  .attr("width", 230)
  .attr("height", 90)
  .attr("stroke", "darkgray")
  .attr("fill", "white");

  const legend_text = svg.selectAll("legend_text")
    .data(["Monthly Data", "Forecast", "Acceptable Increase", "Forecasted Acceptable"])
    .enter();
    
  legend_text.append("text")
    .attr("x", width-200)
    .attr("y", (d, i) => height-130+i*20)
    .text((d) => d)

  // less hardcoding - match shape/fill with those of the line being drawn
  svg
    .append("circle")
    .attr("cx",width-228)
    .attr("cy",height-136)
    .attr("r", 2)
    .style("fill", "#black")
  svg
    .append("line")
    .attr("x1", width - 240)
    .attr("x2", width - 210)
    .attr("y1", height - 116)
    .attr("y2", height - 116)
    .style("stroke-dasharray","5,5")
    .style("stroke", "black");
  svg
    .append('rect')
    .attr('x', width-242)
    .attr('y', height-102)
    .attr('width', 30)
    .attr('height', 13)
    .attr("fill", "#4646ff")
    .attr("opacity", 0.4);
  svg
    .append('rect')
    .attr('x', width-242)
    .attr('y', height-82)
    .attr('width', 30)
    .attr('height', 13)
    .attr("fill", "#05fefe")
    .attr("opacity", 0.3);
}

export { createLegend };
