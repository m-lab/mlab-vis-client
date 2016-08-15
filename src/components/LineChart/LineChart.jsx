import React, { PureComponent, PropTypes } from 'react';
import d3 from 'd3';

import './LineChart.scss';

/**
 * A line chart that uses d3 to draw
 */
export default class LineChart extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    xKey: React.PropTypes.string,
    yKey: React.PropTypes.string,
  }

  static defaultProps = {
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
   * When the react component updates, update the d3 vis
   */
  componentDidUpdate() {
    this.update();
  }

  /**
   * When new props are received, regenerate vis components if necessary
   */
  componentWillReceiveProps(nextProps) {
    const { data, width, height } = this.props;

    // regenerate the vis components if the relevant props change
    if (data !== nextProps.data ||
      width !== nextProps.width ||
      height !== nextProps.height) {
      this.visComponents = this.makeVisComponents(nextProps);
    }
  }

  /**
   * Figure out what is needed to render the chart
   * based on the props of the component
   */
  makeVisComponents(props) {
    const { data = [], height, width, xKey, yKey } = props;

    const innerMargin = { top: 20, right: 20, bottom: 35, left: 50 };
    const innerWidth = width - innerMargin.left - innerMargin.right;
    const innerHeight = height - innerMargin.top - innerMargin.bottom;

    const xMin = 0;
    const xMax = innerWidth;
    const yMin = innerHeight;
    const yMax = 0;

    // NOTE: it is better for this transform of the data to take place via reselect.
    const xDomain = d3.extent(data, d => new Date(d[xKey]));
    const yDomain = d3.extent(data, d => d[yKey]);

    const xScale = d3.scaleTime().domain(xDomain).range([xMin, xMax]);
    const yScale = d3.scaleLinear().domain(yDomain).range([yMin, yMax]);

    // function to generate paths for each series
    const line = d3.line()
      .curve(d3.curveLinear)
      .x((d) => xScale(new Date(d[xKey])))
      .y((d) => yScale(d[yKey]));

    return {
      data,
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
      .attr('cx', d => xScale(new Date(d[xKey])))
      .attr('cy', d => yScale(d[yKey]));

    // EXIT
    binding.exit()
      .remove();
  }

  /**
   * Update the d3 chart - this is the main drawing function
   */
  update() {
    console.log('updating with', this.visComponents);
    this.renderCircles();
    this.renderLines();
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
