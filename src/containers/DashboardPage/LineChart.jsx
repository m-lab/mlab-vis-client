import { extent } from 'd3-array';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { line } from 'd3-shape';
import { scaleLinear, scaleTime } from 'd3-scale';
import React, { Component } from 'react';

import './DashboardPage.scss';

const formatDate = timeFormat("%b %0d");

class LineChart extends Component {
  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter(d) {
    return () => {
      this.props.onHover(d);
    };
  }

  onMouseLeave() {
    this.props.onHover(null);
  }

  render() {
    const {
      currentHoverIndicatorDate,
      data,
      height,
      isFetching,
      margin,
      strokeFn,
      width,
      xAttribute,
      yAttribute,
      xType,
      yType,
    } = this.props;
    const chartHeight = height - margin.top - margin.bottom;
    const chartWidth = width - margin.left - margin.right;
    const barWidth = data[0] ? chartWidth / data[0].values.length : 0;
    const xAttributes = data
      .map((d) => d.values.map((dd) => dd[xAttribute]))
      .flat();
    const yAttributes = data
      .map((d) => d.values.map((dd) => dd[yAttribute]))
      .flat();
    const xScaleFn = xType === "time" ? scaleTime : scaleLinear;
    const yScaleFn = scaleLinear;

    const xAxisTicks = extent(xAttributes);
    const xTickFormat = xType === "time" ? formatDate : format(",");

    const xScale = xScaleFn()
      .domain(extent(xAttributes))
      .range([0, chartWidth]);
    const yScale = yScaleFn().domain([0, 1]).range([0, chartHeight]);

    const yAxisTicks = [0, 0.25, 0.5, 0.75, 1];

    const l = line()
      .x((d) => xScale(d[xAttribute]))
      .y((d) => chartHeight - yScale(d[yAttribute]));

    return (
      <div className={`line-chart ${isFetching ? "is-fetching" : ""}`}>
        <svg
          height={height}
          onMouseLeave={this.onMouseLeave}
          width={width}
          viewBox={`0 0 ${width} ${height}`}
        >
          <g transform={`translate(0, ${margin.top})`}>
            {yAxisTicks.map((tick, i) => (
              <g
                key={`${tick}-${i}`}
                className="tick"
                transform={`translate(0, ${chartHeight - yScale(tick)})`}
              >
                <text>{format(".0%")(tick)}</text>
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
                key={`${tick}-${i}`}
                className="tick"
                transform={`translate(${xScale(tick)}, 0)`}
              >
                <text x={i === 1 ? -25 : -20}>{xTickFormat(tick)}</text>
              </g>
            ))}
            {currentHoverIndicatorDate && (
              <g
                className="hover-tick"
                transform={`translate(${xScale(currentHoverIndicatorDate)}, 0)`}
              >
                <text fontSize="9px" x="-16">
                  {xTickFormat(currentHoverIndicatorDate)}
                </text>
              </g>
            )}
          </g>
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {currentHoverIndicatorDate && (
              <line
                x1={xScale(currentHoverIndicatorDate)}
                x2={xScale(currentHoverIndicatorDate)}
                y1="0"
                y2={yScale(1)}
                stroke="#121212"
                strokeDasharray="5 3"
              />
            )}
            {data.map((d, i) => (
              <path
                key={d.key}
                d={l(d.values)}
                fill="none"
                stroke={strokeFn(d, i)}
              />
            ))}
            {data[0] &&
              data[0].values.map(({ date }) => (
                <rect
                  fill="transparent"
                  stroke="transparent"
                  height={chartHeight}
                  width={barWidth}
                  x={xScale(new Date(date)) - barWidth / 2}
                  y="0"
                  onMouseEnter={this.onMouseEnter(date)}
                />
              ))}
          </g>
        </svg>
      </div>
    );
  }
}

LineChart.defaultProps = {
  currentHoverIndicatorDate: null,
  data: [],
  onHover: () => {},
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
