/* eslint-disable react/prop-types */
import { extent, mean } from "d3-array";
import { format } from "d3-format";
import { timeFormat, timeParse } from "d3-time-format";
import { scaleLinear, scaleLog, scaleTime } from "d3-scale";
import React, { Component } from "react";

import "./DashboardPage.scss";

const formatDate = timeFormat("%b %0d");
const parseDate = timeParse("%Y-%m-%d");

class HeatmapChart extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleMouseEnter(d) {
    return () => {
      const { isHoverDisabled, onHover } = this.props;

      if (isHoverDisabled) return;
      onHover(d);
    };
  }

  handleMouseLeave() {
    const { isHoverDisabled, onHover } = this.props;
    if (isHoverDisabled) return;
    onHover(null);
  }

  handleClick() {
    this.props.onClick();
  }

  render() {
    const {
      currentHoverIndicatorDate,
      data,
      height,
      isHoverDisabled,
      isFetching,
      margin,
      width,
      // xAttribute,
      // yAttribute,
      // xType,
      // yType,
    } = this.props;
    const dateExtent = extent(data, (d) => parseDate(d.key));
    const chartHeight = height - margin.top - margin.bottom;
    const chartWidth = width - margin.left - margin.right;
    const cellWidth = chartWidth / data.length;
    const cellHeight = chartHeight / (data[0] ? data[0].values.length : 1);

    const fractionValues = data
      .map((d) => d.values.map((dd) => dd.dl_frac))
      .flat();
    const fractionExtent = extent(fractionValues);
    const fractionMean = mean(fractionValues);

    const colorScale = scaleLog()
      .domain([fractionExtent[0], fractionMean, fractionExtent[1]])
      .range(["rgb(155, 210, 199)", "#CCCCCC", "rgb(225, 138, 212)"]);
    const xScale = scaleTime()
      .domain(dateExtent)
      .range([0, cellWidth * data.length]);

    return (
      <div className={`heatmap-chart ${isFetching ? "is-fetching" : ""}`}>
        <svg
          height={height}
          onClick={this.handleClick}
          onMouseLeave={this.handleMouseLeave}
          width={width}
          viewBox={`0 0 ${width} ${height}`}
        >
          <g transform={`translate(${chartWidth / 2.2}, 0)`}>
            {[
              fractionExtent[0],
              fractionMean,
              fractionExtent[1],
              fractionExtent[1] * 2,
            ].map((step, i) => {
              const legendCellWidth = 20;
              return (
                <g
                  key={step}
                  transform={`translate(${i * (legendCellWidth * 1.3)}, 0)`}
                >
                  <rect
                    fill={colorScale(step)}
                    height={legendCellWidth / 3}
                    transform="translate(0, -2)"
                    width={legendCellWidth}
                  />
                  <text
                    strokeWidth=".25px"
                    stroke="black"
                    fontSize="10"
                    dx="2"
                    dy="17"
                  >
                    {Math.floor(step * 100)}%
                    {i === 3 && " percent of the daily tests"}
                  </text>
                </g>
              );
            })}
          </g>
          <g>
            <g className="y-axis" transform={`translate(0, ${margin.top})`}>
              {data[0] &&
                data[0].values &&
                data[0].values.map((value, i) => {
                  const y = (i + 1) * cellHeight;
                  return (
                    <g
                      key={i}
                      transform={`translate(0, ${y + 2 - cellHeight / 2})`}
                    >
                      <text fontSize="10px">
                        {format(".2s")(value.bucket_min)}
                        {"  "}-{"  "}
                        {format(".2s")(value.bucket_max)}
                        {i === 0 && <tspan>{"  "} mbps</tspan>}
                      </text>
                    </g>
                  );
                })}
            </g>
            <g
              className="x-axis"
              transform={`translate(${margin.left}, ${
                chartHeight + margin.top + 15
              })`}
            >
              {dateExtent.map((tick, i) => (
                <g
                  key={`${tick}-${i}`}
                  className="tick"
                  transform={`translate(${xScale(tick)}, 0)`}
                >
                  <text x={i === 1 ? -25 : -20}>{formatDate(tick)}</text>
                </g>
              ))}

              {currentHoverIndicatorDate && (
                <g
                  className="hover-tick"
                  transform={`translate(${xScale(
                    currentHoverIndicatorDate
                  )}, 0)`}
                >
                  <text fontSize="9px" x="-16">
                    {formatDate(currentHoverIndicatorDate)}
                  </text>
                </g>
              )}
            </g>
          </g>
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {data.map(({ key, values }) => {
              const date = parseDate(key);
              const x = xScale(date) - cellWidth / 2;

              return (
                <g key={key} transform={`translate(${x}, 0)`}>
                  {values.map((v, i) => (
                    <rect
                      key={i}
                      x="0"
                      y={i * cellHeight}
                      width={cellWidth}
                      height={cellHeight}
                      fill={colorScale(v.dl_frac)}
                      stroke="none"
                      strokeWidth="0"
                      onMouseEnter={this.handleMouseEnter(date)}
                    />
                  ))}
                </g>
              );
            })}
            {currentHoverIndicatorDate && (
              <line
                x1={xScale(currentHoverIndicatorDate)}
                x2={xScale(currentHoverIndicatorDate)}
                y1="0"
                y2={chartHeight}
                stroke={isHoverDisabled ? "#FFD670" : "#121212"}
                strokeDasharray="5 3"
              />
            )}
          </g>
        </svg>
      </div>
    );
  }
}

HeatmapChart.defaultProps = {
  currentHoverIndicatorDate: null,
  data: [],
  onHover: () => {},
  height: 220,
  margin: {
    left: 65,
    right: 20,
    top: 25,
    bottom: 20,
  },
  xType: "time",
  yType: "linear",
  width: 500,
};

export default HeatmapChart;
