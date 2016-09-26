export const initialState = {
  isFetching: false,
  isFetched: false,
};

// reducer for fixed
export default function fixedWithTypePrefix(typePrefix) {
  return function fixed(state = initialState, action) {
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
          // store the data directly
          data: action.result.data,
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
