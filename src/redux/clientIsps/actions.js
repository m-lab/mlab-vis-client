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
