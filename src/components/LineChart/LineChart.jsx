import React, { PureComponent, PropTypes } from 'react';
import d3 from 'd3';

import './LineChart.scss';

/**
 * A line chart that uses d3 to draw. Assumes X is a time scale.
 *
 * @prop {Array} data The array of data points to render (e.g., [{x: Date, y: Number}, ...])
 * @prop {Number} height The height in pixels of the SVG chart
 * @prop {Number} width The width in pixels of the SVG chart
 * @prop {String} xKey="x" The key to read the x value from in the data
 * @prop {String} yKey="y" The key to read the y value from in the data
 */
export default class LineChart extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    xKey: React.PropTypes.string,
    yKey: React.PropTypes.string,
  }

  static defaultProps = {
    data: [],
    xKey: 'x',
    yKey: 'y',
  }

  /**
   * When the react component mounts, setup the d3 vis
   */
  componentDidMount() {
    this.setup();
  }

  /**
   * When new props are received, regenerate vis components if necessary
   */
  componentWillReceiveProps(nextProps) {
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
    this.visComponents = this.makeVisComponents(this.props);
    const { innerMargin } = this.visComponents;

    this.g = d3.select(this.svg)
      .append('g')
      .attr('transform', `translate(${innerMargin.left} ${innerMargin.top})`);

    this.lines = this.g.append('g').classed('lines-group', true);
    this.circles = this.g.append('g').classed('circles-group', true);
    this.update();
  }

  /**
   * Filter the data
   * @param {Object} props the component props
   * @return {Array} the prepared data
   */
  prepareData(props) {
    const { data, xKey, yKey } = props;
    // filter out points with missing values
    const filteredData = (data || []).filter(d => d[xKey] != null && d[yKey] != null);

    return filteredData;
  }

  /**
   * Figure out what is needed to render the chart
   * based on the props of the component
   */
  makeVisComponents(props) {
    const { height, width, xKey, yKey } = props;

    const filteredData = this.prepareData(props);

    const innerMargin = { top: 20, right: 20, bottom: 35, left: 50 };
    const innerWidth = width - innerMargin.left - innerMargin.right;
    const innerHeight = height - innerMargin.top - innerMargin.bottom;

    const xMin = 0;
    const xMax = innerWidth;
    const yMin = innerHeight;
    const yMax = 0;

    const xDomain = d3.extent(filteredData, d => d[xKey]);
    const yDomain = d3.extent(filteredData, d => d[yKey]);

    const xScale = d3.scaleTime().domain(xDomain).range([xMin, xMax]);
    const yScale = d3.scaleLinear().domain(yDomain).range([yMin, yMax]);

    // function to generate paths for each series
    const line = d3.line()
      .curve(d3.curveLinear)
      .x((d) => xScale(d[xKey]))
      .y((d) => yScale(d[yKey]));

    return {
      data: filteredData,
      height,
      innerHeight,
      innerMargin,
      innerWidth,
      line,
      width,
      xScale,
      xKey,
      yScale,
      yKey,
    };
  }

  /**
   * Update the d3 chart - this is the main drawing function
   */
  update() {
    this.renderCircles();
    this.renderLines();
  }

  /**
   * Render some circles in the chart
   */
  renderCircles() {
    const { data, xScale, xKey, yScale, yKey } = this.visComponents;

    const binding = this.circles.selectAll('circle').data(data);

    // ENTER
    const entering = binding.enter()
      .append('circle')
      .style('fill', '#00c');


    // ENTER + UPDATE
    binding
      .merge(entering)
      .attr('r', 3)
      .attr('cx', d => xScale(d[xKey]))
      .attr('cy', d => yScale(d[yKey]));

    // EXIT
    binding.exit()
      .remove();
  }

  /**
   * Render the lines in the chart
   */
  renderLines() {
    const { data, line } = this.visComponents;
    const binding = this.lines.selectAll('path').data([data]);

    // ENTER
    const entering = binding.enter()
      .append('path')
      .style('stroke', '#00a')
      .style('fill', 'none');

    // ENTER + UPDATE
    binding
      .merge(entering)
      .attr('d', line);
  }

  /**
   * The main render method. Defers chart rendering to d3 in `update` and `setup`
   * @return {React.Component} The rendered container
   */
  render() {
    const { width, height } = this.props;

    return (
      <div className="line-chart">
        <svg ref={svg => { this.svg = svg; }} width={width} height={height} />
      </div>
    );
  }
 }
