/**
 * Actions for transitIsps
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
function getTransitIspState(state, transitIspId) {
  return state.transitIsps[transitIspId];
}

// ---------------------
// Fetch Transit ISP Info
// ---------------------
const infoFetch = createFetchAction({
  typePrefix,
  key: 'INFO',
  args: ['transitIspId'],
  shouldFetch(state, transitIspId) {
    const transitIspState = getTransitIspState(state, transitIspId);
    return infoShouldFetch(transitIspState);
  },
  promise(transitIspId) {
    return api => api.getTransitIspInfo(transitIspId);
  },
});
export const FETCH_INFO = infoFetch.types.fetch;
export const FETCH_INFO_SUCCESS = infoFetch.types.success;
export const FETCH_INFO_FAIL = infoFetch.types.fail;
export const shouldFetchInfo = infoFetch.shouldFetch;
export const fetchInfo = infoFetch.fetch;
export const fetchInfoIfNeeded = infoFetch.fetchIfNeeded;

/**
 * When receiving partial transit ISP info, save it to the store if it isn't already there.
 * This is typically done when using a value from a search result that hasn't yet been
 * populated in the transit ISP store.
 */
export const SAVE_TRANSIT_ISP_INFO = `${typePrefix}SAVE_INFO`;
export function shouldSaveTransitIspInfo(state, transitIsp) {
  const transitIspState = getTransitIspState(state, transitIsp.id);
  if (!transitIspState) {
    return true;
  }

  return !transitIspState.info.isFetched;
}

export function saveTransitIspInfo(transitIspInfo) {
  return {
    type: SAVE_TRANSIT_ISP_INFO,
    transitIspId: transitIspInfo.id,
    result: { meta: transitIspInfo },
  };
}

export function saveTransitIspInfoIfNeeded(transitIspInfo) {
  return (dispatch, getState) => {
    const state = getState();
    if (shouldSaveTransitIspInfo(state, transitIspInfo)) {
      dispatch(saveTransitIspInfo(transitIspInfo));
    }
  };
}


// ---------------------
// Fetch Time Series
// ---------------------
const timeSeriesFetch = createFetchAction({
  typePrefix,
  key: 'TIME_SERIES',
  args: ['timeAggregation', 'transitIspId', 'options'],
  shouldFetch(state, timeAggregation, transitIspId, options = {}) {
    const transitIspState = getTransitIspState(state, transitIspId);
    return timeSeriesShouldFetch(transitIspState, timeAggregation, options);
  },
  promise(timeAggregation, transitIspId, options) {
    return api => api.getTransitIspTimeSeries(timeAggregation, transitIspId, options);
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
  args: ['timeAggregation', 'transitIspId', 'options'],
  shouldFetch(state, timeAggregation, transitIspId, options = {}) {
    const transitIspState = getTransitIspState(state, transitIspId);
    return hourlyShouldFetch(transitIspState, timeAggregation, options);
  },
  promise(timeAggregation, transitIspId, options) {
    return (api) => api.getTransitIspHourly(timeAggregation, transitIspId, options);
  },
});
export const FETCH_HOURLY = hourlyFetch.types.fetch;
export const FETCH_HOURLY_SUCCESS = hourlyFetch.types.success;
export const FETCH_HOURLY_FAIL = hourlyFetch.types.fail;
export const shouldFetchHourly = hourlyFetch.shouldFetch;
export const fetchHourly = hourlyFetch.fetch;
export const fetchHourlyIfNeeded = hourlyFetch.fetchIfNeeded;


// ---------------------
// Fetch Locations related to a transit ISP
// ---------------------
const topLocations = createFetchAction({
  typePrefix: `${typePrefix}locations/`,
  key: 'TOP',
  args: ['transitIspId'],
  shouldFetch(state, transitIspId) {
    const transitIspState = getTransitIspState(state, transitIspId);
    return keyShouldFetch(transitIspState, 'topLocations');
  },
  promise(transitIspId) {
    return api => api.getTransitIspTopLocations(transitIspId);
  },
});
export const FETCH_TOP_LOCATIONS = topLocations.types.fetch;
export const FETCH_TOP_LOCATIONS_SUCCESS = topLocations.types.success;
export const FETCH_TOP_LOCATIONS_FAIL = topLocations.types.fail;
export const shouldFetchTopLocations = topLocations.shouldFetch;
export const fetchTopLocations = topLocations.fetch;
export const fetchTopLocationsIfNeeded = topLocations.fetchIfNeeded;

// ---------------------
// Fetch Client ISPs related to a transit ISP
// ---------------------
const topClientIsps = createFetchAction({
  typePrefix: `${typePrefix}clientIsps/`,
  key: 'TOP',
  args: ['transitIspId'],
  shouldFetch(state, transitIspId) {
    const transitIspState = getTransitIspState(state, transitIspId);
    return keyShouldFetch(transitIspState, 'topClientIsps');
  },
  promise(transitIspId) {
    return api => api.getTransitIspTopClientIsps(transitIspId);
  },
});
export const FETCH_TOP_CLIENT_ISPS = topClientIsps.types.fetch;
export const FETCH_TOP_CLIENT_ISPS_SUCCESS = topClientIsps.types.success;
export const FETCH_TOP_CLIENT_ISPS_FAIL = topClientIsps.types.fail;
export const shouldFetchTopClientIsps = topClientIsps.shouldFetch;
export const fetchTopClientIsps = topClientIsps.fetch;
export const fetchTopClientIspsIfNeeded = topClientIsps.fetchIfNeeded;
