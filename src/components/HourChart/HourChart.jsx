import React, { PureComponent, PropTypes } from 'react';
import d3 from 'd3';

import './HourChart.scss';

/**
 * Chart for showing data by hour
 *
 * @prop {String} color The color to render the chart in
 * @prop {Array} data The array of data points indexed by hour. Should be
 *   an array of length 24 of form [{ hour:Number(0..23), points: [{ yKey:Number }, ...]}, ...]
 * @prop {Boolean} forceZeroMin=true Whether the min y value should always be 0.
 * @prop {Number} height The height of the chart
 * @prop {Object} highlightPoint The point being highlighted in the chart
 * @prop {Function} onHighlightPoint Callback for when a point is hovered on
 * @prop {Number} width The width of the chart
 * @prop {String} yAxisLabel The label to show on the Y axis
 * @prop {String} yAxisUnit The unit to show on the Y axis label
 * @prop {Array} yExtent The min and max value of the yKey in the chart
 * @prop {String} yKey="y" The key in the data points to read the y value from
 */
export default class HourChart extends PureComponent {
  static propTypes = {
    color: PropTypes.string,
    data: PropTypes.array,
    dataByDate: PropTypes.object,
    dataByHour: PropTypes.array,
    forceZeroMin: PropTypes.bool,
    height: PropTypes.number,
    highlightPoint: PropTypes.object,
    id: React.PropTypes.string,
    inSvg: React.PropTypes.bool,
    innerMarginLeft: PropTypes.number,
    innerMarginRight: PropTypes.number,
    onHighlightPoint: PropTypes.func,
    threshold: PropTypes.number,
    width: PropTypes.number,
    xScale: React.PropTypes.func,
    yAxisLabel: React.PropTypes.string,
    yAxisUnit: React.PropTypes.string,
    yExtent: PropTypes.array,
    yKey: PropTypes.string,
  }

  static defaultProps = {
    data: [],
    color: '#aaa',
    forceZeroMin: true,
    threshold: 30,
    yKey: 'y',
  }

  /**
   * Main constructor. Bind handlers here.
   */
  constructor(props) {
    super(props);
    this.onCircleMouseEnter = this.onCircleMouseEnter.bind(this);
    this.onCircleMouseLeave = this.onCircleMouseLeave.bind(this);
  }

  /**
   * Initiailize the vis components when the component is about to mount
   */
  componentWillMount() {
    this.visComponents = this.makeVisComponents(this.props);
  }

  /**
   * When the react component mounts, setup the d3 vis
   */
  componentDidMount() {
    this.setup();
  }

  /**
   * When new component is updating, regenerate vis components if necessary
   */
  componentWillUpdate(nextProps) {
    // regenerate the vis components if the relevant props change
    this.visComponents = this.makeVisComponents(nextProps);
  }

  /**
   * When the react component updates, update the d3 vis
   */
  componentDidUpdate() {
    this.update();
  }

    /**
   * Initialize the d3 chart - this is run once on mount
   */
  setup() {
    const { height, innerMargin, width } = this.visComponents;

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
      .attr('transform', `translate(${innerMargin.left} ${innerMargin.top})`);

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
    this.circles = this.g.append('g').classed('circles', true);

    // setup highlight group
    this.gHighlight = this.g.append('g').classed('highlight', true);
    this.gHighlight.append('g').classed('highlight-line', true);

    this.update();
  }

  getFullYAxisLabel() {
    const { yAxisLabel, yAxisUnit } = this.visComponents;
    return `${yAxisLabel}${yAxisUnit ? ` (${yAxisUnit})` : ''}`;
  }

  /**
   * Figure out what is needed to render the chart
   * based on the props of the component
   */
  makeVisComponents(props) {
    const { dataByHour, dataByDate, data, forceZeroMin, height,
      innerMarginLeft = 50, innerMarginRight = 20, overallData,
      width, yAxisLabel, yAxisUnit, yExtent, yKey, color } = props;
    let { xScale } = props;

    const innerMargin = {
      top: 20,
      right: innerMarginRight,
      bottom: 40,
      left: innerMarginLeft,
    };

    const innerWidth = width - innerMargin.left - innerMargin.right;
    const innerHeight = height - innerMargin.top - innerMargin.bottom;

    const xMin = 0;
    const xMax = innerWidth;
    const yMin = innerHeight;
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
    const line = d3.line()
      .curve(d3.curveMonotoneX)
      .x((d) => xScale(d.hour) + (binWidth / 2))
      .y((d) => yScale(d[yKey]));

    // for highlighted dates
    const highlightColor = 'rgb(245, 46, 113)';

    return {
      binWidth,
      color,
      dataByHour,
      dataByDate,
      data,
      height,
      highlightColor,
      innerHeight,
      innerMargin,
      innerWidth,
      line,
      overallData,
      width,
      xScale,
      yScale,
      yKey,
      yAxisLabel,
      yAxisUnit,
    };
  }

  /**
   * Update the d3 chart - this is the main drawing function
   *
   * @return {void}
   */
  update() {
    this.renderCircles();
    this.renderOverallLine();
    this.renderAxes();
    this.renderHighlight();
  }

  /**
   * Callback for when the mouse hovers over a circle
   *
   * @param {Object} d The hovered over data point
   * @return {void}
   */
  onCircleMouseEnter(d) {
    const { onHighlightPoint } = this.props;
    if (onHighlightPoint) {
      onHighlightPoint(d);
    }
  }

  /**
   * Callback for when the mouse leaves a circle
   *
   * @param {Object} d The previously hovered over data point
   * @return {void}
   */
  onCircleMouseLeave() {
    const { onHighlightPoint } = this.props;
    if (onHighlightPoint) {
      onHighlightPoint(null);
    }
  }

  /**
   * Render the x and y axis components
   */
  renderAxes() {
    const { xScale, yScale, innerHeight, innerWidth, innerMargin, binWidth } = this.visComponents;
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

    this.yAxis.call(yAxis);
    this.yAxisLabel
      .attr('transform', `rotate(270) translate(${-innerHeight / 2} ${-innerMargin.left + 12})`)
      .text(this.getFullYAxisLabel());

    this.xAxis
      .attr('transform', `translate(${binWidth / 2} ${innerHeight + 3})`)
      .call(xAxis);
    this.xAxisLabel
      .attr('transform', `translate(${innerWidth / 2} ${innerHeight + (innerMargin.bottom)})`)
      .text('Hour');
  }

  /**
   * Render some circles in the chart
   */
  renderCircles() {
    const { dataByHour, xScale, yScale, yKey, binWidth, color } = this.visComponents;

    const binding = this.circles
      .selectAll('g')
      .data(dataByHour);

    const entering = binding.enter()
      .append('g')
      .classed('hour-container', true);

    const that = this;
    binding.merge(entering)
      .each(function createCircles(hourData) {
        const { hour, points } = hourData;
        const selection = d3.select(this);

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
          .attr('r', 3.5)
          .attr('cx', () => binWidth / 2)
          .attr('cy', d => yScale(d[yKey]))
          .on('mouseenter', that.onCircleMouseEnter)
          .on('mouseleave', that.onCircleMouseLeave);

        // EXIT
        hourBinding.exit()
          .remove();
      });

    binding.exit().remove();
  }

  renderOverallLine() {
    const { overallData, color } = this.visComponents;
    this.renderLine(overallData, this.gOverallLine, { stroke: color });
  }

  /**
   * Renders the highlighted points
   */
  renderHighlight() {
    const { binWidth, dataByDate, xScale, yKey, yScale, highlightColor } = this.visComponents;
    const { highlightPoint } = this.props;

    // if no highlight, remove all children
    if (!highlightPoint) {
      this.gHighlight.select('.highlight-line').selectAll('*').remove();
      return;
    }

    // otherwise, we have a highlighted point, show a line and highlight the points
    const dateKey = highlightPoint.date.format('YYYY-MM-DD');
    const dateData = dataByDate[dateKey] ? dataByDate[dateKey].points : [];

    const g = this.gHighlight.select('.highlight-line');

    // render a line
    this.renderLine(dateData, g, { stroke: highlightColor });

    // also render some brighter circles
    const circlesBinding = g.selectAll('circle').data(dateData, d => d.hour);

    // ENTER
    const circlesEntering = circlesBinding.enter()
      .append('circle');

    // ENTER + UPDATE
    circlesBinding.merge(circlesEntering)
      .attr('r', 3.5)
      .attr('cx', d => xScale(d.hour) + (binWidth / 2))
      .attr('cy', d => yScale(d[yKey]))
      .style('fill', highlightColor);

    // EXIT
    circlesBinding.exit()
      .remove();
  }

  /**
   * Render a line
   */
  renderLine(dateData, parent, options = {}) {
    const { line } = this.visComponents;

    // draw the line
    const lineBinding = parent.selectAll('path').data([dateData]);

    const lineEntering = lineBinding.enter()
      .append('path')
      .style('fill', 'none');

    lineBinding.merge(lineEntering)
      .style('stroke', options.stroke || '#c0c')
      .attr('d', line);

    lineBinding.exit().remove();
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
