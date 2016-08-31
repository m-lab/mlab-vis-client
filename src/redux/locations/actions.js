/**
 * Actions for locations
 */
import createFetchAction from '../createFetchAction';

export const FETCH_HOURLY = 'location/FETCH_HOURLY';
export const FETCH_HOURLY_SUCCESS = 'location/FETCH_HOURLY_SUCCESS';
export const FETCH_HOURLY_FAIL = 'location/FETCH_HOURLY_FAIL';
export const FETCH_CLIENT_ISPS = 'location/FETCH_CLIENT_ISPS';
export const FETCH_CLIENT_ISPS_SUCCESS = 'location/FETCH_CLIENT_ISPS_SUCCESS';
export const FETCH_CLIENT_ISPS_FAIL = 'location/FETCH_CLIENT_ISPS_FAIL';
export const FETCH_CLIENT_ISP_TIME_SERIES = 'location/FETCH_CLIENT_ISP_TIME_SERIES';
export const FETCH_CLIENT_ISP_TIME_SERIES_SUCCESS = 'location/FETCH_CLIENT_ISP_TIME_SERIES_SUCCESS';
export const FETCH_CLIENT_ISP_TIME_SERIES_FAIL = 'location/FETCH_CLIENT_ISP_TIME_SERIES_FAIL';
/**
 * Action Creators
 */

// ---------------------
// Fetch Time Series
// ---------------------
const timeSeriesFetch = createFetchAction({
  typePrefix: 'location/',
  key: 'TIME_SERIES',
  args: ['timeAggregation', 'locationId', 'options'],
  shouldFetch(state, timeAggregation, locationId, options = {}) {
    const locationState = state.locations[locationId];
    if (!locationState) {
      return true;
    }

    const timeSeriesState = locationState.time.timeSeries;

    // if we don't have this time aggregation, we should fetch it
    if (timeSeriesState.timeAggregation !== timeAggregation) {
      return true;
    }

    if (options.startDate && !options.startDate.isSame(timeSeriesState.startDate, timeAggregation)) {
      return true;
    }

    if (options.endDate && !options.endDate.isSame(timeSeriesState.endDate, timeAggregation)) {
      return true;
    }

    // only fetch if it isn't fetching/already fetched
    return !(timeSeriesState.isFetched || timeSeriesState.isFetching);
  },
  promise(timeAggregation, locationId, options) {
    return api => api.getLocationTimeSeries(timeAggregation, locationId, options);
  },
});
export const FETCH_TIME_SERIES = timeSeriesFetch.types.fetch;
export const FETCH_TIME_SERIES_SUCCESS = timeSeriesFetch.types.success;
export const FETCH_TIME_SERIES_FAIL = timeSeriesFetch.types.fail;
export const shouldFetchTimeSeries = timeSeriesFetch.shouldFetch;
export const fetchTimeSeries = timeSeriesFetch.fetch;
export const fetchTimeSeriesIfNeeded = timeSeriesFetch.fetchIfNeeded;

// ---------------------
// Fetch Hourly
// ---------------------
export function shouldFetchHourly(state, timeAggregation, locationId, options = {}) {
  const locationState = state.locations[locationId];
  if (!locationState) {
    return true;
  }

  const locationHourState = locationState.time.hourly;

  // if we don't have this time aggregation, we should fetch it
  if (locationHourState.timeAggregation !== timeAggregation) {
    return true;
  }


  if (options.startDate && !options.startDate.isSame(locationHourState.startDate, timeAggregation)) {
    return true;
  }

  if (options.endDate && !options.endDate.isSame(locationHourState.endDate, timeAggregation)) {
    return true;
  }

  // only fetch if it isn't fetching/already fetched
  return !(locationState.time.hourly.isFetched || locationState.time.hourly.isFetching);
}

export function fetchHourly(timeAggregation, locationId, options = {}) {
  return {
    types: [FETCH_HOURLY, FETCH_HOURLY_SUCCESS, FETCH_HOURLY_FAIL],
    promise: (api) => api.getLocationHourly(timeAggregation, locationId),
    locationId,
    timeAggregation,
    options,
  };
}

export function fetchHourlyIfNeeded(timeAggregation, locationId, options = {}) {
  return (dispatch, getState) => {
    if (shouldFetchHourly(getState(), timeAggregation, locationId, options)) {
      dispatch(fetchHourly(timeAggregation, locationId, options));
    }
  };
}


// ---------------------
// Fetch Client ISPs in location
// ---------------------
export function shouldFetchClientIsps(state, locationId) {
  const locationState = state.locations[locationId];
  if (!locationState) {
    return true;
  }

  // only fetch if it isn't fetching/already fetched
  return !(locationState.clientIsps.isFetched || locationState.clientIsps.isFetching);
}

export function fetchClientIsps(locationId) {
  return {
    types: [FETCH_CLIENT_ISPS, FETCH_CLIENT_ISPS_SUCCESS, FETCH_CLIENT_ISPS_FAIL],
    promise: (api) => api.getLocationClientIsps(locationId),
    locationId,
  };
}

export function fetchClientIspsIfNeeded(locationId) {
  return (dispatch, getState) => {
    if (shouldFetchClientIsps(getState(), locationId)) {
      dispatch(fetchClientIsps(locationId));
    }
  };
}


// ---------------------
// Fetch Client ISP in Location Time Series
// ---------------------
export function shouldFetchClientIspLocationTimeSeries(state, timeAggregation, locationId, clientIspId, options = {}) {
  const locationState = state.locations[locationId];
  if (!locationState) {
    return true;
  }

  const clientIspTimeState = locationState.time.clientIsps[clientIspId];
  if (!clientIspTimeState) {
    return true;
  }

  // if we don't have this time aggregation, we should fetch it
  if (clientIspTimeState.timeSeries.timeAggregation !== timeAggregation) {
    return true;
  }

  if (options.startDate && !options.startDate.isSame(clientIspTimeState.timeSeries.startDate, timeAggregation)) {
    return true;
  }

  if (options.endDate && !options.endDate.isSame(clientIspTimeState.timeSeries.endDate, timeAggregation)) {
    return true;
  }

  // only fetch if it isn't fetching/already fetched
  return !(clientIspTimeState.timeSeries.isFetched ||
    clientIspTimeState.timeSeries.isFetching);
}

export function fetchClientIspLocationTimeSeries(timeAggregation, locationId, clientIspId, options = {}) {
  return {
    types: [FETCH_CLIENT_ISP_TIME_SERIES, FETCH_CLIENT_ISP_TIME_SERIES_SUCCESS,
      FETCH_CLIENT_ISP_TIME_SERIES_FAIL],
    promise: (api) => api.getLocationClientIspTimeSeries(timeAggregation, locationId, clientIspId, options),
    clientIspId,
    locationId,
    timeAggregation,
    options,
  };
}

export function fetchClientIspLocationTimeSeriesIfNeeded(timeAggregation, locationId, clientIspId, options = {}) {
  return (dispatch, getState) => {
    if (shouldFetchClientIspLocationTimeSeries(getState(), timeAggregation, locationId, clientIspId, options)) {
      dispatch(fetchClientIspLocationTimeSeries(timeAggregation, locationId, clientIspId, options));
    }
  };
}


// ---------------------
// Fetch Location Info
// ---------------------
const infoFetch = createFetchAction({
  typePrefix: 'location/',
  key: 'INFO',
  args: ['locationId'],
  shouldFetch(state, locationId) {
    const locationState = state.locations[locationId];
    if (!locationState) {
      return true;
    }

    return !(locationState.info.isFetched || locationState.info.isFetching);
  },
  promise(locationId) {
    return api => api.getLocationInfo(locationId);
  },
});
export const FETCH_INFO = infoFetch.types.fetch;
export const FETCH_INFO_SUCCESS = infoFetch.types.success;
export const FETCH_INFO_FAIL = infoFetch.types.fail;
export const shouldFetchInfo = infoFetch.shouldFetch;
export const fetchInfo = infoFetch.fetch;
export const fetchInfoIfNeeded = infoFetch.fetchIfNeeded;
