/**
 * Selectors for dataPage
 */
import { createSelector } from 'reselect';
import { status } from '../status';
import timeAggregationFromDates from '../../utils/timeAggregationFromDates';
import * as LocationsSelectors from '../locations/selectors';
import * as ClientIspsSelectors from '../clientIsps/selectors';
import * as TransitIspsSelectors from '../transitIsps/selectors';
import * as TopSelectors from '../top/selectors';

// ----------------------
// Input Selectors
// ----------------------
export function getAutoTimeAggregation(state) {
  return state.dataPage.autoTimeAggregation;
}

export function getDownloadStatus(state) {
  return state.dataPage.downloadStatus;
}

export function getTimeAggregation(state, props) {
  let { timeAggregation } = props;

  // this sets the default value
  if (timeAggregation == null) {
    timeAggregation = timeAggregationFromDates(props.startDate, props.endDate);
  }

  return timeAggregation;
}

function getLocationIds(state, props) {
  return props.locationIds;
}

function getClientIspIds(state, props) {
  return props.clientIspIds;
}

function getTransitIspIds(state, props) {
  return props.transitIspIds;
}

// ----------------------
// Selectors
// ----------------------
export const getLocations = createSelector(
  getLocationIds, LocationsSelectors.getLocations,
  (locationIds, allLocations) => {
    if (locationIds && allLocations) {
      const locations = locationIds.map(id => allLocations[id]).filter(d => d != null);
      return locations;
    }

    return [];
  }
);

export const getLocationInfos = createSelector(
  getLocations,
  (locations) => locations.map(location => location.info.data)
    .filter(d => d != null));

export const getClientIsps = createSelector(
  getClientIspIds, ClientIspsSelectors.getClientIsps,
  (clientIspIds, allClientIsps) => {
    if (clientIspIds && allClientIsps) {
      const clientIsps = clientIspIds.map(id => allClientIsps[id]).filter(d => d != null);
      return clientIsps;
    }

    return [];
  }
);

export const getClientIspInfos = createSelector(
  getClientIsps,
  (clientIsps) => clientIsps.map(clientIsp => clientIsp.info.data)
    .filter(d => d != null));


export const getTransitIsps = createSelector(
  getTransitIspIds, TransitIspsSelectors.getTransitIsps,
  (transitIspIds, allTransitIsps) => {
    if (transitIspIds && allTransitIsps) {
      const transitIsps = transitIspIds.map(id => allTransitIsps[id]).filter(d => d != null);
      return transitIsps;
    }

    return [];
  }
);

export const getTransitIspInfos = createSelector(
  getTransitIsps,
  (transitIsps) => transitIsps.map(transitIsp => transitIsp.info.data)
    .filter(d => d != null));


/**
 * Helper function to get top items excluding those already selected based on filterIds
 */
function getFilteredTopItems(top, filterIds, idKey) {
  let topItems = top.data || [];
  const statusStr = status(top);

  // remove already selected ones
  topItems = topItems.filter(d => !filterIds.includes(d[idKey]));

  // let's limit it to 20. we aren't showing that many, so no need to keep them around in memory.
  return {
    data: topItems.slice(0, 20),
    status: statusStr,
  };
}

export const getLocationSuggestionsForClientIsps = createSelector(
  TopSelectors.getTopLocationsForClientIsps, getLocationIds,
  (top, locationIds) => getFilteredTopItems(top, locationIds, 'location_key'));

export const getLocationSuggestionsForTransitIsps = createSelector(
  TopSelectors.getTopLocationsForTransitIsps, getLocationIds,
  (top, locationIds) => getFilteredTopItems(top, locationIds, 'location_key'));

export const getClientIspSuggestionsForLocations = createSelector(
  TopSelectors.getTopClientIspsForLocations, getClientIspIds,
  (top, clientIspIds) => getFilteredTopItems(top, clientIspIds, 'client_asn_number'));

export const getClientIspSuggestionsForTransitIsps = createSelector(
  TopSelectors.getTopClientIspsForTransitIsps, getClientIspIds,
  (top, clientIspIds) => getFilteredTopItems(top, clientIspIds, 'client_asn_number'));


export const getTransitIspSuggestionsForLocations = createSelector(
  TopSelectors.getTopTransitIspsForLocations, getTransitIspIds,
  (top, transitIspIds) => getFilteredTopItems(top, transitIspIds, 'server_asn_number'));

export const getTransitIspSuggestionsForClientIsps = createSelector(
  TopSelectors.getTopTransitIspsForClientIsps, getTransitIspIds,
  (top, transitIspIds) => getFilteredTopItems(top, transitIspIds, 'server_asn_number'));
