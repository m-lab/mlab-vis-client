/**
 * Actions for search
 */
import createFetchAction from '../createFetchAction';
import { shouldFetch } from '../shared/shouldFetch';
/**
 * Action Creators
 */

function searchShouldFetch(state, searchQuery, searchFilterType, searchFilterItemIds) {
  // ignore empty queries
  if (searchQuery.length === 0) {
    return false;
  }

  // is it a different query than what we had before?
  if (state.query !== searchQuery) {
    return true;
  }

  // query matches what is currently there.
  return shouldFetch(state);
}

// ---------------------
// Fetch Location Search
// ---------------------
const locationSearchFetch = createFetchAction({
  typePrefix: 'globalSearch/location/',
  key: 'SEARCH',
  args: ['searchQuery', 'searchFilterType', 'searchFilterItemIds'],
  shouldFetch(state, searchQuery, searchFilterType, searchFilterItemIds) {
    const locationSearchState = state.globalSearch.locationSearch;
    return searchShouldFetch(locationSearchState, searchQuery, searchFilterType, searchFilterItemIds);
  },
  promise(searchQuery, searchFilterType, searchFilterItemIds) {
    return api => api.getLocationSearch(searchQuery, searchFilterType, searchFilterItemIds);
  },
});

export const FETCH_LOCATION_SEARCH = locationSearchFetch.types.fetch;
export const FETCH_LOCATION_SEARCH_SUCCESS = locationSearchFetch.types.success;
export const FETCH_LOCATION_SEARCH_FAIL = locationSearchFetch.types.fail;
export const shouldFetchLocationSearch = locationSearchFetch.shouldFetch;
export const fetchLocationSearch = locationSearchFetch.fetch;
export const fetchLocationSearchIfNeeded = locationSearchFetch.fetchIfNeeded;


// ---------------------
// Fetch Client ISP Search
// ---------------------
const clientIspSearchFetch = createFetchAction({
  typePrefix: 'globalSearch/clientIsp/',
  key: 'SEARCH',
  args: ['searchQuery', 'searchFilterType', 'searchFilterItemIds'],
  shouldFetch(state, searchQuery, searchFilterType, searchFilterItemIds) {
    const clientIspSearchState = state.globalSearch.clientIspSearch;
    return searchShouldFetch(clientIspSearchState, searchQuery, searchFilterType, searchFilterItemIds);
  },
  promise(searchQuery, searchFilterType, searchFilterItemIds) {
    return api => api.getClientIspSearch(searchQuery, searchFilterType, searchFilterItemIds);
  },
});

export const FETCH_CLIENT_ISP_SEARCH = clientIspSearchFetch.types.fetch;
export const FETCH_CLIENT_ISP_SEARCH_SUCCESS = clientIspSearchFetch.types.success;
export const FETCH_CLIENT_ISP_SEARCH_FAIL = clientIspSearchFetch.types.fail;
export const shouldFetchClientIspSearch = clientIspSearchFetch.shouldFetch;
export const fetchClientIspSearch = clientIspSearchFetch.fetch;
export const fetchClientIspSearchIfNeeded = clientIspSearchFetch.fetchIfNeeded;


// ---------------------
// Fetch Transit ISP Search
// ---------------------
const transitIspSearchFetch = createFetchAction({
  typePrefix: 'globalSearch/transitIsp/',
  key: 'SEARCH',
  args: ['searchQuery', 'searchFilterType', 'searchFilterItemIds'],
  shouldFetch(state, searchQuery, searchFilterType, searchFilterItemIds) {
    const transitIspSearchState = state.globalSearch.transitIspSearch;
    return searchShouldFetch(transitIspSearchState, searchQuery, searchFilterType, searchFilterItemIds);
  },
  promise(searchQuery, searchFilterType, searchFilterItemIds) {
    return api => api.getTransitIspSearch(searchQuery, searchFilterType, searchFilterItemIds);
  },
});

export const FETCH_TRANSIT_ISP_SEARCH = transitIspSearchFetch.types.fetch;
export const FETCH_TRANSIT_ISP_SEARCH_SUCCESS = transitIspSearchFetch.types.success;
export const FETCH_TRANSIT_ISP_SEARCH_FAIL = transitIspSearchFetch.types.fail;
export const shouldFetchTransitIspSearch = transitIspSearchFetch.shouldFetch;
export const fetchTransitIspSearch = transitIspSearchFetch.fetch;
export const fetchTransitIspSearchIfNeeded = transitIspSearchFetch.fetchIfNeeded;
