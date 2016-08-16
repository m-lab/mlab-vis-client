import { createSelector } from 'reselect';

/**
 * Actions
 */
const LOAD = 'location/LOAD';
const LOAD_SUCCESS = 'location/LOAD_SUCCESS';
const LOAD_FAIL = 'location/LOAD_FAIL';

/**
 * Reducer
 */
const initialState = {
  loaded: false,
};

export default function location(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result,
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
      };
    default:
      return state;
  }
}

/**
 * Action Creators
 */
export function shouldFetchLocationMetrics(state) {
  return !(state.location && state.location.loaded);
}

export function fetchLocationMetrics() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (api) => api.getLocationMetrics('month', 'NA+US+MA+Cambridge'),
  };
}

export function fetchLocationMetricsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchLocationMetrics(getState())) {
      dispatch(fetchLocationMetrics());
    }
  };
}

/**
 * Selectors
 */

/**
 * Input selector for getting location metrics
 */
function getLocationMetrics(state) {
  return state.location.data;
}

/**
 * A selector to transform API data to be usable in a time series chart.
 */
export const getLocationMetricsTimeSeriesData = createSelector(
  [getLocationMetrics],
  (locationMetrics) => {
    if (!locationMetrics || !locationMetrics.metrics) {
      return undefined;
    }

    // make the date field an actual date
    return locationMetrics.metrics.map(d =>
      Object.assign({}, d, {
        date: new Date(d.date),
      })
    );
  }
);
