
import { combineReducers } from 'redux';
import { makeFetchState, reduceFetch, reduceFetchSuccess, reduceFetchFail } from '../shared/fetch';

import * as Actions from './actions';

const initialTopState = makeFetchState({ filterIds: null });

function tests(state = initialTopState, action) {
  switch (action.type) {
    case Actions.FETCH_RAW_TESTS:
      return reduceFetch({
        data: state.data,
      });
    case Actions.FETCH_RAW_TESTS_SUCCESS: {
      return reduceFetchSuccess({
        ...state,
        data: action.result.results,
      });
    }
    case Actions.FETCH_RAW_TESTS_FAIL:
      return reduceFetchFail({
        ...state,
        error: action.error,
      });
    default:
      return state;
  }
}

export default combineReducers({
  tests,
});
