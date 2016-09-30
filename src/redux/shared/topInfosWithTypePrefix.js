import { makeFetchState, reduceFetch, reduceFetchSuccess, reduceFetchFail } from './fetch';

export const initialState = makeFetchState();

// reducer for fixed
export default function topInfosWithTypePrefix(typePrefix, topPrefix) {
  return function topInfos(state = initialState, action) {
    switch (action.type) {
      case `${typePrefix}${topPrefix}FETCH_TOP`:
        return reduceFetch({ data: state.data });
      case `${typePrefix}${topPrefix}FETCH_TOP_SUCCESS`:
        return reduceFetchSuccess({ data: action.result.results });
      case `${typePrefix}${topPrefix}FETCH_TOP_FAIL`:
        return reduceFetchFail({ error: action.error });
      default:
        return state;
    }
  };
}
