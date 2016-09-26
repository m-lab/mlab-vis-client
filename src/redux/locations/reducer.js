/**
 * Reducer for locations
 */
import { combineReducers } from 'redux';
import * as Actions from './actions';
import infoWithTypePrefix, { initialState as initialInfoState } from '../shared/infoWithTypePrefix';
import timeWithTypePrefix, { initialState as initialTimeState } from '../shared/timeWithTypePrefix';
import fixedWithTypePrefix, { initialState as initialFixedState } from '../shared/fixedWithTypePrefix';
import { makeFetchState, reduceFetch, reduceFetchSuccess, reduceFetchFail } from '../shared/fetch';
import typePrefix from './typePrefix';

export const initialState = {
  id: null,

  info: initialInfoState,
  time: initialTimeState,
  fixed: initialFixedState,

  topClientIsps: makeFetchState(),

  clientIsps: {},
  transitIsps: {},
};

const time = timeWithTypePrefix(typePrefix);
const info = infoWithTypePrefix(typePrefix);
const fixed = fixedWithTypePrefix(typePrefix);

// reducer for the top clientIsps in a location
function topClientIsps(state = initialState.topClientIsps, action = {}) {
  switch (action.type) {
    case Actions.FETCH_TOP_CLIENT_ISPS:
      return reduceFetch({ data: state.data });
    case Actions.FETCH_TOP_CLIENT_ISPS_SUCCESS:
      return reduceFetchSuccess({ data: action.result.results });
    case Actions.FETCH_TOP_CLIENT_ISPS_FAIL:
      return reduceFetchFail({ error: action.error });
    default:
      return state;
  }
}


// reducer to get the ID
function id(state = initialState.id, action = {}) {
  return action.locationId || state;
}

// combine the location reducer
const location = combineReducers({
  id,
  info,
  fixed,
  time,
  topClientIsps,
});

// The root reducer
function locations(state = {}, action) {
  if (action.locationId != null) {
    const { locationId } = action;
    return {
      ...state,
      [locationId]: location(state[locationId], action),
    };
  }

  return state;
}


// Export the reducer
export default locations;
