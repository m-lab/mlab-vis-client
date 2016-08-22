/**
 * Actions for clientIsps
 */
export const FETCH_LOCATION_TIME_SERIES = 'clientIsps/FETCH_LOCATION_TIME_SERIES';
export const FETCH_LOCATION_TIME_SERIES_SUCCESS = 'clientIsps/FETCH_LOCATION_TIME_SERIES_SUCCESS';
export const FETCH_LOCATION_TIME_SERIES_FAIL = 'clientIsps/FETCH_LOCATION_TIME_SERIES_FAIL';

/**
 * Action Creators
 */

// ---------------------
// Fetch Location Time Series
// ---------------------
export function shouldFetchLocationTimeSeries(state, timeAggregation, locationId, clientIspId) {
  const clientIspState = state.clientIsps[clientIspId];
  if (!clientIspState) {
    return true;
  }

  const clientIspLocationState = clientIspState.locationTime[locationId];
  if (!clientIspLocationState) {
    return true;
  }

  // if we don't have this time aggregation, we should fetch it
  if (clientIspLocationState.timeSeries.timeAggregation !== timeAggregation) {
    return true;
  }

  // only fetch if it isn't fetching/already fetched
  return !(clientIspLocationState.timeSeries.isFetched ||
    clientIspLocationState.timeSeries.isFetching);
}

export function fetchLocationTimeSeries(timeAggregation, locationId, clientIspId) {
  return {
    types: [FETCH_LOCATION_TIME_SERIES, FETCH_LOCATION_TIME_SERIES_SUCCESS,
      FETCH_LOCATION_TIME_SERIES_FAIL],
    promise: (api) => api.getLocationClientIspTimeSeries(timeAggregation, locationId, clientIspId),
    clientIspId,
    locationId,
    timeAggregation,
  };
}

export function fetchLocationTimeSeriesIfNeeded(timeAggregation, locationId, clientIspId) {
  return (dispatch, getState) => {
    if (shouldFetchLocationTimeSeries(getState(), timeAggregation, locationId, clientIspId)) {
      dispatch(fetchLocationTimeSeries(timeAggregation, locationId, clientIspId));
    }
  };
}

