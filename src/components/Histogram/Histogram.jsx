import React, { PureComponent, PropTypes } from 'react';
import d3 from 'd3';
import { mod } from '../../utils/math';
import addComputedProps from '../../hoc/addComputedProps';

import './Histogram.scss';

/**
 * Figure out what is needed to render the chart
 * based on the props of the component
 */
function visProps(props) {
  const {
    bins,
    yExtent,
    binStart,
    binWidth,
    width,
    height,
    paddingLeft = 50,
    paddingRight = 10,
    paddingTop = 20,
  } = props;

  const padding = {
    top: paddingTop,
    right: paddingRight,
    bottom: 40,
    left: paddingLeft,
  };

  // Take into account the margins
  const plotAreaWidth = width - padding.left - padding.right;
  const plotAreaHeight = height - padding.top - padding.bottom;

  // Convert our bin stats to actual values
  const binEnd = (binStart) + (binWidth * (bins.length - 1));
  const xValues = d3.range(binStart, binEnd, binWidth);

  // This is a histogram, so lets use a band scale.
  const xScale = d3.scaleBand()
    .domain(xValues)
    .range([0, plotAreaWidth]);

  let yDomain = yExtent;
  if (!yDomain) {
    yDomain = [0, d3.max(bins)];
  }

  const yScale = d3.scaleLinear().range([plotAreaHeight, 0]).clamp(true);
  if (yDomain) {
    yScale.domain(yDomain);
  }

  return {
    padding,
    plotAreaWidth,
    plotAreaHeight,
    xValues,
    xScale,
    yScale,
  };
}

/**
 * Histogram chart. Basic. Expects array of bins
 * bin values come from binStart and binWidth inputs
 * @prop {Array} bins Array of precomputed bin values
 * @prop {Number} binStart X value of first bin .
 * @prop {Number} binWidth how large each bin is, in terms of bucket size.
 * @prop {String} color Color to color chart
 * @prop {Number} height The height of the charts
 * @prop {Number} width The width of the charts
 * @prop {Array} yExtent Optional. [min, max] of yScale
 * @prop {Function} yFormater formatter for y axis
 */
class Histogram extends PureComponent {
  static propTypes = {
    binStart: PropTypes.number,
    binWidth: PropTypes.number,
    bins: PropTypes.array,
    color: PropTypes.string,
    height: PropTypes.number,
    id: PropTypes.string,
    padding: PropTypes.object,
    plotAreaHeight: PropTypes.number,
    plotAreaWidth: PropTypes.number,
    width: PropTypes.number,
    xAxisLabel: PropTypes.string,
    xAxisUnit: PropTypes.string,
    xFormatter: PropTypes.func,
    xScale: PropTypes.func,
    xValues: PropTypes.array,
    yExtent: PropTypes.array,
    yFormatter: PropTypes.func,
    yScale: PropTypes.func,
  };

  static defaultProps = {
    bins: [],
    binStart: 4,
    binWidth: 4,
    color: '#888',
    id: 'histogram',
    height: 200,
    width: 200,
    xFormatter: d => d,
    yFormatter: d => d,
  };

  /**
   * When the react component mounts, setup the d3 vis
   */
  componentDidMount() {
    this.setup();
  }

  /**
   * When the react component updates, update the d3 vis
   */
  componentDidUpdate() {
    this.update();
  }

  getXAxisLabel() {
    const { xAxisLabel, xAxisUnit } = this.props;
    return `${xAxisLabel}${xAxisUnit ? ` (${xAxisUnit})` : ''}`;
  }

  /**
   * Initialize the d3 chart - this is run once on mount
   */
  setup() {
    const { width, height, plotAreaWidth } = this.props;

    // add in white background for saving as PNG
    d3.select(this.root).append('rect')
      .classed('chart-background', true)
      .attr('width', width)
      .attr('height', height)
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', '#fff');

    this.g = d3.select(this.root)
      .append('g');

    // add in axis groups
    this.xAxis = this.g.append('g').classed('x-axis', true);
    this.xAxis.append('line')
      .attr('x1', 0)
      .attr('x2', plotAreaWidth);
    this.xAxisLabel = this.g.append('text')
      .attr('dy', -4)
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle');

    this.yAxis = this.g.append('g').classed('y-axis', true);
    this.yAxisLabel = this.g.append('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle');

    // add in groups for data
    this.bars = this.g.append('g').classed('bars-group', true);
    this.highlightBars = this.g.append('g').classed('highlight-bars-group', true);

    this.update();
  }

  /**
   * Update the d3 chart - this is the main drawing function
   */
  update() {
    const { padding } = this.props;
    this.g.attr('transform', `translate(${padding.left} ${padding.top})`);

    this.updateAxes();
    this.updateBars();
  }

  /**
   * Render the x and y axis components
   */
  updateAxes() {
    const { xScale, xValues, yScale, yFormatter, plotAreaHeight, plotAreaWidth, padding } = this.props;
    const yTicks = Math.round(plotAreaHeight / 50);
    // show the first tick, then some afterwards.
    // TODO: should be moved out of histogram?
    const xTicks = xValues.filter((t, i) => i === 0 || mod(t, 12) === 0);

    const xAxis = d3.axisBottom(xScale).tickValues(xTicks).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(yTicks).tickSizeOuter(0);

    yAxis.tickFormat(yFormatter);

    this.yAxis.call(yAxis);
    this.yAxisLabel
      .attr('transform', `rotate(270) translate(${-plotAreaHeight / 2} ${-padding.left + 12})`)
      .text('Percentage of Tests');

    this.xAxis
      .attr('transform', `translate(0 ${plotAreaHeight})`)
      .call(xAxis);

    this.xAxisLabel
      .attr('transform', `translate(${plotAreaWidth / 2} ${plotAreaHeight + (padding.bottom)})`)
      .text(this.getXAxisLabel());
  }

  /**
   * Render the main count bars (not the highlight ones)
   */
  updateBars() {
    const {
      bins = [],
      xScale,
      xValues,
      yScale,
      plotAreaHeight,
      color,
    } = this.props;

    const binding = this.bars.selectAll('rect').data(bins);

    // ENTER
    const entering = binding.enter()
      .append('rect')
        .attr('y', yScale(0))
        .attr('height', 0)
        .style('shape-rendering', 'crispEdges')
        .style('fill', color)
        .style('stroke', color);

    // ENTER + UPDATE
    binding.merge(entering)
      .attr('x', (d, i) => xScale(xValues[i]))
      .attr('width', xScale.bandwidth)
      .transition()
        .attr('y', d => yScale(d || 0))
        .attr('height', d => plotAreaHeight - yScale(d || 0))
        .style('fill', color)
        .style('stroke', color);


    // EXIT
    binding.exit()
      .remove();
  }

  /**
   * The main render method.
   * @return {React.Component} The rendered container
   */
  render() {
    const { width, height, id } = this.props;
    return (
      <div>
        <svg
          id={id}
          className="histogram chart"
          height={height}
          ref={node => { this.root = node; }}
          width={width}
        />
      </div>
    );
  }
}

export default addComputedProps(visProps)(Histogram);
