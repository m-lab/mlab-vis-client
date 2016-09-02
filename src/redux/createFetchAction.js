/**
 * Helper function to generate the necessary things to make an action
 * that is used to fetch data from the API.
 *
 * Simple example of usage:
 *   const infoFetch = createFetchAction({
 *     typePrefix: 'location/',
 *     key: 'INFO',
 *     args: ['locationId'],
 *     shouldFetch(state, locationId) {
 *       const locationState = state.locations[locationId];
 *       if (!locationState) {
 *         return true;
 *       }
 *
 *       return !(locationState.info.isFetched || locationState.info.isFetching);
 *     },
 *     promise(locationId) {
 *       return api => api.getLocationInfo(locationId);
 *     },
 *   });
 *   export const FETCH_INFO = infoFetch.types.fetch;
 *   export const FETCH_INFO_SUCCESS = infoFetch.types.success;
 *   export const FETCH_INFO_FAIL = infoFetch.types.fail;
 *   export const shouldFetchInfo = infoFetch.shouldFetch;
 *   export const fetchInfo = infoFetch.fetch;
 *   export const fetchInfoIfNeeded = infoFetch.fetchIfNeeded;
 *
 */
export default function createFetchAction({ key, shouldFetch, promise, args = [], typePrefix = '' }) {
  const typeRoot = `${typePrefix}FETCH_${key}`;
  const types = {
    fetch: typeRoot,
    success: `${typeRoot}_SUCCESS`,
    fail: `${typeRoot}_FAIL`,
  };

  function fetch(...fetchArgs) {
    const action = {
      types: [types.fetch, types.success, types.fail],
      promise: promise(...fetchArgs),
    };

    args.forEach((arg, i) => { action[arg] = fetchArgs[i]; });

    return action;
  }

  function fetchIfNeeded(...fetchArgs) {
    return function fetchIfNeededResult(dispatch, getState) {
      if (shouldFetch(getState(), ...fetchArgs)) {
        dispatch(fetch(...fetchArgs));
      }
    };
  }

  return {
    types,
    shouldFetch,
    fetch,
    fetchIfNeeded,
  };
}
