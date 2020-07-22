import { extent, max } from 'd3-array';
import { format } from 'd3-format';
import { line } from 'd3-shape';
import { scaleLinear, scaleTime } from 'd3-scale';
import React from 'react';

import './DashboardPage.scss';

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
  const xAttributes = data.map(d => d[xAttribute]);
  const yAttributes = data.map(d => d[yAttribute]);
  const xScaleFn = xType === 'time' ? scaleTime : scaleLinear;
  const yScaleFn = scaleLinear;

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
    .x((d, i) => i + 30)
    .y(d => yScale(d[yAttribute]));

  return (
    <div className="line-chart">
      <svg height={height} width={width} viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(0, ${margin.top})`}>
          {yAxisTicks.map(tick => (
            <g
              key={tick}
              className="tick"
              transform={`translate(0, ${chartHeight - yScale(tick)})`}
            >
              <text>
                {format(',')(tick)}
              </text>
              <line x1={margin.left} y1="0" y2="0" x2={chartWidth + margin.left} stroke="black" />
            </g>
          ))}
        </g>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {data.map((d, i) => (
            <rect
              key={d[xAttribute]}
              fill={strokeFn(d)}
              height={yScale(d.samples)}
              x={i * barWidth}
              y={chartHeight - yScale(d.samples)}
              width={barWidth}
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
  strokeFn: () => 'green',
  xType: 'time',
  yType: 'linear',
  width: 500,
};

export default LineChart;
