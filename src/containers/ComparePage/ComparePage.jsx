import React, { PureComponent, PropTypes } from 'react';
import Helmet from 'react-helmet';
import moment from 'moment';
import { browserHistory } from 'react-router';
import momentPropTypes from 'react-moment-proptypes';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import * as ComparePageSelectors from '../../redux/comparePage/selectors';
import * as ComparePageActions from '../../redux/comparePage/actions';
// import * as LocationsActions from '../../redux/locations/actions';

import { colorsFor } from '../../utils/color';
import { metrics, facetTypes } from '../../constants';

import {
  DateRangeSelector,
  SelectableList,
  MetricSelector,
  TimeAggregationSelector,
  SearchSelect,
} from '../../components';

import {
  LocationSearch,
} from '../../containers';

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
  facetLocationIds: { type: 'array', urlKey: 'locations' },
  filterClientIspIds: { type: 'array', urlKey: 'filterClientIsps' },
};
const urlHandler = new UrlHandler(urlQueryConfig, browserHistory);

function mapStateToProps(state, propsWithUrl) {
  return {
    ...propsWithUrl,
    facetLocationInfos: ComparePageSelectors.getFacetLocationInfos(state, propsWithUrl),
    facetType: ComparePageSelectors.getFacetType(state, propsWithUrl),
    filterClientIspInfos: ComparePageSelectors.getFilterClientIspInfos(state, propsWithUrl),
    viewMetric: ComparePageSelectors.getViewMetric(state, propsWithUrl),
  };
}

const pageTitle = 'Compare';
class ComparePage extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    endDate: momentPropTypes.momentObj,
    facetLocationIds: PropTypes.array,
    facetLocationInfos: PropTypes.array,
    facetType: PropTypes.object,
    filterClientIspIds: PropTypes.array,
    filterClientIspInfos: PropTypes.array,
    startDate: momentPropTypes.momentObj,
    timeAggregation: PropTypes.string,
    viewMetric: PropTypes.object,
  }

  constructor(props) {
    super(props);

    // bind handlers
    this.onDateRangeChange = this.onDateRangeChange.bind(this);
    this.onFacetTypeChange = this.onFacetTypeChange.bind(this);
    this.onFacetLocationsChange = this.onFacetLocationsChange.bind(this);
    this.onFilterClientIspsChange = this.onFilterClientIspsChange.bind(this);
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
   * Fetch the data for the page if needed
   */
  fetchData(props) {
    // const { dispatch } = props;
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
    const { facetLocationInfos, filterClientIspInfos } = this.props;

    return (
      <div className="input-section subsection">
        <div>
          <header>
            <h3>Locations</h3>
          </header>
          <p>Select one or more locations to explore measurements in. Each location will get its own chart.</p>
          <SearchSelect type="location" onChange={this.onFacetLocationsChange} selected={facetLocationInfos} />
        </div>
        <Row>
          <Col md={6}>
            <h4>Filter by Client ISP</h4>
            <p>Select one or more Client ISPs to filter the measurements by.</p>
            <SearchSelect
              type="clientIsp"
              orientation="vertical"
              onChange={this.onFilterClientIspsChange}
              selected={filterClientIspInfos}
            />
          </Col>
          <Col md={6}>
            <h4>Filter by Transit ISP</h4>
            <p>Select one or more Transit ISPs to filter the measurements by.</p>
            <input className="form-control" type="text" />
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
          </div>
        </Col>
      </Row>
    );
  }

  renderBreakdown() {
    return (
      <Row>
        <Col md={3}>
          <div />
        </Col>
        <Col md={9}>
          <div className="subsection">
            <header>
              <h3>Breakdown</h3>
            </header>
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
