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
  CompareHourCharts,
  CompareTimeSeriesCharts,
  DateRangeSelector,
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
  }

  /**
   * Fetch the data for the page when the facet type is Location (if needed)
   */
  fetchDataFacetTypeLocation(props, facetLocationIds, filterClientIspIds, filterTransitIspIds) {
    const { dispatch, timeAggregation, startDate, endDate } = props;
    const options = { startDate, endDate };

    // fetch the time series and hourly data for facet locations (unfiltered)
    facetLocationIds.forEach(locationId => {
      dispatch(LocationsActions.fetchTimeSeriesIfNeeded(timeAggregation, locationId, options));
      dispatch(LocationsActions.fetchHourlyIfNeeded(timeAggregation, locationId, options));

      // both filters active
      if (filterClientIspIds.length && filterTransitIspIds.length) {
        console.warn('TODO - not fetching data for both active filters', locationId, filterClientIspIds,
          filterTransitIspIds);

      // only one filter active
      } else {
        // fetch the data for each of the filter client ISPs
        filterClientIspIds.forEach(clientIspId => {
          dispatch(LocationsActions.fetchClientIspLocationTimeSeriesIfNeeded(timeAggregation, locationId,
            clientIspId, options));
          dispatch(LocationsActions.fetchClientIspLocationHourlyIfNeeded(timeAggregation, locationId,
            clientIspId, options));
        });

        // fetch the data for each of the filter transit ISPs
        filterTransitIspIds.forEach(transitIspId => {
          console.warn('TODO - not fetching data for', locationId, transitIspId);
          // dispatch(LocationsActions.fetchTransitIspLocationTimeSeriesIfNeeded(timeAggregation, locationId,
          //   transitIspId, options));
          // dispatch(LocationsActions.fetchTransitIspLocationHourlyIfNeeded(timeAggregation, locationId,
          //   transitIspId, options));
        });
      }
    });
  }

  /**
   * Fetch the data for the page when the facet type is Client ISP (if needed)
   */
  fetchDataFacetTypeClientIsp(props, facetClientIspIds, filterLocationIds, filterTransitIspIds) {
    const { dispatch, timeAggregation, startDate, endDate } = props;
    const options = { startDate, endDate };

    console.warn('TODO - fetch data for when facet type is client ISP');
  }

  /**
   * Fetch the data for the page when the facet type is Transit ISP (if needed)
   */
  fetchDataFacetTypeTransitIsp(props, facetTransitIspIds, filterLocationIds, filterClientIspIds) {
    const { dispatch, timeAggregation, startDate, endDate } = props;
    const options = { startDate, endDate };

    console.warn('TODO - fetch data for when facet type is transit ISP');

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
      colors,
      facetItemInfos,
      facetItemTimeSeries,
      facetItemHourly,
      filter1Ids,
      filter1Infos,
      filter2Ids,
      filter2Infos,
      highlightHourly,
      highlightTimeSeriesDate,
      highlightTimeSeriesLine,
      singleFilterTimeSeries,
      singleFilterHourly,
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
                colors={colors}
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
              {facetItemInfos.map((facetItemInfo) => (
                <CompareHourCharts
                  key={facetItemInfo.id}
                  colors={colors}
                  facetItemId={facetItemInfo.id}
                  facetItemInfo={facetItemInfo}
                  facetItemHourly={facetItemHourly}
                  filter1Ids={filter1Ids}
                  filter1Infos={filter1Infos}
                  filter2Ids={filter2Ids}
                  filter2Infos={filter2Infos}
                  highlightHourly={highlightHourly}
                  onHighlightHourly={this.onHighlightHourly}
                  singleFilterHourly={singleFilterHourly}
                  viewMetric={viewMetric}
                />
            ))}
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
