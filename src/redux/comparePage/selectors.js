/**
 * Selectors for comparePage
 */
import { createSelector } from 'reselect';
import { metrics, facetTypes } from '../../constants';

// ----------------------
// Input Selectors
// ----------------------
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


