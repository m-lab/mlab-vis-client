/**
 * Actions for clientIsps
 */
import createFetchAction from '../createFetchAction';
import typePrefix from './typePrefix';

/**
 * Action Creators
 */

// ---------------------
// Fetch Client ISP Info
// ---------------------
const infoFetch = createFetchAction({
  typePrefix,
  key: 'INFO',
  args: ['clientIspId'],
  shouldFetch(state, clientIspId) {
    const clientIspState = state.clientIsps[clientIspId];
    if (!clientIspState) {
      return true;
    }

    const hasInfo = clientIspState.info.isFetched || clientIspState.info.isFetching;
    return !hasInfo;
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
  const clientIspState = state.clientIsps[clientIsp.id];
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
    const clientIspState = state.clientIsps[clientIspId];
    if (!clientIspState) {
      return true;
    }

    const timeSeriesState = clientIspState.time.timeSeries;

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
    const clientIspState = state.clientIsps[clientIspId];
    if (!clientIspState) {
      return true;
    }

    const clientIspHourState = clientIspState.time.hourly;

    // if we don't have this time aggregation, we should fetch it
    if (clientIspHourState.timeAggregation !== timeAggregation) {
      return true;
    }


    if (options.startDate && !options.startDate.isSame(clientIspHourState.startDate, timeAggregation)) {
      return true;
    }

    if (options.endDate && !options.endDate.isSame(clientIspHourState.endDate, timeAggregation)) {
      return true;
    }

    // only fetch if it isn't fetching/already fetched
    return !(clientIspState.time.hourly.isFetched || clientIspState.time.hourly.isFetching);
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
