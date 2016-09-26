export function shouldFetch(state) {
  return !(state.isFetched || state.isFetching);
}

export function keyShouldFetch(state, key) {
  if (!state) {
    return true;
  }

  return shouldFetch(state[key]);
}

export function infoShouldFetch(state) {
  return keyShouldFetch(state, 'info');
}

export function fixedShouldFetch(state) {
  return keyShouldFetch(state, 'fixed');
}

export function timeShouldFetch(state, timeAggregation, options) {
  if (!state) {
    return true;
  }

  // if we don't have this time aggregation, we should fetch it
  if (state.timeAggregation !== timeAggregation) {
    return true;
  }

  if (options.startDate && !options.startDate.isSame(state.startDate, timeAggregation)) {
    return true;
  }

  if (options.endDate && !options.endDate.isSame(state.endDate, timeAggregation)) {
    return true;
  }

  // only fetch if it isn't fetching/already fetched
  return shouldFetch(state);
}

export function timeSeriesShouldFetch(state, timeAggregation, options) {
  return timeShouldFetch(state && state.time.timeSeries, timeAggregation, options);
}

export function hourlyShouldFetch(state, timeAggregation, options) {
  return timeShouldFetch(state && state.time.hourly, timeAggregation, options);
}
