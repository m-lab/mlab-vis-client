/**
 * Reducer for an individual location within locations
 */
import { combineReducers } from 'redux';
import * as Actions from '../actions';
import clientIsp from './clientIsp';
import { initialLocationState, initialClientIspState } from '../initialState';
import timeWithTypePrefix from '../../shared/timeWithTypePrefix';
import infoWithTypePrefix from '../../shared/infoWithTypePrefix';
import fixedWithTypePrefix from '../../shared/fixedWithTypePrefix';

const typePrefix = 'location/';

const time = timeWithTypePrefix(typePrefix);
const info = infoWithTypePrefix(typePrefix);

// reducer for fixed time data about a location (e.g. last year, last week)
const fixed = fixedWithTypePrefix(typePrefix);

// reducer for the clientIsps portion of a location
function topClientIsps(state = initialLocationState.topClientIsps, action = {}) {
  switch (action.type) {
    case Actions.FETCH_TOP_CLIENT_ISPS:
      return {
        data: state.data,
        isFetching: true,
        isFetched: false,
      };
    case Actions.FETCH_TOP_CLIENT_ISPS_SUCCESS:
      return {
        data: action.result.results,
        isFetching: false,
        isFetched: true,
      };
    case Actions.FETCH_TOP_CLIENT_ISPS_FAIL:
      return {
        isFetching: false,
        isFetched: false,
        error: action.error,
      };
    default:
      return state;
  }
}

// helper function to update client ISP info when it comes from other API calls
function mergeClientIspInfo(state, isp) {
  let result = state;
  const id = isp.client_asn_number;
  let clientIspState = state[id];
  // if we don't have state for this client ISP yet, initialize to the default + id
  if (!clientIspState) {
    clientIspState = {
      ...initialClientIspState,
      id,
    };
  }

  // if we don't have info for this client ISP, use the top client ISP data
  if (!clientIspState.info.isFetched) {
    clientIspState = {
      ...clientIspState,
      info: {
        ...clientIspState.info,
        data: isp,
        isFetched: true,
      },
    };

    // update the result to have the new info data
    result = {
      ...result,
      [id]: clientIspState,
    };
  }

  return result;
}

// reducer for the collection of client ISPs
function clientIsps(state = initialLocationState.clientIsps, action = {}) {
  switch (action.type) {
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES:
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES_SUCCESS:
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES_FAIL:
    case Actions.FETCH_CLIENT_ISP_HOURLY:
    case Actions.FETCH_CLIENT_ISP_HOURLY_SUCCESS:
    case Actions.FETCH_CLIENT_ISP_HOURLY_FAIL:
    case Actions.FETCH_CLIENT_ISP_INFO:
    case Actions.FETCH_CLIENT_ISP_INFO_SUCCESS:
    case Actions.FETCH_CLIENT_ISP_INFO_FAIL:
      return {
        ...state,
        [action.clientIspId]: clientIsp(state[action.clientIspId], action),
      };
    // when top ISPs come, merge them into info if they aren't already in there.
    case Actions.FETCH_TOP_CLIENT_ISPS_SUCCESS: {
      const topIsps = action.result.results;
      let result = state;
      // for each top ISP, see if we need to merge in info
      topIsps.forEach(topIsp => {
        result = mergeClientIspInfo(state, topIsp);
      });

      return result;
    }
    default:
      return state;
  }
}

// reducer to get the ID
function id(state = initialLocationState.id, action = {}) {
  return action.locationId || state;
}

// Export the reducer
export default combineReducers({
  id,
  clientIsps,
  info,
  fixed,
  time,
  topClientIsps,
});
