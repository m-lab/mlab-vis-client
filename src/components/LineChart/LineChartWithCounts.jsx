import React, { PureComponent, PropTypes } from 'react';
import d3 from 'd3';

import { colorsFor } from '../../utils/color';
import { LineChart, CountChart } from '../../components';
import { multiExtent } from '../../utils/array';
import addComputedProps from '../../hoc/addComputedProps';

/**
 * Filter the data
 * @param {Object} props the component props
 * @return {Array} the prepared data
 */
function prepareData(props) {
  const { series } = props;

  if (!series) {
    return {};
  }

  // create counts
  const countsByDate = series.reduce((countsByDate, oneSeries) => {
    oneSeries.results.forEach(d => {
      const { count = 0, date } = d;
      if (!countsByDate[date]) {
        countsByDate[date] = {
          count,
          date,
        };
      } else {
        countsByDate[date].count += count;
      }
    });

    return countsByDate;
  }, {});
  const counts = Object.keys(countsByDate).map(key => countsByDate[key]);

  return {
    series,
    counts,
  };
}


/**
 * Figure out what is needed for both charts
 */
function visProps(props) {
  const { width, xExtent, xKey } = props;

  const preparedData = prepareData(props);
  const { series } = preparedData;
  const padding = {
    right: 50,
    left: 50,
  };
  const plotAreaWidth = width - padding.left - padding.right;

  const xMin = 0;
  const xMax = plotAreaWidth;

  let xDomain = xExtent;
  if (!xDomain && series) {
    xDomain = multiExtent(series, d => d[xKey], oneSeries => oneSeries.results);
  }

  const xScale = d3.scaleTime().range([xMin, xMax]);
  if (xDomain) {
    xScale.domain(xDomain);
  }

  // initialize a color scale
  let colors = {};
  if (series) {
    colors = colorsFor(series, (d) => d.meta.id);
  }

  // assumes the first series has the max length
  const numBins = series && series.length ? series[0].length : 1;

  return {
    series: preparedData.series,
    counts: preparedData.counts,
    padding,
    numBins,
    xScale,
    colors,
  };
}


/**
 * Chart for showing line and count together.
 *
 * @prop {Array|Object} annotationSeries The array of series data not included in count (e.g., [{ meta, results }, ...])
 *   or just a single object of series data.
 * @prop {Array} data The array of data points to render (e.g., [{x: Date, y: Number}, ...])
 * @prop {Boolean} forceZeroMin=true Whether the min y value should always be 0.
 * @prop {Number} height The height in pixels of the SVG chart
 * @prop {Object} highlightDate The date being highlighted in the chart
 * @prop {Object} highlightLine The line being highlighted in the chart
 * @prop {String} id The ID of the SVG chart (needed for PNG export)
 * @prop {Function} onHighlightDate Callback when the mouse moves across the main area of the chart
 *   passes in the hovered upon date
 * @prop {Function} onHighlightLine Callback when a series is highlighted
 * @prop {Array} series The array of series data (e.g., [{ meta, results }, ...])
 * @prop {Number} width The width in pixels of the SVG chart
 * @prop {Array} xExtent The min and max value of the xKey in the chart
 * @prop {String} xKey="x" The key to read the x value from in the data
 * @prop {Array} yExtent The min and max value of the yKey in the chart
 * @prop {Function} yFormatter Format function that takes a y value and outputs a string
 * @prop {String} yKey="y" The key to read the y value from in the data
 * @prop {String} yAxisLabel The label to show on the Y axis
 * @prop {String} yAxisUnit The unit to show on the Y axis label
 */
class LineChartWithCounts extends PureComponent {
  static propTypes = {
    annotationSeries: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    colors: PropTypes.object,
    counts: PropTypes.array,
    data: PropTypes.array,
    forceZeroMin: PropTypes.bool,
    height: React.PropTypes.number,
    highlightDate: React.PropTypes.object,
    highlightLine: React.PropTypes.object,
    id: React.PropTypes.string,
    numBins: React.PropTypes.number,
    onHighlightDate: React.PropTypes.func,
    onHighlightLine: React.PropTypes.func,
    padding: PropTypes.object,
    series: PropTypes.array,
    width: React.PropTypes.number,
    xExtent: PropTypes.array,
    xKey: React.PropTypes.string,
    xScale: React.PropTypes.func,
    yAxisLabel: React.PropTypes.string,
    yAxisUnit: React.PropTypes.string,
    yExtent: PropTypes.array,
    yFormatter: PropTypes.func,
    yKey: React.PropTypes.string,
  }

  static defaultProps = {
    threshold: 30,
  }

  /**
   * The main render method. Defers chart rendering to d3 in `update` and `setup`
   * @return {React.Component} The rendered container
   */
  render() {
    const { id, width, xKey, annotationSeries, series, highlightLine, highlightDate,
      onHighlightDate, counts, padding, xScale, numBins, colors } = this.props;

    const lineChartHeight = 350;
    const countHeight = 80;
    const height = lineChartHeight + countHeight;
    const highlightColor = highlightLine ? colors[highlightLine.meta.id] : undefined;
    const highlightCountData = highlightLine ? highlightLine.results : undefined;

    return (
      <div className="line-chart-with-counts-container">
        <svg
          id={id}
          className="line-chart-with-counts chart"
          width={width}
          height={height}
        >
          <rect x={0} y={0} width={width} height={height} fill={'#fff'} />
          <g>
            <LineChart
              {...this.props}
              series={series}
              colors={colors}
              annotationSeries={annotationSeries}
              id={undefined}
              inSvg
              height={lineChartHeight}
              paddingLeft={padding.left}
              paddingRight={padding.right}
              xScale={xScale}
            />
          </g>
          <g transform={`translate(0 ${lineChartHeight})`}>
            <CountChart
              data={counts}
              highlightData={highlightCountData}
              highlightCount={highlightDate}
              highlightColor={highlightColor}
              height={countHeight}
              paddingLeft={padding.left}
              paddingRight={padding.right}
              onHighlightCount={onHighlightDate}
              numBins={numBins}
              width={width}
              xKey={xKey}
              xScale={xScale}
            />
          </g>
        </svg>
      </div>
    );
  }
}

export default addComputedProps(visProps, { changeExclude: ['highlightDate'] })(LineChartWithCounts);
