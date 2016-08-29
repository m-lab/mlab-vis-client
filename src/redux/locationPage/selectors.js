/**
 * Selectors for locationPage
 */

import _ from 'lodash';

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
  return location.clientIsps.data;
}

export function getLocationClientIspsSelected(state, props) {
  const clientIsps = getLocationClientIsps(state, props);
  const selectedIds = props.selectedClientIspIds;
  if (clientIsps && selectedIds) {
    const selected = _.filter(clientIsps, (isp) =>
      _.includes(selectedIds, isp.meta.client_asn_number)
    );

    return selected;
  }
  return [];
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
  getLocationClientIspsSelected, getLocation,
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
