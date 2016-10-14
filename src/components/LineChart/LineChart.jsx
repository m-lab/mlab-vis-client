import React, { PureComponent, PropTypes } from 'react';
import d3 from 'd3';
import { multiExtent, findClosestSorted, findEqualSorted } from '../../utils/array';
import { colorsFor } from '../../utils/color';
import { Legend } from '../../d3-components';
import addComputedProps from '../../hoc/addComputedProps';

import './LineChart.scss';

/**
 * Figure out what is needed to render the chart
 * based on the props of the component
 */
function visProps(props) {
  const {
    idKey,
    labelKey,
    series,
    forceZeroMin,
    height,
    paddingLeft = 50,
    paddingRight = 20,
    width,
    xExtent,
    xKey,
    yExtent,
    yKey,
    yFormatter,
  } = props;
  let {
    colors,
    annotationSeries,
    xScale,
  } = props;


  // ensure annotation series is an array
  if (annotationSeries && !Array.isArray(annotationSeries)) {
    annotationSeries = [annotationSeries];
  }

  // initialize a color scale unless one was provided
  if (series && !colors) {
    colors = colorsFor(series, (d) => d.meta[idKey]);
  }

  const padding = {
    top: 20,
    right: paddingRight,
    bottom: 40,
    left: paddingLeft,
  };

  const plotAreaWidth = width - padding.left - padding.right;

  // compute legend properties and make room for it at the top.
  const legend = new Legend({
    data: (series || []).concat(annotationSeries || []),
    colors,
    formatter: yFormatter,
    width: plotAreaWidth,
    idKey,
    labelKey,
  });

  padding.top += legend.height;

  const plotAreaHeight = height - padding.top - padding.bottom;

  const xMin = 0;
  const xMax = plotAreaWidth;
  const yMin = plotAreaHeight;
  const yMax = 0;

  // set up the domains based on extent. Use the prop if provided, otherwise calculate
  let xDomain = xExtent;
  if (!xDomain) {
    xDomain = multiExtent([...series, ...annotationSeries], d => d[xKey], oneSeries => oneSeries.results);
  }
  let yDomain = yExtent;
  if (!yDomain) {
    yDomain = multiExtent([...series, ...annotationSeries], d => d[yKey], oneSeries => oneSeries.results);
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


  // function to generate paths for each series
  const lineChunked = d3.lineChunked()
    .x((d) => xScale(d[xKey]))
    .y((d) => yScale(d[yKey]))
    .curve(d3.curveMonotoneX)
    .defined(d => d[yKey] != null)
    .accessData(d => d.results)
    .lineStyles({
      stroke: (d) => colors[d.meta[idKey]] || '#aaa',
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


  return {
    annotationLineChunked,
    annotationSeries,
    colors,
    plotAreaHeight,
    padding,
    plotAreaWidth,
    legend,
    lineChunked,
    xScale,
    yScale,
  };
}

/**
 * A line chart that uses d3 to draw. Assumes X is a time scale.
 *
 * @prop {Object} colors Obect mapping series IDs to colors
 * @prop {Boolean} forceZeroMin=true Whether the min y value should always be 0.
 * @prop {Number} height The height in pixels of the SVG chart
 * @prop {String} id The ID of the SVG chart (needed for PNG export)
 * @prop {Boolean} inSvg Whether this is being nested inside an SVG, if true renders a <g>
 * @prop {Object} highlightDate The date being highlighted in the chart
 * @prop {Object} highlightLine The line being highlighted in the chart
 * @prop {Function} onHighlightDate Callback when the mouse moves across the main area of the chart
 *   passes in the hovered upon date
 * @prop {Function} onHighlightLine Callback when a series is highlighted
 * @prop {Array} series The array of series data (e.g., [{ meta, results }, ...])
 * @prop {Number} width The width in pixels of the SVG chart
 * @prop {Array} xExtent The min and max value of the xKey in the chart
 * @prop {String} xKey="x" The key to read the x value from in the data
 * @prop {Array} yExtent The min and max value of the yKey in the chart
 * @prop {Function} yFormatter Format function that takes a y value and outputs a string
 * @prop {String} yAxisLabel The label to show on the Y axis
 * @prop {String} yAxisUnit The unit to show on the Y axis label
 * @prop {String} yKey="y" The key to read the y value from in the data
 */
class LineChart extends PureComponent {
  static propTypes = {
    annotationLineChunked: React.PropTypes.func,
    annotationSeries: PropTypes.array,
    colors: PropTypes.object,
    forceZeroMin: PropTypes.bool,
    height: React.PropTypes.number,
    highlightDate: React.PropTypes.object,
    highlightLine: React.PropTypes.object,
    id: React.PropTypes.string,
    idKey: React.PropTypes.string,
    inSvg: React.PropTypes.bool,
    labelKey: React.PropTypes.string,
    legend: React.PropTypes.object,
    lineChunked: React.PropTypes.func,
    onHighlightDate: React.PropTypes.func,
    onHighlightLine: React.PropTypes.func,
    padding: PropTypes.object,
    plotAreaHeight: PropTypes.number,
    plotAreaWidth: PropTypes.number,
    series: PropTypes.array,
    width: React.PropTypes.number,
    xExtent: PropTypes.array,
    xKey: React.PropTypes.string,
    xScale: PropTypes.func,
    yAxisLabel: React.PropTypes.string,
    yAxisUnit: React.PropTypes.string,
    yExtent: PropTypes.array,
    yFormatter: PropTypes.func,
    yKey: React.PropTypes.string,
    yScale: PropTypes.func,
  }

  static defaultProps = {
    forceZeroMin: true,
    idKey: 'id',
    labelKey: 'label',
    xKey: 'x',
    yFormatter: d => d,
    yKey: 'y',
  }

  constructor(...args) {
    super(...args);

    // bind handlers
    this.onHoverLegendEntry = this.onHoverLegendEntry.bind(this);
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
   * Callback for when the mouse hovers over a legend entry
   *
   * @param {Object} oneSeries an item from the series array or annotationSeries array
   * @return {void}
   */
  onHoverLegendEntry(oneSeries) {
    const { onHighlightLine } = this.props;
    if (onHighlightLine) {
      onHighlightLine(oneSeries);
    }
  }

  /**
   * Callback for when the user moves the mouse across
   *
   * @param {Array} mouse the [x, y] mouse coordinates in chart space (pixels)
   * @return {void}
   */
  onMouseMove(mouse) {
    const { onHighlightDate, series, xScale, xKey } = this.props;

    if (!onHighlightDate) {
      return;
    }

    if (mouse === null) {
      // mouse out
      onHighlightDate(null);
      return;
    }

    let closest;
    // moving around, find nearest x value.
    if (series && series.length) {
      const [mouseX] = mouse;
      const checkSeries = series[0];
      closest = findClosestSorted(checkSeries.results, mouseX, d => xScale(d[xKey]))[xKey];
    }

    onHighlightDate(closest);
  }

  /**
   * Initialize the d3 chart - this is run once on mount
   */
  setup() {
    const { height, width, plotAreaHeight } = this.props;

    // add in white background for saving as PNG
    d3.select(this.root).append('rect')
      .classed('chart-background', true)
      .attr('width', width)
      .attr('height', height)
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', '#fff');

    this.g = d3.select(this.root)
      .append('g'); // transformed to have margin in update()


    this.legendContainer = this.g.append('g').classed('legend', true);

    // add in axis groups
    this.xAxis = this.g.append('g').classed('x-axis', true);
    this.xAxisLabel = this.g.append('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle');

    this.yAxis = this.g.append('g').classed('y-axis', true);
    this.yAxisLabel = this.g.append('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle');

    // add in groups for data
    this.annotationLines = this.g.append('g').classed('annotation-lines-group', true);
    this.lines = this.g.append('g').classed('lines-group', true);
    this.circles = this.g.append('g').classed('circles-group', true);

    // container for showing the x highlighte date indicator
    this.highlightDate = this.g.append('g').attr('class', 'highlight-date');
    this.highlightDate.append('line')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 0)
      .attr('y2', plotAreaHeight + 3)
      .attr('class', 'highlight-ref-line');
    // add in a rect to fill out the area beneath the hovered on X date
    this.highlightDate.append('rect')
      .attr('x', -45)
      .attr('width', 90)
      .attr('y', 0) // should be set to plotAreaHeight
      .attr('height', 20)
      .style('fill', '#fff');
    this.highlightDate.append('text')
      .attr('class', 'highlight-x')
      .attr('dy', 17)
      .attr('text-anchor', 'middle');

    // container for showing the highlighted line
    this.highlightLine = this.g.append('g').attr('class', 'highlight-line');
    this.highlightLine.append('rect').attr('class', 'series-overlay');
    this.highlightLine.append('g');

    // add in mouse listener -- this should be added above the lines and axes
    const that = this;
    this.mouseListener = this.g.append('rect')
      .attr('class', 'mouse-listener')
      .style('fill', '#f00')
      .style('stroke', 'none')
      .style('opacity', 0)
      .on('mousemove', function mouseMoveListener() {
        that.onMouseMove.call(that, d3.mouse(this));
      })
      .on('mouseout', () => this.onMouseMove(null));


    this.update();
  }

  getYAxisLabel() {
    const { yAxisLabel, yAxisUnit } = this.props;
    return `${yAxisLabel}${yAxisUnit ? ` (${yAxisUnit})` : ''}`;
  }

  /**
   * Update the d3 chart - this is the main drawing function
   */
  update() {
    const { highlightDate, series = [], annotationSeries = [], xKey, padding,
      plotAreaHeight, plotAreaWidth } = this.props;

    // ensure we have room for the legend
    this.g.attr('transform', `translate(${padding.left} ${padding.top})`);
    this.mouseListener
      .attr('width', plotAreaWidth)
      .attr('height', plotAreaHeight + 25); // plus some to cover part of the x axis

    // see what the values are for the highlighted date if we have one
    let highlightValues;
    if (highlightDate != null) {
      // find the y value for the highlighted date
      highlightValues = series.concat(annotationSeries).map(oneSeries => {
        const value = findEqualSorted(oneSeries.results, highlightDate.unix(), d => d[xKey].unix());
        return value;
      });
    }

    this.updateLegend(highlightValues);
    this.updateAxes();
    this.updateAnnotationLines();
    this.updateLines();
    this.updateHighlightDate(highlightValues);
    this.updateHighlightLine();
  }

  updateHighlightDate(highlightValues) {
    const { highlightDate, xScale, plotAreaHeight, yScale, yKey, series, colors, idKey } = this.props;

    // render the x-axis marker for highlightDate
    if (highlightDate == null) {
      this.highlightDate.style('display', 'none');
    } else {
      this.highlightDate
        .style('display', '')
        .attr('transform', `translate(${xScale(highlightDate)} 0)`);
      this.highlightDate.select('line')
        .attr('y2', plotAreaHeight + 3);

      this.highlightDate.select('rect')
        .attr('y', plotAreaHeight + 4);

      this.highlightDate.select('text')
        .attr('y', plotAreaHeight + 3)
        .text(highlightDate.format('MMM D YYYY'));

      const points = this.highlightDate.selectAll('circle').data(highlightValues);
      points.exit().remove();
      const entering = points.enter().append('circle');

      // don't filter out d values so we can use `i` to get the color
      points.merge(entering)
        .attr('class', 'highlight-circle')
        .style('display', d => ((d == null || d[yKey] == null) ? 'none' : ''))
        .attr('r', 3)
        .attr('cx', 0)
        .style('fill', (d, i) => {
          if (series[i] && colors[series[i].meta[idKey]]) {
            return d3.color(colors[series[i].meta[idKey]]).brighter(0.3);
          }

          return '#bbb';
        })
        .style('stroke', (d, i) => {
          if (series[i] && colors[series[i].meta[idKey]]) {
            return colors[series[i].meta[idKey]];
          }

          return '#aaa';
        })
        .attr('cy', d => (d == null ? 0 : yScale(d[yKey]) || 0));
    }
  }

  updateHighlightLine() {
    // render the highlight line
    const { highlightLine, lineChunked, plotAreaWidth, plotAreaHeight } = this.props;

    if (!highlightLine) {
      this.highlightLine.style('display', 'none');
    } else {
      this.highlightLine.style('display', '');
      this.highlightLine.select('g').datum(highlightLine).call(lineChunked);
      this.highlightLine.select('.series-overlay')
        .attr('width', plotAreaWidth)
        .attr('height', plotAreaHeight);
    }
  }

  updateLegend(highlightValues) {
    const { highlightLine, legend, yKey } = this.props;

    this.legendContainer.attr('transform', `translate(0 ${-legend.height})`);

    // map to just Y values
    const highlightYValues = highlightValues && highlightValues.map(d => (d == null ? d : d[yKey]));

    legend.render(this.legendContainer, highlightYValues, this.onHoverLegendEntry, highlightLine);
  }

  /**
   * Render the x and y axis components
   */
  updateAxes() {
    const { xScale, yScale, plotAreaHeight, padding, plotAreaWidth, yKey, yFormatter } = this.props;
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

    // use default formatter unless retransmit_avg since we want percentages rendered
    if (yKey === 'retransmit_avg') {
      yAxis.tickFormat(yFormatter);
    }

    this.yAxis.call(yAxis);
    this.yAxisLabel
      .attr('transform', `rotate(270) translate(${-plotAreaHeight / 2} ${-padding.left + 12})`)
      .text(this.getYAxisLabel());

    this.xAxis
      .attr('transform', `translate(0 ${plotAreaHeight + 3})`)
      .call(xAxis);

    this.xAxisLabel
      .attr('transform', `translate(${plotAreaWidth / 2} ${plotAreaHeight + (padding.bottom)})`)
      .text('Time');
  }

  /**
   * Render the lines in the chart
   */
  updateLines() {
    const { series, lineChunked } = this.props;

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
  updateAnnotationLines() {
    const { annotationSeries, annotationLineChunked } = this.props;

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

export default addComputedProps(visProps, { changeExclude: ['highlightDate'] })(LineChart);
