/**
 * Selectors for globalSearch
 */

// Location Search
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


// Client ISP Search
export function getClientIspSearch(state) {
  return state.globalSearch.clientIspSearch;
}

export function getClientIspSearchResults(state) {
  const clientIspSearch = getClientIspSearch(state);

  return clientIspSearch.data;
}

export function getClientIspSearchQuery(state) {
  const clientIspSearch = getClientIspSearch(state);

  return clientIspSearch.query;
}
