/**
 * Actions for clientIsps
 */
import createFetchAction from '../createFetchAction';
import typePrefix from './typePrefix';
import {
  keyShouldFetch,
  infoShouldFetch,
  timeSeriesShouldFetch,
  hourlyShouldFetch,
} from '../shared/shouldFetch';

/**
 * Action Creators
 */
function getClientIspState(state, clientIspId) {
  return state.clientIsps[clientIspId];
}

// ---------------------
// Fetch Client ISP Info
// ---------------------
const infoFetch = createFetchAction({
  typePrefix,
  key: 'INFO',
  args: ['clientIspId'],
  shouldFetch(state, clientIspId) {
    const clientIspState = getClientIspState(state, clientIspId);
    return infoShouldFetch(clientIspState);
  },
  promise(clientIspId) {
    return api => api.getClientIspInfo(clientIspId);
  },
});
export const FETCH_INFO = infoFetch.types.fetch;
export const FETCH_INFO_SUCCESS = infoFetch.types.success;
export const FETCH_INFO_FAIL = infoFetch.types.fail;
export const shouldFetchInfo = infoFetch.shouldFetch;
export const fetchInfo = infoFetch.fetch;
export const fetchInfoIfNeeded = infoFetch.fetchIfNeeded;

/**
 * When receiving partial client ISP info, save it to the store if it isn't already there.
 * This is typically done when using a value from a search result that hasn't yet been
 * populated in the client ISP store.
 */
export const SAVE_CLIENT_ISP_INFO = `${typePrefix}SAVE_INFO`;
export function shouldSaveClientIspInfo(state, clientIsp) {
  const clientIspState = getClientIspState(state, clientIsp.id);
  if (!clientIspState) {
    return true;
  }

  return !clientIspState.info.isFetched;
}

export function saveClientIspInfo(clientIspInfo) {
  return {
    type: SAVE_CLIENT_ISP_INFO,
    clientIspId: clientIspInfo.id,
    result: { meta: clientIspInfo },
  };
}

export function saveClientIspInfoIfNeeded(clientIspInfo) {
  return (dispatch, getState) => {
    const state = getState();
    if (shouldSaveClientIspInfo(state, clientIspInfo)) {
      dispatch(saveClientIspInfo(clientIspInfo));
    }
  };
}


// ---------------------
// Fetch Time Series
// ---------------------
const timeSeriesFetch = createFetchAction({
  typePrefix,
  key: 'TIME_SERIES',
  args: ['timeAggregation', 'clientIspId', 'options'],
  shouldFetch(state, timeAggregation, clientIspId, options = {}) {
    const clientIspState = getClientIspState(state, clientIspId);
    return timeSeriesShouldFetch(clientIspState, timeAggregation, options);
  },
  promise(timeAggregation, clientIspId, options) {
    return api => api.getClientIspTimeSeries(timeAggregation, clientIspId, options);
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
  args: ['timeAggregation', 'clientIspId', 'options'],
  shouldFetch(state, timeAggregation, clientIspId, options = {}) {
    const clientIspState = getClientIspState(state, clientIspId);
    return hourlyShouldFetch(clientIspState, timeAggregation, options);
  },
  promise(timeAggregation, clientIspId, options) {
    return (api) => api.getClientIspHourly(timeAggregation, clientIspId, options);
  },
});
export const FETCH_HOURLY = hourlyFetch.types.fetch;
export const FETCH_HOURLY_SUCCESS = hourlyFetch.types.success;
export const FETCH_HOURLY_FAIL = hourlyFetch.types.fail;
export const shouldFetchHourly = hourlyFetch.shouldFetch;
export const fetchHourly = hourlyFetch.fetch;
export const fetchHourlyIfNeeded = hourlyFetch.fetchIfNeeded;

// ---------------------
// Fetch Locations related to a client ISP
// ---------------------
const topLocations = createFetchAction({
  typePrefix: `${typePrefix}locations/`,
  key: 'TOP',
  args: ['clientIspId'],
  shouldFetch(state, clientIspId) {
    const clientIspState = getClientIspState(state, clientIspId);
    return keyShouldFetch(clientIspState, 'topLocations');
  },
  promise(clientIspId) {
    return api => api.getClientIspTopLocations(clientIspId);
  },
});
export const FETCH_TOP_CLIENT_ISPS = topLocations.types.fetch;
export const FETCH_TOP_CLIENT_ISPS_SUCCESS = topLocations.types.success;
export const FETCH_TOP_CLIENT_ISPS_FAIL = topLocations.types.fail;
export const shouldFetchTopLocations = topLocations.shouldFetch;
export const fetchTopLocations = topLocations.fetch;
export const fetchTopLocationsIfNeeded = topLocations.fetchIfNeeded;

// ---------------------
// Fetch Transit ISPs related to a client ISP
// ---------------------
const topTransitIsps = createFetchAction({
  typePrefix: `${typePrefix}transitIsps/`,
  key: 'TOP',
  args: ['clientIspId'],
  shouldFetch(state, clientIspId) {
    const clientIspState = getClientIspState(state, clientIspId);
    return keyShouldFetch(clientIspState, 'topTransitIsps');
  },
  promise(clientIspId) {
    return api => api.getClientIspTopTransitIsps(clientIspId);
  },
});
export const FETCH_TOP_TRANSIT_ISPS = topTransitIsps.types.fetch;
export const FETCH_TOP_TRANSIT_ISPS_SUCCESS = topTransitIsps.types.success;
export const FETCH_TOP_TRANSIT_ISPS_FAIL = topTransitIsps.types.fail;
export const shouldFetchTopTransitIsps = topTransitIsps.shouldFetch;
export const fetchTopTransitIsps = topTransitIsps.fetch;
export const fetchTopTransitIspsIfNeeded = topTransitIsps.fetchIfNeeded;
