/**
 * Reducer for transitIsps
 */
import { combineReducers } from 'redux';
import * as Actions from './actions';

const initialState = {
};

export const initialTransitIspState = {
  id: null,

  info: {
    isFetching: false,
    isFetched: false,
  },
};

// reducer for transit ISP info
function info(state = initialTransitIspState.info, action = {}) {
  switch (action.type) {
    case Actions.FETCH_INFO:
      return {
        data: state.data,
        isFetching: true,
        isFetched: false,
      };
    case Actions.SAVE_TRANSIT_ISP_INFO:
    case Actions.FETCH_INFO_SUCCESS:
      return {
        // store the meta info directly
        data: action.result.meta,
        isFetching: false,
        isFetched: true,
      };
    case Actions.FETCH_INFO_FAIL:
      return {
        isFetching: false,
        isFetched: false,
        error: action.error,
      };
    default:
      return state;
  }
}


// reducer to get the ID
function id(state = initialTransitIspState.id, action = {}) {
  return action.transitIspId || state;
}

const transitIsp = combineReducers({
  id,
  info,
});

// The root reducer
function transitIsps(state = initialState, action = {}) {
  const { transitIspId } = action;
  switch (action.type) {
    case Actions.SAVE_TRANSIT_ISP_INFO:
    case Actions.FETCH_INFO:
    case Actions.FETCH_INFO_SUCCESS:
    case Actions.FETCH_INFO_FAIL:
      return {
        ...state,
        [transitIspId]: transitIsp(state[transitIspId], action),
      };
    default:
      return state;
  }
}


// Export the reducer
export default transitIsps;
