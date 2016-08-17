/**
 * Actions for locations
 */
export const FETCH_TIME_SERIES = 'location/FETCH_TIME_SERIES';
export const FETCH_TIME_SERIES_SUCCESS = 'location/FETCH_TIME_SERIES_SUCCESS';
export const FETCH_TIME_SERIES_FAIL = 'location/FETCH_TIME_SERIES_FAIL';
export const FETCH_HOURLY = 'location/FETCH_HOURLY';
export const FETCH_HOURLY_SUCCESS = 'location/FETCH_HOURLY_SUCCESS';
export const FETCH_HOURLY_FAIL = 'location/FETCH_HOURLY_FAIL';

/**
 * Action Creators
 */
export function shouldFetchTimeSeries(state, timeAggregation, locationId) {
  const locationState = state.locations[locationId];
  if (!locationState) {
    return true;
  }

  // if we don't have this time aggregation, we should fetch it
  if (locationState.time.timeSeries.timeAggregation !== timeAggregation) {
    return true;
  }

  // only fetch if it isn't fetching/already fetched
  return !(locationState.time.timeSeries.isFetched || locationState.time.timeSeries.isFetching);
}

export function fetchTimeSeries(timeAggregation, locationId) {
  return {
    types: [FETCH_TIME_SERIES, FETCH_TIME_SERIES_SUCCESS, FETCH_TIME_SERIES_FAIL],
    promise: (api) => api.getLocationTimeSeries(timeAggregation, locationId),
    locationId,
    timeAggregation,
  };
}

export function fetchTimeSeriesIfNeeded(timeAggregation, locationId) {
  return (dispatch, getState) => {
    if (shouldFetchTimeSeries(getState(), timeAggregation, locationId)) {
      dispatch(fetchTimeSeries(timeAggregation, locationId));
    }
  };
}


export function shouldFetchHourly(state, timeAggregation, locationId) {
  const locationState = state.locations[locationId];
  if (!locationState) {
    return true;
  }

  // if we don't have this time aggregation, we should fetch it
  if (locationState.time.hourly.timeAggregation !== timeAggregation) {
    return true;
  }

  // only fetch if it isn't fetching/already fetched
  return !(locationState.time.hourly.isFetched || locationState.time.hourly.isFetching);
}

export function fetchHourly(timeAggregation, locationId) {
  return {
    types: [FETCH_HOURLY, FETCH_HOURLY_SUCCESS, FETCH_HOURLY_FAIL],
    promise: (api) => api.getLocationHourly(timeAggregation, locationId),
    locationId,
    timeAggregation,
  };
}

export function fetchHourlyIfNeeded(timeAggregation, locationId) {
  return (dispatch, getState) => {
    if (shouldFetchHourly(getState(), timeAggregation, locationId)) {
      dispatch(fetchHourly(timeAggregation, locationId));
    }
  };
}

