/**
 * Selectors for locationPage
 */
import { createSelector } from 'reselect';
import { metrics } from '../../constants';
import status from '../status';
import { colorsFor } from '../../utils/color';
import timeAggregationFromDates from '../../utils/timeAggregationFromDates';
import * as LocationsSelectors from '../locations/selectors';
import * as LocationClientIspSelectors from '../locationClientIsp/selectors';

// ----------------------
// Input Selectors
// ----------------------
export function getLocationId(state, props) {
  return props.locationId;
}

export function getAutoTimeAggregation(state) {
  return state.locationPage.autoTimeAggregation;
}

export function getTimeAggregation(state, props) {
  let { timeAggregation } = props;

  // this sets the default value
  if (timeAggregation == null) {
    timeAggregation = timeAggregationFromDates(props.startDate, props.endDate);
  }

  return timeAggregation;
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
 * Extract a particular metric from metrics array using its value
 * @param {String} metricValue the value of the metric to search for.
 * @return {Object} metric with value of metricValue
 */
function extractMetric(metricValue) {
  let metric = metrics.find(metric => metric.value === metricValue);
  if (!metric) {
    if (__DEVELOPMENT__) {
      console.warn('Metric not found', metricValue, '-- using download');
    }

    metric = metrics[0];
  }

  return metric;
}

/**
 * Input selector to get the currently viewed metric
 * @param {Object} state the redux state
 * @param {Object} props the react props with URL query params included
 */
export function getViewMetric(state, props) {
  const value = props.viewMetric || 'download';
  return extractMetric(value);
}

/**
 * Input selector to get the currently viewed metric
 * @param {Object} state the redux state
 * @param {Object} props the react props with URL query params included
 */
export function getCompareMetrics(state, props) {
  const xValue = props.compareMetricX || 'download';
  const yValue = props.compareMetricY || 'upload';

  return {
    x: extractMetric(xValue),
    y: extractMetric(yValue),
  };
}

/**
 * Input selector to get the selected client ISP IDs
 */
function getLocationSelectedClientIspIds(state, props) {
  return props.selectedClientIspIds;
}

// ----------------------
// Selectors
// ----------------------

/**
 * Inflates clientIspIds into clientIsp values and returns
 * selected clientIsps
 */
export const getLocationSelectedClientIsps = createSelector(
  LocationClientIspSelectors.getLocationClientIsps, getLocationSelectedClientIspIds, getLocationId,
  (locationClientIsps, selectedIds, locationId) => {
    if (selectedIds) {
      const selected = selectedIds.map(id =>
          LocationClientIspSelectors.findLocationClientIsp(locationClientIsps, locationId, id)
        ).filter(d => d != null);
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
  getLocationClientIspTimeSeriesStatus, LocationsSelectors.getLocationTimeSeriesStatus,
  (ispStatus, locationStatus) => status([ispStatus, locationStatus]));


/**
 * Selector to get the location+client ISP time series data
 * for the selected client ISPs AND for the location all ine one array.
 */
export const getLocationAndClientIspTimeSeries = createSelector(
  getLocationClientIspTimeSeries, LocationsSelectors.getLocationTimeSeries,
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
  LocationsSelectors.getLocationInfo, LocationsSelectors.getLocationFixed, getLocationSelectedClientIsps,
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
        label: locationInfo.label,
        id: locationInfo.id,
      };

      // add in the results for client ISPs here
      const clientIspsData = selectedClientIsps.map(clientIsp => {
        const ispFixed = clientIsp.fixed.data;
        const ispInfo = clientIsp.info.data;
        if (!ispInfo || !ispFixed) {
          return null;
        }

        return {
          ...ispFixed[key],
          label: ispInfo.client_asn_name,
          id: ispInfo.client_asn_number,
        };
      }).filter(d => d != null);

      grouped[key] = { locationData, clientIspsData };

      return grouped;
    }, {});

    return results;
  }
);


/**
 * Selector to get the location hourly data
 */
export const getLocationHourly = createSelector(
  LocationsSelectors.getLocationHourly, LocationsSelectors.getLocationHourlyStatus,
  (data, status) => ({ data, status }));

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

    return hourlyObjects.map(hourly => ({ data: hourly && hourly.data, status: status(hourly) }));
  }
);

/**
 * Selector to get the status of the location+client ISP hourly data
 * for the selected client ISPs
 */
export const getLocationClientIspHourlyStatus = createSelector(
  getLocationClientIspHourlyObjects,
  (hourlyObjects) => status(hourlyObjects));

/**
 * Selector to get the colors given all the selected ISPs and locations
 */
export const getColors = createSelector(
  getLocationId, getLocationSelectedClientIspIds,
  (locationId, selectedClientIspIds) => {
    const colors = colorsFor(selectedClientIspIds,
      // generate the colors based on client ISP ID
      clientIspId => clientIspId,
      // access the colours based on location_clientIspId
      clientIspId => `${locationId}_${clientIspId}`);

    return colors;
  }
);
