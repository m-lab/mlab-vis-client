const LOAD = 'location/LOAD';
const LOAD_SUCCESS = 'location/LOAD_SUCCESS';
const LOAD_FAIL = 'location/LOAD_FAIL';

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

export function shouldFetchLocationMetrics(globalState) {
  return !(globalState.location && globalState.location.loaded);
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
