import useD3 from "js/hooks/useD3";
import { useEffect, useState } from "react";
import * as d3 from "d3";

const mapRaw = (row) => {
  const { t: x, y: y1, x: y2 } = row;
  return { x1: new Date(x), y1: parseFloat(y1), y2: parseFloat(y2) };
};

const mapRawFuture = (row) => {
  const { tf: t, zf: y, xf: x } = row;
  return mapRaw({ t, y, x });
};

const ScatterPlot = () => {
  const [pastData, setPastData] = useState();
  const [futureData, setFutureData] = useState();

  useEffect(() => {
    const getPastData = async () => {
      const values = await d3.csv("/datasets/Past.csv", mapRaw);
      setPastData(values);
    };
    getPastData();
  }, []);

  useEffect(() => {
    const getFutureData = async () => {
      const values = await d3.csv("/datasets/Future.csv", mapRawFuture);
      setFutureData(values);
    };
    getFutureData();
  }, []);

  const ref = useD3(
    (svg) => {
      if (pastData && futureData) {
        const allData = pastData.concat(futureData);
        svg.selectAll("*").remove();

        const height = 500;
        const width = 700;
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };

        const xScale = d3
          .scaleTime()
          .domain(d3.extent(allData.map(({ x1 }) => x1)))
          .range([margin.left, width - margin.right]);

        // create a flat list of all y values, and filter out any undefined
        const allY = allData
          .filter(({ y1 }) => y1)
          .map(({ y1 }) => y1)
          .concat(allData.filter(({ y2 }) => y2).map(({ y2 }) => y2));
        // get Y range
        const minY = Math.floor(Math.min(...allY));
        const maxY = Math.ceil(Math.max(...allY));

        const yScale = d3.scaleLinear(
          [minY, maxY],
          [height - margin.bottom, margin.top]
        );
        const xAxis = d3
          .axisBottom(xScale)
          .ticks(width / 50)
          .tickSizeOuter(0);
        const yAxis = d3.axisLeft(yScale).ticks(height / 50);

        svg
          .append("g")
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(xAxis);

        svg
          .append("g")
          .attr("transform", `translate(${margin.left},0)`)
          .call(yAxis)
          .call((g) => g.select(".domain").remove())
          .call((g) =>
            g
              .selectAll(".tick line")
              .clone()
              .attr("x2", width - margin.left - margin.right)
              .attr("stroke-opacity", 0.1)
          )
          .call((g) =>
            g
              .append("text")
              .attr("x", -margin.left)
              .attr("y", 10)
              .attr("fill", "currentColor")
              .attr("text-anchor", "start")
              .text("Y label")
          );

        // Add past monthly points
        svg
          .selectAll(".point")
          .data(pastData)
          .enter()
          .append("svg:circle")
          .attr("stroke", "black")
          .attr("fill", "black")
          .attr("cx", ({ x1 }) => xScale(x1))
          .attr("cy", ({ y1 }) => yScale(y1))
          .attr("r", 2);

        // Add pastTop
        const pastTop = d3
          .line()
          .curve(d3.curveLinear)
          .x(({ x1 }) => xScale(x1))
          .y(({ y2 }) => yScale(y2));
        svg
          .append("path")
          .datum(pastData)
          .attr("fill", "none")
          .attr("stroke", "#4646ff")
          .attr("stroke-width", 1)
          .attr("stroke-linecap", "round")
          .attr("stroke-linejoin", "round")
          .attr("stroke-opacity", 1)
          .attr("d", pastTop);

        // fill area between lines
        const pastArea = d3
          .area()
          .x(({ x1 }) => xScale(x1))
          .y0(({ y1 }) => yScale(y1))
          .y1(({ y2 }) => yScale(y2));
        svg
          .append("path")
          .datum(pastData)
          .attr("class", "area")
          .attr("d", pastArea)
          .style("fill", "#4646ff")
          .style("opacity", 0.4);

        // Add futureBottom
        const futureBottom = d3
          .line()
          .curve(d3.curveLinear)
          .x(({ x1 }) => xScale(x1))
          .y(({ y1 }) => yScale(y1));

        svg
          .append("path")
          .datum(futureData.filter(({ y1 }) => y1))
          .attr("fill", "none")
          .style("stroke-dasharray", "7, 7")
          .attr("stroke", "#444")
          .attr("stroke-width", 1)
          .attr("stroke-linecap", "round")
          .attr("stroke-linejoin", "round")
          .attr("stroke-opacity", 1)
          .attr("d", futureBottom);

        // Add futureTop
        const futureTop = d3
          .line()
          .curve(d3.curveLinear)
          .x(({ x1 }) => xScale(x1))
          .y(({ y2 }) => yScale(y2));

        svg
          .append("path")
          .datum(futureData.filter(({ y2 }) => y2))
          .attr("fill", "none")
          .attr("stroke", "#05fefe")
          .attr("stroke-width", 1)
          .attr("stroke-linecap", "round")
          .attr("stroke-linejoin", "round")
          .attr("stroke-opacity", 1)
          .attr("d", futureTop);

        // Forecasted acceptable increase
        const futureArea = d3
          .area()
          .x(({ x1 }) => xScale(x1))
          .y0(({ y1 }) => yScale(y1))
          .y1(({ y2 }) => yScale(y2));
        svg
          .append("path")
          .datum(futureData.filter(({ y1, y2 }) => y1 && y2))
          .attr("class", "area")
          .attr("d", futureArea)
          .style("fill", "#05fefe")
          .style("opacity", 0.3);
      }
    },
    [pastData, futureData]
  );

  return (
    <svg
      ref={ref}
      style={{
        height: 500,
        width: "100%",
        marginRight: "0px",
        marginLeft: "0px",
      }}
    ></svg>
  );
};

export default ScatterPlot;
