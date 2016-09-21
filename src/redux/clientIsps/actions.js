/**
 * Actions for clientIsps
 */
import createFetchAction from '../createFetchAction';

/**
 * Action Creators
 */

// ---------------------
// Fetch Client ISP Info
// ---------------------
const infoFetch = createFetchAction({
  typePrefix: 'clientIsps/',
  key: 'INFO',
  args: ['clientIspId'],
  shouldFetch(state, clientIspId) {
    const clientIspState = state.clientIsps[clientIspId];
    if (!clientIspState) {
      return true;
    }

    const hasInfo = clientIspState.info.isFetched || clientIspState.info.isFetching;
    return !hasInfo;
  },
  promise(clientIspId) {
    return api => api.getClientIspInfo(clientIspId);
  },
});
export const FETCH_INFO = infoFetch.types.fetch;
export const FETCH_INFO_SUCCESS = infoFetch.types.success;
export const FETCH_INFO_FAIL = infoFetch.types.fail;
export const shouldFetchInfo = infoFetch.shouldFetch;
export const fetchInfo = infoFetch.fetch;
export const fetchInfoIfNeeded = infoFetch.fetchIfNeeded;

/**
 * When receiving partial client ISP info, save it to the store if it isn't already there.
 * This is typically done when using a value from a search result that hasn't yet been
 * populated in the client ISP store.
 */
export const SAVE_CLIENT_ISP_INFO = 'clientIsps/SAVE_CLIENT_ISP_INFO';
export function shouldSaveClientIspInfo(state, clientIsp) {
  const clientIspState = state.clientIsps[clientIsp.id];
  if (!clientIspState) {
    return true;
  }

  return !clientIspState.info.isFetched;
}

export function saveClientIspInfo(clientIspInfo) {
  return {
    type: SAVE_CLIENT_ISP_INFO,
    clientIspId: clientIspInfo.id,
    result: { meta: clientIspInfo },
  };
}

export function saveClientIspInfoIfNeeded(clientIspInfo) {
  return (dispatch, getState) => {
    const state = getState();
    if (shouldSaveClientIspInfo(state, clientIspInfo)) {
      dispatch(saveClientIspInfo(clientIspInfo));
    }
  };
}
