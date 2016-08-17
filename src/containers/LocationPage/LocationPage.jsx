import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import classNames from 'classnames';
import { browserHistory } from 'react-router';

import { timeAggregations } from '../../constants';
import * as LocationPageSelectors from '../../redux/locationPage/selectors';
import * as LocationsActions from '../../redux/locations/actions';

import { LineChart, HourChart } from '../../components';
import UrlHandler from '../../utils/UrlHandler';

const urlQueryConfig = {
  // chart options
  showBaselines: { type: 'boolean', defaultValue: false },
  showRegionalValues: { type: 'boolean', defaultValue: false },

  // selected time
  startDate: { type: 'date' },
  endDate: { type: 'date' },
  timeAggregation: { type: 'string', defaultValue: 'day' },
};
const urlHandler = new UrlHandler(urlQueryConfig, browserHistory);

function mapStateToProps(state, props) {
  // combine props with those read from URL to provide to Redux selectors
  const propsWithUrl = {
    ...props,
    locationId: props.params.locationId,

    // adds in: showBaselines, showRegionalValues
    ...urlHandler.decodeQuery(props.location.query),
  };

  return {
    ...propsWithUrl,
    hourly: LocationPageSelectors.getActiveLocationHourly(state, propsWithUrl),
    timeSeries: LocationPageSelectors.getActiveLocationTimeSeries(state, propsWithUrl),
  };
}

class LocationPage extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    endDate: PropTypes.object, // date
    hourly: PropTypes.object,
    location: PropTypes.object, // route location
    locationId: PropTypes.string,
    showBaselines: PropTypes.bool,
    showRegionalValues: PropTypes.bool,
    startDate: PropTypes.object, // date
    timeAggregation: PropTypes.string,
    timeSeries: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.handleShowBaselinesChange = this.handleCheckboxChange.bind(this, 'showBaselines');
    this.handleShowRegionalValuesChange = this.handleCheckboxChange.bind(this,
      'showRegionalValues');
  }

  componentDidMount() {
    const { dispatch, locationId, timeAggregation } = this.props;
    dispatch(LocationsActions.fetchTimeSeriesIfNeeded(timeAggregation, locationId));
    dispatch(LocationsActions.fetchHourlyIfNeeded(timeAggregation, locationId));
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, locationId, timeAggregation } = nextProps;
    dispatch(LocationsActions.fetchTimeSeriesIfNeeded(timeAggregation, locationId));
    dispatch(LocationsActions.fetchHourlyIfNeeded(timeAggregation, locationId));
  }

  // update the URL on checkbox change
  handleCheckboxChange(key, evt) {
    const { location } = this.props;
    const { checked } = evt.target;
    urlHandler.replaceInQuery(location, key, checked);
  }

  // update the URL on time aggregation change
  handleTimeAggregationChange(value) {
    const { location } = this.props;
    urlHandler.replaceInQuery(location, 'timeAggregation', value);
  }

  renderCityProviders() {
    return (
      <div>
        <h2>City {this.props.locationId}</h2>
        {this.renderCompareProviders()}
        {this.renderCompareMetrics()}
        {this.renderProvidersByHour()}
      </div>
    );
  }

  renderCompareProviders() {
    const { timeSeries } = this.props;

    return (
      <div>
        <h3>Compare Providers</h3>
        <LineChart
          width={800}
          height={300}
          data={timeSeries}
          xKey="date"
          yKey="download_speed_mbps_median"
        />
        {this.renderChartOptions()}
        {this.renderTimeAggregationSelector()}
      </div>
    );
  }

  renderTimeAggregationSelector() {
    const { timeAggregation } = this.props;

    return (
      <div className="time-aggregation">
        <ul className="list-unstyled">
          {timeAggregations.map(aggr => (
            <li key={aggr.value}>
              <button
                className={classNames('btn btn-default',
                  { active: timeAggregation === aggr.value })}
                onClick={() => this.handleTimeAggregationChange(aggr.value)}
              >
                {aggr.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  renderChartOptions() {
    const { showBaselines, showRegionalValues } = this.props;
    return (
      <div>
        <ul className="list-inline">
          <li>
            <label htmlFor="show-baselines">
              <input
                type="checkbox"
                checked={showBaselines}
                id="show-baselines"
                onChange={this.handleShowBaselinesChange}
              />
              {' Show Baselines'}
            </label>
          </li>
          <li>
            <label htmlFor="show-regional-values">
              <input
                type="checkbox"
                checked={showRegionalValues}
                id="show-regional-values"
                onChange={this.handleShowRegionalValuesChange}
              />
              {' Show Regional Values'}
            </label>
          </li>
        </ul>
      </div>
    );
  }

  renderCompareMetrics() {
    return (
      <div>
        <h3>Compare Metrics</h3>
      </div>
    );
  }

  renderProvidersByHour() {
    const { hourly } = this.props;

    return (
      <div>
        <h3>By Hour, Median download speeds</h3>
        <HourChart
          width={800}
          height={300}
          data={hourly}
          xKey="hour"
          yKey="download_speed_mbps_median"
        />
      </div>
    );
  }

  renderFixedTimeFrames() {
    return (
      <div>
        <h2>Compare Fixed Time Frame</h2>
        {this.renderFixedCompareMetrics()}
        {this.renderFixedDistributions()}
        {this.renderFixedSummaryData()}
      </div>
    );
  }

  renderFixedCompareMetrics() {
    return (
      <div>
        <h3>Compare Metrics</h3>
      </div>
    );
  }

  renderFixedDistributions() {
    return (
      <div>
        <h3>Distributions of Metrics</h3>
      </div>
    );
  }

  renderFixedSummaryData() {
    return (
      <div>
        <h3>Summary Data</h3>
      </div>
    );
  }

  render() {
    return (
      <div>
        <Helmet title="Location" />
        <h1>Location</h1>
        <div>This is the location page.</div>
        {this.renderCityProviders()}
        {this.renderFixedTimeFrames()}
      </div>
    );
  }
}

export default connect(mapStateToProps)(LocationPage);
