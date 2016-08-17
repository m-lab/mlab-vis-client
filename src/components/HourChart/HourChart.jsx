import React, { PureComponent, PropTypes } from 'react';
import d3 from 'd3';

import './HourChart.scss';

export default class HourChart extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    height: React.PropTypes.number,
    width: React.PropTypes.number,
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
    const { data = [], height, width, xKey, yKey } = props;

    const innerMargin = { top: 20, right: 20, bottom: 35, left: 50 };
    const innerWidth = width - innerMargin.left - innerMargin.right;
    const innerHeight = height - innerMargin.top - innerMargin.bottom;

    const xMin = 0;
    const xMax = innerWidth;
    const yMin = innerHeight;
    const yMax = 0;

    const hours = d3.range(0, 24, 1);
    const hourData = new Array(24);

    const yDomain = [Infinity, 0];

    hours.forEach((hour) => {
      // filter out points with missing values
      hourData[hour] = [];
      if (data[hour] && data[hour].length) {
        hourData[hour] = data[hour].filter(d =>
          d[xKey] != null && d[yKey] != null);

        const ext = d3.extent(hourData[hour], d => d[yKey]);
        yDomain[0] = Math.min(yDomain[0], ext[0]);
        yDomain[1] = Math.max(yDomain[1], ext[1]);
      }
    });

    const xDomain = [0, 23];

    const xScale = d3.scaleLinear().domain(xDomain).range([xMin, xMax]);
    const yScale = d3.scaleLinear().domain(yDomain).range([yMin, yMax]);

    const binWidth = (xMax - yMax) / 24;

    // function to generate paths for each series
    const line = d3.line()
      .curve(d3.curveLinear)
      .x((d) => xScale(d[xKey]))
      .y((d) => yScale(d[yKey]));

    return {
      data: hourData,
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
      .data(data, (d, i) => `${i}-${d.length}`);

    const entering = binding.enter()
      .append('g')
      .classed('hour-container', true);

    binding.merge(entering)
      .each(function createCircles(hourData, idx) {
        const selection = d3.select(this);

        // move selection over to the correct column.
        selection.attr('transform', `translate(${xScale(idx)} 0)`);

        const hourBinding = selection.selectAll('circle')
          .data(hourData);

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
