/**
 * Actions for search
 */
export const FETCH_LOCATION_SEARCH = 'globalSearch/FETCH_LOCATION_SEARCH';
export const FETCH_LOCATION_SEARCH_SUCCESS = 'globalSearch/FETCH_LOCATION_SEARCH_SUCCESS';
export const FETCH_LOCATION_SEARCH_FAIL = 'globalSearch/FETCH_LOCATION_SEARCH_FAIL';

/**
 * Action Creators
 */

// ---------------------
// Fetch Time Series
// ---------------------
function shouldFetchLocationSearch(state, searchQuery) {
  if (searchQuery.length > 0) {
    return true;
  }
  return false;
}

function fetchLocationSearch(searchQuery) {
  return {
    types: [FETCH_LOCATION_SEARCH, FETCH_LOCATION_SEARCH_SUCCESS, FETCH_LOCATION_SEARCH_FAIL],
    promise: (api) => api.getLocationSearch(searchQuery),
    searchQuery,
  };
}

export function fetchLocationSearchIfNeeded(searchQuery) {
  return (dispatch, getState) => {
    if (shouldFetchLocationSearch(getState(), searchQuery)) {
      dispatch(fetchLocationSearch(searchQuery));
    }
  };
}
