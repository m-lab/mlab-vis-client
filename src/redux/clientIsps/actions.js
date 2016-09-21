/**
 * Actions for clientIsps
 */
import createFetchAction from '../createFetchAction';

export const FETCH_TIME_SERIES = 'clientIsps/FETCH_TIME_SERIES';
export const FETCH_TIME_SERIES_SUCCESS = 'clientIsps/FETCH_TIME_SERIES_SUCCESS';
export const FETCH_TIME_SERIES_FAIL = 'clientIsps/FETCH_TIME_SERIES_FAIL';

/**
 * Action Creators
 */

// ---------------------
// Fetch Time Series
// ---------------------
export function shouldFetchTimeSeries(state, timeAggregation, clientIspId, options) {
  const clientIspState = state.clientIsps[clientIspId];
  if (!clientIspState) {
    return true;
  }
  const { timeSeries } = clientIspState.time;

  // if we don't have this time aggregation, we should fetch it
  if (timeSeries.timeAggregation !== timeAggregation) {
    return true;
  }

  if (options.startDate && !options.startDate.isSame(timeSeries.startDate, timeAggregation)) {
    return true;
  }

  if (options.endDate && !options.endDate.isSame(timeSeries.endDate, timeAggregation)) {
    return true;
  }

  // only fetch if it isn't fetching/already fetched
  return !(timeSeries.isFetched || timeSeries.isFetching);
}

export function fetchTimeSeries(timeAggregation, clientIspId, options) {
  return {
    types: [FETCH_TIME_SERIES, FETCH_TIME_SERIES_SUCCESS, FETCH_TIME_SERIES_FAIL],
    promise: (api) => api.getClientIspTimeSeries(timeAggregation, clientIspId, options),
    clientIspId,
    timeAggregation,
  };
}

export function fetchTimeSeriesIfNeeded(timeAggregation, clientIspId, options) {
  return (dispatch, getState) => {
    if (shouldFetchTimeSeries(getState(), timeAggregation, clientIspId, options)) {
      dispatch(fetchTimeSeries(timeAggregation, clientIspId, options));
    }
  };
}


// ---------------------
// Fetch Client ISP Info
// ---------------------
const infoFetch = createFetchAction({
  typePrefix: 'clientIsps/',
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
export const SAVE_CLIENT_ISP_INFO = 'clientIsps/SAVE_CLIENT_ISP_INFO';
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
