import React, { PureComponent, PropTypes } from 'react';
import d3 from 'd3';

import { LineChart, CountChart } from '../../components';
import { multiExtent } from '../../utils/array';

/**
 * Chart for showing line and count together.
 *
 * @prop {Array|Object} annotationSeries The array of series data not included in count (e.g., [{ meta, results }, ...])
 *   or just a single object of series data.
 * @prop {Array} data The array of data points to render (e.g., [{x: Date, y: Number}, ...])
 * @prop {Boolean} forceZeroMin=true Whether the min y value should always be 0.
 * @prop {Number} height The height in pixels of the SVG chart
 * @prop {String} id The ID of the SVG chart (needed for PNG export)
 * @prop {Array} series The array of series data (e.g., [{ meta, results }, ...])
 * @prop {Number} width The width in pixels of the SVG chart
 * @prop {Array} xExtent The min and max value of the xKey in the chart
 * @prop {String} xKey="x" The key to read the x value from in the data
 * @prop {Array} yExtent The min and max value of the yKey in the chart
 * @prop {String} yKey="y" The key to read the y value from in the data
 */
export default class LineChartWithCounts extends PureComponent {
  static propTypes = {
    annotationSeries: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    data: PropTypes.array,
    forceZeroMin: PropTypes.bool,
    height: React.PropTypes.number,
    id: React.PropTypes.string,
    series: PropTypes.array,
    width: React.PropTypes.number,
    xExtent: PropTypes.array,
    xKey: React.PropTypes.string,
    yExtent: PropTypes.array,
    yKey: React.PropTypes.string,
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
   * Filter the data
   * @param {Object} props the component props
   * @return {Array} the prepared data
   */
  prepareData(props) {
    const { series, xKey, yKey } = props;

    if (!series) {
      return {};
    }

    // filter the series data
    const filteredSeries = series.map(oneSeries => ({
      ...oneSeries,
      results: oneSeries.results.filter(d => d[xKey] != null && d[yKey] != null),
    }));

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
      filteredSeries,
      counts,
    };
  }


  /**
   * Figure out what is needed for both charts
   */
  makeSharedVisComponents(props) {
    const { width, xExtent, xKey } = props;

    const preparedData = this.prepareData(props);
    const { filteredSeries } = preparedData;
    const innerMargin = {
      right: 50,
      left: 50,
    };
    const innerWidth = width - innerMargin.left - innerMargin.right;

    const xMin = 0;
    const xMax = innerWidth;

    let xDomain = xExtent;
    if (!xDomain && filteredSeries) {
      xDomain = multiExtent(filteredSeries, d => d[xKey], oneSeries => oneSeries.results);
    }

    const xScale = d3.scaleTime().range([xMin, xMax]);
    if (xDomain) {
      xScale.domain(xDomain);
    }

    // TODO - this is incorrect in the event that there is missing data.
    // e.g. Jan 1, Jan 2, Jan 4, Jan 5, Jan 6. = 5 bins, but should be 6.
    // also currently only looks at the first series.
    const numBins = filteredSeries && filteredSeries.length ? filteredSeries[0].length : 1;

    return {
      ...preparedData,
      innerMargin,
      numBins,
      xScale,
    };
  }

  /**
   * The main render method. Defers chart rendering to d3 in `update` and `setup`
   * @return {React.Component} The rendered container
   */
  render() {
    const { height, id, width, xKey, annotationSeries } = this.props;
    const { filteredSeries, counts, innerMargin, xScale, numBins } = this.visComponents;

    const lineChartHeight = height * 0.75;
    const countHeight = height - lineChartHeight;

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
              series={filteredSeries}
              annotationSeries={annotationSeries}
              id={undefined}
              inSvg
              height={lineChartHeight}
              innerMarginLeft={innerMargin.left}
              innerMarginRight={innerMargin.right}
              xScale={xScale}
            />
          </g>
          <g transform={`translate(0 ${lineChartHeight})`}>
            <CountChart
              data={counts} /* TODO figure out multi-series counts */
              height={countHeight}
              innerMarginLeft={innerMargin.left}
              innerMarginRight={innerMargin.right}
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
