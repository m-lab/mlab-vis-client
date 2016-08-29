/**
 * Selectors for locationPage
 */

import { createSelector } from 'reselect';
import { initialLocationState } from '../locations/reducer';
import { metrics } from '../../constants';
import { mergeStatuses, status } from '../status';
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

export function getLocationHourlyStatus(state, props) {
  const location = getLocation(state, props);
  return status(location.time.hourly);
}

export function getLocationTimeSeries(state, props) {
  const location = getLocation(state, props);
  return location.time.timeSeries.data;
}

export function getLocationTimeSeriesStatus(state, props) {
  const location = getLocation(state, props);
  return status(location.time.timeSeries);
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

// ----------------------
// Selectors
// ----------------------

/**
 * Selector to get the location+client ISP time series data
 * for the selected client ISPs
 */
export const getLocationClientIspTimeSeries = createSelector(
  getLocationClientIsps, getLocation,
  (clientIsps, location) => {
    if (!clientIsps || !location) {
      return undefined;
    }

    const timeSeriesData = clientIsps.map(clientIsp => {
      const clientIspId = clientIsp.meta.client_asn_number;
      const locationClientIsp = location.time.clientIsps[clientIspId];
      return locationClientIsp && locationClientIsp.timeSeries.data;
    }).filter(timeSeries => timeSeries != null);

    return timeSeriesData;
  }
);

/**
 * Selector to get the status of the location+client ISP time series data
 * for the selected client ISPs
 */
export const getLocationClientIspTimeSeriesStatus = createSelector(
  getLocationClientIsps, getLocation,
  (clientIsps, location) => {
    if (!clientIsps || !location) {
      return undefined;
    }

    const timeSeriesObjects = clientIsps.map(clientIsp => {
      const clientIspId = clientIsp.meta.client_asn_number;
      const locationClientIsp = location.time.clientIsps[clientIspId];
      return locationClientIsp && locationClientIsp.timeSeries;
    });

    return status(timeSeriesObjects);
  }
);

/**
 * Selector to get the status of all the active time series data (location and
 * location+clientISP)
 */
export const getTimeSeriesStatus = createSelector(
  getLocationClientIspTimeSeriesStatus, getLocationTimeSeriesStatus,
  (ispStatus, locationStatus) => mergeStatuses(ispStatus, locationStatus));
