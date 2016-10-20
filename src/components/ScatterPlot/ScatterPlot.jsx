import React, { PureComponent, PropTypes } from 'react';
import d3 from 'd3';
import { colorsFor } from '../../utils/color';
import addComputedProps from '../../hoc/addComputedProps';

import './ScatterPlot.scss';

/**
 * Figure out what is needed to render the chart
 * based on the props of the component
 */
function visProps(props) {
  const {
    data,
    xExtent,
    xKey,
    yKey,
    yExtent,
    width,
    height,
    clampToZero = true,
  } = props;

  const colors = colorsFor(data, (d) => d.id);
  const padding = {
    top: 20,
    right: 20,
    bottom: 40,
    left: 50,
  };

  const plotAreaWidth = width - padding.left - padding.right;

  const plotAreaHeight = height - padding.top - padding.bottom;

  let xDomain = xExtent;
  if (!xDomain && data) {
    xDomain = d3.extent(data, (d) => d[xKey]);
  }

  let yDomain = yExtent;
  if (!yDomain && data) {
    yDomain = d3.extent(data, (d) => d[yKey]);
  }

  if (clampToZero) {
    yDomain[0] = 0;
    xDomain[0] = 0;
  }

  const domainPaddingFactor = 1.15;

  const xScale = d3.scaleLinear().range([0, plotAreaWidth]).clamp(true);
  if (xDomain) {
    xScale.domain([xDomain[0], xDomain[1] * domainPaddingFactor]);
  }

  const yScale = d3.scaleLinear().range([plotAreaHeight, 0]).clamp(true);
  if (yDomain) {
    yScale.domain([yDomain[0], yDomain[1] * domainPaddingFactor]);
  }

  return {
    colors,
    padding,
    plotAreaWidth,
    plotAreaHeight,
    xScale,
    yScale,
  };
}

/**
 * Chart for showing dots
 *
 * @prop {Array} data array of objects with various metrics inside
 * @prop {Number} height The height of the chart
 * @prop {String} highlightPointId The ID of the point to highlight
 * @prop {Function} onHighlightPoint Callback for when a point is hovered on
 * @prop {Number} width The width of the chart
 * @prop {Array} yExtent Optional. The min and max value of the yKey in the chart
 * @prop {String} yKey="y" The key in the data points to read the y value from
 * @prop {Array} xExtent Optional. The min and max value of the xKey in the chart
 * @prop {String} xKey="x" The key in the data points to read the x value from
 */
class ScatterPlot extends PureComponent {
  static propTypes = {
    colors: PropTypes.object,
    data: PropTypes.array,
    height: PropTypes.number,
    highlightPointId: PropTypes.string,
    id: React.PropTypes.string,
    onHighlightPoint: PropTypes.func,
    padding: PropTypes.object,
    plotAreaHeight: PropTypes.number,
    plotAreaWidth: PropTypes.number,
    pointRadius: PropTypes.number,
    width: PropTypes.number,
    xAxisLabel: React.PropTypes.string,
    xAxisUnit: React.PropTypes.string,
    xExtent: PropTypes.array,
    xFormatter: PropTypes.func,
    xKey: PropTypes.string,
    xScale: PropTypes.func,
    yAxisLabel: React.PropTypes.string,
    yAxisUnit: React.PropTypes.string,
    yExtent: PropTypes.array,
    yFormatter: PropTypes.func,
    yKey: PropTypes.string,
    yScale: PropTypes.func,
  }

  static defaultProps = {
    data: [],
    yKey: 'y',
    xKey: 'x',
    width: 200,
    height: 200,
    pointRadius: 6,
    xFormatter: d => d,
    yFormatter: d => d,
  }

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

  onHoverPoint(d) {
    this.props.onHighlightPoint(d && d.id);
  }

  /**
   * Helper to find the highlight point based off the ID
   */
  getHighlightPoint() {
    const { data, highlightPointId } = this.props;
    if (!data || !data.length || highlightPointId == null) {
      return null;
    }

    const highlightPoint = data.find(d => d.id === highlightPointId);
    return highlightPoint;
  }

  getXAxisLabel() {
    const { xAxisLabel, xAxisUnit } = this.props;
    return `${xAxisLabel}${xAxisUnit ? ` (${xAxisUnit})` : ''}`;
  }

  getYAxisLabel() {
    const { yAxisLabel, yAxisUnit } = this.props;
    return `${yAxisLabel}${yAxisUnit ? ` (${yAxisUnit})` : ''}`;
  }

  /**
   * Initialize the d3 chart - this is run once on mount
   */
  setup() {
    this.g = d3.select(this.root)
      .append('g'); // transformed to have margin in update()

    // add in axis groups
    this.xAxis = this.g.append('g').classed('x-axis', true);
    this.xAxisLabel = this.g.append('text')
      .attr('dy', -4)
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle');

    this.yAxis = this.g.append('g').classed('y-axis', true);
    this.yAxisLabel = this.g.append('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle');

    // set up highlight
    this.highlight = this.g.append('g')
      .attr('class', 'highlight')
      .attr('transform', 'translate(0 -5)');

    this.highlight.append('text')
      .attr('class', 'highlight-label');
    const axisHighlight = this.highlight.append('g')
      .attr('class', 'axis-highlights')
      .attr('transform', 'translate(0 5)');

    const highlightX = axisHighlight.append('g').attr('class', 'highlight-x');
    // add in a rect to fill out the area beneath the hovered value in X axis
    highlightX.append('rect')
      .attr('x', -25)
      .attr('width', 50)
      .attr('height', 20)
      .style('fill', '#fff');
    highlightX.append('text')
      .attr('dy', 15)
      .attr('text-anchor', 'middle');
    highlightX.append('line')
      .attr('y1', 0);

    const highlightY = axisHighlight.append('g').attr('class', 'highlight-y');
    // add in a rect to fill out the area beneath the hovered value in Y axis
    highlightY.append('rect')
      .attr('x', -20)
      .attr('width', 30)
      .attr('y', -10)
      .attr('height', 20)
      .style('fill', '#fff');
    highlightY.append('text')
      .attr('dy', 4)
      .attr('text-anchor', 'end');
    highlightY.append('line')
      .attr('transform', 'translate(10 0)')
      .attr('x1', 0);

    this.update();
  }

  /**
   * Update the d3 chart - this is the main drawing function
   */
  update() {
    this.updateAxes();
    this.updateChart();
    this.updateHighlight();
  }

  updateHighlight() {
    const {
      colors,
      yKey,
      xKey,
      xFormatter,
      yFormatter,
      xScale,
      yScale,
    } = this.props;

    const highlightPoint = this.getHighlightPoint();

    // if no highlight, hide the highlight markers
    if (!highlightPoint) {
      this.highlight.style('display', 'none');
      return;
    }

    // otherwise update an show them
    this.highlight.style('display', '');

    const color = colors[highlightPoint.id];

    // show name in the label
    this.highlight.select('text')
      .style('fill', color)
      .text(highlightPoint.label);

    const xValue = highlightPoint[xKey] || 0;
    const yValue = highlightPoint[yKey] || 0;

    // show the value in the x axis
    const xAxisY = yScale.range()[0] + 4;
    const highlightX = this.highlight.select('.highlight-x')
      .attr('transform', `translate(${xScale(xValue)} ${xAxisY})`);

    highlightX.select('text')
      .style('fill', color)
      .text(xFormatter(xValue));
    highlightX.select('line')
      .attr('y2', -(xAxisY - yScale(yValue)))
      .style('stroke', color);


    // show the value in the y axis
    const highlightY = this.highlight.select('.highlight-y')
      .attr('transform', `translate(-10 ${yScale(yValue)})`);
    highlightY.select('text')
      .style('fill', color)
      .text(yFormatter(yValue));
    highlightY.select('line')
      .attr('x2', xScale(xValue))
      .style('stroke', color);
  }

  /**
   * Iterates through data, using line generators to update charts.
   */
  updateChart() {
    const {
      data,
      padding,
      colors,
      pointRadius,
      xKey,
      xScale,
      yKey,
      yScale,
    } = this.props;

    this.g.attr('transform', `translate(${padding.left} ${padding.top})`);

    const filteredData = data.filter((d) => d[xKey] && d[yKey]);

    const binding = this.g.selectAll('.data-point').data(filteredData, d => d.id);
    binding.exit().remove();
    const entering = binding.enter().append('circle')
      .classed('data-point', true)
      .on('mouseenter', d => this.onHoverPoint(d))
      .on('mouseleave', () => this.onHoverPoint(null));

    binding.merge(entering)
      .attr('cx', (d) => xScale(d[xKey] || 0))
      .attr('cy', (d) => yScale(d[yKey] || 0))
      .attr('r', pointRadius)
      .attr('stroke', (d) => colors[d.id])
      .attr('fill', (d) => d3.color(colors[d.id]).brighter(0.3));
  }

  /**
   * Render the x and y axis components
   */
  updateAxes() {
    const { xScale, yScale, plotAreaHeight, plotAreaWidth, padding } = this.props;

    const xTicks = Math.round(plotAreaWidth / 50);
    const yTicks = Math.round(plotAreaHeight / 50);
    const xAxis = d3.axisBottom(xScale).ticks(xTicks).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(yTicks).tickSizeOuter(0);

    this.yAxis.call(yAxis);
    this.yAxisLabel
      .attr('transform', `rotate(270) translate(${-plotAreaHeight / 2} ${-padding.left + 12})`)
      .text(this.getYAxisLabel());

    this.xAxis
      .attr('transform', `translate(0 ${plotAreaHeight + 3})`)
      .call(xAxis);
    this.xAxisLabel
      .attr('transform', `translate(${plotAreaWidth / 2} ${plotAreaHeight + (padding.bottom)})`)
      .text(this.getXAxisLabel());
  }

  render() {
    const { width, height, id } = this.props;
    return (
      <div>
        <svg
          id={id}
          className="ScatterPlot chart"
          height={height}
          ref={node => { this.root = node; }}
          width={width}
        />
      </div>
    );
  }
}

export default addComputedProps(visProps)(ScatterPlot);
