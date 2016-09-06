import React, { PureComponent, PropTypes } from 'react';
import Helmet from 'react-helmet';
import moment from 'moment';
import { browserHistory } from 'react-router';
import momentPropTypes from 'react-moment-proptypes';
import { Row, Col } from 'react-bootstrap';
import * as LocationPageSelectors from '../../redux/locationPage/selectors';
import * as LocationPageActions from '../../redux/locationPage/actions';
import * as LocationsActions from '../../redux/locations/actions';

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
  SummaryTable,
} from '../../components';

import UrlHandler from '../../url/UrlHandler';
import urlConnect from '../../url/urlConnect';

import './LocationPage.scss';

// Define how to read/write state to URL query parameters
const urlQueryConfig = {
  viewMetric: { type: 'string', defaultValue: 'download', urlKey: 'metric' },

  // chart options
  showBaselines: { type: 'boolean', defaultValue: false, urlKey: 'baselines' },
  showRegionalValues: { type: 'boolean', defaultValue: false, urlKey: 'regional' },

  // selected time
  // TODO: change defaults to more recent time period when data is up-to-date
  startDate: { type: 'date', urlKey: 'start', defaultValue: moment('2015-10-1') },
  endDate: { type: 'date', urlKey: 'end', defaultValue: moment('2015-11-1') },
  timeAggregation: { type: 'string', defaultValue: 'day', urlKey: 'aggr' },
  selectedClientIspIds: { type: 'array', urlKey: 'isps' },
};
const urlHandler = new UrlHandler(urlQueryConfig, browserHistory);


function mapStateToProps(state, propsWithUrl) {
  return {
    ...propsWithUrl,
    locationInfo: LocationPageSelectors.getLocationInfo(state, propsWithUrl),
    viewMetric: LocationPageSelectors.getViewMetric(state, propsWithUrl),
    topClientIsps: LocationPageSelectors.getLocationTopClientIsps(state, propsWithUrl),
    selectedClientIspInfo: LocationPageSelectors.getLocationSelectedClientIspInfo(state, propsWithUrl),
    locationHourly: LocationPageSelectors.getLocationHourly(state, propsWithUrl),
    hourlyStatus: LocationPageSelectors.getLocationHourlyStatus(state, propsWithUrl),
    locationTimeSeries: LocationPageSelectors.getLocationTimeSeries(state, propsWithUrl),
    timeSeriesStatus: LocationPageSelectors.getTimeSeriesStatus(state, propsWithUrl),
    clientIspTimeSeries: LocationPageSelectors.getLocationClientIspTimeSeries(state, propsWithUrl),
    locationAndClientIspTimeSeries: LocationPageSelectors.getLocationAndClientIspTimeSeries(state, propsWithUrl),
    highlightHourly: LocationPageSelectors.getHighlightHourly(state, propsWithUrl),
    summary: LocationPageSelectors.getSummaryData(state, propsWithUrl),
  };
}

class LocationPage extends PureComponent {
  static propTypes = {
    clientIspTimeSeries: PropTypes.array,
    dispatch: PropTypes.func,
    endDate: momentPropTypes.momentObj,
    highlightHourly: PropTypes.object,
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
    this.onShowBaselinesChange = this.onShowBaselinesChange.bind(this);
    this.onShowRegionalValuesChange = this.onShowRegionalValuesChange.bind(this);
    this.onViewMetricChange = this.onViewMetricChange.bind(this);
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
   * Callback for when a point is highlighted in hourly
   */
  onHighlightHourly(d) {
    const { dispatch } = this.props;
    dispatch(LocationPageActions.highlightHourly(d));
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
    const locationName = (locationInfo && locationInfo.name) || 'Loading...';
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
    const { locationId, locationTimeSeries, timeSeriesStatus, viewMetric, clientIspTimeSeries } = this.props;
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
            height={400}
            width={800}
            xKey="date"
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
    const { timeSeriesStatus, locationAndClientIspTimeSeries } = this.props;

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
          />
        </StatusWrapper>
      </div>
    );
  }

  renderProvidersByHour() {
    const { locationHourly, hourlyStatus, highlightHourly, locationId, viewMetric } = this.props;
    const extentKey = this.extentKey(viewMetric);
    const chartId = 'providers-hourly';
    const chartData = locationHourly && locationHourly.results;

    return (
      <div className="subsection">
        <header>
          <h3>By Hour, Median download speeds</h3>
        </header>
        <StatusWrapper status={hourlyStatus}>
          <HourChartWithCounts
            data={locationHourly && locationHourly.results}
            height={400}
            highlightPoint={highlightHourly}
            id={chartId}
            onHighlightPoint={this.onHighlightHourly}
            threshold={30}
            width={800}
            yExtent={locationHourly && locationHourly.extents[extentKey]}
            yKey={viewMetric.dataKey}
          />
          <ChartExportControls
            chartId={chartId}
            data={chartData}
            filename={`${locationId}_${viewMetric.value}_${chartId}`}
          />
        </StatusWrapper>
      </div>
    );
  }

  renderFixedTimeFrames() {
    return (
      <div className="section">
        <header>
          <h2>Compare Fixed Time Frame</h2>
        </header>
        {this.renderFixedCompareMetrics()}
        {this.renderFixedDistributions()}
        {this.renderFixedSummaryData()}
      </div>
    );
  }

  renderFixedCompareMetrics() {
    return (
      <div className="subsection">
        <header>
          <h3>Compare Metrics</h3>
        </header>
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
    const { lastYear } = summary;

    return (
      <div className="subsection">
        <header>
          <h3>Summary Data</h3>
        </header>
        <h4>Last Year</h4>
        <SummaryTable data={lastYear} />
      </div>
    );
  }

  renderBreadCrumbs() {
    const { locationInfo } = this.props;

    return (
      <Breadcrumbs info={locationInfo} />
    );
  }

  render() {
    const { locationInfo } = this.props;
    const locationName = (locationInfo && locationInfo.name) || 'Location';

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
