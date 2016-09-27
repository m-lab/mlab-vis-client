/**
 * Reducer for clientIspTransitIsp
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
  if (action.clientIspId != null && action.transitIspId != null) {
    return makeId(action.clientIspId, action.transitIspId);
  }

  return state;
}

// combine the entry reducer
const clientIspTransitIspEntry = combineReducers({
  id,
  info,
  fixed,
  time,
});

// The root reducer
function clientIspTransitIsp(state = {}, action) {
  if (action.clientIspId != null && action.transitIspId != null) {
    const entryId = makeId(action.clientIspId, action.transitIspId);
    return {
      ...state,
      [entryId]: clientIspTransitIspEntry(state[entryId], action),
    };
  }

  return state;
}


// Export the reducer
export default clientIspTransitIsp;
