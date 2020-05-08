import React, { PureComponent, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { batchActions } from 'redux-batched-actions';
import { browserHistory } from 'react-router';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import AutoWidth from 'react-auto-width';

import * as LocationPageSelectors from '../../redux/locationPage/selectors';
import * as LocationPageActions from '../../redux/locationPage/actions';
import * as LocationsSelectors from '../../redux/locations/selectors';
import * as LocationsActions from '../../redux/locations/actions';
import * as LocationClientIspActions from '../../redux/locationClientIsp/actions';

import timeAggregationFromDates from '../../utils/timeAggregationFromDates';
import { multiMergeMetaIntoResults, mergeMetaIntoResults } from '../../utils/exports';
import { metrics, defaultStartDate, defaultEndDate } from '../../constants';

import {
  ChartExportControls,
  LineChartWithCounts,
  HourChartWithCounts,
  LineChartSmallMult,
  MetricSelector,
  TimeAggregationSelector,
  StatusWrapper,
  IspSelectWithIncidents,
  IspSelect,
  DateRangeSelector,
  Breadcrumbs,
  ScatterGroup,
  HistoGroup,
  SummaryTable,
  HelpTip,
} from '../../components';

import { LocationSearch } from '../../containers';

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
  showRegionalValues: { type: 'boolean', defaultValue: true, urlKey: 'regional' },

  // selected time
  startDate: { type: 'date', urlKey: 'start', defaultValue: defaultStartDate },
  endDate: { type: 'date', urlKey: 'end', defaultValue: defaultEndDate },
  timeAggregation: { type: 'string', urlKey: 'aggr' },
  selectedClientIspIds: { type: 'set', urlKey: 'isps', persist: false },
};
const urlHandler = new UrlHandler(urlQueryConfig, browserHistory);

const fixedFields = [
  { id: 'lastThreeMonths', label: 'Last Three Months' },
  { id: 'lastSixMonths', label: 'Last Six Months' },
  { id: 'lastYear', label: 'Last Year' },
];

// TODO: Replace hardcoded data once API is implemented
// eslint-disable-next-line global-require
const incidentData = require('./sample_data/demo_incidentData.json');

// convert dates to moment objects within the incidentData object
if (incidentData) {
  const incidentASNs = Object.keys(incidentData);
  for (let asnIndex = 0; asnIndex < incidentASNs.length; asnIndex++) {
    const asn = incidentASNs[asnIndex];
    for (let incIndex = 0; incIndex < incidentData[asn].length; incIndex++) {
      const currentIncident = incidentData[asn][incIndex];
      currentIncident.goodPeriodStart = moment(currentIncident.goodPeriodStart);
      currentIncident.goodPeriodEnd = moment(currentIncident.goodPeriodEnd);
      currentIncident.badPeriodStart = moment(currentIncident.badPeriodStart);
      currentIncident.badPeriodEnd = moment(currentIncident.badPeriodEnd);
    }
  }
}

function mapStateToProps(state, propsWithUrl) {
  return {
    ...propsWithUrl,
    autoTimeAggregation: LocationPageSelectors.getAutoTimeAggregation(state, propsWithUrl),
    clientIspHourly: LocationPageSelectors.getLocationClientIspHourly(state, propsWithUrl),
    clientIspTimeSeries: LocationPageSelectors.getLocationClientIspTimeSeries(state, propsWithUrl),
    colors: LocationPageSelectors.getColors(state, propsWithUrl),
    compareMetrics: LocationPageSelectors.getCompareMetrics(state, propsWithUrl),
    highlightHourly: LocationPageSelectors.getHighlightHourly(state, propsWithUrl),
    highlightTimeSeriesDate: LocationPageSelectors.getHighlightTimeSeriesDate(state, propsWithUrl),
    highlightTimeSeriesLine: LocationPageSelectors.getHighlightTimeSeriesLine(state, propsWithUrl),
    hourlyExtents: LocationPageSelectors.getHourlyExtents(state, propsWithUrl),
    locationInfo: LocationsSelectors.getLocationInfo(state, propsWithUrl),
    locationAndClientIspTimeSeries: LocationPageSelectors.getLocationAndClientIspTimeSeries(state, propsWithUrl),
    locationHourly: LocationPageSelectors.getLocationHourly(state, propsWithUrl),
    locationTimeSeries: LocationsSelectors.getLocationTimeSeries(state, propsWithUrl),
    annotationTimeSeries: LocationPageSelectors.getAnnotationTimeSeries(state, propsWithUrl),
    selectedClientIspInfo: LocationPageSelectors.getLocationSelectedClientIspInfo(state, propsWithUrl),
    summary: LocationPageSelectors.getSummaryData(state, propsWithUrl),
    timeAggregation: LocationPageSelectors.getTimeAggregation(state, propsWithUrl),
    timeSeriesStatus: LocationPageSelectors.getTimeSeriesStatus(state, propsWithUrl),
    topClientIsps: LocationsSelectors.getLocationTopClientIsps(state, propsWithUrl),
    viewMetric: LocationPageSelectors.getViewMetric(state, propsWithUrl),
  };
}


class LocationPage extends PureComponent {
  static propTypes = {
    annotationTimeSeries: PropTypes.array,
    autoTimeAggregation: PropTypes.bool,
    clientIspHourly: PropTypes.array,
    clientIspTimeSeries: PropTypes.object,
    colors: PropTypes.object,
    compareMetrics: PropTypes.object,
    dispatch: PropTypes.func,
    endDate: momentPropTypes.momentObj,
    highlightHourly: PropTypes.number,
    highlightTimeSeriesDate: PropTypes.object,
    highlightTimeSeriesLine: PropTypes.object,
    hourlyExtents: PropTypes.object,
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

    this.state = {
      incident_asn: null, // This is the selected ISP object
    };

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
    this.onShowIncidentChange = this.onShowIncidentChange.bind(this);
    this.onDateRangeChange = this.onDateRangeChange.bind(this);
    this.changeIncidentASN = this.changeIncidentASN.bind(this);
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
    if (topClientIsps && topClientIsps.length) {
      // if we don't have selected client ISPs yet, select the top ones.
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
        dispatch(LocationClientIspActions.fetchInfoIfNeeded(locationId, clientIspId));
        dispatch(LocationClientIspActions.fetchTimeSeriesIfNeeded(timeAggregation, locationId,
          clientIspId, options));
        dispatch(LocationClientIspActions.fetchHourlyIfNeeded(timeAggregation, locationId,
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
    const { dispatch, autoTimeAggregation } = this.props;
    dispatch(LocationPageActions.changeTimeAggregation(value));

    // when we change time aggregation, we no longer want auto detection of it based on dates
    if (autoTimeAggregation) {
      dispatch(LocationPageActions.changeAutoTimeAggregation(false));
    }
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
    if (compareName === 'x') {
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
   * Callback to show an incident and change the time aggregation to month
   * @param {Array} ispIds Ids of ISPs to select or deselect based on current selection state
   */
  onShowIncidentChange(ispIds) {
    const { dispatch } = this.props;
    const actions = [];

    actions.push(LocationPageActions.changeSelectedClientIspIds(ispIds));

    // Automatically changes time aggregation to month based on our definition of an incident
    actions.push(LocationPageActions.changeTimeAggregation('month'));

    if (actions.length) {
      dispatch(batchActions(actions));
    }
  }

  /**
   * Callback for when start or end date is changed
   * @param {Date} startDate new startDate
   * @param {Date} endDate new endDate
   */
  onDateRangeChange(newStartDate, newEndDate) {
    const { dispatch, autoTimeAggregation, startDate, endDate } = this.props;
    const actions = [];
    // if we are auto-detecting time aggregation, set it based on the dates
    if (autoTimeAggregation) {
      actions.push(LocationPageActions.changeTimeAggregation(timeAggregationFromDates(newStartDate, newEndDate)));
    }

    const changedStartDate = (!startDate && newStartDate) || (newStartDate && !newStartDate.isSame(startDate, 'day'));
    const changedEndDate = (!endDate && newEndDate) || (newEndDate && !newEndDate.isSame(endDate, 'day'));

    if (changedStartDate) {
      actions.push(LocationPageActions.changeStartDate(newStartDate.toDate()));
    }
    if (changedEndDate) {
      actions.push(LocationPageActions.changeEndDate(newEndDate.toDate()));
    }

    if (actions.length) {
      dispatch(batchActions(actions));
    }
  }

  /**
   * Change the state to render incidents for a specified ISP (if it has an incident)
   * @param {String} asn the asn number for the incident object if specified
   */
  changeIncidentASN(asn) {
    this.setState({ incident_asn: asn }, () => {});
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
    const locationName = (locationInfo && (locationInfo.shortLabel || locationInfo.label)) || 'Loading...';

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
            {this.renderClientIspSelectorWithIncidents()}
            {this.renderMetricSelector()}
            {this.renderTimeAggregationSelector()}
          </Col>
          <Col md={9}>
            {this.renderCompareProviders()}
            {this.renderCompareMetrics()}
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            {this.renderMetricSelector()}
          </Col>
          <Col md={9}>
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

  renderClientIspSelectorWithIncidents() {
    const { topClientIsps = [], selectedClientIspInfo } = this.props;

    // Create ASN to ISP Object dictionary
    const asnToISPObj = {};
    for (let ispIndex = 0; ispIndex < topClientIsps.length; ispIndex++) {
      const incidents = topClientIsps[ispIndex];
      asnToISPObj[incidents.client_asn_number] = incidents;
    }

    return (
      <div className="client-isp-selector">
        <h5>Client ISPs <HelpTip id="client-isp-tip" /></h5>
        <IspSelectWithIncidents
          incidentData={incidentData}
          isps={asnToISPObj}
          selected={selectedClientIspInfo}
          onChange={this.onSelectedClientIspsChange}
          onShowIncident={this.onShowIncidentChange}
          onChangeIncidentASN={this.changeIncidentASN}
        />
      </div>
    );
  }

  renderClientIspSelector() {
    const { topClientIsps = [], selectedClientIspInfo } = this.props;

    return (
      <div className="client-isp-selector">
        <h5>Client ISPs <HelpTip id="client-isp-tip" /></h5>
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
    const enableShowBaselinesToggle = false;
    return (
      <div className="chart-options">
        <ul className="list-inline">
          {enableShowBaselinesToggle ? (
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
          ) : null}
          <li>
            <div className="checkbox">
              <label htmlFor="show-regional-values">
                <input
                  type="checkbox"
                  checked={showRegionalValues}
                  id="show-regional-values"
                  onChange={this.onShowRegionalValuesChange}
                />
                {' Show Regional Values '}
                <HelpTip id="regional-tip" />
              </label>
            </div>
          </li>
        </ul>
      </div>
    );
  }


  renderCompareProviders() {
    const { clientIspTimeSeries, highlightTimeSeriesDate, highlightTimeSeriesLine,
      locationId, locationTimeSeries, timeSeriesStatus, viewMetric, colors,
      annotationTimeSeries } = this.props;
    const chartId = 'providers-time-series';

    // use location totals as the counts
    const counts = locationTimeSeries && locationTimeSeries.results;

    // show the sum of the selected ISP counts if no highlighted ISP
    const { data: clientIspTimeSeriesData, counts: clientIspCounts } = clientIspTimeSeries;

    return (
      <div className="subsection">
        <header>
          <h3>Compare Providers</h3>
        </header>
        <StatusWrapper status={timeSeriesStatus}>
          <AutoWidth>
            <LineChartWithCounts
              id={chartId}
              colors={colors}
              counts={counts}
              highlightCounts={clientIspCounts}
              series={clientIspTimeSeriesData}
              annotationSeries={annotationTimeSeries}
              onHighlightDate={this.onHighlightTimeSeriesDate}
              highlightDate={highlightTimeSeriesDate}
              onHighlightLine={this.onHighlightTimeSeriesLine}
              highlightLine={highlightTimeSeriesLine}
              incidentData={incidentData}
              selectedASN={this.state.incident_asn ? this.state.incident_asn : null}
              yFormatter={viewMetric.formatter}
              xKey="date"
              yAxisLabel={viewMetric.label}
              yAxisUnit={viewMetric.unit}
              yKey={viewMetric.dataKey}
            />
          </AutoWidth>
          <ChartExportControls
            className="for-line-chart"
            chartId={chartId}
            data={[...clientIspTimeSeriesData, locationTimeSeries]}
            prepareForCsv={multiMergeMetaIntoResults}
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
          <h3>Compare Metrics <HelpTip id="compare-metrics-tip" />
          </h3>
        </header>
        <StatusWrapper status={timeSeriesStatus}>
          <AutoWidth>
            <LineChartSmallMult
              id={chartId}
              series={locationAndClientIspTimeSeries}
              xKey="date"
              metrics={metrics}
              timeAggregation={timeAggregation}
            />
          </AutoWidth>
        </StatusWrapper>
      </div>
    );
  }

  renderProvidersByHour() {
    const { locationHourly, viewMetric, clientIspHourly, colors } = this.props;

    return (
      <div className="subsection">
        <header>
          <h3>{`${viewMetric.label} by Hour`} <HelpTip id="hour-metric-tip" /></h3>
        </header>
        <Row>
          {this.renderHourChart(locationHourly)}
          {clientIspHourly.map((hourly, i) => [
            this.renderHourChart(hourly, colors[hourly.data && hourly.data.meta.id]),
            i % 2 === 0 ? <div className="clearfix" key={i} /> : null,
          ])}
        </Row>
      </div>
    );
  }

  renderHourChart(hourly, color) {
    const { highlightHourly, hourlyExtents, locationId, viewMetric } = this.props;
    const extentKey = viewMetric.dataKey;

    if (!hourly) {
      return null;
    }

    const { data: hourlyData, status: hourlyStatus, wrangled } = hourly;

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
            <AutoWidth>
              <HourChartWithCounts
                color={color}
                countExtent={hourlyExtents.count}
                dataByHour={wrangled.dataByHour}
                overallData={wrangled.overallData}
                highlightHour={highlightHourly}
                id={chartId}
                onHighlightHour={this.onHighlightHourly}
                yAxisLabel={viewMetric.label}
                yAxisUnit={viewMetric.unit}
                yExtent={hourlyExtents[extentKey]}
                yFormatter={viewMetric.formatter}
                yKey={viewMetric.dataKey}
              />
            </AutoWidth>
            <ChartExportControls
              className="for-hour-chart"
              chartId={chartId}
              data={hourlyData}
              prepareForCsv={mergeMetaIntoResults}
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
              <h2>Compare Fixed Time Frame <HelpTip id="fixed-time-tip" /></h2>
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
    return (
      <div className="subsection">
        <header>
          <h3>Compare Metrics <HelpTip id="fixed-compare-metrics-tip" />
          </h3>
        </header>
        <ScatterGroup
          summary={summary}
          fields={fixedFields}
          compareMetrics={compareMetrics}
          onChange={this.onCompareMetricsChange}
        />
      </div>
    );
  }

  renderFixedDistributions() {
    const { viewMetric, summary = {} } = this.props;
    return (
      <div className="subsection">
        <header>
          <h3>Distribution of {viewMetric.label} <HelpTip id="fixed-metric-tip" />
          </h3>
        </header>
        <HistoGroup
          summary={summary}
          fields={fixedFields}
          viewMetric={viewMetric}
        />
      </div>
    );
  }

  renderFixedSummaryData() {
    const { summary = {} } = this.props;
    const { lastThreeMonths = {}, lastSixMonths = {}, lastYear = {} } = summary;

    return (
      <div className="subsection">
        <header>
          <h3>Summary Data</h3>
        </header>
        <h4>Last Three Months</h4>
        <SummaryTable data={lastThreeMonths.clientIspsData} bottomData={lastThreeMonths.locationData} />
        <h4>Last Six Months</h4>
        <SummaryTable data={lastSixMonths.clientIspsData} bottomData={lastSixMonths.locationData} />
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

  renderLocationSearch() {
    const { location } = this.props;

    return (
      <LocationSearch
        query={queryRebuild(location.query, urlQueryConfig)}
      />
    );
  }

  renderLocationHeader() {
    return (
      <Row className="location-header">
        <Col md={8}>
          {this.renderBreadCrumbs()}
        </Col>
        <Col md={4} className="pull-left">
          {this.renderLocationSearch()}
        </Col>
      </Row>
    );
  }

  render() {
    const { locationInfo } = this.props;
    const locationName = (locationInfo && (locationInfo.shortLabel || locationInfo.label)) || 'Location';

    return (
      <div className="LocationPage">
        <Helmet title={locationName} />
        {this.renderLocationHeader()}
        {this.renderCityProviders()}
        {this.renderFixedTimeFrames()}
      </div>
    );
  }
}

export default urlConnect(urlHandler, mapStateToProps)(LocationPage);
