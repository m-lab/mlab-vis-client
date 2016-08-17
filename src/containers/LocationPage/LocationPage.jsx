import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import * as ReduxLocations from 'redux/locations';
import * as ReduxLocationPage from 'redux/locationPage';

import { LineChart, JsonDump, HourChart } from 'components';

function mapStateToProps(state, props) {
  return {
    locationId: props.params.locationId,
    timeAggregation: ReduxLocationPage.Selectors.getTimeAggregation(state, props),
    timeSeries: ReduxLocationPage.Selectors.getActiveLocationTimeSeries(state, props),
    hourly: ReduxLocationPage.Selectors.getActiveLocationHourly(state, props),
  };
}

class LocationPage extends PureComponent {
  static propTypes = {
    dispatch: React.PropTypes.func,
    hourly: React.PropTypes.object,
    locationId: React.PropTypes.string,
    timeAggregation: React.PropTypes.string,
    timeSeries: React.PropTypes.array,
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
    dispatch(ReduxLocationPage.Actions.changeLocation(locationId));
    dispatch(ReduxLocations.Actions.fetchTimeSeriesIfNeeded(timeAggregation, locationId));
    dispatch(ReduxLocations.Actions.fetchHourlyIfNeeded(timeAggregation, locationId));
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
