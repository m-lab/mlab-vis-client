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
const hourlyFetch = createFetchAction({
  typePrefix: 'location/',
  key: 'HOURLY',
  args: ['timeAggregation', 'locationId', 'options'],
  shouldFetch(state, timeAggregation, locationId, options = {}) {
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
  },
  promise(timeAggregation, locationId, options) {
    return (api) => api.getLocationHourly(timeAggregation, locationId, options);
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
const topClientIsps = createFetchAction({
  typePrefix: 'location/',
  key: 'TOP_CLIENT_ISPS',
  args: ['locationId'],
  shouldFetch(state, locationId) {
    const locationState = state.locations[locationId];
    if (!locationState) {
      return true;
    }

    // only fetch if it isn't fetching/already fetched
    return !(locationState.topClientIsps.isFetched || locationState.topClientIsps.isFetching);
  },
  promise(locationId) {
    return api => api.getLocationTopClientIsps(locationId);
  },
});
export const FETCH_TOP_CLIENT_ISPS = topClientIsps.types.fetch;
export const FETCH_TOP_CLIENT_ISPS_SUCCESS = topClientIsps.types.success;
export const FETCH_TOP_CLIENT_ISPS_FAIL = topClientIsps.types.fail;
export const shouldFetchTopClientIsps = topClientIsps.shouldFetch;
export const fetchTopClientIsps = topClientIsps.fetch;
export const fetchTopClientIspsIfNeeded = topClientIsps.fetchIfNeeded;


// ---------------------
// Fetch Client ISP in Location Time Series
// ---------------------
const clientIspLocationTimeSeries = createFetchAction({
  typePrefix: 'location/',
  key: 'CLIENT_ISP_TIME_SERIES',
  args: ['timeAggregation', 'locationId', 'clientIspId', 'options'],
  shouldFetch(state, timeAggregation, locationId, clientIspId, options) {
    const locationState = state.locations[locationId];
    if (!locationState) {
      return true;
    }

    const clientIspState = locationState.clientIsps[clientIspId];
    if (!clientIspState) {
      return true;
    }
    const clientIspTimeState = clientIspState.time;

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
  },

  promise(timeAggregation, locationId, clientIspId, options) {
    return api => api.getLocationClientIspTimeSeries(timeAggregation, locationId, clientIspId, options);
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

    return !locationState.info.isFetched && !locationState.info.isFetching &&
     !locationState.fixed.isFetched && !locationState.fixed.isFetching;
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

// ---------------------
// Fetch Location Client ISP Info
// ---------------------
const clientIspInfo = createFetchAction({
  typePrefix: 'location/',
  key: 'CLIENT_ISP_INFO',
  args: ['locationId', 'clientIspId'],
  shouldFetch(state, locationId, clientIspId) {
    const locationState = state.locations[locationId];
    if (!locationState) {
      return true;
    }

    const clientIspState = locationState.clientIsps[clientIspId];
    if (!clientIspState) {
      return true;
    }

    return !(clientIspState.info.isFetched || clientIspState.info.isFetching ||
      clientIspState.fixed.isFetched || clientIspState.fixed.isFetching);
  },
  promise(locationId, clientIspId) {
    return api => api.getLocationClientIspInfo(locationId, clientIspId);
  },
});
export const FETCH_CLIENT_ISP_INFO = clientIspInfo.types.fetch;
export const FETCH_CLIENT_ISP_INFO_SUCCESS = clientIspInfo.types.success;
export const FETCH_CLIENT_ISP_INFO_FAIL = clientIspInfo.types.fail;
export const shouldFetchClientIspInfo = clientIspInfo.shouldFetch;
export const fetchClientIspInfo = clientIspInfo.fetch;
export const fetchClientIspInfoIfNeeded = clientIspInfo.fetchIfNeeded;
