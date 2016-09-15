import React, { PureComponent, PropTypes } from 'react';
import Helmet from 'react-helmet';
import moment from 'moment';
import { browserHistory } from 'react-router';
import momentPropTypes from 'react-moment-proptypes';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import * as LocationPageSelectors from '../../redux/locationPage/selectors';
import * as LocationPageActions from '../../redux/locationPage/actions';
import * as LocationsActions from '../../redux/locations/actions';

import { colorsFor } from '../../utils/color';
import { metrics } from '../../constants';

import {
  ChartExportControls,
  LineChartWithCounts,
  HourChartWithCounts,
  LineChartSmallMult,
  MetricSelector,
  TimeAggregationSelector,
  StatusWrapper,
  IspSelect,
  DateRangeSelector,
  Breadcrumbs,
  ScatterGroup,
  SummaryTable,
} from '../../components';

import UrlHandler from '../../url/UrlHandler';
import urlConnect from '../../url/urlConnect';
import queryRebuild from '../../url/queryRebuild';

import './LocationPage.scss';

// Define how to read/write state to URL query parameters
const urlQueryConfig = {
  viewMetric: { type: 'string', defaultValue: 'download', urlKey: 'metric' },
  compareMetricX: { type: 'string', defaultValue: 'download', urlKey: 'compareX' },
  compareMetricY: { type: 'string', defaultValue: 'upload', urlKey: 'compareY' },

  // chart options
  showBaselines: { type: 'boolean', defaultValue: false, urlKey: 'baselines' },
  showRegionalValues: { type: 'boolean', defaultValue: false, urlKey: 'regional' },

  // selected time
  // TODO: change defaults to more recent time period when data is up-to-date
  startDate: { type: 'date', urlKey: 'start', defaultValue: moment('2015-10-1') },
  endDate: { type: 'date', urlKey: 'end', defaultValue: moment('2015-11-1') },
  timeAggregation: { type: 'string', defaultValue: 'day', urlKey: 'aggr' },
  selectedClientIspIds: { type: 'array', urlKey: 'isps', persist: false },
};
const urlHandler = new UrlHandler(urlQueryConfig, browserHistory);


function mapStateToProps(state, propsWithUrl) {
  return {
    ...propsWithUrl,
    clientIspHourly: LocationPageSelectors.getLocationClientIspHourly(state, propsWithUrl),
    clientIspTimeSeries: LocationPageSelectors.getLocationClientIspTimeSeries(state, propsWithUrl),
    highlightHourly: LocationPageSelectors.getHighlightHourly(state, propsWithUrl),
    highlightTimeSeriesDate: LocationPageSelectors.getHighlightTimeSeriesDate(state, propsWithUrl),
    highlightTimeSeriesLine: LocationPageSelectors.getHighlightTimeSeriesLine(state, propsWithUrl),
    hourlyStatus: LocationPageSelectors.getLocationHourlyStatus(state, propsWithUrl),
    locationInfo: LocationPageSelectors.getLocationInfo(state, propsWithUrl),
    locationAndClientIspTimeSeries: LocationPageSelectors.getLocationAndClientIspTimeSeries(state, propsWithUrl),
    locationHourly: LocationPageSelectors.getLocationHourly(state, propsWithUrl),
    locationTimeSeries: LocationPageSelectors.getLocationTimeSeries(state, propsWithUrl),
    selectedClientIspInfo: LocationPageSelectors.getLocationSelectedClientIspInfo(state, propsWithUrl),
    summary: LocationPageSelectors.getSummaryData(state, propsWithUrl),
    timeSeriesStatus: LocationPageSelectors.getTimeSeriesStatus(state, propsWithUrl),
    topClientIsps: LocationPageSelectors.getLocationTopClientIsps(state, propsWithUrl),
    viewMetric: LocationPageSelectors.getViewMetric(state, propsWithUrl),
    compareMetrics: LocationPageSelectors.getCompareMetrics(state, propsWithUrl),
  };
}

class LocationPage extends PureComponent {
  static propTypes = {
    clientIspHourly: PropTypes.array,
    clientIspTimeSeries: PropTypes.array,
    compareMetrics: PropTypes.object,
    dispatch: PropTypes.func,
    endDate: momentPropTypes.momentObj,
    highlightHourly: PropTypes.object,
    highlightTimeSeriesDate: PropTypes.object,
    highlightTimeSeriesLine: PropTypes.object,
    hourlyStatus: PropTypes.string,
    location: PropTypes.object, // route location
    locationAndClientIspTimeSeries: PropTypes.array,
    locationHourly: PropTypes.object,
    locationId: PropTypes.string,
    locationInfo: PropTypes.object,
    locationTimeSeries: PropTypes.object,
    selectedClientIspIds: PropTypes.array,
    selectedClientIspInfo: PropTypes.array,
    showBaselines: PropTypes.bool,
    showRegionalValues: PropTypes.bool,
    startDate: momentPropTypes.momentObj,
    summary: PropTypes.object,
    timeAggregation: PropTypes.string,
    timeSeriesStatus: PropTypes.string,
    topClientIsps: PropTypes.array,
    viewMetric: PropTypes.object,
  }

  constructor(props) {
    super(props);

    // bind handlers
    this.onHighlightHourly = this.onHighlightHourly.bind(this);
    this.onHighlightTimeSeriesDate = this.onHighlightTimeSeriesDate.bind(this);
    this.onHighlightTimeSeriesLine = this.onHighlightTimeSeriesLine.bind(this);
    this.onShowBaselinesChange = this.onShowBaselinesChange.bind(this);
    this.onShowRegionalValuesChange = this.onShowRegionalValuesChange.bind(this);
    this.onViewMetricChange = this.onViewMetricChange.bind(this);
    this.onCompareMetricsChange = this.onCompareMetricsChange.bind(this);
    this.onTimeAggregationChange = this.onTimeAggregationChange.bind(this);
    this.onSelectedClientIspsChange = this.onSelectedClientIspsChange.bind(this);
    this.onDateRangeChange = this.onDateRangeChange.bind(this);
  }

  componentDidMount() {
    this.fetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps);
  }

  /**
   * Fetch the data for the page if needed
   */
  fetchData(props) {
    const { dispatch, locationId, timeAggregation, startDate, endDate, topClientIsps, selectedClientIspIds } = props;
    const options = {
      startDate,
      endDate,
    };
    dispatch(LocationsActions.fetchInfoIfNeeded(locationId));
    dispatch(LocationsActions.fetchTimeSeriesIfNeeded(timeAggregation, locationId, options));
    dispatch(LocationsActions.fetchHourlyIfNeeded(timeAggregation, locationId, options));
    dispatch(LocationsActions.fetchTopClientIspsIfNeeded(locationId));

    // setup selected ISPs if needed
    if (topClientIsps) {
      if (!selectedClientIspIds) {
        // once we have the client ISPs for the location, if we don't have selected client ISPs,
        // set the selected client ISPs to the top 3 for the location.
        const newSelectedIsps = [];
        topClientIsps.slice(0, 3).forEach(clientIsp => {
          const clientIspId = clientIsp.client_asn_number;
          newSelectedIsps.push(clientIspId);
        });
        dispatch(LocationPageActions.changeSelectedClientIspIds(newSelectedIsps));
      }
    }

    this.fetchSelectedClientIspData(props);
  }

  fetchSelectedClientIspData(props) {
    const { dispatch, locationId, timeAggregation, startDate, endDate, selectedClientIspIds } = props;
    const options = {
      startDate,
      endDate,
    };
    // fetch data for selected Client ISPs
    if (selectedClientIspIds) {
      selectedClientIspIds.forEach(clientIspId => {
        dispatch(LocationsActions.fetchClientIspInfoIfNeeded(locationId, clientIspId));
        dispatch(LocationsActions.fetchClientIspLocationTimeSeriesIfNeeded(timeAggregation, locationId,
          clientIspId, options));
        dispatch(LocationsActions.fetchClientIspLocationHourlyIfNeeded(timeAggregation, locationId,
          clientIspId, options));
      });
    }
  }

  /**
   * Callback for show baselines checkbox
   */
  onShowBaselinesChange(evt) {
    const { dispatch } = this.props;
    const { checked } = evt.target;
    dispatch(LocationPageActions.changeShowBaselines(checked));
  }

  /**
   * Callback for show regional values checkbox
   */
  onShowRegionalValuesChange(evt) {
    const { dispatch } = this.props;
    const { checked } = evt.target;
    dispatch(LocationPageActions.changeShowRegionalValues(checked));
  }

  /**
   * Callback for time aggregation checkbox
   */
  onTimeAggregationChange(value) {
    const { dispatch } = this.props;
    dispatch(LocationPageActions.changeTimeAggregation(value));
  }

  /**
   * Callback for when viewMetric changes - updates URL
   */
  onViewMetricChange(value) {
    const { dispatch } = this.props;
    dispatch(LocationPageActions.changeViewMetric(value));
  }

  /**
   * Callback for when viewMetric changes - updates URL
   */
  onCompareMetricsChange(compareName, value) {
    const { dispatch } = this.props;
    if (compareName === 'first') {
      dispatch(LocationPageActions.changecompareMetricX(value));
    } else {
      dispatch(LocationPageActions.changecompareMetricY(value));
    }
  }

  /**
   * Callback for when a point is highlighted in hourly
   */
  onHighlightHourly(d) {
    const { dispatch } = this.props;
    dispatch(LocationPageActions.highlightHourly(d));
  }

  /**
   * Callback for when a date is highlighted in time series
   */
  onHighlightTimeSeriesDate(date) {
    const { dispatch } = this.props;
    dispatch(LocationPageActions.highlightTimeSeriesDate(date));
  }

  /**
   * Callback for when a line is highlighted in time series
   */
  onHighlightTimeSeriesLine(series) {
    const { dispatch } = this.props;
    dispatch(LocationPageActions.highlightTimeSeriesLine(series));
  }


  /**
   * Callback for when The Selected Client ISPs change
   * @param {Array} ispIds Ids of currently selected ISPs
   */
  onSelectedClientIspsChange(ispIds) {
    const { dispatch } = this.props;
    dispatch(LocationPageActions.changeSelectedClientIspIds(ispIds));
  }

  /**
   * Callback for when start or end date is changed
   * @param {Date} startDate new startDate
   * @param {Date} endDate new endDate
   */
  onDateRangeChange(newStartDate, newEndDate) {
    const { dispatch, startDate, endDate } = this.props;
    if ((!startDate && newStartDate) || (newStartDate && !newStartDate.isSame(startDate, 'day'))) {
      dispatch(LocationPageActions.changeStartDate(newStartDate.toDate()));
    }
    if ((!endDate && newEndDate) || (newEndDate && !newEndDate.isSame(endDate, 'day'))) {
      dispatch(LocationPageActions.changeEndDate(newEndDate.toDate()));
    }
  }

  /**
   * Helper to get the extent key based on the metric
   *
   * Combines upload and download as 'throughput'
   *
   * @param {Object} viewMetric the metric object for the active view
   * @return {String} the key to read from the extents objects in the data
   */
  extentKey(viewMetric) {
    let extentKey = viewMetric.dataKey;
    if (viewMetric.value === 'download' || viewMetric.value === 'upload') {
      extentKey = 'throughput';
    }

    return extentKey;
  }

  renderCityProviders() {
    const { locationInfo } = this.props;
    const locationName = (locationInfo && locationInfo.label) || 'Loading...';
    return (
      <div className="section">
        <header>
          <Row>
            <Col md={3}>
              <h2>{locationName}</h2>
            </Col>
            <Col md={9}>
              {this.renderTimeRangeSelector()}
            </Col>
          </Row>

        </header>
        <Row>
          <Col md={3}>
            {this.renderClientIspSelector()}
            {this.renderMetricSelector()}
            {this.renderTimeAggregationSelector()}
          </Col>
          <Col md={9}>
            {this.renderCompareProviders()}
            {this.renderCompareMetrics()}
            {this.renderProvidersByHour()}
          </Col>
        </Row>
      </div>
    );
  }

  renderTimeRangeSelector() {
    const { startDate, endDate } = this.props;

    return (
      <DateRangeSelector
        startDate={startDate}
        endDate={endDate}
        onChange={this.onDateRangeChange}
      />
    );
  }

  renderClientIspSelector() {
    const { topClientIsps = [], selectedClientIspInfo } = this.props;

    return (
      <div className="client-isp-selector">
        <h5>Client ISPs</h5>
        <IspSelect
          isps={topClientIsps}
          selected={selectedClientIspInfo}
          onChange={this.onSelectedClientIspsChange}
        />
      </div>
    );
  }

  renderTimeAggregationSelector() {
    const { timeAggregation } = this.props;

    return (
      <TimeAggregationSelector active={timeAggregation} onChange={this.onTimeAggregationChange} />
    );
  }

  renderMetricSelector() {
    const { viewMetric } = this.props;

    return (
      <MetricSelector active={viewMetric.value} onChange={this.onViewMetricChange} />
    );
  }

  renderChartOptions() {
    const { showBaselines, showRegionalValues } = this.props;
    return (
      <div className="chart-options">
        <ul className="list-inline">
          <li>
            <div className="checkbox">
              <label htmlFor="show-baselines">
                <input
                  type="checkbox"
                  checked={showBaselines}
                  id="show-baselines"
                  onChange={this.onShowBaselinesChange}
                />
                {' Show Baselines'}
              </label>
            </div>
          </li>
          <li>
            <div className="checkbox">
              <label htmlFor="show-regional-values">
                <input
                  type="checkbox"
                  checked={showRegionalValues}
                  id="show-regional-values"
                  onChange={this.onShowRegionalValuesChange}
                />
                {' Show Regional Values'}
              </label>
            </div>
          </li>
        </ul>
      </div>
    );
  }


  renderCompareProviders() {
    const { clientIspTimeSeries, highlightTimeSeriesDate, highlightTimeSeriesLine,
      locationId, locationTimeSeries, timeSeriesStatus, viewMetric } = this.props;
    const chartId = 'providers-time-series';
    const chartData = locationTimeSeries && locationTimeSeries.results;
    return (
      <div className="subsection">
        <header>
          <h3>Compare Providers</h3>
        </header>
        <StatusWrapper status={timeSeriesStatus}>
          <LineChartWithCounts
            id={chartId}
            data={chartData}
            series={clientIspTimeSeries}
            annotationSeries={locationTimeSeries}
            onHighlightDate={this.onHighlightTimeSeriesDate}
            highlightDate={highlightTimeSeriesDate}
            onHighlightLine={this.onHighlightTimeSeriesLine}
            highlightLine={highlightTimeSeriesLine}
            yFormatter={viewMetric.formatter}
            width={840}
            xKey="date"
            yAxisLabel={viewMetric.label}
            yAxisUnit={viewMetric.unit}
            yKey={viewMetric.dataKey}
          />
          <ChartExportControls
            chartId={chartId}
            data={chartData}
            filename={`${locationId}_${viewMetric.value}_${chartId}`}
          />
        </StatusWrapper>
        {this.renderChartOptions()}
      </div>
    );
  }

  renderCompareMetrics() {
    const { timeSeriesStatus, locationAndClientIspTimeSeries, timeAggregation } = this.props;

    const chartId = 'providers-small-mult';
    return (
      <div className="subsection">
        <header>
          <h3>Compare Metrics</h3>
        </header>
        <StatusWrapper status={timeSeriesStatus}>
          <LineChartSmallMult
            id={chartId}
            series={locationAndClientIspTimeSeries}
            width={800}
            xKey="date"
            metrics={metrics}
            timeAggregation={timeAggregation}
          />
        </StatusWrapper>
      </div>
    );
  }

  renderProvidersByHour() {
    const { locationHourly, clientIspHourly } = this.props;

    const colors = colorsFor(clientIspHourly, (d) => d.meta.id);

    return (
      <div className="subsection">
        <header>
          <h3>By Hour, Median download speeds</h3>
        </header>
        <Row>
          {this.renderHourChart(locationHourly)}
          {clientIspHourly.map(hourly => this.renderHourChart(hourly, colors[hourly.meta.id]))}
        </Row>
      </div>
    );
  }

  renderHourChart(hourlyData, color) {
    const { hourlyStatus, highlightHourly, locationId, viewMetric } = this.props;
    const extentKey = this.extentKey(viewMetric);

    if (!hourlyData || !hourlyData.meta) {
      return null;
    }

    const id = hourlyData.meta.id;
    const chartId = `providers-hourly-${id}`;
    return (
      <Col md={6} key={id}>
        <h4>{hourlyData.meta.label}</h4>
        <div className="clearfix">
          <StatusWrapper status={hourlyStatus}>
            <HourChartWithCounts
              color={color}
              data={hourlyData.results}
              highlightPoint={highlightHourly}
              id={chartId}
              onHighlightPoint={this.onHighlightHourly}
              threshold={30}
              width={400}
              yAxisLabel={viewMetric.label}
              yAxisUnit={viewMetric.unit}
              yExtent={hourlyData.extents[extentKey]}
              yKey={viewMetric.dataKey}
            />
            <ChartExportControls
              chartId={chartId}
              data={hourlyData.results}
              filename={`${locationId}${id === locationId ? '' : `_${id}`}_${viewMetric.value}_${chartId}`}
            />
          </StatusWrapper>
        </div>
      </Col>
    );
  }

  renderFixedTimeFrames() {
    return (
      <div className="section-fixedtime section">
        <Row>
          <Col md={12}>
            <header>
              <h2>Compare Fixed Time Frame</h2>
            </header>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            {this.renderClientIspSelector()}
          </Col>
          <Col md={9}>
            {this.renderFixedCompareMetrics()}
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            {this.renderMetricSelector()}
          </Col>
          <Col md={9}>
            {this.renderFixedDistributions()}
            {this.renderFixedSummaryData()}
          </Col>
        </Row>
      </div>
    );
  }

  renderFixedCompareMetrics() {
    const { compareMetrics, summary = {} } = this.props;
    const fields = [
      { id: 'lastWeek', label: 'Last Week' },
      { id: 'lastMonth', label: 'Last Month' },
      { id: 'lastYear', label: 'Last Year' },
    ];
    return (
      <div className="subsection">
        <header>
          <h3>Compare Metrics</h3>
        </header>
        <ScatterGroup
          summary={summary}
          fields={fields}
          compareMetrics={compareMetrics}
          onChange={this.onCompareMetricsChange}
        />
      </div>
    );
  }

  renderFixedDistributions() {
    return (
      <div className="subsection">
        <header>
          <h3>Distributions of Metrics</h3>
        </header>
      </div>
    );
  }

  renderFixedSummaryData() {
    const { summary = {} } = this.props;
    const { lastWeek = {}, lastMonth = {}, lastYear = {} } = summary;

    return (
      <div className="subsection">
        <header>
          <h3>Summary Data</h3>
        </header>
        <h4>Last Week</h4>
        <SummaryTable data={lastWeek.clientIspsData} bottomData={lastWeek.locationData} />
        <h4>Last Month</h4>
        <SummaryTable data={lastMonth.clientIspsData} bottomData={lastMonth.locationData} />
        <h4>Last Year</h4>
        <SummaryTable data={lastYear.clientIspsData} bottomData={lastYear.locationData} />
      </div>
    );
  }

  renderBreadCrumbs() {
    const { locationInfo, location } = this.props;

    return (
      <Breadcrumbs
        info={locationInfo}
        query={queryRebuild(location.query, urlQueryConfig)}
      />
    );
  }

  render() {
    const { locationInfo } = this.props;
    const locationName = (locationInfo && locationInfo.label) || 'Location';

    return (
      <div className="location-page">
        <Helmet title={locationName} />
        {this.renderBreadCrumbs()}
        {this.renderCityProviders()}
        {this.renderFixedTimeFrames()}
      </div>
    );
  }
}

export default urlConnect(urlHandler, mapStateToProps)(LocationPage);
