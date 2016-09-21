/**
 * Selectors for globalSearch
 */

// helper function for filtering search results
function getSearchResults(results, exclude) {
  if (exclude) {
    results = results.filter(result => !exclude.find(ex => ex.id === result.meta.id));
  }

  return results;
}

// -----------------------
// Location Search
// -----------------------
export function getLocationSearch(state) {
  return state.globalSearch.locationSearch;
}

export function getLocationSearchResults(state, props) {
  const locationSearch = getLocationSearch(state);
  return getSearchResults(locationSearch.data, props.exclude);
}

// -----------------------
// Client ISP Search
// -----------------------
export function getClientIspSearch(state) {
  return state.globalSearch.clientIspSearch;
}

export function getClientIspSearchResults(state, props) {
  const clientIspSearch = getClientIspSearch(state);
  return getSearchResults(clientIspSearch.data, props.exclude);
}


// -----------------------
// Transit ISP Search
// -----------------------
export function getTransitIspSearch(state) {
  return state.globalSearch.transitIspSearch;
}

export function getTransitIspSearchResults(state, props) {
  const transitIspSearch = getTransitIspSearch(state);
  return getSearchResults(transitIspSearch.data, props.exclude);
}
