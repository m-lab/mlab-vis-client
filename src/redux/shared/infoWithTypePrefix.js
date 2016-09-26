import { makeFetchState, reduceFetch, reduceFetchSuccess, reduceFetchFail } from './fetch';

export const initialState = makeFetchState();


// reducer for info
export default function infoWithTypePrefix(typePrefix) {
  return function info(state = initialState, action) {
    switch (action.type) {
      case `${typePrefix}FETCH_INFO`:
        return reduceFetch({ data: state.data });
      case `${typePrefix}SAVE_INFO`:
      case `${typePrefix}FETCH_INFO_SUCCESS`:
        // store the meta info directly
        return reduceFetchSuccess({ data: action.result.meta });
      case `${typePrefix}FETCH_INFO_FAIL`:
        return reduceFetchFail({ error: action.error });
      default:
        return state;
    }
  };
}
