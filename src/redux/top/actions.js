/**
 * Actions for top
 */
import createFetchAction from '../createFetchAction';
import { shouldFetch } from '../shared/shouldFetch';
/**
 * Action Creators
 */

function stringifyIds(ids) {
  return ids.join(',');
}

function topShouldFetch(state, filterIds) {
  // ignore empty lists of IDs
  if (!filterIds || filterIds.length === 0) {
    return false;
  }

  // is it a different list of IDs than what we had before?
  if (state.filterIds !== stringifyIds(filterIds)) {
    return true;
  }

  // query matches what is currently there.
  return shouldFetch(state);
}

// --------------------------------------
// Fetch Top Locations for Client ISPS
// --------------------------------------
const locationsForClientIspsFetch = createFetchAction({
  typePrefix: 'top/locations/clientIsps/',
  key: 'TOP',
  args: ['clientIspIds'],
  shouldFetch(state, clientIspIds) {
    const baseState = state.top.locationsForClientIsps;
    return topShouldFetch(baseState, clientIspIds);
  },
  promise(clientIspIds) {
    return api => api.getTopLocationsForClientIsps(clientIspIds);
  },
});

export const FETCH_TOP_LOCATIONS_FOR_CLIENT_ISPS = locationsForClientIspsFetch.types.fetch;
export const FETCH_TOP_LOCATIONS_FOR_CLIENT_ISPS_SUCCESS = locationsForClientIspsFetch.types.success;
export const FETCH_TOP_LOCATIONS_FOR_CLIENT_ISPS_FAIL = locationsForClientIspsFetch.types.fail;
export const shouldFetchLocationsForClientIsps = locationsForClientIspsFetch.shouldFetch;
export const fetchLocationsForClientIsps = locationsForClientIspsFetch.fetch;
export const fetchLocationsForClientIspsIfNeeded = locationsForClientIspsFetch.fetchIfNeeded;


// --------------------------------------
// Fetch Top Locations for Transit ISPS
// --------------------------------------
const locationsForTransitIspsFetch = createFetchAction({
  typePrefix: 'top/locations/transitIsps/',
  key: 'TOP',
  args: ['transitIspIds'],
  shouldFetch(state, transitIspIds) {
    const baseState = state.top.locationsForTransitIsps;
    return topShouldFetch(baseState, transitIspIds);
  },
  promise(transitIspIds) {
    return api => api.getTopLocationsForTransitIsps(transitIspIds);
  },
});

export const FETCH_TOP_LOCATIONS_FOR_TRANSIT_ISPS = locationsForTransitIspsFetch.types.fetch;
export const FETCH_TOP_LOCATIONS_FOR_TRANSIT_ISPS_SUCCESS = locationsForTransitIspsFetch.types.success;
export const FETCH_TOP_LOCATIONS_FOR_TRANSIT_ISPS_FAIL = locationsForTransitIspsFetch.types.fail;
export const shouldFetchLocationsForTransitIsps = locationsForTransitIspsFetch.shouldFetch;
export const fetchLocationsForTransitIsps = locationsForTransitIspsFetch.fetch;
export const fetchLocationsForTransitIspsIfNeeded = locationsForTransitIspsFetch.fetchIfNeeded;


// --------------------------------------
// Fetch Top Client ISPs for Locations
// --------------------------------------
const clientIspsForLocationsFetch = createFetchAction({
  typePrefix: 'top/clientIsps/locations/',
  key: 'TOP',
  args: ['locationIds'],
  shouldFetch(state, locationIds) {
    const baseState = state.top.clientIspsForLocations;
    return topShouldFetch(baseState, locationIds);
  },
  promise(locationIds) {
    return api => api.getTopClientIspsForLocations(locationIds);
  },
});

export const FETCH_TOP_CLIENT_ISPS_FOR_LOCATIONS = clientIspsForLocationsFetch.types.fetch;
export const FETCH_TOP_CLIENT_ISPS_FOR_LOCATIONS_SUCCESS = clientIspsForLocationsFetch.types.success;
export const FETCH_TOP_CLIENT_ISPS_FOR_LOCATIONS_FAIL = clientIspsForLocationsFetch.types.fail;
export const shouldFetchClientIspsForLocations = clientIspsForLocationsFetch.shouldFetch;
export const fetchClientIspsForLocations = clientIspsForLocationsFetch.fetch;
export const fetchClientIspsForLocationsIfNeeded = clientIspsForLocationsFetch.fetchIfNeeded;


// --------------------------------------
// Fetch Top Client ISPs for Transit ISPS
// --------------------------------------
const clientIspsForTransitIspsFetch = createFetchAction({
  typePrefix: 'top/clientIsps/transitIsps/',
  key: 'TOP',
  args: ['transitIspIds'],
  shouldFetch(state, transitIspIds) {
    const baseState = state.top.clientIspsForTransitIsps;
    return topShouldFetch(baseState, transitIspIds);
  },
  promise(transitIspIds) {
    return api => api.getTopClientIspsForTransitIsps(transitIspIds);
  },
});

export const FETCH_TOP_CLIENT_ISPS_FOR_TRANSIT_ISPS = clientIspsForTransitIspsFetch.types.fetch;
export const FETCH_TOP_CLIENT_ISPS_FOR_TRANSIT_ISPS_SUCCESS = clientIspsForTransitIspsFetch.types.success;
export const FETCH_TOP_CLIENT_ISPS_FOR_TRANSIT_ISPS_FAIL = clientIspsForTransitIspsFetch.types.fail;
export const shouldFetchClientIspsForTransitIsps = clientIspsForTransitIspsFetch.shouldFetch;
export const fetchClientIspsForTransitIsps = clientIspsForTransitIspsFetch.fetch;
export const fetchClientIspsForTransitIspsIfNeeded = clientIspsForTransitIspsFetch.fetchIfNeeded;


// --------------------------------------
// Fetch Top Transit ISPs for Locations
// --------------------------------------
const transitIspsForLocationsFetch = createFetchAction({
  typePrefix: 'top/transitIsps/locations/',
  key: 'TOP',
  args: ['locationIds'],
  shouldFetch(state, locationIds) {
    const baseState = state.top.transitIspsForLocations;
    return topShouldFetch(baseState, locationIds);
  },
  promise(locationIds) {
    return api => api.getTopTransitIspsForLocations(locationIds);
  },
});

export const FETCH_TOP_TRANSIT_ISPS_FOR_LOCATIONS = transitIspsForLocationsFetch.types.fetch;
export const FETCH_TOP_TRANSIT_ISPS_FOR_LOCATIONS_SUCCESS = transitIspsForLocationsFetch.types.success;
export const FETCH_TOP_TRANSIT_ISPS_FOR_LOCATIONS_FAIL = transitIspsForLocationsFetch.types.fail;
export const shouldFetchTransitIspsForLocations = transitIspsForLocationsFetch.shouldFetch;
export const fetchTransitIspsForLocations = transitIspsForLocationsFetch.fetch;
export const fetchTransitIspsForLocationsIfNeeded = transitIspsForLocationsFetch.fetchIfNeeded;


// --------------------------------------
// Fetch Top Transit ISPs for Client ISPS
// --------------------------------------
const transitIspsForClientIspsFetch = createFetchAction({
  typePrefix: 'top/transitIsps/clientIsps/',
  key: 'TOP',
  args: ['clientIspIds'],
  shouldFetch(state, clientIspIds) {
    const baseState = state.top.transitIspsForClientIsps;
    return topShouldFetch(baseState, clientIspIds);
  },
  promise(clientIspIds) {
    return api => api.getTopTransitIspsForClientIsps(clientIspIds);
  },
});

export const FETCH_TOP_TRANSIT_ISPS_FOR_CLIENT_ISPS = transitIspsForClientIspsFetch.types.fetch;
export const FETCH_TOP_TRANSIT_ISPS_FOR_CLIENT_ISPS_SUCCESS = transitIspsForClientIspsFetch.types.success;
export const FETCH_TOP_TRANSIT_ISPS_FOR_CLIENT_ISPS_FAIL = transitIspsForClientIspsFetch.types.fail;
export const shouldFetchTransitIspsForClientIsps = transitIspsForClientIspsFetch.shouldFetch;
export const fetchTransitIspsForClientIsps = transitIspsForClientIspsFetch.fetch;
export const fetchTransitIspsForClientIspsIfNeeded = transitIspsForClientIspsFetch.fetchIfNeeded;
