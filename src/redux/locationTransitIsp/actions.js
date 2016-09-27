/**
 * Actions for locations + transit ISPs
 */
import createFetchAction from '../createFetchAction';
import typePrefix from './typePrefix';
import makeId from './makeId';
import { infoShouldFetch, fixedShouldFetch, timeSeriesShouldFetch, hourlyShouldFetch } from '../shared/shouldFetch';

/**
 * Action Creators
 */

function getBaseState(state, locationId, transitIspId) {
  const id = makeId(locationId, transitIspId);
  return state.locationTransitIsp[id];
}


// ---------------------
// Fetch Transit ISP in Location Time Series
// ---------------------
const timeSeries = createFetchAction({
  typePrefix,
  key: 'TIME_SERIES',
  args: ['timeAggregation', 'locationId', 'transitIspId', 'options'],
  shouldFetch(state, timeAggregation, locationId, transitIspId, options) {
    const baseState = getBaseState(state, locationId, transitIspId);
    return timeSeriesShouldFetch(baseState, timeAggregation, options);
  },

  promise(timeAggregation, locationId, transitIspId, options) {
    return api => api.getLocationTransitIspTimeSeries(timeAggregation, locationId, transitIspId, options);
  },
});
export const FETCH_TIME_SERIES = timeSeries.types.fetch;
export const FETCH_TIME_SERIES_SUCCESS = timeSeries.types.success;
export const FETCH_TIME_SERIES_FAIL = timeSeries.types.fail;
export const shouldFetchTimeSeries = timeSeries.shouldFetch;
export const fetchTimeSeries = timeSeries.fetch;
export const fetchTimeSeriesIfNeeded = timeSeries.fetchIfNeeded;


// ---------------------
// Fetch Transit ISP in Location Hourly
// ---------------------
const hourly = createFetchAction({
  typePrefix,
  key: 'HOURLY',
  args: ['timeAggregation', 'locationId', 'transitIspId', 'options'],
  shouldFetch(state, timeAggregation, locationId, transitIspId, options) {
    const baseState = getBaseState(state, locationId, transitIspId);
    return hourlyShouldFetch(baseState, timeAggregation, options);
  },

  promise(timeAggregation, locationId, transitIspId, options) {
    return api => api.getLocationTransitIspHourly(timeAggregation, locationId, transitIspId, options);
  },
});
export const FETCH_HOURLY = hourly.types.fetch;
export const FETCH_HOURLY_SUCCESS = hourly.types.success;
export const FETCH_HOURLY_FAIL = hourly.types.fail;
export const shouldFetchHourly = hourly.shouldFetch;
export const fetchHourly = hourly.fetch;
export const fetchHourlyIfNeeded = hourly.fetchIfNeeded;


// ---------------------
// Fetch Location Transit ISP Info
// ---------------------
const info = createFetchAction({
  typePrefix,
  key: 'INFO',
  args: ['locationId', 'transitIspId'],
  shouldFetch(state, locationId, transitIspId) {
    const baseState = getBaseState(state, locationId, transitIspId);
    return infoShouldFetch(baseState) || fixedShouldFetch(baseState);
  },
  promise(locationId, transitIspId) {
    return api => api.getLocationTransitIspInfo(locationId, transitIspId);
  },
});
export const FETCH_INFO = info.types.fetch;
export const FETCH_INFO_SUCCESS = info.types.success;
export const FETCH_INFO_FAIL = info.types.fail;
export const shouldFetchInfo = info.shouldFetch;
export const fetchInfo = info.fetch;
export const fetchInfoIfNeeded = info.fetchIfNeeded;
