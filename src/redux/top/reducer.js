/**
 * Reducer for top
 */
import { combineReducers } from 'redux';
import { makeFetchState, reduceFetch, reduceFetchSuccess, reduceFetchFail } from '../shared/fetch';

const initialTopState = makeFetchState({ filterIds: null });

function stringifyIds(ids) {
  return ids ? ids.join(',') : undefined;
}

function topWithTypePrefix(typePrefix) {
  return function top(state = initialTopState, action) {
    switch (action.type) {
      case `${typePrefix}FETCH_TOP`:
        return reduceFetch({
          data: state.data,
          filterIds: stringifyIds(action.filterIds),
        });
      case `${typePrefix}FETCH_TOP_SUCCESS`: {
        // if the filter IDs has changed since, ignore this
        const filterIds = stringifyIds(action.filterIds);
        if (state.filterIds !== filterIds) {
          return state;
        }
        // query hasn't changed, so update results
        return reduceFetchSuccess({
          ...state,
          data: action.result.results,
          filterIds,
        });
      }
      case `${typePrefix}FETCH_TOP_FAIL`:
        return reduceFetchFail({
          ...state,
          error: action.error,
        });
      default:
        return state;
    }
  };
}

const locationsForClientIsps = topWithTypePrefix('top/locations/clientIsps/');
const locationsForTransitIsps = topWithTypePrefix('top/locations/transitIsps/');
const clientIspsForLocations = topWithTypePrefix('top/clientIsps/locations/');
const clientIspsForClientIsps = topWithTypePrefix('top/clientIsps/transitIsps/');
const transitIspsForLocations = topWithTypePrefix('top/transitIsps/locations/');
const transitIspsForClientIsps = topWithTypePrefix('top/transitIsps/clientIsps/');

// Export the reducer
export default combineReducers({
  locationsForClientIsps,
  locationsForTransitIsps,
  clientIspsForLocations,
  clientIspsForClientIsps,
  transitIspsForLocations,
  transitIspsForClientIsps,
});
