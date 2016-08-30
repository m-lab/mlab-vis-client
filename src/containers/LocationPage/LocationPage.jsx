import React, { PureComponent, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Link, browserHistory } from 'react-router';
import { Row, Col } from 'react-bootstrap';
import * as LocationPageSelectors from '../../redux/locationPage/selectors';
import * as LocationPageActions from '../../redux/locationPage/actions';
import * as LocationsActions from '../../redux/locations/actions';

import {
  ChartExportControls,
  LineChartWithCounts,
  HourChartWithCounts,
  MetricSelector,
  TimeAggregationSelector,
  StatusWrapper,
  IspSelect,
  DateRangeSelector,
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
  startDate: { type: 'date', urlKey: 'start' },
  endDate: { type: 'date', urlKey: 'end' },
  timeAggregation: { type: 'string', defaultValue: 'day', urlKey: 'aggr' },
  selectedClientIspIds: { type: 'array', urlKey: 'isps' },
};
const urlHandler = new UrlHandler(urlQueryConfig, browserHistory);


function mapStateToProps(state, propsWithUrl) {
  return {
    ...propsWithUrl,
    viewMetric: LocationPageSelectors.getViewMetric(state, propsWithUrl),
    clientIsps: LocationPageSelectors.getLocationClientIsps(state, propsWithUrl),
    selectedClientIsps: LocationPageSelectors.getLocationClientIspsSelected(state, propsWithUrl),
    hourly: LocationPageSelectors.getLocationHourly(state, propsWithUrl),
    hourlyStatus: LocationPageSelectors.getLocationHourlyStatus(state, propsWithUrl),
    locationTimeSeries: LocationPageSelectors.getLocationTimeSeries(state, propsWithUrl),
    timeSeriesStatus: LocationPageSelectors.getTimeSeriesStatus(state, propsWithUrl),
    clientIspTimeSeries: LocationPageSelectors.getLocationClientIspTimeSeries(state, propsWithUrl),
    highlightHourly: LocationPageSelectors.getHighlightHourly(state, propsWithUrl),
  };
}

class LocationPage extends PureComponent {
  static propTypes = {
    clientIspTimeSeries: PropTypes.array,
    clientIsps: PropTypes.array,
    dispatch: PropTypes.func,
    endDate: PropTypes.object, // date
    highlightHourly: PropTypes.object,
    hourly: PropTypes.object,
    hourlyStatus: PropTypes.string,
    location: PropTypes.object, // route location
    locationId: PropTypes.string,
    locationTimeSeries: PropTypes.object,
    selectedClientIspIds: PropTypes.array,
    selectedClientIsps: PropTypes.array,
    showBaselines: PropTypes.bool,
    showRegionalValues: PropTypes.bool,
    startDate: PropTypes.object, // date
    timeAggregation: PropTypes.string,
    timeSeriesStatus: PropTypes.string,
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
    const { dispatch, locationId, timeAggregation, clientIsps, selectedClientIspIds } = props;
    dispatch(LocationsActions.fetchTimeSeriesIfNeeded(timeAggregation, locationId));
    dispatch(LocationsActions.fetchHourlyIfNeeded(timeAggregation, locationId));
    dispatch(LocationsActions.fetchClientIspsIfNeeded(locationId));

    // setup selected ISPs if needed
    if (clientIsps) {
      if (!selectedClientIspIds) {
        // once we have the client ISPs for the location, if we don't have selected client ISPs,
        // set the selected client ISPs to the top 3 for the location.
        const newSelectedIsps = [];
        clientIsps.slice(0, 3).forEach(clientIsp => {
          const clientIspId = clientIsp.meta.client_asn_number;
          newSelectedIsps.push(clientIspId);
        });
        dispatch(LocationPageActions.changeSelectedClientIspIds(newSelectedIsps));
      }
    }

    // fetch data for selected Client ISPs
    if (selectedClientIspIds) {
      selectedClientIspIds.forEach(clientIspId => {
        dispatch(LocationsActions.fetchClientIspLocationTimeSeriesIfNeeded(timeAggregation,
          locationId, clientIspId));
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
    const locationName = this.props.locationId;
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
    return (
      <DateRangeSelector />
    );
  }

  renderClientIspSelector() {
    const { clientIsps = [], selectedClientIsps } = this.props;

    return (
      <div className="client-isp-selector">
        <IspSelect
          isps={clientIsps}
          selected={selectedClientIsps}
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
    return (
      <div className="subsection">
        <header>
          <h3>Compare Metrics</h3>
        </header>
      </div>
    );
  }

  renderProvidersByHour() {
    const { hourly, hourlyStatus, highlightHourly, locationId, viewMetric } = this.props;
    const extentKey = this.extentKey(viewMetric);
    const chartId = 'providers-hourly';
    const chartData = hourly && hourly.results;

    return (
      <div className="subsection">
        <header>
          <h3>By Hour, Median download speeds</h3>
        </header>
        <StatusWrapper status={hourlyStatus}>
          <HourChartWithCounts
            data={hourly && hourly.results}
            height={400}
            highlightPoint={highlightHourly}
            id={chartId}
            onHighlightPoint={this.onHighlightHourly}
            threshold={30}
            width={800}
            yExtent={hourly && hourly.extents[extentKey]}
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
    return (
      <div className="subsection">
        <header>
          <h3>Summary Data</h3>
        </header>
      </div>
    );
  }

  renderBreadCrumbs() {
    return (
      <div className="breadcrumbs">
        {'Some / Bread / Crumbs / '}
        <Link to={`/location/${this.props.locationId}`}>{this.props.locationId}</Link>
      </div>
    );
  }

  render() {
    const locationName = this.props.locationId || 'Location';

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
