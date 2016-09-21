/**
 * Selectors for globalSearch
 */

// Location Search
export function getLocationSearch(state) {
  return state.globalSearch.locationSearch;
}

export function getLocationSearchResults(state, props) {
  const locationSearch = getLocationSearch(state);

  let results = locationSearch.data;
  if (props.exclude) {
    results = results.filter(location => !props.exclude.find(ex => ex.id === location.meta.id));
  }

  return results;
}

export function getLocationSearchQuery(state) {
  const locationSearch = getLocationSearch(state);

  return locationSearch.query;
}


// Client ISP Search
export function getClientIspSearch(state) {
  return state.globalSearch.clientIspSearch;
}

export function getClientIspSearchResults(state, props) {
  const clientIspSearch = getClientIspSearch(state);

  let results = clientIspSearch.data;
  if (props.exclude) {
    results = results.filter(clientIsp => !props.exclude.find(ex => ex.id === clientIsp.meta.id));
  }

  return results;
}

export function getClientIspSearchQuery(state) {
  const clientIspSearch = getClientIspSearch(state);

  return clientIspSearch.query;
}
