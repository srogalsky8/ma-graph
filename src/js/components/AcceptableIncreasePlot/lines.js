import * as d3 from "d3";

let _svg, _pastData, _futureData, _xScale, _yScale;


const initialize = ({ svg, pastData, futureData, xScale, yScale }) => {
  _svg = svg;
  _pastData = pastData;
  _futureData = futureData;
  _xScale = xScale;
  _yScale = yScale;
}

const addPastMonthly = () => {
  // Add past monthly points
  _svg
    .selectAll(".point")
    .data(_pastData)
    .enter()
    .append("svg:circle")
    .attr("stroke", "black")
    .attr("fill", "black")
    .attr("cx", ({ x1 }) => _xScale(x1))
    .attr("cy", ({ y1 }) => _yScale(y1))
    .attr("r", 2);
}

const addPastIncrease = () => {
  const line = d3
    .line()
    .curve(d3.curveLinear)
    .x(({ x1 }) => _xScale(x1))
    .y(({ y2 }) => _yScale(y2));
  _svg
    .append("path")
    .datum(_pastData)
    .attr("fill", "none")
    .attr("stroke", "#4646ff")
    .attr("stroke-width", 1)
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round")
    .attr("stroke-opacity", 1)
    .attr("d", line);
}

const addPastArea = () => {
    // fill area between lines
    const area = d3
    .area()
    .x(({ x1 }) => _xScale(x1))
    .y0(({ y1 }) => _yScale(y1))
    .y1(({ y2 }) => _yScale(y2));
  _svg
    .append("path")
    .datum(_pastData)
    .attr("class", "area")
    .attr("d", area)
    .style("fill", "#4646ff")
    .style("opacity", 0.4);
}

const addForecast = () => {
  const line = d3
    .line()
    .curve(d3.curveLinear)
    .x(({ x1 }) => _xScale(x1))
    .y(({ y1 }) => _yScale(y1));

  _svg
    .append("path")
    .datum(_futureData.filter(({ y1 }) => y1))
    .attr("fill", "none")
    .style("stroke-dasharray", "7, 7")
    .attr("stroke", "#444")
    .attr("stroke-width", 1)
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round")
    .attr("stroke-opacity", 1)
    .attr("d", line);
}

const addForecastIncrease = () => {
  const line = d3
    .line()
    .curve(d3.curveLinear)
    .x(({ x1 }) => _xScale(x1))
    .y(({ y2 }) => _yScale(y2));

  _svg
    .append("path")
    .datum(_futureData.filter(({ y2 }) => y2)) // filter for actual values
    .attr("fill", "none")
    .attr("stroke", "#05fefe")
    .attr("stroke-width", 1)
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round")
    .attr("stroke-opacity", 1)
    .attr("d", line);
}

const addForecastArea = () => {
  const area = d3
    .area()
    .x(({ x1 }) => _xScale(x1))
    .y0(({ y1 }) => _yScale(y1))
    .y1(({ y2 }) => _yScale(y2));
  _svg
    .append("path")
    .datum(_futureData.filter(({ y1, y2 }) => y1 && y2))
    .attr("class", "area")
    .attr("d", area)
    .style("fill", "#05fefe")
    .style("opacity", 0.3);
}

export { initialize as initializeLines, addPastMonthly, addPastIncrease, addPastArea, addForecast, addForecastIncrease, addForecastArea }