/**
 * Selectors for locationPage
 */
import { createSelector } from 'reselect';
import { initialLocationState } from '../locations/initialState';
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

export function getLocationTopClientIsps(state, props) {
  const location = getLocation(state, props);
  return location.topClientIsps.data;
}

export function getHighlightHourly(state) {
  return state.locationPage.highlightHourly;
}

export function getHighlightTimeSeriesDate(state) {
  return state.locationPage.highlightTimeSeriesDate;
}

export function getHighlightTimeSeriesLine(state) {
  return state.locationPage.highlightTimeSeriesLine;
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
 * Input selector to get the selected client ISP IDs
 */
function getLocationSelectedClientIspIds(state, props) {
  return props.selectedClientIspIds;
}


/**
 * Input selector to get the client ISP map for a location
 */
function getLocationClientIsps(state, props) {
  return getLocation(state, props).clientIsps;
}


// ----------------------
// Selectors
// ----------------------

/**
 * Inflates clientIspIds into clientIsp values and returns
 * selected clientIsps
 */
export const getLocationSelectedClientIsps = createSelector(
  getLocationClientIsps, getLocationSelectedClientIspIds,
  (clientIsps, selectedIds) => {
    if (selectedIds) {
      const selected = selectedIds.map(id => clientIsps[id]).filter(d => d != null);
      return selected;
    }
    return [];
  }
);

/**
 * Inflates clientIspIds into clientIsp values and returns
 * selected clientIsps info
 */
export const getLocationSelectedClientIspInfo = createSelector(
  getLocationSelectedClientIsps,
  (clientIsps) => clientIsps.map(clientIsp => clientIsp.info.data)
    .filter(d => d != null));


/**
 * Selector to get the data objects for location+client ISP time series data
 * for the selected client ISPs
 */
export const getLocationClientIspTimeSeriesObjects = createSelector(
  getLocationSelectedClientIsps,
  (clientIsps) => {
    if (!clientIsps) {
      return undefined;
    }

    return clientIsps.map(clientIsp => clientIsp.time.timeSeries);
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
 * Selector to get the location+client ISP time series data
 * for the selected client ISPs AND for the location all ine one array.
 */
export const getLocationAndClientIspTimeSeries = createSelector(
  getLocationClientIspTimeSeries, getLocationTimeSeries,
  (clientIspTimeSeries = [], locationTimeSeries) => {
    let result = [];
    if (locationTimeSeries) {
      result.push(locationTimeSeries);
    }

    if (clientIspTimeSeries) {
      result = result.concat(clientIspTimeSeries);
    }

    return result;
  }
);


/**
 * Selector to get the summary data for the location and related ISPs
 * @return {Object} A key for each type of fixed data
 * Sample: { lastYear: { locationData: {}, clientIspsData: [] }}
 */
export const getSummaryData = createSelector(
  getLocationInfo, getLocationFixed, getLocationSelectedClientIsps,
  (locationInfo, locationFixed, selectedClientIsps) => {
    if (!locationFixed) {
      return undefined;
    }

    if (!selectedClientIsps) {
      selectedClientIsps = [];
    }

    // group all the `lastYear`, `lastweek`, etc together
    const results = Object.keys(locationFixed).reduce((grouped, key) => {
      const locationData = {
        ...locationFixed[key],
        label: locationInfo.name,
      };

      // add in the results for client ISPs here
      const clientIspsData = selectedClientIsps.map(clientIsp => {
        const ispFixed = clientIsp.fixed.data || {};
        const ispInfo = clientIsp.info.data || {};

        return {
          ...ispFixed[key],
          label: ispInfo.client_asn_name,
        };
      });

      grouped[key] = { locationData, clientIspsData };

      return grouped;
    }, {});

    return results;
  }
);

/**
 * Selector to get the data objects for location+client ISP hourly data
 * for the selected client ISPs
 */
export const getLocationClientIspHourlyObjects = createSelector(
  getLocationSelectedClientIsps,
  (clientIsps) => {
    if (!clientIsps) {
      return undefined;
    }

    return clientIsps.map(clientIsp => clientIsp.time.hourly);
  }
);

/**
 * Selector to get the location+client ISP hourly data
 * for the selected client ISPs
 */
export const getLocationClientIspHourly = createSelector(
  getLocationClientIspHourlyObjects,
  (hourlyObjects) => {
    if (!hourlyObjects) {
      return undefined;
    }

    return hourlyObjects.map(hourly => hourly && hourly.data)
      .filter(hourly => hourly != null);
  }
);

/**
 * Selector to get the status of the location+client ISP hourly data
 * for the selected client ISPs
 */
export const getLocationClientIspHourlyStatus = createSelector(
  getLocationClientIspHourlyObjects,
  (hourlyObjects) => status(hourlyObjects));




