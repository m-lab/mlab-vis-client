/**
 * Reducer for clientIsps
 */
import { combineReducers } from 'redux';
import * as Actions from './actions';

import infoWithTypePrefix, { initialState as initialInfoState } from '../shared/infoWithTypePrefix';
import timeWithTypePrefix, { initialState as initialTimeState } from '../shared/timeWithTypePrefix';
import typePrefix from './typePrefix';

const time = timeWithTypePrefix(typePrefix);
const info = infoWithTypePrefix(typePrefix);

export const initialState = {
  id: null,

  info: initialInfoState,
  time: initialTimeState,

  transitIsps: {},
};

// reducer to get the ID
function id(state = initialState.id, action) {
  return action.clientIspId || state;
}

const clientIsp = combineReducers({
  id,
  info,
  time,
});

// The root reducer
function clientIsps(state = {}, action) {
  const { clientIspId } = action;
  switch (action.type) {
    case Actions.SAVE_CLIENT_ISP_INFO:
    case Actions.FETCH_INFO:
    case Actions.FETCH_INFO_SUCCESS:
    case Actions.FETCH_INFO_FAIL:
    case Actions.FETCH_HOURLY:
    case Actions.FETCH_HOURLY_SUCCESS:
    case Actions.FETCH_HOURLY_FAIL:
    case Actions.FETCH_TIME_SERIES:
    case Actions.FETCH_TIME_SERIES_SUCCESS:
    case Actions.FETCH_TIME_SERIES_FAIL:
      return {
        ...state,
        [clientIspId]: clientIsp(state[clientIspId], action),
      };
    default:
      return state;
  }
}


// Export the reducer
export default clientIsps;
