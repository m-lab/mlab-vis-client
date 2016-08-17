import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router';

import * as LocationPageSelectors from 'redux/locationPage/selectors';
import * as LocationPageActions from 'redux/locationPage/actions';
import * as LocationsActions from 'redux/locations/actions';

import { LineChart, JsonDump } from 'components';
import UrlHandler from 'utils/UrlHandler';

const urlQueryConfig = {
  showBaselines: { type: 'boolean', defaultValue: false },
  showRegionalValues: { type: 'boolean', defaultValue: false },
};
const urlHandler = new UrlHandler(urlQueryConfig);


function mapStateToProps(state, props) {
  return {
    locationId: props.params.locationId,
    // adds in: showBaselines, showRegionalValues
    ...urlHandler.decodeQuery(props.location.query),

    hourly: LocationPageSelectors.getActiveLocationHourly(state, props),
    timeAggregation: LocationPageSelectors.getTimeAggregation(state, props),
    timeSeries: LocationPageSelectors.getActiveLocationTimeSeries(state, props),
  };
}

class LocationPage extends PureComponent {
  static propTypes = {
    dispatch: React.PropTypes.func,
    hourly: React.PropTypes.object,
    location: React.PropTypes.object, // route location
    locationId: React.PropTypes.string,
    router: React.PropTypes.object,
    showBaselines: React.PropTypes.bool,
    showRegionalValues: React.PropTypes.bool,
    timeAggregation: React.PropTypes.string,
    timeSeries: React.PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.handleShowBaselinesChange = this.handleCheckboxChange.bind(this, 'showBaselines');
    this.handleShowRegionalValuesChange = this.handleCheckboxChange.bind(this,
      'showRegionalValues');
  }

  componentDidMount() {
    this.changeLocation(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { locationId } = this.props;

    if (locationId !== nextProps.locationId) {
      this.changeLocation(nextProps);
    }
  }

  changeLocation(props) {
    const { dispatch, locationId, timeAggregation } = props;
    dispatch(LocationPageActions.resetSelectedLocations());
    dispatch(LocationPageActions.resetSelectedClientIsps());
    dispatch(LocationsActions.fetchTimeSeriesIfNeeded(timeAggregation, locationId));
    dispatch(LocationsActions.fetchHourlyIfNeeded(timeAggregation, locationId));
  }

  // update the URL on checkbox change
  handleCheckboxChange(key, evt) {
    const { location, router } = this.props;
    const { checked } = evt.target;
    urlHandler.replaceInQuery(location, key, checked, router);
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
    const { timeSeries, showBaselines, showRegionalValues } = this.props;

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
        <div>
          <label htmlFor="show-baselines">
            <input
              type="checkbox"
              checked={showBaselines}
              id="show-baselines"
              onChange={this.handleShowBaselinesChange}
            />
            Show Baselines
          </label>
          <label htmlFor="show-regional-values">
            <input
              type="checkbox"
              checked={showRegionalValues}
              id="show-regional-values"
              onChange={this.handleShowRegionalValuesChange}
            />
            Show Regional Values
          </label>
        </div>
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
        <JsonDump json={hourly} />
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

export default connect(mapStateToProps)(withRouter(LocationPage));
