/**
 * Actions
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
export function shouldFetchTimeSeries(/* state */) {
  // TODO
  return true;
}

export function fetchTimeSeries() {
  const timeAggregation = 'month';
  const locationId = 'NA+US+MA+Cambridge';

  return {
    types: [FETCH_TIME_SERIES, FETCH_TIME_SERIES_SUCCESS, FETCH_TIME_SERIES_FAIL],
    promise: (api) => api.getLocationTimeSeries(timeAggregation, locationId),
    locationId,
  };
}

export function fetchTimeSeriesIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchTimeSeries(getState())) {
      dispatch(fetchTimeSeries());
    }
  };
}


export function shouldFetchHourly(/* state */) {
  // TODO
  return true;
}

export function fetchHourly() {
  const timeAggregation = 'day';
  const locationId = 'NA+US+MA+Cambridge';
  return {
    types: [FETCH_HOURLY, FETCH_HOURLY_SUCCESS, FETCH_HOURLY_FAIL],
    promise: (api) => api.getLocationHourly(timeAggregation, locationId),
    locationId,
  };
}

export function fetchHourlyIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchHourly(getState())) {
      dispatch(fetchHourly());
    }
  };
}

