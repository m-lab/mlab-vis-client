const LOAD = 'info/LOAD';
const LOAD_SUCCESS = 'info/LOAD_SUCCESS';
const LOAD_FAIL = 'info/LOAD_FAIL';

const initialState = {
  loaded: false,
};

export default function info(state = initialState, action = {}) {
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

export function shouldFetchInfo(globalState) {
  return !(globalState.info && globalState.info.loaded);
}

export function fetchInfo() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (api) => api.getLocationMetrics('month', 'NA+US+MA+Cambridge'),
  };
}

export function fetchInfoIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchInfo(getState())) {
      dispatch(fetchInfo());
    }
  };
}
