/**
 * Reducer for globalSearch
 */
import { combineReducers } from 'redux';
import * as Actions from './actions';

const initialState = {
  locationSearch: {
    data: [],
    query: '',
    isFetching: false,
    isFetched: false,
  },
  clientIspSearch: {
    data: [],
    query: '',
    isFetching: false,
    isFetched: false,
  },
  transitIspSearch: {
    data: [],
    query: '',
    isFetching: false,
    isFetched: false,
  },
};

// the location search reducer
function locationSearch(state = initialState.locationSearch, action = {}) {
  switch (action.type) {
    case Actions.FETCH_LOCATION_SEARCH:
      return {
        // TODO: ideally this ensured that the data was filtered what query is.
        // We want to keep results from "new" when going from "new" to "newyo",
        // but not when going from "new" to "sea" or anything not matching "new".
        data: state.data,
        query: action.searchQuery,
        isFetching: true,
        isFetched: false,
      };
    case Actions.FETCH_LOCATION_SEARCH_SUCCESS:
      // if the query has changed since, ignore this
      if (state.query !== action.searchQuery) {
        return state;
      }
      // query hasn't changed, so update results
      return {
        ...state,
        data: action.result.results,
        query: action.searchQuery,
        isFetching: false,
        isFetched: true,
      };
    case Actions.FETCH_LOCATION_SEARCH_FAIL:
      return {
        ...state,
        isFetching: false,
        isFetched: false,
        error: action.error,
      };
    default:
      return state;
  }
}

// the client ISP search reducer
function clientIspSearch(state = initialState.clientIspSearch, action = {}) {
  switch (action.type) {
    case Actions.FETCH_CLIENT_ISP_SEARCH:
      return {
        // TODO: ideally this ensured that the data was filtered what query is.
        data: state.data,
        query: action.searchQuery,
        isFetching: true,
        isFetched: false,
      };
    case Actions.FETCH_CLIENT_ISP_SEARCH_SUCCESS:
      // if the query has changed since, ignore this
      if (state.query !== action.searchQuery) {
        return state;
      }
      // query hasn't changed, so update results
      return {
        ...state,
        data: action.result.results,
        query: action.searchQuery,
        isFetching: false,
        isFetched: true,
      };
    case Actions.FETCH_CLIENT_ISP_SEARCH_FAIL:
      return {
        ...state,
        isFetching: false,
        isFetched: false,
        error: action.error,
      };
    default:
      return state;
  }
}


// the transit ISP search reducer
function transitIspSearch(state = initialState.transitIspSearch, action = {}) {
  switch (action.type) {
    case Actions.FETCH_TRANSIT_ISP_SEARCH:
      return {
        // TODO: ideally this ensured that the data was filtered what query is.
        data: state.data,
        query: action.searchQuery,
        isFetching: true,
        isFetched: false,
      };
    case Actions.FETCH_TRANSIT_ISP_SEARCH_SUCCESS:
      // if the query has changed since, ignore this
      if (state.query !== action.searchQuery) {
        return state;
      }
      // query hasn't changed, so update results
      return {
        ...state,
        data: action.result.results,
        query: action.searchQuery,
        isFetching: false,
        isFetched: true,
      };
    case Actions.FETCH_TRANSIT_ISP_SEARCH_FAIL:
      return {
        ...state,
        isFetching: false,
        isFetched: false,
        error: action.error,
      };
    default:
      return state;
  }
}

// Export the reducer
export default combineReducers({
  locationSearch,
  clientIspSearch,
  transitIspSearch,
});
