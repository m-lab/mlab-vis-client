/**
 * Actions for locations + client ISPs + transit ISPs
 */
import createFetchAction from '../createFetchAction';
import typePrefix from './typePrefix';
import makeId from './makeId';
import { infoShouldFetch, fixedShouldFetch, timeSeriesShouldFetch, hourlyShouldFetch } from '../shared/shouldFetch';

/**
 * Action Creators
 */

function getBaseState(state, locationId, clientIspId, transitIspId) {
  const id = makeId(locationId, clientIspId, transitIspId);
  return state.locationClientIspTransitIsp[id];
}


// ---------------------
// Fetch Client ISP + Transit ISP in Location Time Series
// ---------------------
const timeSeries = createFetchAction({
  typePrefix,
  key: 'TIME_SERIES',
  args: ['timeAggregation', 'locationId', 'clientIspId', 'transitIspId', 'options'],
  shouldFetch(state, timeAggregation, locationId, clientIspId, transitIspId, options) {
    const baseState = getBaseState(state, locationId, clientIspId, transitIspId);
    return timeSeriesShouldFetch(baseState, timeAggregation, options);
  },

  promise(timeAggregation, locationId, clientIspId, transitIspId, options) {
    return api => api.getLocationClientIspTransitIspTimeSeries(timeAggregation, locationId,
      clientIspId, transitIspId, options);
  },
});
export const FETCH_TIME_SERIES = timeSeries.types.fetch;
export const FETCH_TIME_SERIES_SUCCESS = timeSeries.types.success;
export const FETCH_TIME_SERIES_FAIL = timeSeries.types.fail;
export const shouldFetchTimeSeries = timeSeries.shouldFetch;
export const fetchTimeSeries = timeSeries.fetch;
export const fetchTimeSeriesIfNeeded = timeSeries.fetchIfNeeded;


// ---------------------
// Fetch Client ISP + Transit ISP in Location Hourly
// ---------------------
const hourly = createFetchAction({
  typePrefix,
  key: 'HOURLY',
  args: ['timeAggregation', 'locationId', 'clientIspId', 'transitIspId', 'options'],
  shouldFetch(state, timeAggregation, locationId, clientIspId, transitIspId, options) {
    const baseState = getBaseState(state, locationId, clientIspId, transitIspId);
    return hourlyShouldFetch(baseState, timeAggregation, options);
  },

  promise(timeAggregation, locationId, clientIspId, transitIspId, options) {
    return api => api.getLocationClientIspTransitIspHourly(timeAggregation, locationId,
      clientIspId, transitIspId, options);
  },
});
export const FETCH_HOURLY = hourly.types.fetch;
export const FETCH_HOURLY_SUCCESS = hourly.types.success;
export const FETCH_HOURLY_FAIL = hourly.types.fail;
export const shouldFetchHourly = hourly.shouldFetch;
export const fetchHourly = hourly.fetch;
export const fetchHourlyIfNeeded = hourly.fetchIfNeeded;


// ---------------------
// Fetch Location Client ISP Transit ISP Info
// ---------------------
const info = createFetchAction({
  typePrefix,
  key: 'INFO',
  args: ['locationId', 'clientIspId', 'transitIspId'],
  shouldFetch(state, locationId, clientIspId, transitIspId) {
    const baseState = getBaseState(state, locationId, clientIspId, transitIspId);
    return infoShouldFetch(baseState) || fixedShouldFetch(baseState);
  },
  promise(locationId, clientIspId, transitIspId) {
    return api => api.getLocationClientIspTransitIspInfo(locationId, clientIspId, transitIspId);
  },
});
export const FETCH_INFO = info.types.fetch;
export const FETCH_INFO_SUCCESS = info.types.success;
export const FETCH_INFO_FAIL = info.types.fail;
export const shouldFetchInfo = info.shouldFetch;
export const fetchInfo = info.fetch;
export const fetchInfoIfNeeded = info.fetchIfNeeded;
