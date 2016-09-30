/**
 * Reducer for top
 */
import { combineReducers } from 'redux';
import { makeFetchState, reduceFetch, reduceFetchSuccess, reduceFetchFail } from '../shared/fetch';

const initialTopState = makeFetchState({ filterIds: null });

function stringifyIds(ids) {
  return ids ? ids.join(',') : undefined;
}

function topWithTypePrefix(typePrefix, filterIdsKey) {
  return function top(state = initialTopState, action) {
    switch (action.type) {
      case `${typePrefix}FETCH_TOP`:
        return reduceFetch({
          data: state.data,
          filterIds: stringifyIds(action[filterIdsKey]),
        });
      case `${typePrefix}FETCH_TOP_SUCCESS`: {
        // if the filter IDs has changed since, ignore this
        const filterIds = stringifyIds(action[filterIdsKey]);
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

const locationsForClientIsps = topWithTypePrefix('top/locations/clientIsps/', 'clientIspIds');
const locationsForTransitIsps = topWithTypePrefix('top/locations/transitIsps/', 'transitIspIds');
const clientIspsForLocations = topWithTypePrefix('top/clientIsps/locations/', 'locationIds');
const clientIspsForTransitIsps = topWithTypePrefix('top/clientIsps/transitIsps/', 'transitIspIds');
const transitIspsForLocations = topWithTypePrefix('top/transitIsps/locations/', 'locationIds');
const transitIspsForClientIsps = topWithTypePrefix('top/transitIsps/clientIsps/', 'clientIspIds');

// Export the reducer
export default combineReducers({
  locationsForClientIsps,
  locationsForTransitIsps,
  clientIspsForLocations,
  clientIspsForTransitIsps,
  transitIspsForLocations,
  transitIspsForClientIsps,
});
