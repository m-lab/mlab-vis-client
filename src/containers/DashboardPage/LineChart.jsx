import { extent, max } from 'd3-array';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { line } from 'd3-shape';
import { scaleLinear, scaleTime } from 'd3-scale';
import React from 'react';

import './DashboardPage.scss';

const formatDate = timeFormat("%b %0d");

const LineChart = ({
  data,
  height,
  margin,
  strokeFn,
  width,
  xAttribute,
  yAttribute,
  xType,
  yType,
}) => {
  const chartHeight = height - margin.top - margin.bottom;
  const chartWidth = width - margin.left - margin.right;
  const barWidth = chartWidth / data.length;
  const xAttributes = data.map(d => d.values.map(dd => dd[xAttribute])).flat();
  const yAttributes = data
    .map((d) => d.values.map((dd) => dd[yAttribute]))
    .flat();
  const xScaleFn = xType === 'time' ? scaleTime : scaleLinear;
  const yScaleFn = scaleLinear;

  const xAxisTicks = extent(xAttributes);
  const xTickFormat = xType === "time" ? formatDate : format(",");

  const xScale = xScaleFn()
    .domain(extent(xAttributes))
    .range([0, chartWidth]);
  const yScale = yScaleFn()
    .domain([0, 1])
    .range([0, chartHeight]);

  const yAxisTicks = [
    0,
    0.25,
    0.5,
    0.75,
    1,
  ];

  const l = line()
    .x((d) => xScale(d[xAttribute]))
    .y((d) => chartHeight - yScale(d[yAttribute]));

  return (
    <div className="line-chart">
      <svg height={height} width={width} viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(0, ${margin.top})`}>
          {yAxisTicks.map((tick) => (
            <g
              key={tick}
              className="tick"
              transform={`translate(0, ${chartHeight - yScale(tick)})`}
            >
              <text>{format(",")(tick)}</text>
              <line
                x1={margin.left}
                y1="0"
                y2="0"
                x2={chartWidth + margin.left}
                stroke="black"
              />
            </g>
          ))}
        </g>
        <g
          className="x-axis"
          transform={`translate(${margin.left}, ${
            chartHeight + margin.top + 15
          })`}
        >
          {xAxisTicks.map((tick, i) => (
            <g
              key={tick}
              className="tick"
              transform={`translate(${xScale(tick)}, 0)`}
            >
              <text x={i === 1 ? -25 : -20}>{xTickFormat(tick)}</text>
            </g>
          ))}
        </g>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {data.map((d, i) => (
            <path
              key={d.key}
              d={l(d.values)}
              fill="none"
              stroke={strokeFn(d, i)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

LineChart.defaultProps = {
  data: [],
  height: 220,
  margin: {
    left: 40,
    right: 20,
    top: 20,
    bottom: 20,
  },
  strokeFn: () => "rgb(155, 210, 199)",
  xType: "time",
  yType: "linear",
  width: 500,
};

export default LineChart;
