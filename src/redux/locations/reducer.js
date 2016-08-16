import * as Actions from './actions';

/**
 * Reducer
 */
const initialState = {
  metricsLoaded: false,
  hourlyLoaded: false,
};

/**
 * Location metrics actions
 */
export default function location(state = initialState, action = {}) {
  switch (action.type) {
    case Actions.METRICS_LOAD:
      return {
        ...state,
        metricsLoading: true,
      };
    case Actions.METRICS_LOAD_SUCCESS:
      return {
        ...state,
        metricsLoading: false,
        metricsLoaded: true,
        metricsData: action.result,
      };
    case Actions.METRICS_LOAD_FAIL:
      return {
        ...state,
        metricsLoading: false,
        metricsLoaded: false,
        error: action.error,
      };

    case Actions.HOURLY_LOAD:
      return {
        ...state,
        hourlyLoading: true,
      };
    case Actions.HOURLY_LOAD_SUCCESS:
      return {
        ...state,
        hourlyLoading: false,
        hourlyLoaded: true,
        hourlyData: action.result,
      };
    case Actions.HOURLY_LOAD_FAIL:
      return {
        ...state,
        hourlyLoading: false,
        hourlyLoaded: false,
        error: action.error,
      };
    default:
      return state;
  }
}
