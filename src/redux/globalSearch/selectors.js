/**
 * Selectors for globalSearch
 */

export function getLocationSearch(state) {
  return state.globalSearch.locationSearch;
}

export function getLocationSearchResults(state) {
  const locationSearch = getLocationSearch(state);

  return locationSearch.data;
}

export function getLocationSearchQuery(state) {
  const locationSearch = getLocationSearch(state);

  return locationSearch.query;
}
