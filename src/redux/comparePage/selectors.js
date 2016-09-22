/**
 * Selectors for comparePage
 */
import { createSelector } from 'reselect';
import { metrics, facetTypes } from '../../constants';
import { mergeStatuses, status } from '../status';
import { colorsFor } from '../../utils/color';

// ----------------------
// Input Selectors
// ----------------------


export function getHighlightHourly(state) {
  return state.comparePage.highlightHourly;
}

export function getHighlightTimeSeriesDate(state) {
  return state.comparePage.highlightTimeSeriesDate;
}

export function getHighlightTimeSeriesLine(state) {
  return state.comparePage.highlightTimeSeriesLine;
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
  const value = props.viewMetric;
  return extractMetric(value);
}


/**
 * Extract a particular facetType from facetTypes array using its value
 * @param {String} metricValue the value of the metric to search for.
 * @return {Object} metric with value of metricValue
 */
function extractFacetType(facetTypeValue) {
  let facetType = facetTypes.find(facetType => facetType.value === facetTypeValue);
  if (!facetType) {
    if (__DEVELOPMENT__) {
      console.warn('Facet type not found', facetTypeValue, '-- using location');
    }

    facetType = facetTypes[0];
  }

  return facetType;
}

/**
 * Input selector to get the currently selected facet type
 * @param {Object} state the redux state
 * @param {Object} props the react props with URL query params included
 */
export function getFacetType(state, props) {
  const value = props.facetType;
  return extractFacetType(value);
}

/**
 * Input selector to get the selected facet location IDs
 */
function getFacetLocationIds(state, props) {
  return props.facetLocationIds;
}


function getLocations(state) {
  return state.locations;
}


/**
 * Input selector to get the selected filter client ISP IDs
 */
function getFilterClientIspIds(state, props) {
  return props.filterClientIspIds;
}

function getClientIsps(state) {
  return state.clientIsps;
}


/**
 * Input selector to get the selected filter transit ISP IDs
 */
function getFilterTransitIspIds(state, props) {
  return props.filterTransitIspIds;
}

function getTransitIsps(state) {
  return state.transitIsps;
}

// ----------------------
// Selectors
// ----------------------

/**
 * Inflates facet location IDs into location values
 */
export const getFacetLocations = createSelector(
  getLocations, getFacetLocationIds,
  (locations, facetLocationIds) => {
    if (facetLocationIds) {
      const facetLocations = facetLocationIds.map(id => locations[id]).filter(d => d != null);
      return facetLocations;
    }

    return [];
  }
);


/**
 * Gets the location info for each facet location
 */
export const getFacetLocationInfos = createSelector(
  getFacetLocations,
  (facetLocations) => facetLocations.map(facetLocation => facetLocation.info.data)
    .filter(d => d != null));


/**
 * Inflates facet client ISP IDs into client ISP values
 */
export const getFilterClientIsps = createSelector(
  getClientIsps, getFilterClientIspIds,
  (clientIsps, filterClientIspIds) => {
    if (filterClientIspIds) {
      const facetLocations = filterClientIspIds.map(id => clientIsps[id]).filter(d => d != null);
      return facetLocations;
    }

    return [];
  }
);


/**
 * Gets the client ISP info for each facet client ISP
 */
export const getFilterClientIspInfos = createSelector(
  getFilterClientIsps,
  (filterClientIsps) => filterClientIsps.map(filterClientIsp => filterClientIsp.info.data)
    .filter(d => d != null));


/**
 * Inflates facet transit ISP IDs into transit ISP values
 */
export const getFilterTransitIsps = createSelector(
  getTransitIsps, getFilterTransitIspIds,
  (transitIsps, filterTransitIspIds) => {
    if (filterTransitIspIds) {
      const facetLocations = filterTransitIspIds.map(id => transitIsps[id]).filter(d => d != null);
      return facetLocations;
    }

    return [];
  }
);


/**
 * Gets the transit ISP info for each facet transit ISP
 */
export const getFilterTransitIspInfos = createSelector(
  getFilterTransitIsps,
  (filterTransitIsps) => filterTransitIsps.map(filterTransitIsp => filterTransitIsp.info.data)
    .filter(d => d != null));


/**
 * Selector to get the data objects for the main facet items time series data
 */
export const getFacetItemTimeSeries = createSelector(
  getFacetLocations,
  (facetLocations) => {
    if (!facetLocations) {
      return undefined;
    }

    const timeSeries = facetLocations
      .map(facetLocation => {
        const timeSeries = facetLocation.time.timeSeries;
        if (!timeSeries) {
          return null;
        }

        return { id: facetLocation.id, status: status(timeSeries), data: timeSeries.data };
      })
      .filter(d => d != null);

    const combined = timeSeries
      .reduce((combined, timeSeries) => {
        combined.statuses.push(timeSeries.status);
        if (timeSeries.data) {
          combined.data.push(timeSeries.data);
        }
        return combined;
      }, { statuses: [], data: [] });

    combined.status = mergeStatuses(combined.statuses);

    return { combined, timeSeries };
  }
);

/**
 * Selector to get the data objects for the overall hourly data
 */
export const getFacetItemHourly = createSelector(
  getFacetLocations,
  (facetLocations) => {
    if (!facetLocations) {
      return undefined;
    }

    return facetLocations.map(facetLocation => {
      const hourly = facetLocation.time.hourly;
      return { id: facetLocation.id, data: hourly.data, status: status(hourly) };
    });
  }
);


/**
 * Selector to get the data objects for the single filtered time series data
 */
export const getSingleFilterTimeSeries = createSelector(
  getFacetLocations, getFilterClientIsps,
  (facetLocations, clientIsps) => {
    if (!facetLocations) {
      return undefined;
    }

    return facetLocations.reduce((byLocation, facetLocation) => {
      const timeSeriesObjects = clientIsps
        .map(filterClientIsp => {
          if (!facetLocation.clientIsps[filterClientIsp.id]) {
            return null;
          }
          return facetLocation.clientIsps[filterClientIsp.id].time.timeSeries;
        })
        .filter(d => d != null);

      // group them together
      byLocation[facetLocation.id] = timeSeriesObjects.reduce((combined, timeSeriesObject) => {
        combined.statuses.push(status(timeSeriesObject));
        if (timeSeriesObject.data) {
          combined.data.push(timeSeriesObject.data);
        }
        return combined;
      }, { statuses: [], data: [] });

      byLocation[facetLocation.id].status = mergeStatuses(byLocation[facetLocation.id].statuses);

      return byLocation;
    }, {});
  }
);

/**
 * Selector to get the data objects for the single filtered hourly data
 */
export const getSingleFilterHourly = createSelector(
  getFacetLocations, getFilterClientIsps,
  (facetLocations, clientIsps) => {
    if (!facetLocations) {
      return undefined;
    }

    return facetLocations.reduce((byLocation, facetLocation) => {
      const hourlyObjects = clientIsps
        .map(filterClientIsp => {
          if (!facetLocation.clientIsps[filterClientIsp.id]) {
            return null;
          }

          const hourly = facetLocation.clientIsps[filterClientIsp.id].time.hourly;
          return { id: filterClientIsp.id, data: hourly.data, status: status(hourly) };
        })
        .filter(d => d != null);

      // group them together
      byLocation[facetLocation.id] = hourlyObjects;

      return byLocation;
    }, {});
  }
);


/**
 * Selector to get the colors given all the selected ISPs and locations
 */
export const getColors = createSelector(
  getFacetLocationIds, getFilterClientIspIds, getFilterTransitIspIds,
  (facetLocationIds, filterClientIspIds, filterTransitIspIds) => {
    const combined = [].concat(facetLocationIds, filterClientIspIds, filterTransitIspIds);
    return colorsFor(combined);
  }
);
