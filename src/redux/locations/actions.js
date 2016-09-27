/**
 * Actions for locations
 */
import createFetchAction from '../createFetchAction';
import typePrefix from './typePrefix';
import { keyShouldFetch, infoShouldFetch, fixedShouldFetch, timeSeriesShouldFetch,
  hourlyShouldFetch } from '../shared/shouldFetch';

/**
 * Action Creators
 */

function getLocationState(state, locationId) {
  return state.locations[locationId];
}

/**
 * When receiving partial location info, save it to the store if it isn't already there.
 * This is typically done when using a value from a search result that hasn't yet been
 * populated in the location store.
 */
export const SAVE_LOCATION_INFO = `${typePrefix}SAVE_INFO`;
export function shouldSaveLocationInfo(state, location) {
  const locationState = getLocationState(state, location.id);
  if (!locationState) {
    return true;
  }

  return !locationState.info.isFetched;
}

export function saveLocationInfo(locationInfo) {
  return {
    type: SAVE_LOCATION_INFO,
    locationId: locationInfo.id,
    result: { meta: locationInfo },
  };
}

export function saveLocationInfoIfNeeded(locationInfo) {
  return (dispatch, getState) => {
    const state = getState();
    if (shouldSaveLocationInfo(state, locationInfo)) {
      dispatch(saveLocationInfo(locationInfo));
    }
  };
}


// ---------------------
// Fetch Time Series
// ---------------------
const timeSeriesFetch = createFetchAction({
  typePrefix,
  key: 'TIME_SERIES',
  args: ['timeAggregation', 'locationId', 'options'],
  shouldFetch(state, timeAggregation, locationId, options = {}) {
    const locationState = getLocationState(state, locationId);
    return timeSeriesShouldFetch(locationState, timeAggregation, options);
  },
  promise(timeAggregation, locationId, options) {
    return api => api.getLocationTimeSeries(timeAggregation, locationId, options);
  },
});
export const FETCH_TIME_SERIES = timeSeriesFetch.types.fetch;
export const FETCH_TIME_SERIES_SUCCESS = timeSeriesFetch.types.success;
export const FETCH_TIME_SERIES_FAIL = timeSeriesFetch.types.fail;
export const shouldFetchTimeSeries = timeSeriesFetch.shouldFetch;
export const fetchTimeSeries = timeSeriesFetch.fetch;
export const fetchTimeSeriesIfNeeded = timeSeriesFetch.fetchIfNeeded;

// ---------------------
// Fetch Hourly
// ---------------------
const hourlyFetch = createFetchAction({
  typePrefix,
  key: 'HOURLY',
  args: ['timeAggregation', 'locationId', 'options'],
  shouldFetch(state, timeAggregation, locationId, options = {}) {
    const locationState = getLocationState(state, locationId);
    return hourlyShouldFetch(locationState, timeAggregation, options);
  },
  promise(timeAggregation, locationId, options) {
    return (api) => api.getLocationHourly(timeAggregation, locationId, options);
  },
});
export const FETCH_HOURLY = hourlyFetch.types.fetch;
export const FETCH_HOURLY_SUCCESS = hourlyFetch.types.success;
export const FETCH_HOURLY_FAIL = hourlyFetch.types.fail;
export const shouldFetchHourly = hourlyFetch.shouldFetch;
export const fetchHourly = hourlyFetch.fetch;
export const fetchHourlyIfNeeded = hourlyFetch.fetchIfNeeded;

// ---------------------
// Fetch Client ISPs in location
// ---------------------
const topClientIsps = createFetchAction({
  typePrefix,
  key: 'TOP_CLIENT_ISPS',
  args: ['locationId'],
  shouldFetch(state, locationId) {
    const locationState = getLocationState(state, locationId);
    return keyShouldFetch(locationState, 'topClientIsps');
  },
  promise(locationId) {
    return api => api.getLocationTopClientIsps(locationId);
  },
});
export const FETCH_TOP_CLIENT_ISPS = topClientIsps.types.fetch;
export const FETCH_TOP_CLIENT_ISPS_SUCCESS = topClientIsps.types.success;
export const FETCH_TOP_CLIENT_ISPS_FAIL = topClientIsps.types.fail;
export const shouldFetchTopClientIsps = topClientIsps.shouldFetch;
export const fetchTopClientIsps = topClientIsps.fetch;
export const fetchTopClientIspsIfNeeded = topClientIsps.fetchIfNeeded;


// ---------------------
// Fetch Location Info
// ---------------------
const infoFetch = createFetchAction({
  typePrefix,
  key: 'INFO',
  args: ['locationId'],
  shouldFetch(state, locationId) {
    const locationState = getLocationState(state, locationId);
    return infoShouldFetch(locationState) || fixedShouldFetch(locationState);
  },
  promise(locationId) {
    return api => api.getLocationInfo(locationId);
  },
});
export const FETCH_INFO = infoFetch.types.fetch;
export const FETCH_INFO_SUCCESS = infoFetch.types.success;
export const FETCH_INFO_FAIL = infoFetch.types.fail;
export const shouldFetchInfo = infoFetch.shouldFetch;
export const fetchInfo = infoFetch.fetch;
export const fetchInfoIfNeeded = infoFetch.fetchIfNeeded;

