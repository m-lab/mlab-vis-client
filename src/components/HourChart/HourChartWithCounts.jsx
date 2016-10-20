import React, { PureComponent, PropTypes } from 'react';
import d3 from 'd3';

import { HourChart, CountChart } from '../../components';
import addComputedProps from '../../hoc/addComputedProps';
import { testThreshold } from '../../constants';

/**
 * Figure out what is needed for both charts
 */
function visProps(props) {
  const { width } = props;

  const padding = {
    right: 50,
    left: 50,
  };
  const plotAreaWidth = width - padding.left - padding.right;

  const xMin = 0;
  const xMax = plotAreaWidth;

  const xDomain = [0, 23];
  const xScale = d3.scaleLinear().domain(xDomain).range([xMin, xMax]);
  const numBins = 24; // one for each hour

  return {
    padding,
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
    countExtent: PropTypes.array,
    dataByHour: PropTypes.array,
    filteredData: PropTypes.array,
    forceZeroMin: PropTypes.bool,
    highlightHour: PropTypes.number,
    id: React.PropTypes.string,
    numBins: PropTypes.number,
    onHighlightHour: PropTypes.func,
    overallData: PropTypes.array,
    padding: PropTypes.object,
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
    threshold: testThreshold,
  }

  /**
   * The main render method. Defers chart rendering to d3 in `update` and `setup`
   * @return {React.Component} The rendered container
   */
  render() {
    const { id, width, color, highlightHour, onHighlightHour, dataByHour,
      filteredData, padding, overallData, xScale, numBins, countExtent } = this.props;

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
              overallData={overallData}
              id={undefined}
              inSvg
              height={hourHeight}
              paddingLeft={padding.left}
              paddingRight={padding.right}
              xScale={xScale}
            />
          </g>
          <g transform={`translate(0 ${hourHeight})`}>
            <CountChart
              data={dataByHour}
              height={countHeight}
              highlightCount={highlightHour}
              paddingLeft={padding.left}
              paddingRight={padding.right}
              numBins={numBins}
              onHighlightCount={onHighlightHour}
              width={width}
              xKey="hour"
              xScale={xScale}
              yExtent={countExtent}
            />
          </g>
        </svg>
      </div>
    );
  }
}

export default addComputedProps(visProps, { changeExclude: ['highlightHour'] })(HourChartWithCounts);
