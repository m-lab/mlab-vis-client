
import createFetchAction from '../createFetchAction';
import { shouldFetch } from '../shared/shouldFetch';


function rawShouldFetch(state) {
  return shouldFetch(state);
}

// ---------------------
// Fetch Raw Tests
// ---------------------
const rawTestsFetch = createFetchAction({
  typePrefix: 'raw/tests/',
  key: 'RAW',
  args: [],
  shouldFetch(state) {
    const rawTestsState = state.raw.tests;
    return rawShouldFetch(rawTestsState);
  },
  promise() {
    return api => api.getRawSample();
  },
});

export const FETCH_RAW_TESTS = rawTestsFetch.types.fetch;
export const FETCH_RAW_TESTS_SUCCESS = rawTestsFetch.types.success;
export const FETCH_RAW_TESTS_FAIL = rawTestsFetch.types.fail;
export const shouldFetchRawTests = rawTestsFetch.shouldFetch;
export const fetchRawTests = rawTestsFetch.fetch;
export const fetchRawTestsIfNeeded = rawTestsFetch.fetchIfNeeded;
