export const initialState = {
  isFetching: false,
  isFetched: false,
};

// reducer for info
export default function infoWithTypePrefix(typePrefix) {
  return function info(state = initialState, action) {
    switch (action.type) {
      case `${typePrefix}FETCH_INFO`:
        return {
          data: state.data,
          isFetching: true,
          isFetched: false,
        };
      case `${typePrefix}SAVE_INFO`:
      case `${typePrefix}FETCH_INFO_SUCCESS`:
        return {
          // store the meta info directly
          data: action.result.meta,
          isFetching: false,
          isFetched: true,
        };
      case `${typePrefix}FETCH_INFO_FAIL`:
        return {
          isFetching: false,
          isFetched: false,
          error: action.error,
        };
      default:
        return state;
    }
  };
}
