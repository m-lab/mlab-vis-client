/**
 * Selectors for locationPage
 */

import { createSelector } from 'reselect';
import { initialLocationState } from '../locations/reducer';
import { metrics } from '../../constants';

// ----------------------
// Input Selectors
// ----------------------

export function getLocation(state, props) {
  // read in locationId from props
  const { locationId } = props;

  if (locationId == null || !state.locations[locationId]) {
    return initialLocationState;
  }

  return state.locations[locationId];
}

export function getLocationHourly(state, props) {
  const location = getLocation(state, props);
  return location.time.hourly.data;
}

export function getLocationTimeSeries(state, props) {
  const location = getLocation(state, props);
  return location.time.timeSeries.data;
}

export function getLocationClientIsps(state, props) {
  const location = getLocation(state, props);
  // TODO: this temporarily limits to top 3 ISPs
  return location.clientIsps.data && location.clientIsps.data.slice(0, 3);
}

export function getHighlightHourly(state) {
  return state.locationPage.highlightHourly;
}

/**
 * Input selector to get the currently viewed metric
 * @param {Object} state the redux state
 * @param {Object} props the react props with URL query params included
 */
export function getViewMetric(state, props) {
  const value = props.viewMetric || 'download';
  let metric = metrics.find(metric => metric.value === value);
  if (!metric) {
    if (__DEVELOPMENT__) {
      console.warn('Metric not found', value, '-- using download');
    }

    metric = metrics[0];
  }

  return metric;
}

/**
 * Input selector to get the client ISP full objects from the
 * clientIsps branch of the store
 */
export function getClientIsps(state, props) {
  const locationClientIsps = getLocationClientIsps(state, props);
  if (!locationClientIsps) {
    return undefined;
  }
  return locationClientIsps.map(locationClientIsp =>
    state.clientIsps[locationClientIsp.meta.client_asn_number]
  ).filter(locationClientIsp => locationClientIsp != null);
}

// ----------------------
// Selectors
// ----------------------


export const getLocationClientIspTimeSeries = createSelector(
  getClientIsps, getLocation,
  (clientIsps, location) => {
    if (!clientIsps || !location) {
      return undefined;
    }

    const timeSeriesData = clientIsps.map(clientIsp => {
      const locationTime = clientIsp.locationTime[location.locationId];
      return locationTime && locationTime.timeSeries.data;
    }).filter(timeSeries => timeSeries != null);

    return timeSeriesData;
  }
);
