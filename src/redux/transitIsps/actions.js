/**
 * Actions for transitIsps
 */
import createFetchAction from '../createFetchAction';

/**
 * Action Creators
 */

// ---------------------
// Fetch Transit ISP Info
// ---------------------
const infoFetch = createFetchAction({
  typePrefix: 'transitIsps/',
  key: 'INFO',
  args: ['transitIspId'],
  shouldFetch(state, transitIspId) {
    const transitIspState = state.transitIsps[transitIspId];
    if (!transitIspState) {
      return true;
    }

    const hasInfo = transitIspState.info.isFetched || transitIspState.info.isFetching;
    return !hasInfo;
  },
  promise(transitIspId) {
    return api => api.getTransitIspInfo(transitIspId);
  },
});
export const FETCH_INFO = infoFetch.types.fetch;
export const FETCH_INFO_SUCCESS = infoFetch.types.success;
export const FETCH_INFO_FAIL = infoFetch.types.fail;
export const shouldFetchInfo = infoFetch.shouldFetch;
export const fetchInfo = infoFetch.fetch;
export const fetchInfoIfNeeded = infoFetch.fetchIfNeeded;

/**
 * When receiving partial transit ISP info, save it to the store if it isn't already there.
 * This is typically done when using a value from a search result that hasn't yet been
 * populated in the transit ISP store.
 */
export const SAVE_TRANSIT_ISP_INFO = 'transitIsps/SAVE_TRANSIT_ISP_INFO';
export function shouldSaveTransitIspInfo(state, transitIsp) {
  const transitIspState = state.transitIsps[transitIsp.id];
  if (!transitIspState) {
    return true;
  }

  return !transitIspState.info.isFetched;
}

export function saveTransitIspInfo(transitIspInfo) {
  return {
    type: SAVE_TRANSIT_ISP_INFO,
    transitIspId: transitIspInfo.id,
    result: { meta: transitIspInfo },
  };
}

export function saveTransitIspInfoIfNeeded(transitIspInfo) {
  return (dispatch, getState) => {
    const state = getState();
    if (shouldSaveTransitIspInfo(state, transitIspInfo)) {
      dispatch(saveTransitIspInfo(transitIspInfo));
    }
  };
}
