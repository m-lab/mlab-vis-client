/**
 * Reducer for globalSearch
 */
import { combineReducers } from 'redux';
import { makeFetchState, reduceFetch, reduceFetchSuccess, reduceFetchFail } from '../shared/fetch';

const initialSearchState = makeFetchState({ data: [], query: '' });

function searchWithTypePrefix(typePrefix) {
  return function search(state = initialSearchState, action) {
    switch (action.type) {
      case `${typePrefix}FETCH_SEARCH`:
        // TODO: ideally this ensured that the data was filtered what query is.
        // We want to keep results from "new" when going from "new" to "newyo",
        // but not when going from "new" to "sea" or anything not matching "new".
        return reduceFetch({
          data: state.data,
          query: action.searchQuery,
        });
      case `${typePrefix}FETCH_SEARCH_SUCCESS`:
        // if the query has changed since, ignore this
        if (state.query !== action.searchQuery) {
          return state;
        }
        // query hasn't changed, so update results
        return reduceFetchSuccess({
          ...state,
          data: action.result.results,
          query: action.searchQuery,
        });
      case `${typePrefix}FETCH_SEARCH_FAIL`:
        return reduceFetchFail({
          ...state,
          error: action.error,
        });
      default:
        return state;
    }
  };
}

const locationSearch = searchWithTypePrefix('globalSearch/location/');
const clientIspSearch = searchWithTypePrefix('globalSearch/clientIsp/');
const transitIspSearch = searchWithTypePrefix('globalSearch/transitIsp/');

// Export the reducer
export default combineReducers({
  locationSearch,
  clientIspSearch,
  transitIspSearch,
});
