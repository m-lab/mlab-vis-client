/**
 * Selectors for comparePage
 */
import d3 from 'd3';
import { createSelector } from 'reselect';
import { metrics, facetTypes } from '../../constants';
import { mergeStatuses, status } from '../status';
import { colorsFor } from '../../utils/color';
import * as LocationsSelectors from '../locations/selectors';
import * as LocationClientIspSelectors from '../locationClientIsp/selectors';
import * as LocationClientIspTransitIspSelectors from '../locationClientIspTransitIsp/selectors';
import * as LocationTransitIspSelectors from '../locationTransitIsp/selectors';
import * as ClientTransitIspSelectors from '../clientIspTransitIsp/selectors';

import makeLocationClientIspId from '../locationClientIsp/makeId';
import makeLocationClientIspTransitIspId from '../locationClientIspTransitIsp/makeId';
import makeLocationTransitIspId from '../locationTransitIsp/makeId';
import makeClientIspTransitIspId from '../clientIspTransitIsp/makeId';


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
 * Input selector to get the selected facet item IDs
 */
function getFacetItemIds(state, props) {
  return props.facetItemIds;
}

/**
 * Input selector to get the selected filter 1 IDs
 */
function getFilter1Ids(state, props) {
  return props.filter1Ids;
}

/**
 * Helper function telling you which type is filter1 and which one is filter2
 */
export function getFilterTypes(state, props) {
  const facetType = getFacetType(state, props);
  if (facetType.value === 'location') {
    return [extractFacetType('clientIsp'), extractFacetType('transitIsp')];
  } else if (facetType.value === 'clientIsp') {
    return [extractFacetType('location'), extractFacetType('transitIsp')];
  } else if (facetType.value === 'transitIsp') {
    return [extractFacetType('location'), extractFacetType('clientIsp')];
  }

  return [];
}

function getClientIsps(state) {
  return state.clientIsps;
}


/**
 * Input selector to get the selected filter 2 IDs
 */
function getFilter2Ids(state, props) {
  return props.filter2Ids;
}

function getTransitIsps(state) {
  return state.transitIsps;
}


function getBreakdownBy(state, props) {
  return props.breakdownBy;
}

// ----------------------
// Selectors
// ----------------------

/**
 * Gets the object for each facet item based on the active facet type
 */
export const getFacetItems = createSelector(
  getFacetType, getFacetItemIds, LocationsSelectors.getLocations, getClientIsps, getTransitIsps,
  (facetType, facetItemIds, locations, clientIsps, transitIsps) => {
    let items;
    if (facetType.value === 'location') {
      items = locations;
    } else if (facetType.value === 'clientIsp') {
      items = clientIsps;
    } else if (facetType.value === 'transitIsp') {
      items = transitIsps;
    }

    if (facetItemIds && items) {
      const facetItems = facetItemIds.map(id => items[id]).filter(d => d != null);
      return facetItems;
    }

    return [];
  }
);

function topKeyFromFilterType(filterType) {
  if (filterType.value === 'location') {
    return 'topLocations';
  } else if (filterType.value === 'clientIsp') {
    return 'topClientIsps';
  } else if (filterType.value === 'transitIsp') {
    return 'topTransitIsps';
  }

  return undefined;
}

function topFilterInfos(facetItems, filterType, filterIds = []) {
  const topKey = topKeyFromFilterType(filterType);

  const { idKey } = filterType;

  // combine the arrays
  let combined = facetItems.map((facetItem) => facetItem[topKey].data)
    .filter(d => d != null && d.length)
    .reduce((flattened, facetTopInfos) => flattened.concat(facetTopInfos), []);

  // remove already selected ones
  combined = combined.filter(d => !filterIds.includes(d[idKey]));

  // nest to combine so we can sum test counts. simplifies object to { [idKey], [labelKey], test_count }
  // ensures we get one object per ID
  const nested = d3.nest().key(d => d[idKey]).entries(combined);
  combined = nested.map(entry => entry.values.slice(1).reduce((reduced, value) => {
    reduced.test_count += value.test_count;
    return reduced;
  }, Object.assign({}, entry.values[0])));

  // sort by test count descending
  combined.sort((a, b) => b.test_count - a.test_count);

  // let's limit it to 20. we aren't showing that many, so no need to keep them around in memory.
  return combined.slice(0, 20);
}

/**
 * Selector to get the colors given all the selected ISPs and locations
 */
export const getTopFilter1Infos = createSelector(
  getFacetItems, getFilterTypes, getFilter1Ids,
  (facetItems, filterTypes, filterIds) => topFilterInfos(facetItems, filterTypes[0], filterIds));

/**
 * Selector to get the colors given all the selected ISPs and locations
 */
export const getTopFilter2Infos = createSelector(
  getFacetItems, getFilterTypes, getFilter2Ids,
  (facetItems, filterTypes, filterIds) => topFilterInfos(facetItems, filterTypes[1], filterIds));


/**
 * Gets the info for each facet item
 */
export const getFacetItemInfos = createSelector(
  getFacetItems,
  (facetItems) => facetItems.map(facetItem => facetItem.info.data)
    .filter(d => d != null));


/**
 * Inflates filter 1 IDs into objects
 */
export const getFilter1Items = createSelector(
  getFilterTypes, getFilter1Ids, LocationsSelectors.getLocations, getClientIsps, getTransitIsps,
  ([filterType], filterIds, locations, clientIsps, transitIsps) => {
    let items;
    if (filterType.value === 'location') {
      items = locations;
    } else if (filterType.value === 'clientIsp') {
      items = clientIsps;
    } else if (filterType.value === 'transitIsp') {
      items = transitIsps;
    }

    if (filterIds) {
      const filterItems = filterIds.map(id => items[id]).filter(d => d != null);
      return filterItems;
    }

    return [];
  }
);

/**
 * Gets the info for filter1 objects
 */
export const getFilter1Infos = createSelector(
  getFilter1Items,
  (filterItems) => filterItems.map(filterItem => filterItem.info.data)
    .filter(d => d != null));


/**
 * Inflates filter 2 IDs into objects
 */
export const getFilter2Items = createSelector(
  getFilterTypes, getFilter2Ids, LocationsSelectors.getLocations, getClientIsps, getTransitIsps,
  ([_, filterType], filterIds, locations, clientIsps, transitIsps) => {
    let items;
    if (filterType.value === 'location') {
      items = locations;
    } else if (filterType.value === 'clientIsp') {
      items = clientIsps;
    } else if (filterType.value === 'transitIsp') {
      items = transitIsps;
    }

    if (filterIds) {
      const filterItems = filterIds.map(id => items[id]).filter(d => d != null);
      return filterItems;
    }

    return [];
  }
);

/**
 * Gets the info for filter2 objects
 */
export const getFilter2Infos = createSelector(
  getFilter2Items,
  (filterItems) => filterItems.map(filterItem => filterItem.info.data)
    .filter(d => d != null));


/**
 * Selector to get the data objects for the main facet items time series data
 */
export const getFacetItemTimeSeries = createSelector(
  getFacetItems,
  (facetItems) => {
    if (!facetItems) {
      return undefined;
    }

    const timeSeries = facetItems
      .map(facetItem => {
        const timeSeries = facetItem.time.timeSeries;
        if (!timeSeries) {
          return null;
        }

        return { id: facetItem.id, status: status(timeSeries), data: timeSeries.data };
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
  getFacetItems,
  (facetItems) => {
    if (!facetItems) {
      return undefined;
    }

    return facetItems.map(facetItem => {
      const hourly = facetItem.time.hourly;
      return { id: facetItem.id, data: hourly.data, status: status(hourly) };
    });
  }
);

/**
 * Compute the combined type and create the IDs for the combined items
 *
 * Possible outcomes for combinedType are:
 * - clientIsp-transitIsp
 * - location-clientIsp
 * - location-clientIsp-transitIsp
 * - location-transitIsp
 */
export const getCombinedTypeAndIds = createSelector(
  getFacetType, getFacetItemIds, getFilterTypes, getFilter1Ids, getFilter2Ids, getBreakdownBy,
  (facetType, facetItemIds, [filter1Type, filter2Type], filter1Ids, filter2Ids, breakdownBy) => {
    const sortValues = { location: 0, clientIsp: 1, transitIsp: 2 };

    // find out which filters are active
    const combined = [{
      value: facetType.value,
      type: 'facet',
      ids: facetItemIds || [],
      sort: sortValues[facetType.value],
    }];
    if (filter1Ids && filter1Ids.length) {
      combined.push({
        value: filter1Type.value,
        type: 'filter1',
        breakdownBy: breakdownBy === 'filter1',
        ids: filter1Ids,
        sort: sortValues[filter1Type.value],
      });
    }
    if (filter2Ids && filter2Ids.length) {
      combined.push({
        value: filter2Type.value,
        type: 'filter2',
        breakdownBy: breakdownBy === 'filter2',
        ids: filter2Ids,
        sort: sortValues[filter2Type.value],
      });
    }
    // sort so we get the same value no matter if where a type occurs
    const combinedType = combined.sort((a, b) => a.sort - b.sort).map(d => d.value).join('-');

    // compute combined IDs
    const combinedIds = [];
    switch (combinedType) {
      case 'location-clientIsp': {
        // make IDs
        const locations = combined[0];
        const clientIsps = combined[1];

        locations.ids.forEach(locationId => {
          clientIsps.ids.forEach(clientIspId => {
            combinedIds.push({
              facetItemId: locations.type === 'facet' ? locationId : clientIspId,
              filterItemId: locations.type !== 'facet' ? locationId : clientIspId,
              combined: makeLocationClientIspId(locationId, clientIspId),
            });
          });
        });

        break;
      }
      case 'location-transitIsp': {
        // make IDs
        const locations = combined[0];
        const transitIsps = combined[1];

        locations.ids.forEach(locationId => {
          transitIsps.ids.forEach(transitIspId => {
            combinedIds.push({
              facetItemId: locations.type === 'facet' ? locationId : transitIspId,
              filterItemId: locations.type !== 'facet' ? locationId : transitIspId,
              combined: makeLocationTransitIspId(locationId, transitIspId),
            });
          });
        });
        break;
      }
      case 'clientIsp-transitIsp': {
        // make IDs
        const clientIsps = combined[0];
        const transitIsps = combined[1];

        clientIsps.ids.forEach(clientIspId => {
          transitIsps.ids.forEach(transitIspId => {
            combinedIds.push({
              facetItemId: clientIsps.type === 'facet' ? clientIspId : transitIspId,
              filterItemId: clientIsps.type !== 'facet' ? clientIspId : transitIspId,
              combined: makeClientIspTransitIspId(clientIspId, transitIspId),
            });
          });
        });
        break;
      }
      case 'location-clientIsp-transitIsp': {
        // make IDs
        const locations = combined[0];
        const clientIsps = combined[1];
        const transitIsps = combined[2];

        locations.ids.forEach(locationId => {
          clientIsps.ids.forEach(clientIspId => {
            transitIsps.ids.forEach(transitIspId => {
              /* eslint-disable no-nested-ternary,max-len */
              const facetItemId = locations.type === 'facet' ? locationId : (clientIsps.type === 'facet' ? clientIspId : transitIspId);
              const breakdownByItemId = locations.breakdownBy ? locationId : (clientIsps.breakdownBy ? clientIspId : transitIspId);
              const filterItemId = locations.breakdownBy === false ? locationId : (clientIsps.breakdownBy === false ? clientIspId : transitIspId);
              /* eslint-enable no-nested-ternary,max-len */

              combinedIds.push({
                facetItemId,
                breakdownByItemId,
                filterItemId,
                combined: makeLocationClientIspTransitIspId(locationId, clientIspId, transitIspId),
              });
            });
          });
        });
        break;
      }
      default:
        break;
    }

    return { combinedType, combinedIds };
  }
);


/**
 * Get the data items for the combined facet + filters
 */
export const getCombinedItems = createSelector(
  getCombinedTypeAndIds,
  LocationClientIspSelectors.getLocationClientIsps,
  LocationTransitIspSelectors.getLocationTransitIsps,
  ClientTransitIspSelectors.getClientIspTransitIsps,
  LocationClientIspTransitIspSelectors.getLocationClientIspTransitIsps,
  ({ combinedType, combinedIds }, locationClientIsps, locationTransitIsps,
    clientIspTransitIsps, locationClientIspTransitIsps) => {
    const sourceMap = {
      'location-clientIsp': locationClientIsps,
      'location-clientIsp-transitIsp': locationClientIspTransitIsps,
      'location-transitIsp': locationTransitIsps,
      'clientIsp-transitIsp': clientIspTransitIsps,
    };

    const source = sourceMap[combinedType];

    if (source) {
      return combinedIds.map(id => ({
        id,
        data: source[id.combined],
      })).filter(d => d.data != null);
    }

    return [];
  }
);

/**
 * helper function to combine data in a nested format.
 * end up with:
 * { facetId: combined, ... } (one filter)
 * { facetId: { breakdownByItemId: combined, ... }, ... } (two filters)
 *
 * where combined happens by sending a subset of combinedItems to combine()
 */
function combineData(combine, combinedType, combinedItems) {
  if (!combinedItems || !combinedItems.length) {
    return undefined;
  }

  // end result is grouped by facet item ID
  let byFacetItem;

  // nest by facet item ID
  const nest = d3.nest().key(item => item.id.facetItemId);

  // nest two levels deep for all 3 factors
  if (combinedType === 'location-clientIsp-transitIsp') {
    // further nest by breakdown item ID
    byFacetItem = nest.key(item => item.id.breakdownByItemId).object(combinedItems);

    // replace combine the items as combined time series objects
    Object.keys(byFacetItem).forEach(facetItemId => {
      const byBreakdown = byFacetItem[facetItemId];
      Object.keys(byBreakdown).forEach(breakdownByItemId => {
        // replace the array of items with a combined time series object
        byBreakdown[breakdownByItemId] = combine(byBreakdown[breakdownByItemId]);
      });
    });

  // only one filter active, so only one level of nesting necessary
  } else {
    byFacetItem = nest.object(combinedItems);
    Object.keys(byFacetItem).forEach(facetItemId => {
      // replace the array of items with a combined time series object
      byFacetItem[facetItemId] = combine(byFacetItem[facetItemId]);
    });
  }

  return byFacetItem;
}

// helper function to combine the time series into a single object of form:
// {facetId: { status: "", statuses: [], data: [] }, ...}
// where each data entry corresponds to a line
function combineTimeSeries(itemsToCombine) {
  const timeSeriesToCombine = itemsToCombine.map(item => item.data.time.timeSeries);

  // group them together by the facet ID
  const combinedTimeSeries = timeSeriesToCombine.reduce((combined, timeSeriesObject) => {
    combined.statuses.push(status(timeSeriesObject));
    if (timeSeriesObject.data) {
      combined.data.push(timeSeriesObject.data);
    }
    return combined;
  }, { statuses: [], data: [] });

  // compute the overall status for this facet group
  combinedTimeSeries.status = mergeStatuses(combinedTimeSeries.statuses);
  return combinedTimeSeries;
}

/**
 * Selector to get the data objects for the combined filtered time series data
 */
export const getCombinedTimeSeries = createSelector(
  getCombinedTypeAndIds,
  getFacetItemIds,
  getCombinedItems,
  ({ combinedType }, facetItemIds, combinedItems) => {
    const combined = combineData(combineTimeSeries, combinedType, combinedItems);
    return combined;
  }
);

// helper function to combine items into combined hourly objects
function combineHourly(itemsToCombine) {
  const hourlyObjects = itemsToCombine.map(item => ({
    id: item.id.filterItemId,
    data: item.data.time.hourly.data,
    status: status(item.data.time.hourly),
  }));

  return hourlyObjects;
}

/**
 * Selector to get the data objects for the single filtered hourly data
 */
export const getCombinedHourly = createSelector(
  getCombinedTypeAndIds,
  getFacetItemIds,
  getCombinedItems,
  ({ combinedType }, facetItemIds, combinedItems) => {
    const combined = combineData(combineHourly, combinedType, combinedItems);
    return combined;
  }
);


/**
 * Selector to get the colors given all the selected ISPs and locations
 */
export const getColors = createSelector(
  getFacetItemIds, getFilter1Ids, getFilter2Ids,
  (facetItemIds, filterClientIspIds, filterTransitIspIds) => {
    const combined = [facetItemIds, filterClientIspIds, filterTransitIspIds]
      .filter(d => d != null)
      .reduce((combined, ids) => combined.concat(ids), []);

    const colors = colorsFor(combined);
    return colors;
  }
);
