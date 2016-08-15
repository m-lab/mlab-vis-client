import React, { PureComponent, PropTypes } from 'react';
import d3 from 'd3';

import './LineChart.scss';

export default class LineChart extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
  }

  componentDidMount() {
    this.setup();
  }

  componentDidUpdate() {
    this.update();
  }

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
    const { width, height, data } = props;

    const innerMargin = { top: 20, right: 20, bottom: 35, left: 50 };
    const innerWidth = width - innerMargin.left - innerMargin.right;
    const innerHeight = height - innerMargin.top - innerMargin.bottom;

    const xMin = 0;
    const xMax = innerWidth;
    const yMin = innerHeight;
    const yMax = 0;

    const xDomain = d3.extent(data, d => d.x);
    const yDomain = d3.extent(data, d => d.y);

    const xScale = d3.scaleLinear().domain(xDomain).range([xMin, xMax]);
    const yScale = d3.scaleLinear().domain(yDomain).range([yMin, yMax]);

    // function to generate paths for each series
    const line = d3.line()
      .curve(d3.curveLinear)
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y));

    return {
      data,
      height,
      innerHeight,
      innerMargin,
      innerWidth,
      line,
      width,
      xScale,
      yScale,
    };
  }

  /**
   * Initialize the d3 chart
   */
  setup() {
    this.visComponents = this.makeVisComponents(this.props);
    const { innerMargin } = this.visComponents;

    this.g = d3.select(this.svg)
      .append('g')
      .attr('transform', `translate(${innerMargin.left} ${innerMargin.top})`);

    this.circles = this.g.append('g').classed('circles-group', true);
    this.update();
  }

  /**
   * Update the d3 chart
   */
  update() {
    const { data, xScale, yScale } = this.visComponents;

    const binding = this.circles.selectAll('circle').data(data);
    const entering = binding.enter()
      .append('circle')
      .style('fill', '#c00');

    binding
      .merge(entering)
      .attr('r', 10)
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y));

    binding.exit()
      .remove();
  }

  render() {
    const { width, height } = this.props;

    return (
      <div className="line-chart">
        <svg ref={svg => { this.svg = svg; }} width={width} height={height} />
      </div>
    );
  }
 }
