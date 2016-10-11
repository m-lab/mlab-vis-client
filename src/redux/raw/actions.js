
import createFetchAction from '../createFetchAction';
import { shouldFetch } from '../shared/shouldFetch';

// ---------------------
// Fetch Raw Tests
// ---------------------
const rawTestsFetch = createFetchAction({
  typePrefix: 'raw/',
  key: 'RAW',
  args: [],
  shouldFetch(state) {
    const rawTestsState = state.raw;
    return shouldFetch(rawTestsState);
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
