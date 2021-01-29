import { extent, max } from 'd3-array';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { scaleLinear, scaleTime } from 'd3-scale';
import React, { Component } from 'react';

import './DashboardPage.scss';

const formatDate = timeFormat('%b %0d');

class BarChart extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleClick() {
    this.props.onClick();
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

  render() {
    const {
      currentHoverIndicatorDate,
      data,
      fillFn,
      height,
      isHoverDisabled,
      isFetching,
      margin,
      width,
      xAttribute,
      yAttribute,
      xType,
      yType,
    } = this.props;
    const chartHeight = height - margin.top - margin.bottom;
    const chartWidth = width - margin.left - margin.right;
    const barWidth = chartWidth / data.length;
    const xAttributes = data.map((d) => d[xAttribute]);
    const yAttributes = data.map((d) => d[yAttribute]);
    const xScaleFn = xType === 'time' ? scaleTime : scaleLinear;
    const yScaleFn = scaleLinear;

    const xScale = xScaleFn()
      .domain(extent(xAttributes))
      .range([0, chartWidth]);
    const yScale = yScaleFn()
      .domain([0, max(yAttributes)])
      .range([0, chartHeight]);

    const xAxisTicks = extent(xAttributes);
    const yAxisTicks = [0, Math.floor(max(yAttributes) / 2), max(yAttributes)];

    const xTickFormat = xType === 'time' ? formatDate : format(',');

    return (
      <div className={`bar-chart ${isFetching ? 'is-fetching' : ''}`}>
        <svg
          height={height}
          width={width}
          onClick={this.handleClick}
          onMouseLeave={this.handleMouseLeave}
          viewBox={`0 0 ${width} ${height}`}
        >
          <g className="y-axis" transform={`translate(0, ${margin.top})`}>
            {yAxisTicks.map((tick, i) => (
              <g
                key={`${tick}-${i}`}
                className="tick"
                transform={`translate(0, ${chartHeight - yScale(tick)})`}
              >
                <text>{format(',')(tick)}</text>
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
            {data.map((d) => (
              <rect
                key={d[xAttribute]}
                fill={fillFn(d)}
                height={yScale(d.samples)}
                x={xScale(d[xAttribute]) - barWidth / 2}
                y={chartHeight - yScale(d.samples)}
                width={barWidth}
              />
            ))}
            {currentHoverIndicatorDate && (
              <line
                x1={xScale(currentHoverIndicatorDate)}
                x2={xScale(currentHoverIndicatorDate)}
                y1="0"
                y2={chartHeight}
                stroke={isHoverDisabled ? '#FFD670' : '#121212'}
                strokeDasharray="5 3"
              />
            )}
            {data.map((d) => (
              <rect
                key={d[xAttribute]}
                fill="transparent"
                stroke="transparent"
                height={chartHeight}
                x={xScale(d[xAttribute]) - barWidth / 2}
                y={0}
                width={barWidth}
                onMouseEnter={this.handleMouseEnter(d[xAttribute])}
              />
            ))}
          </g>
        </svg>
      </div>
    );
  }
}

BarChart.defaultProps = {
  data: [],
  fillFn: () => 'rgb(155, 210, 199)',
  height: 220,
  isHoverDisabled: false,
  margin: {
    left: 60,
    right: 20,
    top: 20,
    bottom: 20,
  },
  onHover: () => {},
  xType: 'time',
  yType: 'linear',
  width: 500,
};

export default BarChart;
