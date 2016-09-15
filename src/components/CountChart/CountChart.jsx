import React, { PureComponent, PropTypes } from 'react';
import d3 from 'd3';

import './CountChart.scss';

/**
 * This chart is intended to be used paired with another chart. It
 * shares the same x-axis, width, margin left and margin right as the
 * other chart.
 *
 * @prop {String} highlightColor Color used to render the highlighted bars if provided
 * @prop {Object} highlightCount The date being highlighted in the chart
 * @prop {Array} highlightData Used to highlight a subset of the count data (typically a series object with { meta, results })
 * @prop {Function} onHighlightCount Callback when the mouse hovers over a bar. Passes in the x value.
 */
export default class CountChart extends PureComponent {

  static propTypes = {
    data: PropTypes.array,
    height: PropTypes.number,
    highlightColor: PropTypes.string,
    highlightCount: PropTypes.object,
    highlightData: PropTypes.array,
    innerMarginLeft: PropTypes.number,
    innerMarginRight: PropTypes.number,
    numBins: PropTypes.number,
    onHighlightCount: PropTypes.func,
    width: PropTypes.number,
    xExtent: PropTypes.array,
    xKey: React.PropTypes.string,
    xScale: React.PropTypes.func,
    yExtent: PropTypes.array,
    yKey: React.PropTypes.string,
    maxBinWidth: React.PropTypes.number,
  };

  static defaultProps = {
    data: [],
    xKey: 'x',
    yKey: 'count',
    highlightColor: '#aaa',
    maxBinWidth: 40,
  };

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
   * callback for when mouse hovers over a count bar
   */
  onHoverCountBar(xValue) {
    const { onHighlightCount } = this.props;
    if (onHighlightCount) {
      onHighlightCount(xValue);
    }
  }

  /**
   * Initialize the d3 chart - this is run once on mount
   */
  setup() {
    const { width, height, innerMargin, innerHeight, innerWidth } = this.visComponents;

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
    this.yAxis = this.g.append('g').classed('y-axis', true);
    this.yAxisLabel = this.g.append('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle');

    // render a line for the x-axis (no ticks)
    this.xAxis = this.g.append('g').classed('x-axis', true)
      .attr('transform', `translate(0 ${innerHeight})`);

    this.xAxis.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth);

    // add in groups for data
    this.bars = this.g.append('g').classed('bars-group', true);
    this.highlightBars = this.g.append('g').classed('highlight-bars-group', true);

    this.highlightCountBar = this.g.append('g').attr('class', 'highlight-count-bar');
    this.highlightCountBar.append('rect');
    this.highlightCountBar.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 12);

    this.update();
  }

  makeVisComponents(props) {
    const { height, innerMarginLeft = 50, innerMarginRight = 20, width, xKey,
      xExtent, yExtent, yKey, data, numBins, maxBinWidth } = props;
    let { xScale } = props;

    const innerMargin = {
      top: 10,
      right: innerMarginRight,
      bottom: 10,
      left: innerMarginLeft,
    };

    const innerWidth = width - innerMargin.left - innerMargin.right;
    const innerHeight = height - innerMargin.top - innerMargin.bottom;

    const xMin = 0;
    const xMax = innerWidth;
    const yMin = innerHeight;
    const yMax = 0;

    // set up the domains based on extent. Use the prop if provided, otherwise calculate
    const xDomain = xExtent || d3.extent(data, d => d[xKey]);
    let yDomain = yExtent || d3.extent(data, d => d[yKey]);

    // use the props xScale if provided, otherwise compute it
    if (!xScale) {
      xScale = d3.scaleLinear().domain(xDomain).range([xMin, xMax]);
    }

    // force a zero minimum
    yDomain = [0, yDomain[1]];

    // ensure a minimum y-domain size to prevent full sized rects at 0 value
    if (yDomain[0] === yDomain[1]) {
      yDomain = [yDomain[0], yDomain[0] + 1];
    }

    const yScale = d3.scaleLinear().domain(yDomain).range([yMin, yMax]);
    const binWidth = Math.min(maxBinWidth,
        (xMax - xMin) / (numBins || data.length));

    return {
      binWidth,
      data,
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
    this.renderMainBars();
    this.renderHighlightBars();
    this.renderHighlightCountBar();
  }

  /**
   * Render the x and y axis components
   */
  renderAxes() {
    const { yScale, innerHeight, innerMargin } = this.visComponents;
    const yAxis = d3.axisLeft(yScale).ticks(4).tickSizeOuter(0);

    this.yAxis.call(yAxis);
    this.yAxisLabel
      .attr('transform', `rotate(270) translate(${-innerHeight / 2} ${-innerMargin.left + 12})`)
      .text('Test Count');
  }

  /**
   * Render the main count bars (not the highlight ones)
   */
  renderMainBars() {
    const { data } = this.visComponents;

    this.renderBars(this.bars, data, '#ccc', true);
  }

  /**
   * Render the highlight count bars
   */
  renderHighlightBars() {
    const { highlightData, highlightColor } = this.props;

    this.renderBars(this.highlightBars, highlightData, highlightColor);
  }

  /**
   * Helper function to render the rects
   */
  renderBars(root, data = [], color = '#ccc', addHandlers) {
    const {
      xKey,
      xScale,
      yKey,
      yScale,
      binWidth,
      innerHeight,
    } = this.visComponents;

    const d3Color = d3.color(color);
    const lighterColor = d3Color ? d3Color.brighter(0.3) : undefined;

    const binding = root.selectAll('rect').data(data);

    // ENTER
    const entering = binding.enter()
      .append('rect')
        .attr('x', d => xScale(d[xKey]))
        .attr('y', yScale(0))
        .attr('width', binWidth)
        .attr('height', 0)
        .style('shape-rendering', 'crispEdges')
        .style('fill', d => (d.belowThreshold ? '#fff' : lighterColor))
        .style('stroke', d => (d.belowThreshold ? '#ddd' : color));

    if (addHandlers) {
      entering
        .on('mouseenter', d => this.onHoverCountBar(d[xKey]))
        .on('mouseleave', () => this.onHoverCountBar(null));
    }

    // ENTER + UPDATE
    binding.merge(entering)
      .attr('x', d => xScale(d[xKey]))
      .attr('width', binWidth)
      .transition()
        .attr('y', d => yScale(d[yKey] || 0))
        .attr('height', d => innerHeight - yScale(d[yKey] || 0))
        .style('fill', d => (d.belowThreshold ? '#fff' : lighterColor))
        .style('stroke', d => (d.belowThreshold ? '#ddd' : color));


    // EXIT
    binding.exit()
      .remove();
  }

  /**
   * Render the highlighted count bar
   */
  renderHighlightCountBar() {
    const { highlightCount } = this.props;
    const {
      data,
      xKey,
      xScale,
      yKey,
      yScale,
      binWidth,
      innerHeight,
    } = this.visComponents;

    if (highlightCount == null) {
      this.highlightCountBar.style('display', 'none');
    } else {
      const d = data.find(datum => datum[xKey] === highlightCount);
      this.highlightCountBar
        .style('display', '')
        .attr('transform', `translate(${xScale(d[xKey])} ${yScale(d[yKey] || 0)})`);

      const barHeight = innerHeight - yScale(d[yKey] || 0);
      this.highlightCountBar.select('rect')
        .attr('width', binWidth)
        .attr('height', barHeight)
        .style('fill', '#ccc')
        .style('stroke', '#aaa');

      this.highlightCountBar.select('text')
        .attr('x', binWidth / 2)
        .attr('y', barHeight < 15 ? -14 : 0)
        .text(d[yKey]);
    }
  }

  /**
   * The main render method. Defers chart rendering to d3 in `update` and `setup`
   * @return {React.Component} The rendered container
   */
  render() {
    return (
      <g className="CountChart chart" ref={node => { this.root = node; }} />
    );
  }
}
