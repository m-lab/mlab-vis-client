/**
 * Actions for transitIsps
 */
import createFetchAction from '../createFetchAction';

/**
 * Action Creators
 */

// ---------------------
// Fetch Transit ISP Info
// ---------------------
const infoFetch = createFetchAction({
  typePrefix: 'transitIsps/',
  key: 'INFO',
  args: ['transitIspId'],
  shouldFetch(state, transitIspId) {
    const transitIspState = state.transitIsps[transitIspId];
    if (!transitIspState) {
      return true;
    }

    const hasInfo = transitIspState.info.isFetched || transitIspState.info.isFetching;
    return !hasInfo;
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
export const SAVE_TRANSIT_ISP_INFO = 'transitIsps/SAVE_TRANSIT_ISP_INFO';
export function shouldSaveTransitIspInfo(state, transitIsp) {
  const transitIspState = state.transitIsps[transitIsp.id];
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
  typePrefix: 'transitIsps/',
  key: 'TIME_SERIES',
  args: ['timeAggregation', 'transitIspId', 'options'],
  shouldFetch(state, timeAggregation, transitIspId, options = {}) {
    const transitIspState = state.transitIsps[transitIspId];
    if (!transitIspState) {
      return true;
    }

    const timeSeriesState = transitIspState.time.timeSeries;

    // if we don't have this time aggregation, we should fetch it
    if (timeSeriesState.timeAggregation !== timeAggregation) {
      return true;
    }

    if (options.startDate && !options.startDate.isSame(timeSeriesState.startDate, timeAggregation)) {
      return true;
    }

    if (options.endDate && !options.endDate.isSame(timeSeriesState.endDate, timeAggregation)) {
      return true;
    }

    // only fetch if it isn't fetching/already fetched
    return !(timeSeriesState.isFetched || timeSeriesState.isFetching);
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
  typePrefix: 'transitIsps/',
  key: 'HOURLY',
  args: ['timeAggregation', 'transitIspId', 'options'],
  shouldFetch(state, timeAggregation, transitIspId, options = {}) {
    const transitIspState = state.transitIsps[transitIspId];
    if (!transitIspState) {
      return true;
    }

    const transitIspHourState = transitIspState.time.hourly;

    // if we don't have this time aggregation, we should fetch it
    if (transitIspHourState.timeAggregation !== timeAggregation) {
      return true;
    }


    if (options.startDate && !options.startDate.isSame(transitIspHourState.startDate, timeAggregation)) {
      return true;
    }

    if (options.endDate && !options.endDate.isSame(transitIspHourState.endDate, timeAggregation)) {
      return true;
    }

    // only fetch if it isn't fetching/already fetched
    return !(transitIspState.time.hourly.isFetched || transitIspState.time.hourly.isFetching);
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
