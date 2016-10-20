import React, { PureComponent, PropTypes } from 'react';
import { batchActions } from 'redux-batched-actions';
import Helmet from 'react-helmet';
import { browserHistory, withRouter } from 'react-router';
import momentPropTypes from 'react-moment-proptypes';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import AutoWidth from 'react-auto-width';

import * as ComparePageSelectors from '../../redux/comparePage/selectors';
import * as ComparePageActions from '../../redux/comparePage/actions';
import * as TopActions from '../../redux/top/actions';
import * as LocationsActions from '../../redux/locations/actions';
import * as ClientIspsActions from '../../redux/clientIsps/actions';
import * as TransitIspsActions from '../../redux/transitIsps/actions';
import * as LocationClientIspActions from '../../redux/locationClientIsp/actions';
import * as LocationTransitIspActions from '../../redux/locationTransitIsp/actions';
import * as ClientIspTransitIspActions from '../../redux/clientIspTransitIsp/actions';
import * as LocationClientIspTransitIspActions from '../../redux/locationClientIspTransitIsp/actions';

import { multiMergeMetaIntoResults } from '../../utils/exports';
import timeAggregationFromDates from '../../utils/timeAggregationFromDates';
import { facetTypes, defaultStartDate, defaultEndDate } from '../../constants';

import {
  ChartExportControls,
  CompareInputPanel,
  CompareHourCharts,
  CompareTimeSeriesCharts,
  DateRangeSelector,
  LineChartWithCounts,
  MetricSelector,
  SelectableList,
  StatusWrapper,
  TimeAggregationSelector,
  HelpTip,
} from '../../components';

import UrlHandler from '../../url/UrlHandler';
import urlConnect from '../../url/urlConnect';
import queryRebuild from '../../url/queryRebuild';

import './ComparePage.scss';

// Define how to read/write state to URL query parameters
const urlQueryConfig = {
  viewMetric: { type: 'string', defaultValue: 'download', urlKey: 'metric' },
  breakdownBy: { type: 'string', defaultValue: 'filter1', urlKey: 'breakdownBy' },

  // selected time
  startDate: { type: 'date', urlKey: 'start', defaultValue: defaultStartDate },
  endDate: { type: 'date', urlKey: 'end', defaultValue: defaultEndDate },
  timeAggregation: { type: 'string', urlKey: 'aggr' },
  facetItemIds: { type: 'set', urlKey: 'selected', persist: false },
  filter1Ids: { type: 'set', urlKey: 'filter1', persist: false },
  filter2Ids: { type: 'set', urlKey: 'filter2', persist: false },
};
const urlHandler = new UrlHandler(urlQueryConfig, browserHistory);

function mapStateToProps(state, propsWithUrl) {
  return {
    ...propsWithUrl,
    autoTimeAggregation: ComparePageSelectors.getAutoTimeAggregation(state, propsWithUrl),
    colors: ComparePageSelectors.getColors(state, propsWithUrl),
    combinedHourly: ComparePageSelectors.getCombinedHourly(state, propsWithUrl),
    combinedHourlyExtents: ComparePageSelectors.getCombinedHourlyExtents(state, propsWithUrl),
    combinedTimeSeries: ComparePageSelectors.getCombinedTimeSeries(state, propsWithUrl),
    facetItemHourly: ComparePageSelectors.getFacetItemHourly(state, propsWithUrl),
    facetItemHourlyExtents: ComparePageSelectors.getFacetItemHourlyExtents(state, propsWithUrl),
    facetItemInfos: ComparePageSelectors.getFacetItemInfos(state, propsWithUrl),
    facetItemTimeSeries: ComparePageSelectors.getFacetItemTimeSeries(state, propsWithUrl),
    facetType: ComparePageSelectors.getFacetType(state, propsWithUrl),
    filter1Infos: ComparePageSelectors.getFilter1Infos(state, propsWithUrl),
    filter2Infos: ComparePageSelectors.getFilter2Infos(state, propsWithUrl),
    filterTypes: ComparePageSelectors.getFilterTypes(state, propsWithUrl),
    highlightHourly: ComparePageSelectors.getHighlightHourly(state, propsWithUrl),
    highlightTimeSeriesDate: ComparePageSelectors.getHighlightTimeSeriesDate(state, propsWithUrl),
    highlightTimeSeriesLine: ComparePageSelectors.getHighlightTimeSeriesLine(state, propsWithUrl),
    timeAggregation: ComparePageSelectors.getTimeAggregation(state, propsWithUrl),
    topFilter1: ComparePageSelectors.getTopFilter1(state, propsWithUrl),
    topFilter2: ComparePageSelectors.getTopFilter2(state, propsWithUrl),
    viewMetric: ComparePageSelectors.getViewMetric(state, propsWithUrl),
  };
}

const pageTitle = 'Compare';
class ComparePage extends PureComponent {
  static propTypes = {
    autoTimeAggregation: PropTypes.bool,
    breakdownBy: PropTypes.string,
    colors: PropTypes.object,
    combinedHourly: PropTypes.object,
    combinedHourlyExtents: PropTypes.object,
    combinedTimeSeries: PropTypes.object,
    dispatch: PropTypes.func,
    endDate: momentPropTypes.momentObj,
    facetItemHourly: PropTypes.array,
    facetItemHourlyExtents: PropTypes.object,
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
    startDate: momentPropTypes.momentObj,
    timeAggregation: PropTypes.string,
    topFilter1: PropTypes.object,
    topFilter2: PropTypes.object,
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
    this.onBreakdownByChange = this.onBreakdownByChange.bind(this);
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
    this.onReset = this.onReset.bind(this);
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
    const { dispatch, facetType } = props;

    const facetClientIspIds = this.getFacetItemIds('clientIsp', props);
    const facetLocationIds = this.getFacetItemIds('location', props);
    const facetTransitIspIds = this.getFacetItemIds('transitIsp', props);
    const filterClientIspIds = this.getFilterIds('clientIsp', props);
    const filterLocationIds = this.getFilterIds('location', props);
    const filterTransitIspIds = this.getFilterIds('transitIsp', props);
    const combineIds = (facetIds, filterIds) => facetIds.concat(filterIds);

    // get location info if needed
    combineIds(facetLocationIds, filterLocationIds).forEach(locationId => {
      dispatch(LocationsActions.fetchInfoIfNeeded(locationId));
    });

    // get client ISP info if needed
    combineIds(facetClientIspIds, filterClientIspIds).forEach(clientIspId => {
      dispatch(ClientIspsActions.fetchInfoIfNeeded(clientIspId));
    });

    // get transit ISP info if needed
    combineIds(facetTransitIspIds, filterTransitIspIds).forEach(transitIspId => {
      dispatch(TransitIspsActions.fetchInfoIfNeeded(transitIspId));
    });

    if (facetType.value === 'location') {
      this.fetchDataFacetTypeLocation(props, facetLocationIds, filterClientIspIds, filterTransitIspIds);
    } else if (facetType.value === 'clientIsp') {
      this.fetchDataFacetTypeClientIsp(props, facetClientIspIds, filterLocationIds, filterTransitIspIds);
    } else if (facetType.value === 'transitIsp') {
      this.fetchDataFacetTypeTransitIsp(props, facetTransitIspIds, filterLocationIds, filterClientIspIds);
    }

    // fetch the top filter infos for suggestions
    this.fetchTopFilterInfos(props);
  }

  /**
   * Helper function to fetch top filter options for each of the faceted items
   */
  fetchTopFilterInfos(props) {
    const { dispatch, facetItemIds, facetType } = props;
    if (facetItemIds.length) {
      if (facetType.value === 'location') {
        dispatch(TopActions.fetchClientIspsForLocationsIfNeeded(facetItemIds));
        dispatch(TopActions.fetchTransitIspsForLocationsIfNeeded(facetItemIds));
      } else if (facetType.value === 'clientIsp') {
        dispatch(TopActions.fetchLocationsForClientIspsIfNeeded(facetItemIds));
        dispatch(TopActions.fetchTransitIspsForClientIspsIfNeeded(facetItemIds));
      } else if (facetType.value === 'transitIsp') {
        dispatch(TopActions.fetchClientIspsForTransitIspsIfNeeded(facetItemIds));
        dispatch(TopActions.fetchLocationsForTransitIspsIfNeeded(facetItemIds));
      }
    }
  }

  // helper to get time series and hour data for a given set of actions.
  fetchTimeData(props, Actions, ...args) {
    const { dispatch, timeAggregation, startDate, endDate } = props;
    const options = { startDate, endDate };

    dispatch(Actions.fetchTimeSeriesIfNeeded(timeAggregation, ...args, options));
    dispatch(Actions.fetchHourlyIfNeeded(timeAggregation, ...args, options));
  }

  fetchDataForLocations(props, locationIds) {
    // fetch the time series and hourly data for locations (unfiltered)
    locationIds.forEach(locationId => this.fetchTimeData(props, LocationsActions, locationId));
  }

  fetchDataForClientIsps(props, clientIspIds) {
    // fetch the time series and hourly data for client ISPs (unfiltered)
    clientIspIds.forEach(clientIspId => this.fetchTimeData(props, ClientIspsActions, clientIspId));
  }

  fetchDataForTransitIsps(props, transitIspIds) {
    // fetch the time series and hourly data for transit ISPs (unfiltered)
    transitIspIds.forEach(transitIspId => this.fetchTimeData(props, TransitIspsActions, transitIspId));
  }

  fetchDataForLocationClientIsps(props, locationIds, clientIspIds) {
    locationIds.forEach(locationId => clientIspIds.forEach(clientIspId =>
      this.fetchTimeData(props, LocationClientIspActions, locationId, clientIspId)));
  }

  fetchDataForLocationTransitIsps(props, locationIds, transitIspIds) {
    locationIds.forEach(locationId => transitIspIds.forEach(transitIspId =>
      this.fetchTimeData(props, LocationTransitIspActions, locationId, transitIspId)));
  }

  fetchDataForClientIspTransitIsps(props, clientIspIds, transitIspIds) {
    clientIspIds.forEach(clientIspId => transitIspIds.forEach(transitIspId =>
      this.fetchTimeData(props, ClientIspTransitIspActions, clientIspId, transitIspId)));
  }

  fetchDataForLocationClientIspTransitIsps(props, locationIds, clientIspIds, transitIspIds) {
    locationIds.forEach(locationId => clientIspIds.forEach(clientIspId => transitIspIds.forEach(transitIspId =>
      this.fetchTimeData(props, LocationClientIspTransitIspActions, locationId, clientIspId, transitIspId))));
  }

  /**
   * Fetch the data for the page when the facet type is Location (if needed)
   */
  fetchDataFacetTypeLocation(props, facetLocationIds, filterClientIspIds, filterTransitIspIds) {
    // fetch the time series and hourly data for facet locations (unfiltered)
    this.fetchDataForLocations(props, facetLocationIds);

    // both filters active
    if (filterClientIspIds.length && filterTransitIspIds.length) {
      this.fetchDataForLocationClientIspTransitIsps(props, facetLocationIds, filterClientIspIds, filterTransitIspIds);

    // only one filter active
    // fetch the data for each of the filter client ISPs
    } else if (filterClientIspIds.length) {
      this.fetchDataForLocationClientIsps(props, facetLocationIds, filterClientIspIds);

    // fetch the data for each of the filter transit ISPs
    } else if (filterTransitIspIds.length) {
      this.fetchDataForLocationTransitIsps(props, facetLocationIds, filterTransitIspIds);
    }
  }

  /**
   * Fetch the data for the page when the facet type is Client ISP (if needed)
   */
  fetchDataFacetTypeClientIsp(props, facetClientIspIds, filterLocationIds, filterTransitIspIds) {
    // fetch the time series and hourly data for facet client ISPs (unfiltered)
    this.fetchDataForClientIsps(props, facetClientIspIds);

    // both filters active
    if (filterLocationIds.length && filterTransitIspIds.length) {
      this.fetchDataForLocationClientIspTransitIsps(props, filterLocationIds, facetClientIspIds, filterTransitIspIds);

    // only one filter active
    // fetch the data for each of the filter locations
    } else if (filterLocationIds.length) {
      this.fetchDataForLocationClientIsps(props, filterLocationIds, facetClientIspIds);

    // fetch the data for each of the filter transit ISPs
    } else if (filterTransitIspIds.length) {
      this.fetchDataForClientIspTransitIsps(props, facetClientIspIds, filterTransitIspIds);
    }
  }

  /**
   * Fetch the data for the page when the facet type is Transit ISP (if needed)
   */
  fetchDataFacetTypeTransitIsp(props, facetTransitIspIds, filterLocationIds, filterClientIspIds) {
    // fetch the time series and hourly data for facet client ISPs (unfiltered)
    this.fetchDataForTransitIsps(props, facetTransitIspIds);

    // both filters active
    if (filterLocationIds.length && facetTransitIspIds.length) {
      this.fetchDataForLocationClientIspTransitIsps(props, filterLocationIds, filterClientIspIds, facetTransitIspIds);

    // only one filter active
    // fetch the data for each of the filter locations
    } else if (filterLocationIds.length) {
      this.fetchDataForLocationTransitIsps(props, filterLocationIds, facetTransitIspIds);

    // fetch the data for each of the filter client ISPs
    } else if (filterClientIspIds.length) {
      this.fetchDataForClientIspTransitIsps(props, filterClientIspIds, facetTransitIspIds);
    }
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
   * Callback for when reset is clicked
   */
  onReset() {
    const { facetType, router } = this.props;
    const path = `/compare/${facetType.value}`;

    router.push({ pathname: path });
  }

  /**
   * Callback for time aggregation checkbox
   */
  onTimeAggregationChange(value) {
    const { dispatch, autoTimeAggregation } = this.props;
    dispatch(ComparePageActions.changeTimeAggregation(value));

    // when we change time aggregation, we no longer want auto detection of it based on dates
    if (autoTimeAggregation) {
      dispatch(ComparePageActions.changeAutoTimeAggregation(false));
    }
  }

  /**
   * Callback for when viewMetric changes - updates URL
   */
  onViewMetricChange(value) {
    const { dispatch } = this.props;
    dispatch(ComparePageActions.changeViewMetric(value));
  }

  /**
   * Callback for time aggregation checkbox
   */
  onBreakdownByChange(value) {
    const { dispatch, filterTypes } = this.props;
    if (filterTypes[0].value === value) {
      value = 'filter1';
    } else {
      value = 'filter2';
    }

    dispatch(ComparePageActions.changeBreakdownBy(value));
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
      actions.push(ComparePageActions.changeTimeAggregation(timeAggregationFromDates(newStartDate, newEndDate)));
    }

    const changedStartDate = (!startDate && newStartDate) || (newStartDate && !newStartDate.isSame(startDate, 'day'));
    const changedEndDate = (!endDate && newEndDate) || (newEndDate && !newEndDate.isSame(endDate, 'day'));

    if (changedStartDate) {
      actions.push(ComparePageActions.changeStartDate(newStartDate.toDate()));
    }
    if (changedEndDate) {
      actions.push(ComparePageActions.changeEndDate(newEndDate.toDate()));
    }

    if (actions.length) {
      dispatch(batchActions(actions));
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

  /**
   * Helper function to get filter IDs given a filter type
   * @param {String} type filter type (e.g. location, clientIsp, transitIsp)
   * @return {Array} filterIds or undefined if not a filter
   */
  getFilterIds(type, props) {
    const { filterTypes, filter1Ids, filter2Ids } = props;
    if (filterTypes[0].value === type) {
      return filter1Ids;
    } else if (filterTypes[1].value === type) {
      return filter2Ids;
    }

    return [];
  }

  /**
   * Helper function to get facet item IDs given a facet type
   * @param {String} type facet type (e.g. location, clientIsp, transitIsp)
   * @return {Array} facetItemIds or undefined if not the active facet type
   */
  getFacetItemIds(type, props) {
    const { facetType, facetItemIds } = props;
    if (facetType.value === type) {
      return facetItemIds;
    }

    return [];
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
        <h5>Facet By <HelpTip content="Toggle what to aggregate data by." id="facet-tip" />
        </h5>
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
    const { colors, facetItemIds, facetItemInfos, facetType, filter1Ids, filter1Infos,
      filter2Ids, filter2Infos, filterTypes, topFilter1, topFilter2 } = this.props;

    return (
      <Row>
        <Col md={3}>
          {this.renderFacetSelector()}
        </Col>
        <Col md={9}>
          <CompareInputPanel
            colors={colors}
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
            topFilter1={topFilter1}
            topFilter2={topFilter2}
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
      colors,
    } = this.props;

    if (!seriesData || seriesData.length === 0) {
      return null;
    }

    return (
      <StatusWrapper status={status}>
        <AutoWidth>
          <LineChartWithCounts
            id={chartId}
            series={seriesData}
            colors={colors}
            onHighlightDate={this.onHighlightTimeSeriesDate}
            highlightDate={highlightTimeSeriesDate}
            onHighlightLine={this.onHighlightTimeSeriesLine}
            highlightLine={highlightTimeSeriesLine}
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
          data={seriesData}
          prepareForCsv={multiMergeMetaIntoResults}
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

  renderBreakdownOptions() {
    // TODO: when both filters have values, choose which one to breakdown by
    const { filterTypes, filter1Ids, filter2Ids, breakdownBy } = this.props;

    let active;
    if (breakdownBy === 'filter1') {
      active = filterTypes[0].value;
    } else {
      active = filterTypes[1].value;
    }

    if (filter1Ids.length && filter2Ids.length) {
      return (
        <div className="breakdown-by-selector">
          <h5>Breakdown By</h5>
          <SelectableList items={filterTypes} active={active} onChange={this.onBreakdownByChange} />
        </div>
      );
    }

    return null;
  }

  getBreakdownLabel() {
    const { breakdownBy, facetType, filterTypes, filter1Ids, filter2Ids } = this.props;
    let label = `Breakdown by ${facetType.label}s`;

    if (filter1Ids.length && filter2Ids.length) {
      if (breakdownBy === 'filter1') {
        label = `${filterTypes[1].label}s by ${facetType.label}s and ${filterTypes[0].label}s`;
      } else {
        label = `${filterTypes[0].label}s by ${facetType.label}s and ${filterTypes[1].label}s`;
      }
    } else if (filter1Ids.length) {
      label = `${filterTypes[0].label}s by ${facetType.label}s`;
    } else if (filter2Ids.length) {
      label = `${filterTypes[1].label}s by ${facetType.label}s`;
    }

    return label;
  }

  renderBreakdown() {
    const {
      breakdownBy,
      colors,
      combinedHourly,
      combinedHourlyExtents,
      combinedTimeSeries,
      facetItemInfos,
      facetItemTimeSeries,
      facetItemHourly,
      facetItemHourlyExtents,
      facetType,
      filter1Ids,
      filter1Infos,
      filter2Ids,
      filter2Infos,
      filterTypes,
      highlightHourly,
      highlightTimeSeriesDate,
      highlightTimeSeriesLine,
      viewMetric,
    } = this.props;

    // if filters are empty, show the facet item line in the chart
    // if one filter has items, show the lines for those filter items in the chart
    // if both filters have items, group by `breakdownBy` filter and have the other filter items have lines in those charts
    const renderBreakdownTimeSeries = filter1Ids.length || filter2Ids.length;
    const breakdownLabel = this.getBreakdownLabel();

    return (
      <div>
        {renderBreakdownTimeSeries ? (
          <Row>
            <Col md={3}>
              {this.renderBreakdownOptions()}
            </Col>
            <Col md={9}>
              <div className="subsection">
                <header>
                  <h3>{breakdownLabel}</h3>
                </header>
                {facetItemInfos.map((facetItemInfo) => (
                  <CompareTimeSeriesCharts
                    key={facetItemInfo.id}
                    breakdownBy={breakdownBy}
                    colors={colors}
                    combinedTimeSeries={combinedTimeSeries && combinedTimeSeries[facetItemInfo.id]}
                    facetItemId={facetItemInfo.id}
                    facetItemInfo={facetItemInfo}
                    facetItemTimeSeries={facetItemTimeSeries}
                    facetType={facetType}
                    filter1Ids={filter1Ids}
                    filter1Infos={filter1Infos}
                    filter2Ids={filter2Ids}
                    filter2Infos={filter2Infos}
                    filterTypes={filterTypes}
                    highlightTimeSeriesDate={highlightTimeSeriesDate}
                    highlightTimeSeriesLine={highlightTimeSeriesLine}
                    onHighlightTimeSeriesDate={this.onHighlightTimeSeriesDate}
                    onHighlightTimeSeriesLine={this.onHighlightTimeSeriesLine}
                    viewMetric={viewMetric}
                  />
                ))}
              </div>
            </Col>
          </Row>
        ) : null}
        <Row>
          <Col md={3}>
            {this.renderMetricSelector()}
          </Col>
          <Col md={9}>
            <div className="subsection">
              <header>
                <h3>{`${viewMetric.label} by Hour`}</h3>
              </header>
              <Row>
                {facetItemInfos.map((facetItemInfo) => (
                  <CompareHourCharts
                    key={facetItemInfo.id}
                    breakdownBy={breakdownBy}
                    colors={colors}
                    combinedHourly={combinedHourly && combinedHourly[facetItemInfo.id]}
                    combinedHourlyExtents={combinedHourlyExtents}
                    facetItemId={facetItemInfo.id}
                    facetItemInfo={facetItemInfo}
                    facetItemHourly={facetItemHourly}
                    facetItemHourlyExtents={facetItemHourlyExtents}
                    facetType={facetType}
                    filter1Ids={filter1Ids}
                    filter1Infos={filter1Infos}
                    filter2Ids={filter2Ids}
                    filter2Infos={filter2Infos}
                    filterTypes={filterTypes}
                    highlightHourly={highlightHourly}
                    onHighlightHourly={this.onHighlightHourly}
                    viewMetric={viewMetric}
                  />
              ))}
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  renderAboutCompare() {
    return (
      <div className="about">
        <Row>
          <Col md={3}>
            <h2>{pageTitle}</h2>
          </Col>
          <Col md={8}>
            <p>
              The compare tool provides a way to compare speed tests along different aggregations.
              <br />
              <br />
              The "Facet By" selector on the left allows you to split the data by either Location, Client ISP or Transit ISP.

              <br />
              Once a facet is selected, fill in the search bars on the right with the specific locations and ISPs you want to look at.

              Selecting values from these lists, or from the suggestions provided, will automatically update the charts below.
            </p>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    return (
      <div className="ComparePage">
        <Helmet title={pageTitle} />
        {this.renderAboutCompare()}
        <div className="section">
          <header>
            <Row>
              <Col md={3}>
                <p />
              </Col>
              <Col md={8}>
                {this.renderTimeRangeSelector()}
              </Col>
              <Col md={1}>
                <button className="btn btn-default" onClick={this.onReset}>Reset</button>
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
