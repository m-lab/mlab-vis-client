/**
 * Helper functions for keeping track of fetch state when handling
 * fetch actions.
 */

export function reduceFetch(newState) {
  return {
    ...newState,
    isFetching: true,
    isFetched: false,
  };
}

export function reduceFetchSuccess(newState) {
  return {
    ...newState,
    isFetching: false,
    isFetched: true,
  };
}

export function reduceFetchFail(newState) {
  return {
    ...newState,
    isFetching: false,
    isFetched: true,
  };
}

export function makeFetchState(state) {
  return {
    ...state,
    isFetching: false,
    isFetched: false,
  };
}
