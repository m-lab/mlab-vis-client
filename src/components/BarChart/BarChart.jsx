import React, { PureComponent, PropTypes } from 'react';
import d3 from 'd3';

import './BarChart.scss';

export default class BarChart extends PureComponent {

  static propTypes = {
    data: PropTypes.array,
    id: React.PropTypes.string,
    forceZeroMin: PropTypes.bool,
    height: PropTypes.number,
    width: PropTypes.number,
    xExtent: PropTypes.array,
    xKey: React.PropTypes.string,
    yExtent: PropTypes.array,
    yKey: React.PropTypes.string,
    threshold: React.PropTypes.number,
  };

  static defaultProps = {
    data: [],
    forceZeroMin: true,
    xKey: 'x',
    yKey: 'y',
    threshold: 30,
  };

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
    const { height, innerMargin, width } = this.visComponents;

    // add in white background for saving as PNG
    d3.select(this.svg).append('rect')
      .classed('chart-background', true)
      .attr('width', width)
      .attr('height', height)
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', '#fff');

    this.g = d3.select(this.svg)
      .append('g')
      .attr('transform', `translate(${innerMargin.left} ${innerMargin.top})`);

    // add in axis groups
    this.yAxis = this.g.append('g').classed('y-axis', true);

    // add in groups for data
    this.bars = this.g.append('g').classed('bars-group', true);

    this.update();
  }

   /**
   * Prepare the data by setting a flag if it does not
   * pass the threshold.
   * @param {Object} props the component props
   * @return {Array} the prepared data
   */
  prepareData(props) {
    const { data, yKey, threshold } = props;

    data.forEach(d => {
      if (d[yKey] < threshold) {
        d.tooFew = true;
      }
    });

    return data;
  }

  makeVisComponents(props) {
    const { forceZeroMin, height, width, xExtent, xKey, yExtent, yKey, data } = props;

    const filteredData = this.prepareData(props);

    const innerMargin = { top: 20, right: 20, bottom: 35, left: 50 };
    const innerWidth = width - innerMargin.left - innerMargin.right;
    const innerHeight = height - innerMargin.top - innerMargin.bottom;

    const xMin = 0;
    const xMax = innerWidth;
    const yMin = innerHeight;
    const yMax = 0;

    // set up the domains based on extent. Use the prop if provided, otherwise calculate
    const xDomain = xExtent || d3.extent(filteredData, d => d[xKey]);
    let yDomain = yExtent || d3.extent(filteredData, d => d[yKey]);

    // force 0 as the min in the yDomain if specified
    if (forceZeroMin) {
      yDomain = [0, yDomain[1]];
    }

    const xScale = d3.scaleTime().domain(xDomain).range([xMin, xMax]);
    const yScale = d3.scaleLinear().domain(yDomain).range([yMin, yMax]);
    const binWidth = (xMax - xMin) / data.length;

    return {
      binWidth,
      data: filteredData,
      height,
      innerHeight,
      innerMargin,
      innerWidth,
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
    this.renderAxes();
    this.renderBars();
  }

  /**
   * Render the x and y axis components
   */
  renderAxes() {
    const { yScale } = this.visComponents;
    const yAxis = d3.axisLeft(yScale).ticks(4);

    this.yAxis.call(yAxis);
  }

  /**
   * Render the rects
   */
  renderBars() {
    const {
      data,
      xKey,
      xScale,
      yKey,
      yScale,
      innerHeight,
      binWidth,
    } = this.visComponents;

    const binding = this.bars.selectAll('rect').data(data);
    const yMax = yScale.range()[1];

    // ENTER
    const entering = binding.enter()
      .append('rect')
      .style('fill', '#00c');

    // ENTER + UPDATE
    binding.merge(entering)
      .attr('x', d => xScale(d[xKey]))
      .attr('y', d => innerHeight - yScale(d[yKey]))
      .attr('width', binWidth)
      .attr('height', d => yScale(d[yKey]));

    // EXIT
    binding.exit()
      .remove();
  }

  /**
   * The main render method. Defers chart rendering to d3 in `update` and `setup`
   * @return {React.Component} The rendered container
   */
  render() {
    const { width, id, height } = this.props;

    return (
      <div className="bar-chart-container">
        <svg
          id={id}
          className="bar-chart chart"
          ref={svg => { this.svg = svg; }}
          width={width}
          height={height}
        />
      </div>
    );
  }
}
