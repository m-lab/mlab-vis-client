import React, { PureComponent, PropTypes } from 'react';
import d3 from 'd3';

import { HourChart, CountChart } from '../../components';
import { sum, average } from '../../utils/math';
import addComputedProps from '../../hoc/addComputedProps';


/**
 * Filter the data and group it by hour and by date
 * @param {Object} props the component props
 * @return {Object} the prepared data { filteredData, dataByHour, dataByDate }
 */
function prepareData(props) {
  const { data, yKey, threshold } = props;

  // filter so all data has a value for yKey
  const filteredData = (data || []).filter(d => d[yKey] != null);

  // produce the byHour array
  const groupedByHour = d3.nest().key(d => d.hour).object(filteredData);

  // use d3.range(24) instead of Object.keys to ensure we get an entry for each hour
  const dataByHour = d3.range(24).map(hour => {
    const hourPoints = groupedByHour[hour];
    const count = sum(hourPoints, 'count') || 0;

    return {
      hour,
      points: hourPoints || [],
      count,
      belowThreshold: count < threshold,
      overall: average(hourPoints, yKey),
    };
  });

  // produce the byDate array
  const groupedByDate = d3.nest().key(d => d.date.format('YYYY-MM-DD')).object(filteredData);
  const dataByDate = Object.keys(groupedByDate).reduce((byDate, date) => {
    const datePoints = groupedByDate[date];
    const count = sum(datePoints, 'count') || 0;

    byDate[date] = {
      date: datePoints[0].date,
      points: datePoints,
      count,
      belowThreshold: count < threshold,
    };

    return byDate;
  }, {});

  // compute the overall data for an average line
  const overallData = dataByHour.map(d => ({
    [yKey]: d.overall,
    hour: d.hour,
  })).filter(d => d[yKey] != null);

  return {
    filteredData,
    dataByHour,
    dataByDate,
    overallData,
  };
}


/**
 * Figure out what is needed for both charts
 */
function visProps(props) {
  const { width } = props;

  const preparedData = prepareData(props);

  const innerMargin = {
    right: 50,
    left: 50,
  };
  const innerWidth = width - innerMargin.left - innerMargin.right;

  const xMin = 0;
  const xMax = innerWidth;

  const xDomain = [0, 23];
  const xScale = d3.scaleLinear().domain(xDomain).range([xMin, xMax]);
  const numBins = 24; // one for each hour

  return {
    ...preparedData,
    innerMargin,
    numBins,
    xScale,
  };
}

/**
 * Chart for showing data by hour and with test counts
 *
 * @prop {String} color The color to render the chart in
 * @prop {Array} data The array of data points indexed by hour. Should be
 *   an array of length 24 of form [{ hour:Number(0..23), points: [{ yKey:Number }, ...]}, ...]
 * @prop {Boolean} forceZeroMin=true Whether the min y value should always be 0.
 * @prop {Number} highlightHour The hour being highlighted in the chart
 * @prop {Function} onHighlightHour Callback for when a point is hovered on
 * @prop {Number} width The width of the chart
 * @prop {String} yAxisLabel The label to show on the Y axis
 * @prop {String} yAxisUnit The unit to show on the Y axis label
 * @prop {Array} yExtent The min and max value of the yKey in the chart
 * @prop {Function} yFormatter Format function that takes a y value and outputs a string
 * @prop {String} yKey="y" The key in the data points to read the y value from
 */
class HourChartWithCounts extends PureComponent {
  static propTypes = {
    color: PropTypes.string,
    data: PropTypes.array,
    dataByDate: PropTypes.object,
    dataByHour: PropTypes.array,
    filteredData: PropTypes.array,
    forceZeroMin: PropTypes.bool,
    highlightHour: PropTypes.number,
    id: React.PropTypes.string,
    innerMargin: PropTypes.object,
    numBins: PropTypes.number,
    onHighlightHour: PropTypes.func,
    overallData: PropTypes.array,
    threshold: PropTypes.number,
    width: PropTypes.number,
    xScale: React.PropTypes.func,
    yAxisLabel: React.PropTypes.string,
    yAxisUnit: React.PropTypes.string,
    yExtent: PropTypes.array,
    yFormatter: PropTypes.func,
    yKey: PropTypes.string,
  }

  static defaultProps = {
    threshold: 30,
  }

  /**
   * The main render method. Defers chart rendering to d3 in `update` and `setup`
   * @return {React.Component} The rendered container
   */
  render() {
    const { id, width, color, highlightHour, onHighlightHour, dataByHour, dataByDate,
      filteredData, innerMargin, overallData, xScale, numBins } = this.props;

    const hourHeight = 250;
    const countHeight = 80;
    const height = hourHeight + countHeight;

    return (
      <div className="hour-chart-with-counts-container">
        <svg
          id={id}
          className="hour-chart-with-counts chart"
          width={width}
          height={height}
        >
          <rect x={0} y={0} width={width} height={height} fill={'#fff'} />
          <g>
            <HourChart
              {...this.props}
              color={color}
              data={filteredData}
              dataByHour={dataByHour}
              dataByDate={dataByDate}
              overallData={overallData}
              id={undefined}
              inSvg
              height={hourHeight}
              innerMarginLeft={innerMargin.left}
              innerMarginRight={innerMargin.right}
              xScale={xScale}
            />
          </g>
          <g transform={`translate(0 ${hourHeight})`}>
            <CountChart
              data={dataByHour}
              height={countHeight}
              highlightCount={highlightHour}
              innerMarginLeft={innerMargin.left}
              innerMarginRight={innerMargin.right}
              numBins={numBins}
              onHighlightCount={onHighlightHour}
              width={width}
              xKey="hour"
              xScale={xScale}
            />
          </g>
        </svg>
      </div>
    );
  }
}

export default addComputedProps(visProps)(HourChartWithCounts);
