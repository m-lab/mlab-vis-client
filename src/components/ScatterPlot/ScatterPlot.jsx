import React, { PureComponent, PropTypes } from 'react';
import d3 from 'd3';
import { colorsFor } from '../../utils/color';

import './ScatterPlot.scss';

/**
 * Chart for showing dots
 *
 * @prop {Array} data array of objects with various metrics inside
 * @prop {Number} height The height of the chart
 * @prop {Function} onHover Callback for when a point is hovered on
 * @prop {Number} width The width of the chart
 * @prop {Array} yExtent Optional. The min and max value of the yKey in the chart
 * @prop {String} yKey="y" The key in the data points to read the y value from
 * @prop {Array} xExtent Optional. The min and max value of the xKey in the chart
 * @prop {String} xKey="x" The key in the data points to read the x value from
 */
export default class ScatterPlot extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    height: PropTypes.number,
    id: React.PropTypes.string,
    onHover: PropTypes.func,
    width: PropTypes.number,
    xExtent: PropTypes.array,
    xKey: PropTypes.string,
    yExtent: PropTypes.array,
    yKey: PropTypes.string,
  }

  static defaultProps = {
    data: [],
    yKey: 'y',
    xKey: 'x',
    width: 200,
    height: 200,
  }

  /**
   * Initiailize the vis components when the component is about to mount
   */
  componentWillMount() {
    // Holds refs to chart node for line updating.
    this.root = null;

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
    this.g = d3.select(this.root)
      .append('g'); // transformed to have margin in update()

    // add in axis groups
    this.xAxis = this.g.append('g').classed('x-axis', true);
    this.yAxis = this.g.append('g').classed('y-axis', true);

    this.update();
  }

  /**
   * Update the d3 chart - this is the main drawing function
   */
  update() {
    this.updateAxes();
    this.updateChart();
  }

  /**
   * Iterates through data, using line generators to update charts.
   */
  updateChart() {
    const {
            data,
            innerMargin,
            colors,
            xKey,
            xScale,
            yKey,
            yScale,
          } = this.visComponents;

    this.g.attr('transform', `translate(${innerMargin.left} ${innerMargin.top})`);

    const binding = this.g.selectAll('.data-point').data(data, d => d.id);
    binding.exit().remove();
    const entering = binding.enter().append('circle')
      .classed('data-point', true);

    // TODO: the values inside our summary data don't all get populated at once?
    binding.merge(entering)
      .attr('cx', (d) => (d[xKey] ? xScale(d[xKey]) : -100))
      .attr('cy', (d) => (d[yKey] ? yScale(d[yKey]) : -100))
      .attr('r', 8)
      .attr('fill', (d) => (d.id ? colors[d.id] : '#fff'));
  }

  /**
   * Render the x and y axis components
   */
  updateAxes() {
    const { xScale, yScale, chartHeight, chartWidth } = this.visComponents;

    const xTicks = Math.round(chartWidth / 50);
    const yTicks = Math.round(chartHeight / 50);
    const xAxis = d3.axisBottom(xScale).ticks(xTicks).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(yTicks).tickSizeOuter(0);

    this.yAxis.call(yAxis);

    this.xAxis
      .attr('transform', `translate(0 ${chartHeight + 3})`)
      .call(xAxis);
  }


  /**
   * Figure out what is needed to render the chart
   * based on the props of the component
   */
  makeVisComponents(props) {
    const { data,
            xExtent,
            xKey,
            yKey,
            yExtent,
            width,
            height,
            clampToZero = true,
            innerMarginLeft = 50,
            innerMarginRight = 20,
            innerMarginTop = 40,
          } = props;

    const colors = colorsFor(data, (d) => d.id);
    const innerMargin = {
      top: innerMarginTop,
      right: innerMarginRight,
      bottom: 35,
      left: innerMarginLeft,
    };

    const chartWidth = width - innerMargin.left - innerMargin.right;

    const chartHeight = height - innerMargin.top - innerMargin.bottom;

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

    const xScale = d3.scaleLinear().range([0, chartWidth]).clamp(true);
    if (xDomain) {
      xScale.domain(xDomain);
    }

    const yScale = d3.scaleLinear().range([chartHeight, 0]).clamp(true);
    if (yDomain) {
      yScale.domain(yDomain);
    }

    return {
      data,
      colors,
      height,
      innerMargin,
      chartWidth,
      chartHeight,
      width,
      xScale,
      yScale,
      xKey,
      yKey,
    };
  }

  render() {
    const { width, height, id } = this.props;
    return (
      <div>
        <svg
          id={id}
          className="scatter-plot chart"
          height={height}
          ref={node => { this.root = node; }}
          width={width}
        />
      </div>
    );
  }
}
