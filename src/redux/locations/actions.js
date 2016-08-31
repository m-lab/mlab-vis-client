/**
 * Actions for locations
 */
import createFetchAction from '../createFetchAction';

/**
 * Action Creators
 */

// ---------------------
// Fetch Time Series
// ---------------------
const timeSeriesFetch = createFetchAction({
  typePrefix: 'location/',
  key: 'TIME_SERIES',
  args: ['timeAggregation', 'locationId'],
  shouldFetch(state, timeAggregation, locationId) {
    const locationState = state.locations[locationId];
    if (!locationState) {
      return true;
    }

    // if we don't have this time aggregation, we should fetch it
    if (locationState.time.timeSeries.timeAggregation !== timeAggregation) {
      return true;
    }

    // only fetch if it isn't fetching/already fetched
    return !(locationState.time.timeSeries.isFetched || locationState.time.timeSeries.isFetching);
  },
  promise(timeAggregation, locationId) {
    return api => api.getLocationTimeSeries(timeAggregation, locationId);
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
const hourlyFetch = createFetchAction({
  typePrefix: 'location/',
  key: 'HOURLY',
  args: ['timeAggregation', 'locationId'],
  shouldFetch(state, timeAggregation, locationId) {
    const locationState = state.locations[locationId];
    if (!locationState) {
      return true;
    }

    // if we don't have this time aggregation, we should fetch it
    if (locationState.time.hourly.timeAggregation !== timeAggregation) {
      return true;
    }

    // only fetch if it isn't fetching/already fetched
    return !(locationState.time.hourly.isFetched || locationState.time.hourly.isFetching);
  },
  promise(timeAggregation, locationId) {
    return api => api.getLocationHourly(timeAggregation, locationId);
  },
});
export const FETCH_HOURLY = hourlyFetch.types.fetch;
export const FETCH_HOURLY_SUCCESS = hourlyFetch.types.success;
export const FETCH_HOURLY_FAIL = hourlyFetch.types.fail;
export const shouldFetchHourly = hourlyFetch.shouldFetch;
export const fetchHourly = hourlyFetch.fetch;
export const fetchHourlyIfNeeded = hourlyFetch.fetchIfNeeded;

// ---------------------
// Fetch Client ISPs in location
// ---------------------
const clientIsps = createFetchAction({
  typePrefix: 'location/',
  key: 'CLIENT_ISPS',
  args: ['locationId'],
  shouldFetch(state, locationId) {
    const locationState = state.locations[locationId];
    if (!locationState) {
      return true;
    }

    // only fetch if it isn't fetching/already fetched
    return !(locationState.clientIsps.isFetched || locationState.clientIsps.isFetching);
  },
  promise(locationId) {
    return api => api.getLocationClientIsps(locationId);
  },
});
export const FETCH_CLIENT_ISPS = clientIsps.types.fetch;
export const FETCH_CLIENT_ISPS_SUCCESS = clientIsps.types.success;
export const FETCH_CLIENT_ISPS_FAIL = clientIsps.types.fail;
export const shouldFetchClientIsps = clientIsps.shouldFetch;
export const fetchClientIsps = clientIsps.fetch;
export const fetchClientIspsIfNeeded = clientIsps.fetchIfNeeded;


// ---------------------
// Fetch Client ISP in Location Time Series
// ---------------------
const clientIspLocationTimeSeries = createFetchAction({
  typePrefix: 'location/',
  key: 'CLIENT_ISP_TIME_SERIES',
  args: ['timeAggregation', 'locationId', 'clientIspId'],
  shouldFetch(state, timeAggregation, locationId, clientIspId) {
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

    // only fetch if it isn't fetching/already fetched
    return !(clientIspTimeState.timeSeries.isFetched ||
      clientIspTimeState.timeSeries.isFetching);
  },
  promise(timeAggregation, locationId, clientIspId) {
    return api => api.getLocationClientIspTimeSeries(timeAggregation, locationId, clientIspId);
  },
});
export const FETCH_CLIENT_ISP_TIME_SERIES = clientIspLocationTimeSeries.types.fetch;
export const FETCH_CLIENT_ISP_TIME_SERIES_SUCCESS = clientIspLocationTimeSeries.types.success;
export const FETCH_CLIENT_ISP_TIME_SERIES_FAIL = clientIspLocationTimeSeries.types.fail;
export const shouldFetchClientIspLocationTimeSeries = clientIspLocationTimeSeries.shouldFetch;
export const fetchClientIspLocationTimeSeries = clientIspLocationTimeSeries.fetch;
export const fetchClientIspLocationTimeSeriesIfNeeded = clientIspLocationTimeSeries.fetchIfNeeded;


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

