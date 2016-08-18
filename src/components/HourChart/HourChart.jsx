import React, { PureComponent, PropTypes } from 'react';
import { groupBy } from 'lodash';
import d3 from 'd3';

import './HourChart.scss';

/**
 * Chart for showing data by hour
 *
 * @prop {Array} data The array of data points indexed by hour. Should be
 *   an array of length 24 of form [{ hour:Number(0..23), points: [{ yKey:Number }, ...]}, ...]
 * @prop {Boolean} forceZeroMin=true Whether the min y value should always be 0.
 * @prop {Number} height The height of the chart
 * @prop {Object} highlightPoint The point being highlighted in the chart
 * @prop {Function} onHighlightPoint Callback for when a point is hovered on
 * @prop {Number} width The width of the chart
 * @prop {Array} yExtent The min and max value of the yKey in the chart
 * @prop {String} yKey="y" The key in the data points to read the y value from
 */
export default class HourChart extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    forceZeroMin: PropTypes.bool,
    height: PropTypes.number,
    highlightPoint: PropTypes.object,
    onHighlightPoint: PropTypes.func,
    width: PropTypes.number,
    yExtent: PropTypes.array,
    yKey: PropTypes.string,
  }

  static defaultProps = {
    data: [],
    forceZeroMin: true,
    yKey: 'y',
  }

  /**
   * Main constructor. Bind handlers here.
   */
  constructor(props) {
    super(props);
    this.handleCircleMouseEnter = this.handleCircleMouseEnter.bind(this);
    this.handleCircleMouseLeave = this.handleCircleMouseLeave.bind(this);
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

    this.lines = this.g.append('g').classed('lines', true);
    this.circles = this.g.append('g').classed('circles', true);
    this.xAxis = this.g.append('g').classed('x-axis', true);
    this.yAxis = this.g.append('g').classed('y-axis', true);

    // setup highlight group
    this.gHighlight = this.g.append('g').classed('highlight', true);
    this.gHighlight.append('g').classed('highlight-line', true);

    this.update();
  }


  /**
   * Filter the data and group it by hour and by date
   * @param {Object} props the component props
   * @return {Object} the prepared data { filteredData, dataByHour, dataByDate }
   */
  prepareData(props) {
    const { data, yKey } = props;

    // filter so all data has a value for yKey
    const filteredData = (data || []).map(d => ({
      ...d,
      points: d.points ? d.points.filter(point => point[yKey] != null) : [],
    }));

    // produce the byHour array
    const groupedByHour = groupBy(filteredData, 'hour');
    // use d3.range(24) instead of Object.keys to ensure we get an entry for each hour
    const dataByHour = d3.range(24).map(hour => {
      const hourPoints = groupedByHour[hour];
      return {
        hour,
        points: hourPoints || [],
      };
    });

    // produce the byDate array
    const groupedByDate = groupBy(filteredData, 'date');
    const dataByDate = Object.keys(groupedByDate).reduce((byDate, date) => {
      const datePoints = groupedByDate[date];
      byDate[date] = {
        date,
        points: datePoints || [],
      };

      return byDate;
    }, {});

    return {
      filteredData,
      dataByHour,
      dataByDate,
    };
  }


   /**
   * Figure out what is needed to render the chart
   * based on the props of the component
   */
  makeVisComponents(props) {
    const { forceZeroMin, height, width, yExtent, yKey } = props;

    const preparedData = this.prepareData(props);

    const innerMargin = { top: 20, right: 20, bottom: 35, left: 50 };
    const innerWidth = width - innerMargin.left - innerMargin.right;
    const innerHeight = height - innerMargin.top - innerMargin.bottom;

    const xMin = 0;
    const xMax = innerWidth;
    const yMin = innerHeight;
    const yMax = 0;

    // set up the domains based on extent. Use the prop if provided, otherwise calculate
    const xDomain = [0, 23];
    let yDomain = yExtent || d3.extent(preparedData.filteredData, d => d[yKey]);

    // force 0 as the min in the yDomain if specified
    if (forceZeroMin) {
      yDomain = [0, yDomain[1]];
    }

    const xScale = d3.scaleLinear().domain(xDomain).range([xMin, xMax]);
    const yScale = d3.scaleLinear().domain(yDomain).range([yMin, yMax]);

    const binWidth = (xMax - yMax) / 24;

    // function to generate paths for each series
    const line = d3.line()
      .curve(d3.curveLinear)
      .x((d) => xScale(d.hour) + (binWidth / 2))
      .y((d) => yScale(d[yKey]));

    return {
      ...preparedData,
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
   *
   * @return {void}
   */
  update() {
    this.renderCircles();
    this.renderAxes();
    this.renderHighlight();
  }

  /**
   * Callback for when the mouse hovers over a circle
   *
   * @param {Object} d The hovered over data point
   * @return {void}
   */
  handleCircleMouseEnter(d) {
    const { onHighlightPoint } = this.props;
    if (onHighlightPoint) {
      onHighlightPoint(d);
    }
  }

  /**
   * Callback for when the mouse leaves a circle
   *
   * @param {Object} d The previously hovered over data point
   * @return {void}
   */
  handleCircleMouseLeave() {
    const { onHighlightPoint } = this.props;
    if (onHighlightPoint) {
      onHighlightPoint(null);
    }
  }

  /**
   * Render the x and y axis components
   */
  renderAxes() {
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
    const { dataByHour, xScale, yScale, yKey, binWidth } = this.visComponents;

    const binding = this.circles
      .selectAll('g')
      .data(dataByHour);

    const entering = binding.enter()
      .append('g')
      .classed('hour-container', true);

    const that = this;
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
          .attr('cy', d => yScale(d[yKey]))
          .on('mouseenter', that.handleCircleMouseEnter)
          .on('mouseleave', that.handleCircleMouseLeave);

        // EXIT
        hourBinding.exit()
          .remove();
      });

    binding.exit().remove();
  }

  /**
   * Renders the highlighted points
   */
  renderHighlight() {
    const { binWidth, dataByDate, xScale, yKey, yScale } = this.visComponents;
    const { highlightPoint } = this.props;

    // if no highlight, remove all children
    if (!highlightPoint) {
      this.gHighlight.select('.highlight-line').selectAll('*').remove();
      return;
    }

    // otherwise, we have a highlighted point, show a line and highlight the points
    const dateKey = highlightPoint.date.toString();
    const dateData = dataByDate[dateKey] ? dataByDate[dateKey].points : [];

    const g = this.gHighlight.select('.highlight-line');

    // render a line
    this.renderLine(dateData, g);

    // also render some brighter circles
    const circlesBinding = g.selectAll('circle').data(dateData, d => d.hour);

    // ENTER
    const circlesEntering = circlesBinding.enter()
      .append('circle');

    // ENTER + UPDATE
    circlesBinding.merge(circlesEntering)
      .attr('r', 4)
      .attr('cx', d => xScale(d.hour) + (binWidth / 2))
      .attr('cy', d => yScale(d[yKey]))
      .style('fill', '#c0c');

    // EXIT
    circlesBinding.exit()
      .remove();
  }

  /**
   * Render a line
   */
  renderLine(dateData, parent) {
    const { line } = this.visComponents;

    // draw the line
    const lineBinding = parent.selectAll('path').data([dateData]);

    const lineEntering = lineBinding.enter()
      .append('path')
      .style('fill', 'none');

    lineBinding.merge(lineEntering)
      .style('stroke', '#c0c')
      .attr('d', line);

    lineBinding.exit().remove();
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