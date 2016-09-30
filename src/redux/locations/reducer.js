/**
 * Reducer for locations
 */
import { combineReducers } from 'redux';
// import * as Actions from './actions';
import infoWithTypePrefix, { initialState as initialInfoState } from '../shared/infoWithTypePrefix';
import timeWithTypePrefix, { initialState as initialTimeState } from '../shared/timeWithTypePrefix';
import fixedWithTypePrefix, { initialState as initialFixedState } from '../shared/fixedWithTypePrefix';
import topInfosWithTypePrefix, { initialState as initialTopState } from '../shared/topInfosWithTypePrefix';
import typePrefix from './typePrefix';

export const initialState = {
  id: null,

  info: initialInfoState,
  time: initialTimeState,
  fixed: initialFixedState,
  topClientIsps: initialTopState,
  topTransitIsps: initialTopState,

  clientIsps: {},
  transitIsps: {},
};

const time = timeWithTypePrefix(typePrefix);
const info = infoWithTypePrefix(typePrefix);
const fixed = fixedWithTypePrefix(typePrefix);
const topClientIsps = topInfosWithTypePrefix(typePrefix, 'topClientIsps/');
const topTransitIsps = topInfosWithTypePrefix(typePrefix, 'topTransitIsps/');

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
  topTransitIsps,
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
