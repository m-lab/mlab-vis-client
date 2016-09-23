import React, { PureComponent, PropTypes } from 'react';
import Helmet from 'react-helmet';
import moment from 'moment';
import { browserHistory } from 'react-router';
import momentPropTypes from 'react-moment-proptypes';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import * as ComparePageSelectors from '../../redux/comparePage/selectors';
import * as ComparePageActions from '../../redux/comparePage/actions';
import * as LocationsActions from '../../redux/locations/actions';
import * as ClientIspsActions from '../../redux/clientIsps/actions';
import * as TransitIspsActions from '../../redux/transitIsps/actions';

// import { colorsFor } from '../../utils/color';
import { facetTypes } from '../../constants';

import {
  ChartExportControls,
  DateRangeSelector,
  HourChartWithCounts,
  LineChartWithCounts,
  MetricSelector,
  SearchSelect,
  SelectableList,
  StatusWrapper,
  TimeAggregationSelector,
} from '../../components';

import UrlHandler from '../../url/UrlHandler';
import urlConnect from '../../url/urlConnect';

import './ComparePage.scss';

// Define how to read/write state to URL query parameters
const urlQueryConfig = {
  viewMetric: { type: 'string', defaultValue: 'download', urlKey: 'metric' },
  facetType: { type: 'string', defaultValue: 'location', urlKey: 'facetBy' },

  // selected time
  // TODO: change defaults to more recent time period when data is up-to-date
  startDate: { type: 'date', urlKey: 'start', defaultValue: moment('2015-10-1') },
  endDate: { type: 'date', urlKey: 'end', defaultValue: moment('2015-11-1') },
  timeAggregation: { type: 'string', defaultValue: 'day', urlKey: 'aggr' },
  facetItemIds: { type: 'array', urlKey: 'selected' },
  filter1Ids: { type: 'array', urlKey: 'filter1' },
  filter2Ids: { type: 'array', urlKey: 'filter2' },
};
const urlHandler = new UrlHandler(urlQueryConfig, browserHistory);

function mapStateToProps(state, propsWithUrl) {
  return {
    ...propsWithUrl,
    colors: ComparePageSelectors.getColors(state, propsWithUrl),
    facetItemHourly: ComparePageSelectors.getFacetItemHourly(state, propsWithUrl),
    facetItemInfos: ComparePageSelectors.getFacetItemInfos(state, propsWithUrl),
    facetItemTimeSeries: ComparePageSelectors.getFacetItemTimeSeries(state, propsWithUrl),
    facetType: ComparePageSelectors.getFacetType(state, propsWithUrl),
    filter1Infos: ComparePageSelectors.getFilter1Infos(state, propsWithUrl),
    filter2Infos: ComparePageSelectors.getFilter2Infos(state, propsWithUrl),
    highlightHourly: ComparePageSelectors.getHighlightHourly(state, propsWithUrl),
    highlightTimeSeriesDate: ComparePageSelectors.getHighlightTimeSeriesDate(state, propsWithUrl),
    highlightTimeSeriesLine: ComparePageSelectors.getHighlightTimeSeriesLine(state, propsWithUrl),
    singleFilterHourly: ComparePageSelectors.getSingleFilterHourly(state, propsWithUrl),
    singleFilterTimeSeries: ComparePageSelectors.getSingleFilterTimeSeries(state, propsWithUrl),
    viewMetric: ComparePageSelectors.getViewMetric(state, propsWithUrl),
  };
}

const pageTitle = 'Compare';
class ComparePage extends PureComponent {
  static propTypes = {
    colors: PropTypes.object,
    dispatch: PropTypes.func,
    endDate: momentPropTypes.momentObj,
    facetItemHourly: PropTypes.array,
    facetItemIds: PropTypes.array,
    facetItemInfos: PropTypes.array,
    facetItemTimeSeries: PropTypes.object,
    facetType: PropTypes.object,
    filter1Ids: PropTypes.array,
    filter1Infos: PropTypes.array,
    filter2Ids: PropTypes.array,
    filter2Infos: PropTypes.array,
    highlightHourly: PropTypes.number,
    highlightTimeSeriesDate: PropTypes.object,
    highlightTimeSeriesLine: PropTypes.object,
    singleFilterHourly: PropTypes.object,
    singleFilterTimeSeries: PropTypes.object,
    startDate: momentPropTypes.momentObj,
    timeAggregation: PropTypes.string,
    viewMetric: PropTypes.object,
  }

  static defaultProps = {
    facetItemIds: [],
    filter1Ids: [],
    filter2Ids: [],
  }

  constructor(props) {
    super(props);

    // bind handlers
    this.onDateRangeChange = this.onDateRangeChange.bind(this);
    this.onFacetTypeChange = this.onFacetTypeChange.bind(this);
    this.onFacetLocationsChange = this.onFacetLocationsChange.bind(this);
    this.onFilterClientIspsChange = this.onFilterClientIspsChange.bind(this);
    this.onFilterTransitIspsChange = this.onFilterTransitIspsChange.bind(this);
    this.onHighlightHourly = this.onHighlightHourly.bind(this);
    this.onHighlightTimeSeriesDate = this.onHighlightTimeSeriesDate.bind(this);
    this.onHighlightTimeSeriesLine = this.onHighlightTimeSeriesLine.bind(this);
    this.onTimeAggregationChange = this.onTimeAggregationChange.bind(this);
    this.onViewMetricChange = this.onViewMetricChange.bind(this);
  }

  componentDidMount() {
    this.fetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps);
  }

  /**
   * Fetch the data for the page (if needed)
   */
  fetchData(props) {
    const { facetType } = props;

    if (facetType.value === 'location') {
      this.fetchDataFacetTypeLocation(props);
    } else if (facetType.value === 'clientIsp') {
      // this.fetchDataFacetTypeClientIsp(props);
    }
  }

  /**
   * Fetch the data for the page when the facet type is Location (if needed)
   */
  fetchDataFacetTypeLocation(props) {
    const { dispatch, facetItemIds, filter1Ids, filter2Ids,
      timeAggregation, startDate, endDate } = props;
    const options = { startDate, endDate };

    const filterClientIspIds = filter1Ids;
    const filterTransitIspIds = filter2Ids;

    // get facet location info if needed
    facetItemIds.forEach(facetLocationId => {
      dispatch(LocationsActions.fetchInfoIfNeeded(facetLocationId));
    });

    // get filter client ISP info if needed
    filterClientIspIds.forEach(filterClientIspId => {
      dispatch(ClientIspsActions.fetchInfoIfNeeded(filterClientIspId));
    });

    // get filter transit ISP info if needed
    filterTransitIspIds.forEach(filterTransitIspId => {
      dispatch(TransitIspsActions.fetchInfoIfNeeded(filterTransitIspId));
    });

    // fetch the time series and hourly data for facet locations (unfiltered)
    facetItemIds.forEach(locationId => {
      dispatch(LocationsActions.fetchTimeSeriesIfNeeded(timeAggregation, locationId, options));
      dispatch(LocationsActions.fetchHourlyIfNeeded(timeAggregation, locationId, options));

      // TODO: handle options for when both filters are active

      // fetch the data for each of the filter client ISPs
      filterClientIspIds.forEach(clientIspId => {
        dispatch(LocationsActions.fetchClientIspLocationTimeSeriesIfNeeded(timeAggregation, locationId,
          clientIspId, options));
        dispatch(LocationsActions.fetchClientIspLocationHourlyIfNeeded(timeAggregation, locationId,
          clientIspId, options));
      });

      // TODO: fetch data for filter transit ISPs
    });
  }

  /**
   * Callback for when facet changes - updates URL
   */
  onFacetTypeChange(value) {
    const { dispatch } = this.props;
    dispatch(ComparePageActions.changeFacetType(value));
  }

  /**
   * Callback for time aggregation checkbox
   */
  onTimeAggregationChange(value) {
    const { dispatch } = this.props;
    dispatch(ComparePageActions.changeTimeAggregation(value));
  }

  /**
   * Callback for when viewMetric changes - updates URL
   */
  onViewMetricChange(value) {
    const { dispatch } = this.props;
    dispatch(ComparePageActions.changeViewMetric(value));
  }

  /**
   * Callback for when start or end date is changed
   * @param {Date} startDate new startDate
   * @param {Date} endDate new endDate
   */
  onDateRangeChange(newStartDate, newEndDate) {
    const { dispatch, startDate, endDate } = this.props;
    if ((!startDate && newStartDate) || (newStartDate && !newStartDate.isSame(startDate, 'day'))) {
      dispatch(ComparePageActions.changeStartDate(newStartDate.toDate()));
    }
    if ((!endDate && newEndDate) || (newEndDate && !newEndDate.isSame(endDate, 'day'))) {
      dispatch(ComparePageActions.changeEndDate(newEndDate.toDate()));
    }
  }

  /**
   * Callback when the facet location list changes
   * @param {Array} facetLocations array of location info objects
   */
  onFacetLocationsChange(facetLocations) {
    const { dispatch } = this.props;
    dispatch(ComparePageActions.changeFacetLocations(facetLocations, dispatch));
  }

  /**
   * Callback when the filter client ISP list changes
   * @param {Array} clientIsps array of client ISP info objects
   */
  onFilterClientIspsChange(clientIsps) {
    const { dispatch } = this.props;
    dispatch(ComparePageActions.changeFilterClientIsps(clientIsps, dispatch));
  }

  /**
   * Callback when the filter transit ISP list changes
   * @param {Array} transitIsps array of transit ISP info objects
   */
  onFilterTransitIspsChange(transitIsps) {
    const { dispatch } = this.props;
    dispatch(ComparePageActions.changeFilterTransitIsps(transitIsps, dispatch));
  }

  /**
   * Callback for when a point is highlighted in hourly
   */
  onHighlightHourly(d) {
    const { dispatch } = this.props;
    dispatch(ComparePageActions.highlightHourly(d));
  }

  /**
   * Callback for when a date is highlighted in time series
   */
  onHighlightTimeSeriesDate(date) {
    const { dispatch } = this.props;
    dispatch(ComparePageActions.highlightTimeSeriesDate(date));
  }

  /**
   * Callback for when a line is highlighted in time series
   */
  onHighlightTimeSeriesLine(series) {
    const { dispatch } = this.props;
    dispatch(ComparePageActions.highlightTimeSeriesLine(series));
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

  renderFacetSelector() {
    const { facetType } = this.props;

    return (
      <div className="facet-by-selector">
        <h5>Facet By</h5>
        <SelectableList items={facetTypes} active={facetType.value} onChange={this.onFacetTypeChange} />
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

  renderLocationInputs() {
    const { facetItemIds, facetItemInfos, filter1Infos, filter2Infos } = this.props;
    const hasFacetLocations = facetItemIds.length;
    return (
      <div className="input-section subsection">
        <div>
          <header>
            <h3>Locations</h3>
          </header>
          <p>Select one or more locations to explore measurements in. Each location will get its own chart.</p>
          <SearchSelect type="location" onChange={this.onFacetLocationsChange} selected={facetItemInfos} />
        </div>
        <Row>
          <Col md={6}>
            <h4>Filter by Client ISP</h4>
            <p>Select one or more Client ISPs to filter the measurements by.</p>
            <SearchSelect
              type="clientIsp"
              orientation="vertical"
              disabled={!hasFacetLocations}
              onChange={this.onFilterClientIspsChange}
              selected={filter1Infos}
            />
          </Col>
          <Col md={6}>
            <h4>Filter by Transit ISP</h4>
            <p>Select one or more Transit ISPs to filter the measurements by.</p>
            <SearchSelect
              type="transitIsp"
              orientation="vertical"
              disabled={!hasFacetLocations}
              onChange={this.onFilterTransitIspsChange}
              selected={filter2Infos}
            />
          </Col>
        </Row>
      </div>
    );
  }

  renderInputSection() {
    return (
      <Row>
        <Col md={3}>
          {this.renderFacetSelector()}
        </Col>
        <Col md={9}>
          {this.renderLocationInputs()}
        </Col>
      </Row>
    );
  }

  renderOverall() {
    const { facetType } = this.props;
    return (
      <Row>
        <Col md={3}>
          {this.renderMetricSelector()}
          {this.renderTimeAggregationSelector()}
        </Col>
        <Col md={9}>
          <div className="subsection">
            <header>
              <h3>{`Compare ${facetType.label}s`}</h3>
            </header>
            {this.renderOverallTimeSeries()}
          </div>
        </Col>
      </Row>
    );
  }

  renderTimeSeries(chartId, status, seriesData) {
    const {
      highlightTimeSeriesDate,
      highlightTimeSeriesLine,
      viewMetric,
    } = this.props;

    if (!seriesData || seriesData.length === 0) {
      return null;
    }

    return (
      <StatusWrapper status={status}>
        <LineChartWithCounts
          id={chartId}
          series={seriesData}
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
          data={seriesData}
          filename={`compare_${viewMetric.value}_${chartId}`}
        />
      </StatusWrapper>
    );
  }

  renderOverallTimeSeries() {
    const {
      facetItemTimeSeries,
    } = this.props;

    const { combined } = facetItemTimeSeries;
    const chartId = 'overall-time-series';
    return this.renderTimeSeries(chartId, combined.status, combined.data);
  }

  // if filters are empty, show the facet item line in the chart
  renderBreakdownGroupNoFilters(facetItemInfo) {
    const {
      facetItemTimeSeries,
    } = this.props;

    const chartId = `facet-time-series-${facetItemInfo.id}`;
    const timeSeries = facetItemTimeSeries.timeSeries.find(seriesData => seriesData.id === facetItemInfo.id);

    return this.renderTimeSeries(chartId, timeSeries.status, timeSeries.data);
  }

  // if one filter has items, show the lines for those filter items in the chart
  renderBreakdownGroupSingleFilter(facetItemInfo) {
    const {
      singleFilterTimeSeries,
    } = this.props;

    const chartId = `facet-single-filtered-time-series-${facetItemInfo.id}`;

    const timeSeriesObject = singleFilterTimeSeries[facetItemInfo.id];
    return this.renderTimeSeries(chartId, timeSeriesObject.status, timeSeriesObject.data);
  }

  // if both filters have items, group by `breakdownBy` filter and have the other filter items have lines in those charts
  renderBreakdownGroupBothFilters(facetItemInfo, filter1Infos, filter2Infos) {
    const {
      facetItemTimeSeries,
    } = this.props;

    const chartId = `facet-double-filtered-time-series-${facetItemInfo.id}`;

    // TODO: produce a number of time series based on filter1 -> filter2
    const timeSeries = facetItemTimeSeries.timeSeries.find(seriesData => seriesData.id === facetItemInfo.id);

    return this.renderTimeSeries(chartId, timeSeries.status, timeSeries.data);
  }

  renderBreakdownGroup(facetItemInfo) {
    const { filter1Ids, filter1Infos, filter2Ids, filter2Infos } = this.props;
    // if filters are empty, show the facet item line in the chart
    // if one filter has items, show the lines for those filter items in the chart
    // if both filters have items, group by `breakdownBy` filter and have the other filter items have lines in those charts
    let groupCharts;

    // no filters
    if (!filter1Ids.length && !filter2Ids.length) {
      groupCharts = this.renderBreakdownGroupNoFilters(facetItemInfo);

    // only one filter (client ISPs)
    } else if (filter1Ids.length && !filter2Ids.length) {
      groupCharts = this.renderBreakdownGroupSingleFilter(facetItemInfo, filter1Infos);

    // only one filter (transit ISPs)
    } else if (!filter1Ids.length && filter2Ids.length) {
      groupCharts = this.renderBreakdownGroupSingleFilter(facetItemInfo, filter2Infos);

    // else two filters
    } else {
      // TODO: order filter1, filter2 based on breakdownBy
      groupCharts = this.renderBreakdownGroupBothFilters(facetItemInfo, filter1Infos, filter2Infos);
    }

    return (
      <div key={facetItemInfo.id}>
        <h4>{facetItemInfo.label}</h4>
        {groupCharts}
      </div>
    );
  }

  renderHourly(chartId, status, hourlyData) {
    const {
      highlightHourly,
      viewMetric,
      colors,
    } = this.props;

    if (!hourlyData || hourlyData.length === 0) {
      return null;
    }
    const color = colors[hourlyData.meta.id];

    return (
      <StatusWrapper status={status}>
        <HourChartWithCounts
          color={color}
          data={hourlyData.results}
          highlightHour={highlightHourly}
          id={chartId}
          onHighlightHour={this.onHighlightHourly}
          threshold={30}
          width={400}
          yAxisLabel={viewMetric.label}
          yAxisUnit={viewMetric.unit}
          yExtent={hourlyData.extents[viewMetric.dataKey]}
          yFormatter={viewMetric.formatter}
          yKey={viewMetric.dataKey}
        />
        <ChartExportControls
          chartId={chartId}
          data={hourlyData.results}
          filename={`compare_hourly_${viewMetric.value}_${chartId}`}
        />
      </StatusWrapper>
    );
  }

  // if filters are empty, show the facet item line in the chart
  renderBreakdownGroupHourlyNoFilters(facetItemInfo) {
    const {
      facetItemHourly,
    } = this.props;
    const chartId = `facet-hourly-${facetItemInfo.id}`;
    const hourly = facetItemHourly.find(hourly => hourly.id === facetItemInfo.id);

    return this.renderHourly(chartId, hourly.status, hourly.data);
  }

  // if one filter has items, show the lines for those filter items in the chart
  renderBreakdownGroupHourlySingleFilter(facetItemInfo, filter1Infos) {
    const {
      singleFilterHourly,
    } = this.props;


    const hourlyObjects = singleFilterHourly[facetItemInfo.id];

    // render a chart for each filter item
    return (
      <Row>
        {hourlyObjects.map(hourlyObject => {
          const info = filter1Infos.find(d => d.id === hourlyObject.id) || { label: 'Loading...' };
          const chartId = `facet-single-filtered-hourly-${facetItemInfo.id}-${hourlyObject.id}`;
          return (
            <Col key={hourlyObject.id} md={6}>
              <h5>{info.label}</h5>
              {this.renderHourly(chartId, hourlyObject.status, hourlyObject.data)}
            </Col>
          );
        })}
      </Row>
    );
  }

  // if both filters have items, group by `breakdownBy` filter and have the other filter items have lines in those charts
  renderBreakdownGroupHourlyBothFilters(facetItemInfo, filter1Infos, filter2Infos) {
    const {
      facetItemHourly,
    } = this.props;

    const chartId = `facet-double-filtered-hourly-${facetItemInfo.id}`;

    // TODO: produce a number of time series based on filter1 -> filter2
    const hourly = facetItemHourly.find(hourly => hourly.id === facetItemInfo.id);

    return this.renderHourly(chartId, hourly.status, hourly.data);
  }

  renderBreakdownGroupHourly(facetItemInfo) {
    const { filter1Ids, filter1Infos, filter2Ids, filter2Infos } = this.props;
    // if filters are empty, show the facet item line in the chart
    // if one filter has items, show the lines for those filter items in the chart
    // if both filters have items, group by `breakdownBy` filter and have the other filter items have lines in those charts
    let groupCharts;
    let colSize = 6;

    // no filters
    if (!filter1Ids.length && !filter2Ids.length) {
      groupCharts = this.renderBreakdownGroupHourlyNoFilters(facetItemInfo);

    // only one filter (client ISPs)
    } else if (filter1Ids.length && !filter2Ids.length) {
      colSize = 12;
      groupCharts = this.renderBreakdownGroupHourlySingleFilter(facetItemInfo, filter1Infos);

    // only one filter (transit ISPs)
    } else if (!filter1Ids.length && filter2Ids.length) {
      colSize = 12;
      groupCharts = this.renderBreakdownGroupHourlySingleFilter(facetItemInfo, filter2Infos);

    // else two filters
    } else {
      // TODO: order filter1, filter2 based on breakdownBy
      colSize = 12;
      groupCharts = this.renderBreakdownGroupHourlyBothFilters(facetItemInfo, filter1Infos, filter2Infos);
    }

    return (
      <Col key={facetItemInfo.id} md={colSize}>
        <h4>{facetItemInfo.label}</h4>
        {groupCharts}
      </Col>
    );
  }


  renderBreakdownOptions() {
    // TODO: when both filters have values, choose which one to breakdown by
    return (<div />);
  }

  renderBreakdown() {
    const { facetItemInfos } = this.props;
    // if filters are empty, show the facet item line in the chart
    // if one filter has items, show the lines for those filter items in the chart
    // if both filters have items, group by `breakdownBy` filter and have the other filter items have lines in those charts
    return (
      <Row>
        <Col md={3}>
          {this.renderBreakdownOptions()}
        </Col>
        <Col md={9}>
          <div className="subsection">
            <header>
              <h3>Breakdown</h3>
            </header>
            {facetItemInfos.map((facetItemInfo) => this.renderBreakdownGroup(facetItemInfo))}
          </div>
          <div className="subsection">
            <header>
              <h3>By Hour</h3>
            </header>
            <Row>
              {facetItemInfos.map((facetItemInfo) => this.renderBreakdownGroupHourly(facetItemInfo))}
            </Row>
          </div>
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <div className="ComparePage">
        <Helmet title={pageTitle} />
        <div className="section">
          <header>
            <Row>
              <Col md={3}>
                <h2>{pageTitle}</h2>
              </Col>
              <Col md={9}>
                {this.renderTimeRangeSelector()}
              </Col>
            </Row>
          </header>
          {this.renderInputSection()}
          {this.renderOverall()}
          {this.renderBreakdown()}
        </div>
      </div>
    );
  }
}

export default urlConnect(urlHandler, mapStateToProps)(ComparePage);
