import React, { PureComponent, PropTypes } from 'react';
import moment from 'moment';
import momentPropTypes from 'react-moment-proptypes';
import classNames from 'classnames';
import { browserHistory } from 'react-router';
import Helmet from 'react-helmet';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Button from 'react-bootstrap/lib/Button';

import timeAggregationFromDates from '../../utils/timeAggregationFromDates';
import { timeAggregations } from '../../constants';
import { apiRoot } from '../../config';
import {
  DateRangeSelector,
  SearchSelect,
} from '../../components';
import UrlHandler from '../../url/UrlHandler';
import urlConnect from '../../url/urlConnect';

import * as DataPageActions from '../../redux/dataPage/actions';
import * as DataPageSelectors from '../../redux/dataPage/selectors';
import * as LocationsActions from '../../redux/locations/actions';
import * as ClientIspsActions from '../../redux/clientIsps/actions';
import * as TransitIspsActions from '../../redux/transitIsps/actions';

import './DataPage.scss';


// Define how to read/write state to URL query parameters
const urlQueryConfig = {
  dataFormat: { type: 'string', defaultValue: 'csv', urlKey: 'format' },

  // selected time
  // TODO: change defaults to more recent time period when data is up-to-date
  startDate: { type: 'date', urlKey: 'start', defaultValue: moment('2015-10-1') },
  endDate: { type: 'date', urlKey: 'end', defaultValue: moment('2015-11-1') },
  timeAggregation: { type: 'string', urlKey: 'aggr' },
  clientIspIds: { type: 'array', urlKey: 'clientIsps', defaultValue: [] },
  transitIspIds: { type: 'array', urlKey: 'transitIsps', defaultValue: [] },
  locationIds: { type: 'array', urlKey: 'locations', defaultValue: [] },
};
const urlHandler = new UrlHandler(urlQueryConfig, browserHistory);
function mapStateToProps(state, propsWithUrl) {
  return {
    ...propsWithUrl,
    autoTimeAggregation: DataPageSelectors.getAutoTimeAggregation(state, propsWithUrl),
    clientIspInfos: DataPageSelectors.getClientIspInfos(state, propsWithUrl),
    locationInfos: DataPageSelectors.getLocationInfos(state, propsWithUrl),
    timeAggregation: DataPageSelectors.getTimeAggregation(state, propsWithUrl),
    transitIspInfos: DataPageSelectors.getTransitIspInfos(state, propsWithUrl),
  };
}

class DataPage extends PureComponent {
  static propTypes = {
    autoTimeAggregation: PropTypes.bool,
    clientIspIds: PropTypes.array,
    clientIspInfos: PropTypes.array,
    dataFormat: PropTypes.string,
    dispatch: PropTypes.func,
    endDate: momentPropTypes.momentObj,
    locationIds: PropTypes.array,
    locationInfos: PropTypes.array,
    startDate: momentPropTypes.momentObj,
    timeAggregation: PropTypes.string,
    transitIspIds: PropTypes.array,
    transitIspInfos: PropTypes.array,
  }

  constructor(props) {
    super(props);

    this.onDataFormatChange = this.onDataFormatChange.bind(this);
    this.onTimeAggregationChange = this.onTimeAggregationChange.bind(this);
    this.onDateRangeChange = this.onDateRangeChange.bind(this);
    this.onLocationsChange = this.onLocationsChange.bind(this);
    this.onClientIspsChange = this.onClientIspsChange.bind(this);
    this.onTransitIspsChange = this.onTransitIspsChange.bind(this);
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
    const { dispatch, locationIds, clientIspIds, transitIspIds } = props;

    // get location info if needed
    locationIds.forEach(locationId => {
      dispatch(LocationsActions.fetchInfoIfNeeded(locationId));
    });

    // get client ISP info if needed
    clientIspIds.forEach(clientIspId => {
      dispatch(ClientIspsActions.fetchInfoIfNeeded(clientIspId));
    });

    // get transit ISP info if needed
    transitIspIds.forEach(transitIspId => {
      dispatch(TransitIspsActions.fetchInfoIfNeeded(transitIspId));
    });
  }

  onDataFormatChange(dataFormat) {
    const { dispatch } = this.props;
    dispatch(DataPageActions.changeDataFormat(dataFormat));
  }

  /**
   * Callback for when start or end date is changed
   * @param {Date} startDate new startDate
   * @param {Date} endDate new endDate
   */
  onDateRangeChange(newStartDate, newEndDate) {
    const { dispatch, autoTimeAggregation, startDate, endDate } = this.props;
    // if we are auto-detecting time aggregation, set it based on the dates
    if (autoTimeAggregation) {
      dispatch(DataPageActions.changeTimeAggregation(timeAggregationFromDates(newStartDate, newEndDate)));
    }

    if ((!startDate && newStartDate) || (newStartDate && !newStartDate.isSame(startDate, 'day'))) {
      dispatch(DataPageActions.changeStartDate(newStartDate.toDate()));
    }
    if ((!endDate && newEndDate) || (newEndDate && !newEndDate.isSame(endDate, 'day'))) {
      dispatch(DataPageActions.changeEndDate(newEndDate.toDate()));
    }
  }

  /**
   * Callback for time aggregation checkbox
   */
  onTimeAggregationChange(evt) {
    const { dispatch, autoTimeAggregation } = this.props;
    const { value } = evt.target;
    dispatch(DataPageActions.changeTimeAggregation(value));

    // when we change time aggregation, we no longer want auto detection of it based on dates
    if (autoTimeAggregation) {
      dispatch(DataPageActions.changeAutoTimeAggregation(false));
    }
  }

  /**
   * Callback when the location list changes
   * @param {Array} locations array of info objects
   */
  onLocationsChange(locations) {
    const { dispatch } = this.props;
    dispatch(DataPageActions.changeLocations(locations, dispatch));
  }

  /**
   * Callback when the client ISP list changes
   * @param {Array} clientIsps array of info objects
   */
  onClientIspsChange(clientIsps) {
    const { dispatch } = this.props;
    dispatch(DataPageActions.changeClientIsps(clientIsps, dispatch));
  }

  /**
   * Callback when the transit ISP list changes
   * @param {Array} transitIsps array of info objects
   */
  onTransitIspsChange(transitIsps) {
    const { dispatch } = this.props;
    dispatch(DataPageActions.changeTransitIsps(transitIsps, dispatch));
  }

  renderFilters() {
    const { locationInfos, clientIspInfos, transitIspInfos } = this.props;

    return (
      <div className="features-section">
        <h4>Features</h4>
        <p>
          Select which features you would like to gather data about. You must select at least one.
        </p>
        <Row>
          <Col md={4}>
            <h5>Locations</h5>
            <SearchSelect
              type="location"
              orientation="vertical"
              onChange={this.onLocationsChange}
              selected={locationInfos}
            />
          </Col>
          <Col md={4}>
            <h5>Client ISPs</h5>
            <SearchSelect
              type="clientIsp"
              orientation="vertical"
              onChange={this.onClientIspsChange}
              selected={clientIspInfos}
            />
          </Col>
          <Col md={4}>
            <h5>Transit ISPs</h5>
            <SearchSelect
              type="transitIsp"
              orientation="vertical"
              onChange={this.onTransitIspsChange}
              selected={transitIspInfos}
            />
          </Col>
        </Row>
      </div>
    );
  }

  renderRestUrl() {
    const restUrl = apiRoot;

    return (
      <div className="section">
        <h4>Rest API URL</h4>
        <p>
          This is the URL you can use to get the generated data directly from the <a href={apiRoot}>REST API</a>.
        </p>
        <input className="form-control" readOnly value={restUrl} />
      </div>
    );
  }

  renderDataFormatSelector() {
    const { dataFormat } = this.props;

    return (
      <div>
        <h5>Data Format</h5>
        <ButtonGroup>
          <Button
            className={classNames({ active: dataFormat === 'csv' })}
            onClick={() => this.onDataFormatChange('csv')}
          >
            CSV
          </Button>
          <Button
            className={classNames({ active: dataFormat === 'json' })}
            onClick={() => this.onDataFormatChange('json')}
          >
            JSON
          </Button>
        </ButtonGroup>
      </div>
    );
  }

  renderTimeAggregationSelector() {
    const { timeAggregation } = this.props;

    return (
      <div>
        <h5>Time Aggregation</h5>
        <select className="time-aggr form-control" value={timeAggregation} onChange={this.onTimeAggregationChange}>
          {timeAggregations.map(aggr =>
            <option key={aggr.value} value={aggr.value}>{aggr.label}</option>)}
        </select>
      </div>
    );
  }

  renderTimeRangeSelector() {
    const { startDate, endDate } = this.props;

    return (
      <div>
        <h5>Time Range</h5>
        <DateRangeSelector
          startDate={startDate}
          endDate={endDate}
          onChange={this.onDateRangeChange}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="DataPage">
        <Helmet title="Data" />
        <h1>Data</h1>
        <Row>
          <Col md={8}>
            <p>
              There are several different ways to access the data used for these visualizations.
              You can download the data for the individual charts by clicking the CSV or JSON buttons
              beneath them, you can use the <a href={apiRoot}>REST API</a> that powers these
              visualizations directly, or you can use the interface below.
            </p>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            {this.renderTimeRangeSelector()}
          </Col>
          <Col md={4}>
            {this.renderTimeAggregationSelector()}
          </Col>
          <Col md={4}>
            {this.renderDataFormatSelector()}
          </Col>
        </Row>
        {this.renderFilters()}
        <button className="btn btn-primary download-btn">Download Data</button>
        {this.renderRestUrl()}
      </div>
    );
  }
}

export default urlConnect(urlHandler, mapStateToProps)(DataPage);
