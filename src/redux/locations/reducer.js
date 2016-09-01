/**
 * Reducer for locations
 */
import * as Actions from './actions';
import { initialState } from './initialState';
import location from './reducers/location';

// The root reducer
function locations(state = initialState, action = {}) {
  switch (action.type) {
    case Actions.FETCH_TIME_SERIES:
    case Actions.FETCH_TIME_SERIES_SUCCESS:
    case Actions.FETCH_TIME_SERIES_FAIL:
    case Actions.FETCH_HOURLY:
    case Actions.FETCH_HOURLY_SUCCESS:
    case Actions.FETCH_HOURLY_FAIL:
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES:
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES_SUCCESS:
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES_FAIL:
    case Actions.FETCH_CLIENT_ISPS:
    case Actions.FETCH_CLIENT_ISPS_SUCCESS:
    case Actions.FETCH_CLIENT_ISPS_FAIL:
    case Actions.FETCH_INFO:
    case Actions.FETCH_INFO_SUCCESS:
    case Actions.FETCH_INFO_FAIL: {
      const { locationId } = action;

      return {
        ...state,
        [locationId]: location(state[locationId], action),
      };
    }
    default:
      return state;
  }
}


// Export the reducer
export default locations;
