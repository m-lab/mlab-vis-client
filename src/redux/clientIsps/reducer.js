/**
 * Reducer for clientIsps
 */
import { combineReducers } from 'redux';
// import * as Actions from './actions';
import * as LocationsActions from '../locations/actions';

import infoWithTypePrefix, { initialState as initialInfoState } from '../shared/infoWithTypePrefix';
import timeWithTypePrefix, { initialState as initialTimeState } from '../shared/timeWithTypePrefix';
import topInfosWithTypePrefix, { initialState as initialTopState } from '../shared/topInfosWithTypePrefix';
import typePrefix from './typePrefix';

const time = timeWithTypePrefix(typePrefix);
const info = infoWithTypePrefix(typePrefix);
const topLocations = topInfosWithTypePrefix(typePrefix, 'locations/');
const topTransitIsps = topInfosWithTypePrefix(typePrefix, 'transitIsps/');

export const initialState = {
  id: null,

  info: initialInfoState,
  time: initialTimeState,
  topLocations: initialTopState,
  topTransitIsps: initialTopState,
};

// reducer to get the ID
function id(state = initialState.id, action) {
  return action.clientIspId || state;
}

const clientIsp = combineReducers({
  id,
  info,
  time,
  topLocations,
  topTransitIsps,
});

// helper function to merge in ISP info that arrives separately from other handled actions.
function mergeClientIspInfo(state, clientIsp) {
  let result = state;
  const id = clientIsp.id == null ? clientIsp.client_asn_number : clientIsp.id;
  let clientIspState = state[id];
  // if we don't have state for this client ISP yet, initialize to the default + id
  if (!clientIspState) {
    clientIspState = {
      ...initialState,
      id,
    };
  }

  // if we don't have info for this client ISP, use the top client ISP data
  if (!clientIspState.info.isFetched) {
    clientIspState = {
      ...clientIspState,
      info: {
        ...clientIspState.info,
        data: clientIsp,
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


// The root reducer
function clientIsps(state = {}, action) {
  if (action.clientIspId != null) {
    const { clientIspId } = action;
    return {
      ...state,
      [clientIspId]: clientIsp(state[clientIspId], action),
    };
  }

  // merge in client ISP info from other actions
  if (action.type === LocationsActions.FETCH_TOP_CLIENT_ISPS_SUCCESS) {
    const topIsps = action.result.results;
    let result = state;
    // for each top ISP, see if we need to merge in info
    topIsps.forEach(topIsp => {
      result = mergeClientIspInfo(result, topIsp);
    });
    return result;
  }

  return state;
}


// Export the reducer
export default clientIsps;
