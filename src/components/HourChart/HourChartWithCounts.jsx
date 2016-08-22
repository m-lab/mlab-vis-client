import React, { PureComponent, PropTypes } from 'react';
import { groupBy } from 'lodash';
import d3 from 'd3';

import { HourChart, CountChart } from '../../components';
import { sum, weightedAverage } from '../../utils/math';

/**
 * Chart for showing data by hour and with test counts
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
export default class HourChartWithCounts extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    forceZeroMin: PropTypes.bool,
    height: PropTypes.number,
    highlightPoint: PropTypes.object,
    id: React.PropTypes.string,
    onHighlightPoint: PropTypes.func,
    threshold: PropTypes.number,
    width: PropTypes.number,
    yExtent: PropTypes.array,
    yKey: PropTypes.string,
  }

  static defaultProps = {
    threshold: 30,
  }

  /**
   * Initiailize the vis components when the component is about to mount
   */
  componentWillMount() {
    this.visComponents = this.makeSharedVisComponents(this.props);
  }

  /**
   * When new props are received, regenerate vis components if necessary
   */
  componentWillReceiveProps(nextProps) {
    // regenerate the vis components if the relevant props change
    this.visComponents = this.makeSharedVisComponents(nextProps);
  }

  /**
   * Filter the data and group it by hour and by date
   * @param {Object} props the component props
   * @return {Object} the prepared data { filteredData, dataByHour, dataByDate }
   */
  prepareData(props) {
    const { data, yKey, threshold } = props;

    // filter so all data has a value for yKey
    const filteredData = (data || []).filter(d => d[yKey] != null);

    // produce the byHour array
    const groupedByHour = groupBy(filteredData, 'hour');
    // use d3.range(24) instead of Object.keys to ensure we get an entry for each hour
    const dataByHour = d3.range(24).map(hour => {
      const hourPoints = groupedByHour[hour];
      const count = sum(hourPoints, 'count') || 0;

      return {
        hour,
        points: hourPoints || [],
        count,
        belowThreshold: count < threshold,
        overall: weightedAverage(hourPoints, yKey, 'count'),
      };
    });

    // produce the byDate array
    const groupedByDate = groupBy(filteredData, 'date');
    const dataByDate = Object.keys(groupedByDate).reduce((byDate, date) => {
      const datePoints = groupedByDate[date];
      const count = sum(datePoints, 'count') || 0;

      byDate[date] = {
        date,
        points: datePoints || [],
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
  makeSharedVisComponents(props) {
    const { width } = props;

    const preparedData = this.prepareData(props);

    const innerMargin = {
      right: 50,
      left: 50,
    };
    const innerWidth = width - innerMargin.left - innerMargin.right;

    const xMin = 0;
    const xMax = innerWidth;

    const xDomain = [0, 23];
    const xScale = d3.scaleLinear().domain(xDomain).range([xMin, xMax]);

    return {
      ...preparedData,
      innerMargin,
      xScale,
    };
  }

  /**
   * The main render method. Defers chart rendering to d3 in `update` and `setup`
   * @return {React.Component} The rendered container
   */
  render() {
    const { height, id, width } = this.props;
    const { dataByHour, dataByDate, filteredData, innerMargin, overallData,
      xScale } = this.visComponents;

    const hourHeight = height * 0.75;
    const countHeight = height - hourHeight;

    return (
      <div className="hour-chart-with-counts-container">
        <svg
          id={id}
          className="hour-chart-with-counts chart"
          ref={node => { this.root = node; }}
          width={width}
          height={height}
        >
          <rect x={0} y={0} width={width} height={height} fill={'#fff'} />
          <g>
            <HourChart
              {...this.props}
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
              innerMarginLeft={innerMargin.left}
              innerMarginRight={innerMargin.right}
              numBins={24}
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
