import useD3 from "js/hooks/useD3";
import { useEffect, useState } from "react";
import * as d3 from "d3";
import { initializeLines, addPastMonthly, addPastIncrease, addPastArea, addForecast, addForecastIncrease, addForecastArea } from "./lines";
import { createLegend } from "./legend";
import { PlotHeader, PlotContainer, SvgContainer, SvgContent } from "./index.styled";

// convert to date and floats
const mapRaw = (row) => {
  const { t: x, y: y1, x: y2 } = row;
  return { x1: new Date(x), y1: parseFloat(y1), y2: parseFloat(y2) };
};

const mapRawFuture = (row) => {
  const { tf: t, zf: y, xf: x } = row;
  return mapRaw({ t, y, x });
};

/**
 * Create the acceptable increase plot
 * @returns {Node} svg
 */
const AcceptableIncreasePlot = () => {
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
          .attr("preserveAspectRatio", "xMinYMin meet")
          .attr("viewBox", `0 0 ${width} ${height}`)

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
          );

        initializeLines({
          svg, pastData, futureData, xScale, yScale
        })
        addPastMonthly();
        addPastIncrease();
        addPastArea();
        addForecast();
        addForecastIncrease();
        addForecastArea();

        createLegend({ svg, height, width });
      }
    },
    [pastData, futureData]
  );

  return (
    <>
      <PlotHeader>Sample Plot using ReactJS and d3.js</PlotHeader>
      <PlotContainer>
        <SvgContainer>
          <SvgContent
            ref={ref}
          />
        </SvgContainer>
      </PlotContainer>
    </>
  );
};

export default AcceptableIncreasePlot;
