import React, { PureComponent, PropTypes } from 'react';
import Helmet from 'react-helmet';
import moment from 'moment';
import { browserHistory, withRouter } from 'react-router';
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
  CompareInputPanel,
  CompareTimeSeriesCharts,
  DateRangeSelector,
  HourChartWithCounts,
  LineChartWithCounts,
  MetricSelector,
  SelectableList,
  StatusWrapper,
  TimeAggregationSelector,
} from '../../components';

import UrlHandler from '../../url/UrlHandler';
import urlConnect from '../../url/urlConnect';
import queryRebuild from '../../url/queryRebuild';

import './ComparePage.scss';

// Define how to read/write state to URL query parameters
const urlQueryConfig = {
  viewMetric: { type: 'string', defaultValue: 'download', urlKey: 'metric' },

  // selected time
  // TODO: change defaults to more recent time period when data is up-to-date
  startDate: { type: 'date', urlKey: 'start', defaultValue: moment('2015-10-1') },
  endDate: { type: 'date', urlKey: 'end', defaultValue: moment('2015-11-1') },
  timeAggregation: { type: 'string', defaultValue: 'day', urlKey: 'aggr' },
  facetItemIds: { type: 'array', urlKey: 'selected', persist: false },
  filter1Ids: { type: 'array', urlKey: 'filter1', persist: false },
  filter2Ids: { type: 'array', urlKey: 'filter2', persist: false },
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
    filterTypes: ComparePageSelectors.getFilterTypes(state, propsWithUrl),
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
    filterTypes: PropTypes.array,
    highlightHourly: PropTypes.number,
    highlightTimeSeriesDate: PropTypes.object,
    highlightTimeSeriesLine: PropTypes.object,
    location: PropTypes.object, // route location
    router: PropTypes.object, // react-router
    singleFilterHourly: PropTypes.object,
    singleFilterTimeSeries: PropTypes.object,
    startDate: momentPropTypes.momentObj,
    timeAggregation: PropTypes.string,
    viewMetric: PropTypes.object,
  }

  static defaultProps = {
    facetType: 'location',
    facetItemIds: [],
    filter1Ids: [],
    filter2Ids: [],
  }

  constructor(props) {
    super(props);

    // bind handlers
    this.onDateRangeChange = this.onDateRangeChange.bind(this);
    this.onFacetTypeChange = this.onFacetTypeChange.bind(this);
    this.onFacetItemsChange = this.onFacetItemsChange.bind(this);
    this.onFilter1Change = this.onFilter1Change.bind(this);
    this.onFilter2Change = this.onFilter2Change.bind(this);
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
    const { location, router } = this.props;
    const path = `/compare/${value}`;
    const query = queryRebuild(location.query, urlQueryConfig);

    router.push({ pathname: path, query });
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
   * Callback when the facet item list changes
   * @param {Array} facetItems array of info objects
   */
  onFacetItemsChange(facetItems) {
    const { facetType, dispatch } = this.props;
    if (facetType.value === 'location') {
      dispatch(ComparePageActions.changeFacetLocations(facetItems, dispatch));
    } else if (facetType.value === 'clientIsp') {
      dispatch(ComparePageActions.changeFacetClientIsps(facetItems, dispatch));
    } else if (facetType.value === 'transitIsp') {
      dispatch(ComparePageActions.changeFacetTransitIsps(facetItems, dispatch));
    }
  }

  /**
   * Callback when the filter1 list changes
   * @param {Array} filterItems array of info objects
   */
  onFilter1Change(filterItems) {
    const { filterTypes, dispatch } = this.props;
    const filterType = filterTypes[0];

    if (filterType.value === 'location') {
      dispatch(ComparePageActions.changeFilterLocations(filterItems, 'filter1', dispatch));
    } else if (filterType.value === 'clientIsp') {
      dispatch(ComparePageActions.changeFilterClientIsps(filterItems, 'filter1', dispatch));
    } else if (filterType.value === 'transitIsp') {
      dispatch(ComparePageActions.changeFilterTransitIsps(filterItems, 'filter1', dispatch));
    }
  }

  /**
   * Callback when the filter2 list changes
   * @param {Array} filterItems array of info objects
   */
  onFilter2Change(filterItems) {
    const { filterTypes, dispatch } = this.props;
    const filterType = filterTypes[1];

    if (filterType.value === 'location') {
      dispatch(ComparePageActions.changeFilterLocations(filterItems, 'filter2', dispatch));
    } else if (filterType.value === 'clientIsp') {
      dispatch(ComparePageActions.changeFilterClientIsps(filterItems, 'filter2', dispatch));
    } else if (filterType.value === 'transitIsp') {
      dispatch(ComparePageActions.changeFilterTransitIsps(filterItems, 'filter2', dispatch));
    }
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

  renderInputSection() {
    const { facetItemIds, facetItemInfos, facetType, filter1Ids, filter1Infos,
      filter2Ids, filter2Infos, filterTypes } = this.props;

    return (
      <Row>
        <Col md={3}>
          {this.renderFacetSelector()}
        </Col>
        <Col md={9}>
          <CompareInputPanel
            facetItemIds={facetItemIds}
            facetItemInfos={facetItemInfos}
            facetType={facetType}
            filter1Ids={filter1Ids}
            filter1Infos={filter1Infos}
            filter2Ids={filter2Ids}
            filter2Infos={filter2Infos}
            filterTypes={filterTypes}
            onFacetItemsChange={this.onFacetItemsChange}
            onFilter1Change={this.onFilter1Change}
            onFilter2Change={this.onFilter2Change}
          />
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
    const { filterTypes, filter1Ids, filter2Ids } = this.props;
    const breakdownBy = filterTypes[0]; // TODO this should be read from URL

    if (filter1Ids.length && filter2Ids.length) {
      return (
        <div className="breakdown-by-selector">
          <h5>Breakdown By</h5>
          <SelectableList items={filterTypes} active={breakdownBy.value} onChange={this.onBreakdownByChange} />
        </div>
      );
    }

    return null;
  }

  renderBreakdown() {
    const {
      facetItemInfos,
      facetItemTimeSeries,
      filter1Ids,
      filter1Infos,
      filter2Ids,
      filter2Infos,
      highlightTimeSeriesDate,
      highlightTimeSeriesLine,
      singleFilterTimeSeries,
      viewMetric,
    } = this.props;

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
            {facetItemInfos.map((facetItemInfo) => (
              <CompareTimeSeriesCharts
                key={facetItemInfo.id}
                facetItemId={facetItemInfo.id}
                facetItemInfo={facetItemInfo}
                facetItemTimeSeries={facetItemTimeSeries}
                filter1Ids={filter1Ids}
                filter1Infos={filter1Infos}
                filter2Ids={filter2Ids}
                filter2Infos={filter2Infos}
                highlightTimeSeriesDate={highlightTimeSeriesDate}
                highlightTimeSeriesLine={highlightTimeSeriesLine}
                onHighlightTimeSeriesDate={this.onHighlightTimeSeriesDate}
                onHighlightTimeSeriesLine={this.onHighlightTimeSeriesLine}
                singleFilterTimeSeries={singleFilterTimeSeries}
                viewMetric={viewMetric}
              />
            ))}
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

export default urlConnect(urlHandler, mapStateToProps)(withRouter(ComparePage));
