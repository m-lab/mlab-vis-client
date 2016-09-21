/**
 * Actions for search
 */
import createFetchAction from '../createFetchAction';

/**
 * Action Creators
 */

// ---------------------
// Fetch Location Search
// ---------------------
const locationSearchFetch = createFetchAction({
  typePrefix: 'globalSearch/',
  key: 'LOCATION_SEARCH',
  args: ['searchQuery'],
  shouldFetch(state, searchQuery) {
    // ignore empty queries
    if (searchQuery.length === 0) {
      return false;
    }

    // is it a different query than what we had before?
    const locationSearchState = state.globalSearch.locationSearch;
    if (locationSearchState.query !== searchQuery) {
      return true;
    }

    // query matches what is currently there.
    return !(locationSearchState.isFetched || locationSearchState.isFetching);
  },
  promise(searchQuery) {
    return api => api.getLocationSearch(searchQuery);
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
  typePrefix: 'globalSearch/',
  key: 'CLIENT_ISP_SEARCH',
  args: ['searchQuery'],
  shouldFetch(state, searchQuery) {
    // ignore empty queries
    if (searchQuery.length === 0) {
      return false;
    }

    // is it a different query than what we had before?
    const clientIspSearchState = state.globalSearch.clientIspSearch;
    if (clientIspSearchState.query !== searchQuery) {
      return true;
    }

    // query matches what is currently there.
    return !(clientIspSearchState.isFetched || clientIspSearchState.isFetching);
  },
  promise(searchQuery) {
    return api => api.getClientIspSearch(searchQuery);
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
  typePrefix: 'globalSearch/',
  key: 'TRANSIT_ISP_SEARCH',
  args: ['searchQuery'],
  shouldFetch(state, searchQuery) {
    // ignore empty queries
    if (searchQuery.length === 0) {
      return false;
    }

    // is it a different query than what we had before?
    const transitIspSearchState = state.globalSearch.transitIspSearch;
    if (transitIspSearchState.query !== searchQuery) {
      return true;
    }

    // query matches what is currently there.
    return !(transitIspSearchState.isFetched || transitIspSearchState.isFetching);
  },
  promise(searchQuery) {
    return api => api.getTransitIspSearch(searchQuery);
  },
});

export const FETCH_TRANSIT_ISP_SEARCH = transitIspSearchFetch.types.fetch;
export const FETCH_TRANSIT_ISP_SEARCH_SUCCESS = transitIspSearchFetch.types.success;
export const FETCH_TRANSIT_ISP_SEARCH_FAIL = transitIspSearchFetch.types.fail;
export const shouldFetchTransitIspSearch = transitIspSearchFetch.shouldFetch;
export const fetchTransitIspSearch = transitIspSearchFetch.fetch;
export const fetchTransitIspSearchIfNeeded = transitIspSearchFetch.fetchIfNeeded;
