import React, { PureComponent, PropTypes } from 'react';
import d3 from 'd3';
import { multiExtent, findClosestSorted } from '../../utils/array';
import { colorsFor } from '../../utils/color';
import { TextWithBackground } from '../../components';
import addComputedProps from '../../hoc/addComputedProps';

import './LineChartSmallMult.scss';

/**
 * Figure out what is needed to render the chart
 * based on the props of the component
 */
function visProps(props) {
  const {
    series,
    forceZeroMin,
    showBaseline,
    width,
    xExtent,
    xKey,
    metrics,
    smallMultHeight,
  } = props;
  let { xScale } = props;

  // padding inside the component
  const padding = {
    top: 25,
    right: 20,
    bottom: 35,
    left: 0,
  };

  // spacing around each small multiple
  const smallMultMargin = 45;

  // width for the whole drawing area
  const plotAreaWidth = width - padding.left - padding.right;

  // width for an individual small multiple
  const smallMultWidth = Math.floor(plotAreaWidth / metrics.length) - smallMultMargin;

  // height for the whole component (add enough height for each row)
  let height = padding.top + padding.bottom;
  if (series && series.length > 0) {
    height += (series.length * (smallMultHeight + smallMultMargin));
  }

  // height for the whole drawing area
  const plotAreaHeight = height - padding.top - padding.bottom;

  // scales are defined for individual small multiple dimensions
  const xMin = 0;
  const xMax = smallMultWidth;
  const yMin = smallMultHeight;
  const yMax = 0;

  // set up the domains based on extent. Use the prop if provided, otherwise calculate
  let xDomain = xExtent;
  if (!xDomain && series) {
    xDomain = multiExtent(series, d => d[xKey], oneSeries => oneSeries.results);
  }

  // setup the y scales for all our metrics
  let yScales = [];
  if (metrics && series && series.length > 0) {
    yScales = metrics.map((metric) => {
      const yExtent = multiExtent(series, d => d[metric.dataKey], oneSeries => oneSeries.results);
      if (yExtent && forceZeroMin) {
        yExtent[0] = 0;
      }
      return d3.scaleLinear()
        .domain(yExtent)
        .range([yMin, yMax]);
    });
  }

  // use the props xScale if provided, otherwise compute it
  if (!xScale) {
    xScale = d3.scaleTime().range([xMin, xMax]).clamp(true);
    if (xDomain) {
      xScale.domain(xDomain);
    }
  }

  // get colors
  let colors = {};
  if (series) {
    colors = colorsFor(series, (d) => d.meta.client_asn_number);
  }

  // create lineChunked generators for all ykeys
  let lineGens = [];
  if (yScales && yScales.length > 0) {
    lineGens = yScales.map((yScale, yIndex) =>
      // function to generate paths for each yKey
      d3.lineChunked()
        .x((d) => xScale(d[xKey]))
        .y((d) => yScale(d[metrics[yIndex].dataKey]))
        .curve(d3.curveMonotoneX)
        .defined(d => d[metrics[yIndex].dataKey] != null)
        .accessData(d => d.results)
        .lineStyles({
          // first element is baseline value
          stroke: (d, i) => ((showBaseline && i === 0) ? '#bbb' : colors[d.meta.client_asn_number]),
          'stroke-width': (d, i) => ((showBaseline && i === 0) ? 1 : 1.5),
        })
    );
  }

  return {
    colors,
    height,
    innerHeight,
    padding,
    plotAreaHeight,
    plotAreaWidth,
    smallMultWidth,
    smallMultMargin,
    lineGens,
    xScale,
    yScales,
  };
}

/**
 * A small multiple chart that uses d3 to draw. Assumes X is a time scale.
 *
 * @prop {Boolean} forceZeroMin=true Whether the min y value should always be 0.
 * @prop {Number} smallMultHeight The height in pixels an individual chart
 * @prop {String} id The ID of the SVG chart (needed for PNG export)
 * @prop {Boolean} inSvg Whether this is being nested inside an SVG, if true renders a <g>
 * @prop {Array} series The array of series data (e.g., [{ meta, results }, ...])
 * @prop {Boolean} showBaseline=true Whether the first element in series is a baseline value
 * @prop {Number} width The width in pixels of the entire small multiple
 * @prop {Array} xExtent The min and max value of the xKey in the chart
 * @prop {String} xKey="x" The key to read the x value from in the data
 * @prop {Array} metrics="y" The keys and names to read the y value from in the data
 */
class LineChartSmallMult extends PureComponent {
  static propTypes = {
    colors: PropTypes.object,
    forceZeroMin: PropTypes.bool,
    height: PropTypes.number,
    id: PropTypes.string,
    innerHeight: PropTypes.number,
    lineGens: PropTypes.array,
    metrics: PropTypes.array,
    padding: PropTypes.object,
    plotAreaWidth: PropTypes.number,
    series: PropTypes.array,
    showBaseline: PropTypes.bool,
    smallMultHeight: PropTypes.number,
    smallMultMargin: PropTypes.number,
    smallMultWidth: PropTypes.number,
    width: React.PropTypes.number,
    xExtent: PropTypes.array,
    xKey: PropTypes.string,
    xScale: PropTypes.func,
    yScales: PropTypes.array,
  }

  static defaultProps = {
    smallMultHeight: 110,
    forceZeroMin: true,
    showBaseline: true,
    xKey: 'date',
    metrics: [],
  }

  constructor(props) {
    super(props);

    this.state = {
      hover: false,
      mouse: [0, 0],
    };

    // Holds refs to chart nodes for line updating.
    this.chartNodes = {};

    // holds refs to backgrounds of charts so we can do
    // mouseover with d3.mouse
    this.backgroundNodes = {};

    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
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
   * Mouse over callback
   */
  onMouseOver() {
    this.setState({ hover: true });
  }

  /**
   * Mouse out callback
   */
  onMouseOut() {
    this.setState({ hover: false });
  }

  /**
   * Mouse move callback. gets mouse position relative to chart and
   * save it in state.
   * @param {Array} mouse Mouse [x,y] position relative to chart
   */
  onMouseMove(mouse) {
    this.setState({ mouse });
  }

  /**
   * Initialize the d3 chart - this is run once on mount
   */
  setup() {
    this.update();
  }

  /**
   * Update the d3 chart - this is the main drawing function
   */
  update() {
    const { series, metrics } = this.props;

    // Iterates through data, using line generators to update charts.
    series.forEach((s, sIndex) => {
      metrics.forEach((metric, keyIndex) => {
        this.updateChart(s, sIndex, metric, keyIndex);
      });
    });
  }

  /**
   * Renders a chart given series data and a metric
   */
  updateChart(s, sIndex, metric, keyIndex) {
    const { series, lineGens, showBaseline, smallMultHeight, xScale } = this.props;
    const seriesId = s.meta.id;
    const chartId = `${seriesId}-${metric.dataKey}`;

    // get appropriate chart node
    const chart = d3.select(this.chartNodes[chartId]);

    const data = [s];
    if (showBaseline && sIndex > 0) {
      data.unshift(series[0]);
    }

    // add in axis line
    let axisLine = chart.select('.axis-line');
    if (axisLine.empty()) {
      axisLine = chart.append('line').attr('class', 'axis-line');
    }
    axisLine
      .attr('x1', xScale.range()[0])
      .attr('x2', xScale.range()[1])
      .attr('y1', smallMultHeight + 3)
      .attr('y2', smallMultHeight + 3);

    // BIND
    const binding = chart.selectAll('g').data(data);

    // ENTER
    const entering = binding.enter().append('g');

    // MERGE
    binding.merge(entering)
      .transition()
      .call(lineGens[keyIndex]);

    // EXIT
    binding.exit().remove();

    // handle mouse over
    const that = this;
    d3.select(this.backgroundNodes[chartId])
      .on('mousemove', function mouseMoveListener() {
        that.onMouseMove(d3.mouse(this));
      })
      .on('mouseover', this.onMouseOver)
      .on('mouseout', this.onMouseOut);
  }

  /**
   * React style building of chart
   */
  renderChart(series, seriesIndex, yKey, metricIndex) {
    const { smallMultWidth, smallMultMargin } = this.props;

    const seriesId = series.meta.id;
    const chartId = `${seriesId}-${yKey}`;

    // offset by circle radius so it doesn't get clipped
    const circleRadius = 3;
    const xPos = ((smallMultWidth + smallMultMargin) * metricIndex) + circleRadius;
    const chartHeaderHeight = 27;

    return (
      <g key={chartId} transform={`translate(${xPos},${chartHeaderHeight})`} >
        <g
          id={chartId}
          ref={node => { this.chartNodes[chartId] = node; }}
        />
      {this.renderChartLabels(series, chartId, seriesIndex, yKey, metricIndex)}
      {this.renderChartBackground(chartId)}
      </g>
    );
  }

  /**
   * React style addition of labels on mouseover
   */
  renderChartLabels(series, chartId, seriesIndex, yKey, metricIndex) {
    const { hover, mouse } = this.state;
    const { xScale, yScales, colors, xKey, showBaseline, metrics, smallMultWidth } = this.props;

    // find the value closest to the mouse's x coordinate
    const closest = findClosestSorted(series.results, mouse[0], d => xScale(d[xKey]));
    const xValue = closest[xKey];
    const yValue = closest[yKey];

    const color = ((showBaseline && seriesIndex === 0) ? '#bbb' : colors[series.meta.client_asn_number]);
    const lightColor = d3.color(color).brighter(0.3);

    const metric = metrics[metricIndex];
    const yFormatter = metric.formatter || (d => d);
    const unit = metric.unit === '%' ? undefined : metric.unit;

    if (hover && yValue) {
      // determine text anchor based on how close to the edges it is
      const xPosition = xScale(xValue);
      let textAnchor = 'middle';
      if (xPosition < smallMultWidth / 4 && metricIndex === 0) {
        textAnchor = 'start';
      } else if (xPosition > (3 * smallMultWidth) / 4 && metricIndex === metrics.length - 1) {
        textAnchor = 'end';
      }

      return (
        <g transform={`translate(${xPosition} ${yScales[metricIndex](yValue)})`}>
          <TextWithBackground
            x={0}
            y={-11}
            dy={3}
            dx={6}
            textAnchor={textAnchor}
            textClassName="small-mult-label small-mult-hover-label"
            background="#fff"
            padding={{ top: 3, bottom: 3, left: 3, right: 3 }}
          >
            {`${yFormatter(yValue)}${unit ? ` ${unit}` : ''}`}
          </TextWithBackground>
          <circle cx={0} cy={0} r={3} fill={lightColor} stroke={color} />
        </g>
      );
    }

    return null;
  }

  /**
   * React style addition of mouseover box
   */
  renderChartBackground(chartId) {
    const { smallMultWidth, smallMultHeight, smallMultMargin } = this.props;
    return (
      <rect
        className="small-mult-chart-background"
        key={chartId}
        ref={node => { this.backgroundNodes[chartId] = node; }}
        x={0}
        y={0}
        width={smallMultWidth + smallMultMargin}
        height={smallMultHeight}
        fill="none"
        pointerEvents="all"
      />
    );
  }

  /**
   * React style building of row of data
   */
  renderSeries(series, seriesIndex) {
    const { metrics, smallMultHeight, smallMultMargin, showBaseline } = this.props;

    const yPos = (smallMultHeight + smallMultMargin) * seriesIndex;
    // position text below charts for now
    const yPosText = 0;
    const seriesKey = series.meta.id;
    const seriesName = (showBaseline && seriesIndex === 0) ? series.meta.client_city : series.meta.client_asn_name;

    return (
      <g
        key={seriesKey}
        className="small-mult-row"
        transform={`translate(${0},${yPos})`}
      >
        <text
          className="small-mult-label small-mult-name"
          y={yPosText}
          dy={16}
        >
          {seriesName}
        </text>
        {metrics.map((metric, i) => this.renderChart(series, seriesIndex, metric.dataKey, i))}
      </g>
    );
  }

  /**
   * React style label creation
   */
  renderLabels() {
    const { smallMultWidth, smallMultMargin, metrics } = this.props;
    const labels = metrics.map((metric, index) => {
      const xPos = ((smallMultWidth + smallMultMargin) * index);
      return (
        <text
          key={metric.dataKey}
          className="small-mult-title"
          x={xPos}
          y={0}
          dy={18}
          textAnchor="start"
        >{metric.label}</text>

      );
    });

    return (
      <g>
        {labels}
      </g>
    );
  }

  /**
   * React style rect creation for background
   */
  renderBackground(width, height) {
    return (
      <rect
        width={width}
        height={height}
        x={0}
        y={0}
        fill="white"
      />
    );
  }

  /**
   * The main render method. Defers chart rendering to d3 in `update` and `setup`
   * @return {React.Component} The rendered container
   */
  render() {
    const { id, series } = this.props;

    const { padding, width, height } = this.props;

    return (
      <div className="LineChartSmallMult">
        <svg
          id={id}
          className="small-mult-svg chart"
          height={height}
          ref={node => { this.root = node; }}
          width={width}
        >
          {this.renderBackground(width, height)}
          {this.renderLabels()}
          <g
            transform={`translate(0,${padding.top})`}
          >
            {series.map((s, i) => this.renderSeries(s, i))}
          </g>
        </svg>
      </div>
    );
  }
}

export default addComputedProps(visProps)(LineChartSmallMult);
