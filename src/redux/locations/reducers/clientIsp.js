/**
 * Reducer for client ISP within a location
 */
import { combineReducers } from 'redux';
import { initialClientIspState } from '../initialState';
import timeWithTypePrefix from '../../shared/timeWithTypePrefix';
import infoWithTypePrefix from '../../shared/infoWithTypePrefix';
import fixedWithTypePrefix from '../../shared/fixedWithTypePrefix';

const typePrefix = 'locationClientIsp/';

const time = timeWithTypePrefix(typePrefix);
const info = infoWithTypePrefix(typePrefix);
const fixed = fixedWithTypePrefix(typePrefix);

// reducer to get the ID
function id(state = initialClientIspState.id, action = {}) {
  return action.clientIspId || state;
}

// Export the reducer
export default combineReducers({
  id,
  info,
  fixed,
  time,
});
