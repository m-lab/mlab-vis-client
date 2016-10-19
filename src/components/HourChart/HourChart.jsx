import React, { PureComponent, PropTypes } from 'react';
import d3 from 'd3';
import addComputedProps from '../../hoc/addComputedProps';
import { testThreshold } from '../../constants';
import { standardLineChunkedDefinitions } from '../../utils/chart';

import './HourChart.scss';

/**
 * Figure out what is needed to render the chart
 * based on the props of the component
 */
function visProps(props) {
  const {
    color,
    data,
    forceZeroMin,
    height,
    paddingLeft = 50,
    paddingRight = 20,
    threshold,
    width,
    yExtent,
    yKey,
  } = props;
  let { xScale } = props;

  const padding = {
    top: 20,
    right: paddingRight,
    bottom: 40,
    left: paddingLeft,
  };

  const plotAreaWidth = width - padding.left - padding.right;
  const plotAreaHeight = height - padding.top - padding.bottom;

  const xMin = 0;
  const xMax = plotAreaWidth;
  const yMin = plotAreaHeight;
  const yMax = 0;

  // set up the domains based on extent. Use the prop if provided, otherwise calculate
  const xDomain = [0, 23];
  let yDomain = yExtent || d3.extent(data, d => d[yKey]);

  // force 0 as the min in the yDomain if specified
  if (forceZeroMin) {
    yDomain = [0, yDomain[1]];
  }

  // use the props xScale if provided, otherwise compute it
  if (!xScale) {
    xScale = d3.scaleLinear().domain(xDomain).range([xMin, xMax]);
  }
  const yScale = d3.scaleLinear().domain(yDomain).range([yMin, yMax]);

  const binWidth = (xMax - yMax) / 24;

  // function to generate paths for each series
  const lineChunked = d3.lineChunked()
    .curve(d3.curveMonotoneX)
    .x((d) => xScale(d.hour) + (binWidth / 2))
    .y((d) => yScale(d[yKey]))
    .defined(d => d[yKey] != null)
    .lineStyles({
      stroke: color,
      'stroke-width': 1.5,
    })
    .chunk(d => (d.count > threshold ? 'line' : 'below-threshold'))
    .chunkDefinitions(standardLineChunkedDefinitions(color));

  return {
    binWidth,
    data,
    height,
    plotAreaHeight,
    padding,
    plotAreaWidth,
    lineChunked,
    width,
    xScale,
    yScale,
    yKey,
  };
}


/**
 * Chart for showing data by hour
 *
 * @prop {String} color The color to render the chart in
 * @prop {Array} data The array of data points indexed by hour. Should be
 *   an array of length 24 of form [{ hour:Number(0..23), points: [{ yKey:Number }, ...]}, ...]
 * @prop {Boolean} forceZeroMin=true Whether the min y value should always be 0.
 * @prop {Number} height The height of the chart
 * @prop {Number} highlightHour The hour being highlighted in the chart
 * @prop {Function} onHighlightHour Callback for when an hour is hovered on
 * @prop {Number} width The width of the chart
 * @prop {String} yAxisLabel The label to show on the Y axis
 * @prop {String} yAxisUnit The unit to show on the Y axis label
 * @prop {Array} yExtent The min and max value of the yKey in the chart
 * @prop {Function} yFormatter Format function that takes a y value and outputs a string
 * @prop {String} yKey="y" The key in the data points to read the y value from
 */
class HourChart extends PureComponent {
  static propTypes = {
    binWidth: PropTypes.number,
    color: PropTypes.string,
    data: PropTypes.array,
    dataByDate: PropTypes.object,
    dataByHour: PropTypes.array,
    forceZeroMin: PropTypes.bool,
    height: PropTypes.number,
    highlightHour: PropTypes.number,
    id: React.PropTypes.string,
    inSvg: React.PropTypes.bool,
    lineChunked: PropTypes.func,
    onHighlightHour: PropTypes.func,
    overallData: PropTypes.array,
    padding: PropTypes.object,
    paddingLeft: PropTypes.number,
    paddingRight: PropTypes.number,
    plotAreaHeight: PropTypes.number,
    plotAreaWidth: PropTypes.number,
    threshold: PropTypes.number,
    width: PropTypes.number,
    xScale: React.PropTypes.func,
    yAxisLabel: React.PropTypes.string,
    yAxisUnit: React.PropTypes.string,
    yExtent: PropTypes.array,
    yFormatter: PropTypes.func,
    yKey: PropTypes.string,
    yScale: PropTypes.func,
  }

  static defaultProps = {
    data: [],
    color: '#aaa',
    forceZeroMin: true,
    threshold: testThreshold,
    yFormatter: d => d,
    yKey: 'y',
  }

  /**
   * Main constructor. Bind handlers here.
   */
  constructor(props) {
    super(props);
    this.onHoverHour = this.onHoverHour.bind(this);
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

  /**
   * Callback for when the mouse hovers over a circle
   *
   * @param {Object} d The hovered over hour data
   * @return {void}
   */
  onHoverHour(d) {
    const { onHighlightHour } = this.props;
    if (onHighlightHour) {
      onHighlightHour(d && d.hour);
    }
  }

  getFullYAxisLabel() {
    const { yAxisLabel, yAxisUnit } = this.props;
    return `${yAxisLabel}${yAxisUnit ? ` (${yAxisUnit})` : ''}`;
  }

  /**
   * Initialize the d3 chart - this is run once on mount
   */
  setup() {
    const { height, padding, width } = this.props;

    // add in white background for saving as PNG
    d3.select(this.root).append('rect')
      .classed('chart-background', true)
      .attr('width', width)
      .attr('height', height)
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', '#fff');

    this.g = d3.select(this.root)
      .append('g')
      .attr('transform', `translate(${padding.left} ${padding.top})`);

    // add in axis groups
    this.xAxis = this.g.append('g').classed('x-axis', true);
    this.xAxisLabel = this.g.append('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle');

    this.yAxis = this.g.append('g').classed('y-axis', true);
    this.yAxisLabel = this.g.append('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle');

    this.gOverallLine = this.g.append('g').attr('class', 'overall');

    // add in groups for data
    this.circles = this.g.append('g').classed('circles', true)
      .on('mouseleave', () => this.onHoverHour(null));

    this.setupHighlight();

    this.update();
  }

  /**
   * Helper to setup the elements for highlight
   * @return {void}
   */
  setupHighlight() {
    // setup highlight group
    this.gHighlight = this.g.append('g').classed('highlight', true);

    // add in the lines
    const extentLines = this.gHighlight.append('g').attr('class', 'extent-lines');
    extentLines.append('line').attr('class', 'extent-line');
    const extentEdgeWidth = 7;
    extentLines.append('line').attr('class', 'extent-edge extent-edge-min')
      .attr('x1', -extentEdgeWidth / 2)
      .attr('x2', extentEdgeWidth / 2);
    extentLines.append('line').attr('class', 'extent-edge extent-edge-max')
      .attr('x1', -extentEdgeWidth / 2)
      .attr('x2', extentEdgeWidth / 2);

    // add in the circle
    this.gHighlight.append('circle').attr('class', 'highlight-circle');

    // add in the text
    const gHighlightText = this.gHighlight.append('g').attr('class', 'highlight-text');
    gHighlightText.append('rect').style('fill', '#fff');
    gHighlightText.append('text').attr('text-anchor', 'middle');

    const highlightX = this.gHighlight.append('g').attr('class', 'highlight-x');
    // add in a rect to fill out the area beneath the hovered hour in X axis
    highlightX.append('rect')
      .attr('x', -25)
      .attr('width', 50)
      .attr('height', 20)
      .style('fill', '#fff');
    highlightX.append('text')
      .attr('dy', 15)
      .attr('text-anchor', 'middle');
  }

  /**
   * Update the d3 chart - this is the main drawing function
   *
   * @return {void}
   */
  update() {
    this.updateCircles();
    this.updateOverallLine();
    this.updateAxes();
    this.updateHighlight();
  }

  /**
   * Render the x and y axis components
   */
  updateAxes() {
    const { xScale, yScale, plotAreaHeight, plotAreaWidth, padding, binWidth, yKey, yFormatter } = this.props;
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

    // use default formatter unless retransmit_avg since we want percentages rendered
    if (yKey === 'retransmit_avg') {
      yAxis.tickFormat(yFormatter);
    }

    this.yAxis.call(yAxis);
    this.yAxisLabel
      .attr('transform', `rotate(270) translate(${-plotAreaHeight / 2} ${-padding.left + 12})`)
      .text(this.getFullYAxisLabel());

    this.xAxis
      .attr('transform', `translate(${binWidth / 2} ${plotAreaHeight + 3})`)
      .call(xAxis);
    this.xAxisLabel
      .attr('transform', `translate(${plotAreaWidth / 2} ${plotAreaHeight + (padding.bottom)})`)
      .text('Hour');
  }

  /**
   * Render some circles in the chart
   */
  updateCircles() {
    const { dataByHour, xScale, yScale, yKey, binWidth, color, plotAreaHeight } = this.props;

    const binding = this.circles
      .selectAll('g')
      .data(dataByHour);

    const entering = binding.enter()
      .append('g')
      .classed('hour-container', true);

    // add in mouse listener rects
    entering.append('rect')
      .style('fill', '#f00')
      .style('opacity', 0)
      .on('mouseenter', this.onHoverHour);

    binding.merge(entering)
      .each(function createCircles(hourData) {
        const { hour, points } = hourData;
        const selection = d3.select(this);

        selection.select('rect')
          .attr('width', Math.ceil(binWidth))
          .attr('x', 0)
          .attr('y', 0)
          .attr('height', plotAreaHeight + 23);

        // move selection over to the correct column.
        selection.attr('transform', `translate(${xScale(hour)} 0)`);

        const hourBinding = selection.selectAll('circle')
          .data(points);

        // ENTER
        const entering = hourBinding.enter()
          .append('circle')
          .style('fill', color);

        // ENTER + UPDATE
        hourBinding
          .merge(entering)
          .attr('r', 2.5)
          .attr('cx', binWidth / 2)
          .attr('cy', d => yScale(d[yKey]));

        // EXIT
        hourBinding.exit()
          .remove();
      });

    binding.exit().remove();
  }

  updateOverallLine() {
    const { overallData, lineChunked } = this.props;

    const binding = this.gOverallLine.selectAll('g').data([overallData]);

    // ENTER
    const entering = binding.enter().append('g');

    // ENTER + UPDATE
    binding.merge(entering)
      .call(lineChunked);

    // EXIT
    binding.exit().remove();
  }

  /**
   * Renders the highlighted points
   */
  updateHighlight() {
    const { binWidth, dataByHour, color, xScale, yKey, yScale, highlightHour, overallData, yFormatter } = this.props;
    const highlightPoint = overallData.find(d => d.hour === highlightHour);

    if (!highlightPoint) {
      this.gHighlight.style('display', 'none');
    } else {
      const x = xScale(highlightPoint.hour) + (binWidth / 2);
      const y = yScale(highlightPoint[yKey]);

      this.gHighlight.style('display', '')
        .attr('transform', `translate(${x} 0)`);

      // draw a circle at the value
      this.gHighlight.select('circle')
        .attr('r', 3)
        .attr('cx', 0)
        .attr('cy', y)
        .style('stroke', color)
        .style('fill', '#fff');

      const [minY, maxY] = d3.extent(dataByHour[highlightPoint.hour].points, d => d[yKey]);

      // draw the lines extending to max and min
      const lineColor = d3.color(color).darker(1);
      const extentLines = this.gHighlight.select('.extent-lines');

      extentLines.select('.extent-line')
        .attr('y1', yScale(minY))
        .attr('y2', yScale(maxY))
        .style('stroke', lineColor);

      extentLines.select('.extent-edge-min')
        .attr('y1', yScale(minY))
        .attr('y2', yScale(minY))
        .style('stroke', lineColor);

      extentLines.select('.extent-edge-max')
        .attr('y1', yScale(maxY))
        .attr('y2', yScale(maxY))
        .style('stroke', lineColor);

      // show the value near the circle
      const textHeight = 16;
      const textMargin = 4;

      const highlightText = this.gHighlight.select('.highlight-text');
      const text = highlightText.select('text')
        .attr('y', y - textHeight - textMargin)
        .attr('dy', 12)
        .text(yFormatter(highlightPoint[yKey]));

      const textWidth = text.node().getBBox().width;
      highlightText.select('rect')
        .attr('x', -textWidth / 2)
        .attr('y', y - textHeight - textMargin)
        .attr('height', textHeight)
        .attr('width', textWidth)
        .style('fill', '#fff');

      // show the hour in the x-axis
      const highlightX = this.gHighlight.select('.highlight-x')
        .attr('transform', `translate(0 ${yScale.range()[0] + 4})`);

      highlightX.select('text')
        .text(highlightPoint.hour);
    }
  }

  /**
   * The main render method. Defers chart rendering to d3 in `update` and `setup`
   * @return {React.Component} The rendered container
   */
  render() {
    const { height, inSvg, id, width } = this.props;

    if (inSvg) {
      return (
        <g
          className="hour-chart chart"
          ref={node => { this.root = node; }}
        />
      );
    }

    return (
      <svg
        id={id}
        className="hour-chart chart"
        ref={node => { this.root = node; }}
        width={width}
        height={height}
      />
    );
  }
}

export default addComputedProps(visProps, { changeExclude: ['highlightHour'] })(HourChart);
