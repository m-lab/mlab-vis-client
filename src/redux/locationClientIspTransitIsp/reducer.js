/**
 * Reducer for locationClientIspTransitIsp
 */
import { combineReducers } from 'redux';
import infoWithTypePrefix, { initialState as initialInfoState } from '../shared/infoWithTypePrefix';
import timeWithTypePrefix, { initialState as initialTimeState } from '../shared/timeWithTypePrefix';
import fixedWithTypePrefix, { initialState as initialFixedState } from '../shared/fixedWithTypePrefix';
import typePrefix from './typePrefix';
import makeId from './makeId';

export const initialState = {
  id: null,

  info: initialInfoState,
  time: initialTimeState,
  fixed: initialFixedState,
};

const time = timeWithTypePrefix(typePrefix);
const info = infoWithTypePrefix(typePrefix);
const fixed = fixedWithTypePrefix(typePrefix);

// reducer to get the ID
function id(state = initialState.id, action = {}) {
  if (action.locationId != null && action.clientIspId != null && action.transitIspId != null) {
    return makeId(action.locationId, action.clientIspId, action.transitIspId);
  }

  return state;
}

// combine the entry reducer
const locationClientIspTransitIspEntry = combineReducers({
  id,
  info,
  fixed,
  time,
});

// The root reducer
function locationClientIspTransitIsp(state = {}, action) {
  if (action.locationId != null && action.clientIspId != null && action.transitIspId != null) {
    const entryId = makeId(action.locationId, action.clientIspId, action.transitIspId);
    return {
      ...state,
      [entryId]: locationClientIspTransitIspEntry(state[entryId], action),
    };
  }

  return state;
}


// Export the reducer
export default locationClientIspTransitIsp;
