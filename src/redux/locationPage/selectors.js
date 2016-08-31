/**
 * Selectors for locationPage
 */
import d3 from 'd3';

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


export function getLocationInfo(state, props) {
  const location = getLocation(state, props);
  return location.info.data;
}

export function getLocationFixed(state, props) {
  const location = getLocation(state, props);
  return location.fixed.data;
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
  return location.clientIsps.data;
}

/**
 * Inflates clientIspIds into clientIsp values and returns
 * selected clientIsps
 */
export function getLocationClientIspsSelected(state, props) {
  const clientIsps = getLocationClientIsps(state, props);
  const selectedIds = props.selectedClientIspIds;
  if (clientIsps && selectedIds) {
    const selected = clientIsps.filter(isp => selectedIds.includes(isp.meta.client_asn_number));

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
 * Selector to get the data objects for location+client ISP time series data
 * for the selected client ISPs
 */
export const getLocationClientIspTimeSeriesObjects = createSelector(
  getLocationClientIspsSelected, getLocation,
  (clientIsps, location) => {
    if (!clientIsps || !location) {
      return undefined;
    }

    const timeSeriesObjects = clientIsps.map(clientIsp => {
      const clientIspId = clientIsp.meta.client_asn_number;
      const locationClientIsp = location.time.clientIsps[clientIspId];
      return locationClientIsp && locationClientIsp.timeSeries;
    });

    return timeSeriesObjects;
  }
);

/**
 * Selector to get the location+client ISP time series data
 * for the selected client ISPs
 */
export const getLocationClientIspTimeSeries = createSelector(
  getLocationClientIspTimeSeriesObjects,
  (timeSeriesObjects) => {
    if (!timeSeriesObjects) {
      return undefined;
    }

    return timeSeriesObjects.map(timeSeries => timeSeries && timeSeries.data)
      .filter(timeSeries => timeSeries != null);
  }
);

/**
 * Selector to get the status of the location+client ISP time series data
 * for the selected client ISPs
 */
export const getLocationClientIspTimeSeriesStatus = createSelector(
  getLocationClientIspTimeSeriesObjects,
  (timeSeriesObjects) => status(timeSeriesObjects));


/**
 * Selector to get the status of all the active time series data (location and
 * location+clientISP)
 */
export const getTimeSeriesStatus = createSelector(
  getLocationClientIspTimeSeriesStatus, getLocationTimeSeriesStatus,
  (ispStatus, locationStatus) => mergeStatuses(ispStatus, locationStatus));


/**
 * Selector to get the summary data for the location and related ISPs
 */
export const getSummaryData = createSelector(
  getLocationInfo, getLocationFixed, // getLocationClientIspFixed, (TODO add client ISP fixed data)
  (locationInfo, locationFixed, locationClientIspFixed) => {
    if (!locationFixed) {
      return undefined;
    }

    if (!locationClientIspFixed) {
      locationClientIspFixed = [];
    }

    // gropu all the `lastYear`, `lastweek`, etc together
    const results = Object.keys(locationFixed).reduce((grouped, key) => {
      const locationData = {
        ...locationFixed[key],
        label: locationInfo.name,
      };

      // add in the results for client ISPs here (TODO - add in proper names)
      const clientIspsData = locationClientIspFixed.map((ispFixed, i) => ({
        ...ispFixed[key],
        label: `clientIsp${i}`,
      }));

      grouped[key] = [locationData, ...clientIspsData];

      return grouped;
    }, {});

    return results;
  }
);
