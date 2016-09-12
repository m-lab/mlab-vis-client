import React, { PureComponent, PropTypes } from 'react';
import d3 from 'd3';
import { multiExtent } from '../../utils/array';
import { colorsFor } from '../../utils/color';

import './LineChart.scss';

/**
 * A line chart that uses d3 to draw. Assumes X is a time scale.
 *
 * @prop {Boolean} forceZeroMin=true Whether the min y value should always be 0.
 * @prop {Number} height The height in pixels of the SVG chart
 * @prop {String} id The ID of the SVG chart (needed for PNG export)
 * @prop {Boolean} inSvg Whether this is being nested inside an SVG, if true renders a <g>
 * @prop {Array} series The array of series data (e.g., [{ meta, results }, ...])
 * @prop {Number} width The width in pixels of the SVG chart
 * @prop {Array} xExtent The min and max value of the xKey in the chart
 * @prop {String} xKey="x" The key to read the x value from in the data
 * @prop {Array} yExtent The min and max value of the yKey in the chart
 * @prop {String} yKey="y" The key to read the y value from in the data
 */
export default class LineChart extends PureComponent {
  static propTypes = {
    forceZeroMin: PropTypes.bool,
    height: React.PropTypes.number,
    id: React.PropTypes.string,
    inSvg: React.PropTypes.bool,
    series: PropTypes.array,
    width: React.PropTypes.number,
    xExtent: PropTypes.array,
    xKey: React.PropTypes.string,
    yExtent: PropTypes.array,
    yKey: React.PropTypes.string,
  }

  static defaultProps = {
    forceZeroMin: true,
    xKey: 'x',
    yKey: 'y',
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
    this.yAxis = this.g.append('g').classed('y-axis', true);

    // add in groups for data
    this.annotationLines = this.g.append('g').classed('annotation-lines-group', true);
    this.lines = this.g.append('g').classed('lines-group', true);
    this.circles = this.g.append('g').classed('circles-group', true);

    this.update();
  }

  /**
   * Figure out what is needed to render the chart
   * based on the props of the component
   */
  makeVisComponents(props) {
    const { series, forceZeroMin, height, innerMarginLeft = 50,
      innerMarginRight = 20, width, xExtent, xKey, yExtent, yKey } = props;
    let { annotationSeries, xScale } = props;

    const innerMargin = {
      top: 20,
      right: innerMarginRight,
      bottom: 35,
      left: innerMarginLeft,
    };

    const innerWidth = width - innerMargin.left - innerMargin.right;
    const innerHeight = height - innerMargin.top - innerMargin.bottom;

    const xMin = 0;
    const xMax = innerWidth;
    const yMin = innerHeight;
    const yMax = 0;

    // set up the domains based on extent. Use the prop if provided, otherwise calculate
    let xDomain = xExtent;
    if (!xDomain && series) {
      xDomain = multiExtent(series, d => d[xKey], oneSeries => oneSeries.results);
    }
    let yDomain = yExtent;
    if (!yDomain && series) {
      yDomain = multiExtent(series, d => d[yKey], oneSeries => oneSeries.results);
    }

    // force 0 as the min in the yDomain if specified
    if (forceZeroMin) {
      yDomain = [0, yDomain ? yDomain[1] : 1];
    }

    // use the props xScale if provided, otherwise compute it
    if (!xScale) {
      xScale = d3.scaleTime().range([xMin, xMax]);
      if (xDomain) {
        xScale.domain(xDomain);
      }
    }
    const yScale = d3.scaleLinear().range([yMin, yMax]);
    if (yDomain) {
      yScale.domain(yDomain);
    }

    // initialize a color scale
    let colors = {};
    if (series) {
      colors = colorsFor(series, (d) => d.meta.client_asn_number);
    }

    // function to generate paths for each series
    const lineChunked = d3.lineChunked()
      .x((d) => xScale(d[xKey]))
      .y((d) => yScale(d[yKey]))
      .curve(d3.curveLinear)
      .defined(d => d[yKey] != null)
      .accessData(d => d.results)
      .lineStyles({
        stroke: (d) => colors[d.meta.client_asn_number],
        'stroke-width': 1.5,
      });

    // function to generate paths for each annotation series
    const annotationLineChunked = d3.lineChunked()
      .x(lineChunked.x())
      .y(lineChunked.y())
      .curve(lineChunked.curve())
      .defined(lineChunked.defined())
      .accessData(lineChunked.accessData())
      .lineStyles({
        stroke: '#aaa',
        'stroke-width': 1,
      });

    // ensure annotation series is an array
    if (annotationSeries && !Array.isArray(annotationSeries)) {
      annotationSeries = [annotationSeries];
    }

    return {
      annotationLineChunked,
      annotationSeries,
      colors,
      height,
      innerHeight,
      innerMargin,
      innerWidth,
      lineChunked,
      series,
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
    this.renderAnnotationLines();
    this.renderLines();
  }
  /**
   * Render the x and y axis components
   */
  renderAxes() {
    const { xScale, yScale, innerHeight } = this.visComponents;
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    this.yAxis.call(yAxis);

    this.xAxis
      .attr('transform', `translate(0 ${innerHeight + 3})`)
      .call(xAxis);
  }

  /**
   * Render the lines in the chart
   */
  renderLines() {
    const { series, lineChunked } = this.visComponents;

    if (!series) {
      this.lines.selectAll('*').remove();
      return;
    }

    const binding = this.lines.selectAll('g').data(series);

    // ENTER
    const entering = binding.enter().append('g');

    // ENTER + UPDATE
    binding.merge(entering)
      .transition()
      .call(lineChunked);

    // EXIT
    binding.exit().remove();
  }

  /**
   * Render the annotation lines in the chart
   */
  renderAnnotationLines() {
    const { annotationSeries, annotationLineChunked } = this.visComponents;

    if (!annotationSeries) {
      this.annotationLines.selectAll('*').remove();
      return;
    }

    const binding = this.annotationLines.selectAll('g').data(annotationSeries);

    // ENTER
    const entering = binding.enter().append('g');

    // ENTER + UPDATE
    binding.merge(entering)
      .transition()
      .call(annotationLineChunked);

    // EXIT
    binding.exit().remove();
  }

  /**
   * The main render method. Defers chart rendering to d3 in `update` and `setup`
   * @return {React.Component} The rendered container
   */
  render() {
    const { height, id, inSvg, width } = this.props;

    if (inSvg) {
      return (
        <g
          className="line-chart chart"
          ref={node => { this.root = node; }}
        />
      );
    }

    return (
      <div>
        <svg
          id={id}
          className="line-chart chart"
          height={height}
          ref={node => { this.root = node; }}
          width={width}
        />
      </div>
    );
  }
 }
