/**
 * Actions for clientIsp + transitIsp
 */
import createFetchAction from '../createFetchAction';
import typePrefix from './typePrefix';
import makeId from './makeId';
import { infoShouldFetch, fixedShouldFetch, timeSeriesShouldFetch, hourlyShouldFetch } from '../shared/shouldFetch';

/**
 * Action Creators
 */

function getBaseState(state, clientIspId, transitIspId) {
  const id = makeId(clientIspId, transitIspId);
  return state.clientIspTransitIsp[id];
}


// ---------------------
// Fetch Transit ISP in Client ISP Time Series
// ---------------------
const timeSeries = createFetchAction({
  typePrefix,
  key: 'TIME_SERIES',
  args: ['timeAggregation', 'clientIspId', 'transitIspId', 'options'],
  shouldFetch(state, timeAggregation, clientIspId, transitIspId, options) {
    const baseState = getBaseState(state, clientIspId, transitIspId);
    return timeSeriesShouldFetch(baseState, timeAggregation, options);
  },

  promise(timeAggregation, clientIspId, transitIspId, options) {
    return api => api.getClientIspTransitIspTimeSeries(timeAggregation, clientIspId, transitIspId, options);
  },
});
export const FETCH_TIME_SERIES = timeSeries.types.fetch;
export const FETCH_TIME_SERIES_SUCCESS = timeSeries.types.success;
export const FETCH_TIME_SERIES_FAIL = timeSeries.types.fail;
export const shouldFetchTimeSeries = timeSeries.shouldFetch;
export const fetchTimeSeries = timeSeries.fetch;
export const fetchTimeSeriesIfNeeded = timeSeries.fetchIfNeeded;


// ---------------------
// Fetch Transit ISP in Client ISP Hourly
// ---------------------
const hourly = createFetchAction({
  typePrefix,
  key: 'HOURLY',
  args: ['timeAggregation', 'clientIspId', 'transitIspId', 'options'],
  shouldFetch(state, timeAggregation, clientIspId, transitIspId, options) {
    const baseState = getBaseState(state, clientIspId, transitIspId);
    return hourlyShouldFetch(baseState, timeAggregation, options);
  },

  promise(timeAggregation, clientIspId, transitIspId, options) {
    return api => api.getClientIspTransitIspHourly(timeAggregation, clientIspId, transitIspId, options);
  },
});
export const FETCH_HOURLY = hourly.types.fetch;
export const FETCH_HOURLY_SUCCESS = hourly.types.success;
export const FETCH_HOURLY_FAIL = hourly.types.fail;
export const shouldFetchHourly = hourly.shouldFetch;
export const fetchHourly = hourly.fetch;
export const fetchHourlyIfNeeded = hourly.fetchIfNeeded;


// ---------------------
// Fetch ClientIsp Transit ISP Info
// ---------------------
const info = createFetchAction({
  typePrefix,
  key: 'INFO',
  args: ['clientIspId', 'transitIspId'],
  shouldFetch(state, clientIspId, transitIspId) {
    const baseState = getBaseState(state, clientIspId, transitIspId);
    return infoShouldFetch(baseState) || fixedShouldFetch(baseState);
  },
  promise(clientIspId, transitIspId) {
    return api => api.getClientIspTransitIspInfo(clientIspId, transitIspId);
  },
});
export const FETCH_INFO = info.types.fetch;
export const FETCH_INFO_SUCCESS = info.types.success;
export const FETCH_INFO_FAIL = info.types.fail;
export const shouldFetchInfo = info.shouldFetch;
export const fetchInfo = info.fetch;
export const fetchInfoIfNeeded = info.fetchIfNeeded;
