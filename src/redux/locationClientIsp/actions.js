/**
 * Actions for locations + client ISPs
 */
import createFetchAction from '../createFetchAction';
import typePrefix from './typePrefix';
import makeId from './makeId';
import { infoShouldFetch, fixedShouldFetch, timeSeriesShouldFetch, hourlyShouldFetch } from '../shared/shouldFetch';

/**
 * Action Creators
 */

function getLocationClientIspState(state, locationId, clientIspId) {
  const id = makeId(locationId, clientIspId);
  return state.locationClientIsp[id];
}


// ---------------------
// Fetch Client ISP in Location Time Series
// ---------------------
const timeSeries = createFetchAction({
  typePrefix,
  key: 'TIME_SERIES',
  args: ['timeAggregation', 'locationId', 'clientIspId', 'options'],
  shouldFetch(state, timeAggregation, locationId, clientIspId, options) {
    const locationClientIspState = getLocationClientIspState(state, locationId, clientIspId);
    return timeSeriesShouldFetch(locationClientIspState, timeAggregation, options);
  },

  promise(timeAggregation, locationId, clientIspId, options) {
    return api => api.getLocationClientIspTimeSeries(timeAggregation, locationId, clientIspId, options);
  },
});
export const FETCH_TIME_SERIES = timeSeries.types.fetch;
export const FETCH_TIME_SERIES_SUCCESS = timeSeries.types.success;
export const FETCH_TIME_SERIES_FAIL = timeSeries.types.fail;
export const shouldFetchTimeSeries = timeSeries.shouldFetch;
export const fetchTimeSeries = timeSeries.fetch;
export const fetchTimeSeriesIfNeeded = timeSeries.fetchIfNeeded;


// ---------------------
// Fetch Client ISP in Location Hourly
// ---------------------
const hourly = createFetchAction({
  typePrefix,
  key: 'HOURLY',
  args: ['timeAggregation', 'locationId', 'clientIspId', 'options'],
  shouldFetch(state, timeAggregation, locationId, clientIspId, options) {
    const locationClientIspState = getLocationClientIspState(state, locationId, clientIspId);
    return hourlyShouldFetch(locationClientIspState, timeAggregation, options);
  },

  promise(timeAggregation, locationId, clientIspId, options) {
    return api => api.getLocationClientIspHourly(timeAggregation, locationId, clientIspId, options);
  },
});
export const FETCH_HOURLY = hourly.types.fetch;
export const FETCH_HOURLY_SUCCESS = hourly.types.success;
export const FETCH_HOURLY_FAIL = hourly.types.fail;
export const shouldFetchHourly = hourly.shouldFetch;
export const fetchHourly = hourly.fetch;
export const fetchHourlyIfNeeded = hourly.fetchIfNeeded;


// ---------------------
// Fetch Location Client ISP Info
// ---------------------
const info = createFetchAction({
  typePrefix,
  key: 'INFO',
  args: ['locationId', 'clientIspId'],
  shouldFetch(state, locationId, clientIspId) {
    const locationClientIspState = getLocationClientIspState(state, locationId, clientIspId);
    return infoShouldFetch(locationClientIspState) || fixedShouldFetch(locationClientIspState);
  },
  promise(locationId, clientIspId) {
    return api => api.getLocationClientIspInfo(locationId, clientIspId);
  },
});
export const FETCH_INFO = info.types.fetch;
export const FETCH_INFO_SUCCESS = info.types.success;
export const FETCH_INFO_FAIL = info.types.fail;
export const shouldFetchInfo = info.shouldFetch;
export const fetchInfo = info.fetch;
export const fetchInfoIfNeeded = info.fetchIfNeeded;
