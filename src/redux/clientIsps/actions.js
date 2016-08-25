/**
 * Actions for clientIsps
 */
export const FETCH_TIME_SERIES = 'clientIsps/FETCH_TIME_SERIES';
export const FETCH_TIME_SERIES_SUCCESS = 'clientIsps/FETCH_TIME_SERIES_SUCCESS';
export const FETCH_TIME_SERIES_FAIL = 'clientIsps/FETCH_TIME_SERIES_FAIL';

/**
 * Action Creators
 */

// ---------------------
// Fetch Time Series
// ---------------------
export function shouldFetchTimeSeries(state, timeAggregation, clientIspId) {
  const clientIspState = state.clientIsps[clientIspId];
  if (!clientIspState) {
    return true;
  }
  const { timeSeries } = clientIspState.time;

  // if we don't have this time aggregation, we should fetch it
  if (timeSeries.timeAggregation !== timeAggregation) {
    return true;
  }

  // only fetch if it isn't fetching/already fetched
  return !(timeSeries.isFetched || timeSeries.isFetching);
}

export function fetchTimeSeries(timeAggregation, clientIspId) {
  return {
    types: [FETCH_TIME_SERIES, FETCH_TIME_SERIES_SUCCESS, FETCH_TIME_SERIES_FAIL],
    promise: (api) => api.getClientIspTimeSeries(timeAggregation, clientIspId),
    clientIspId,
    timeAggregation,
  };
}

export function fetchTimeSeriesIfNeeded(timeAggregation, clientIspId) {
  return (dispatch, getState) => {
    if (shouldFetchTimeSeries(getState(), timeAggregation, clientIspId)) {
      dispatch(fetchTimeSeries(timeAggregation, clientIspId));
    }
  };
}

