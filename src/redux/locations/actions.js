/**
 * Actions
 */
export const METRICS_LOAD = 'location/METRICS_LOAD';
export const METRICS_LOAD_SUCCESS = 'location/METRICS_LOAD_SUCCESS';
export const METRICS_LOAD_FAIL = 'location/METRICS_LOAD_FAIL';
export const HOURLY_LOAD = 'location/HOURLY_LOAD';
export const HOURLY_LOAD_SUCCESS = 'location/HOURLY_LOAD_SUCCESS';
export const HOURLY_LOAD_FAIL = 'location/HOURLY_LOAD_FAIL';

/**
 * Action Creators
 */
export function shouldFetchLocationMetrics(state) {
  return !(state.locations && state.locations.metricsLoaded &&
    state.locations.hourlyLoaded);
}

export function fetchLocationMetrics() {
  return {
    types: [METRICS_LOAD, METRICS_LOAD_SUCCESS, METRICS_LOAD_FAIL],
    promise: (api) => api.getLocationMetrics('month', 'NA+US+MA+Cambridge'),
  };
}

export function fetchHourlyLocationMetrics() {
  const timePeriod = 'day';
  const locationId = 'NA+US+MA+Cambridge';
  return {
    types: [HOURLY_LOAD, HOURLY_LOAD_SUCCESS, HOURLY_LOAD_FAIL],
    promise: (api) => api.getLocationMetrics(`${timePeriod}_hour`, locationId),
  };
}

export function fetchLocationMetricsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchLocationMetrics(getState())) {
      dispatch(fetchLocationMetrics());
      dispatch(fetchHourlyLocationMetrics());
    }
  };
}
