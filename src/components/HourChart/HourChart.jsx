import React, { PureComponent, PropTypes } from 'react';
import d3 from 'd3';

import './HourChart.scss';

/**
 * Chart for showing data by hour
 *
 * @prop {Array} data The array of data points indexed by hour. Should be
 *   an array of length 24 of form [{ hour:Number(0..23), points: [{ yKey:Number }, ...]}, ...]
 * @prop {Array} extent The min and max value of the yKey in the chart
 * @prop {Boolean} forceZeroMin=true Whether the min y value should always be 0.
 * @prop {Number} height The height of the chart
 * @prop {Number} width The width of the chart
 * @prop {String} yKey="y" The key in the data points to read the y value from
 */
export default class HourChart extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    extent: PropTypes.array,
    forceZeroMin: PropTypes.bool,
    height: PropTypes.number,
    width: PropTypes.number,
    yKey: PropTypes.string,
  }

  static defaultProps = {
    data: [],
    extent: [0, 10],
    forceZeroMin: true,
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
    this.xAxis = this.g.append('g');
    this.yAxis = this.g.append('g');
    this.update();
  }

   /**
   * Figure out what is needed to render the chart
   * based on the props of the component
   */
  makeVisComponents(props) {
    const { data = [], extent = [], forceZeroMin, height, width, yKey } = props;

    const innerMargin = { top: 20, right: 20, bottom: 35, left: 50 };
    const innerWidth = width - innerMargin.left - innerMargin.right;
    const innerHeight = height - innerMargin.top - innerMargin.bottom;

    const xMin = 0;
    const xMax = innerWidth;
    const yMin = innerHeight;
    const yMax = 0;

    const xDomain = [0, 23];
    const yDomain = [forceZeroMin ? 0 : extent[0], extent[1]];

    // filter so only points with non-null values for yKey exist
    const filteredData = data.map(d => ({
      ...d,
      points: d.points ? d.points.filter(point => point[yKey] != null) : [],
    }));

    const xScale = d3.scaleLinear().domain(xDomain).range([xMin, xMax]);
    const yScale = d3.scaleLinear().domain(yDomain).range([yMin, yMax]);

    const binWidth = (xMax - yMax) / 24;

    // function to generate paths for each series
    const line = d3.line()
      .curve(d3.curveLinear)
      .x((d) => xScale(d.hour))
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
      yScale,
      yKey,
      binWidth,
    };
  }

  /**
   * Update the d3 chart - this is the main drawing function
   */
  update() {
    this.renderCircles();
    this.renderAxis();
  }

  /**
   * Render the x and y axis components
   */
  renderAxis() {
    const { xScale, yScale, innerHeight, binWidth } = this.visComponents;
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    this.yAxis.call(yAxis);

    this.xAxis
      .attr('transform', `translate(${binWidth / 2} ${innerHeight + 3})`)
      .call(xAxis);
  }

  /**
   * Render some circles in the chart
   */
  renderCircles() {
    const { data, xScale, yScale, yKey, binWidth } = this.visComponents;
    const binding = this.circles
      .selectAll('g')
      .data(data);

    const entering = binding.enter()
      .append('g')
      .classed('hour-container', true);

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
          .style('fill', '#00c');

        // ENTER + UPDATE
        hourBinding
          .merge(entering)
          .attr('r', 3)
          .attr('cx', () => binWidth / 2)
          .attr('cy', d => yScale(d[yKey]));

        // EXIT
        hourBinding.exit()
          .remove();
      });

    binding.exit().remove();
  }


  /**
   * The main render method. Defers chart rendering to d3 in `update` and `setup`
   * @return {React.Component} The rendered container
   */
  render() {
    const { width, height } = this.props;

    return (
      <div className="hour-chart">
        <svg ref={svg => { this.svg = svg; }} width={width} height={height} />
      </div>
    );
  }

}
