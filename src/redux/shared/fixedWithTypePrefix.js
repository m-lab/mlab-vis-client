import { makeFetchState, reduceFetch, reduceFetchSuccess, reduceFetchFail } from './fetch';

export const initialState = makeFetchState();

// reducer for fixed
export default function fixedWithTypePrefix(typePrefix) {
  return function fixed(state = initialState, action) {
    switch (action.type) {
      case `${typePrefix}FETCH_INFO`:
        return reduceFetch({ data: state.data });
      case `${typePrefix}SAVE_INFO`:
      case `${typePrefix}FETCH_INFO_SUCCESS`:
        // store the data directly
        return reduceFetchSuccess({ data: action.result.data });
      case `${typePrefix}FETCH_INFO_FAIL`:
        return reduceFetchFail({ error: action.error });
      default:
        return state;
    }
  };
}
