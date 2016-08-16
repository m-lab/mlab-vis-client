import { createSelector } from 'reselect';
import { parseDate } from '../../utils/utils';
/**
 * Actions
 */
const METRICS_LOAD = 'location/METRICS_LOAD';
const METRICS_LOAD_SUCCESS = 'location/METRICS_LOAD_SUCCESS';
const METRICS_LOAD_FAIL = 'location/METRICS_LOAD_FAIL';
const HOURLY_LOAD = 'location/HOURLY_LOAD';
const HOURLY_LOAD_SUCCESS = 'location/HOURLY_LOAD_SUCCESS';
const HOURLY_LOAD_FAIL = 'location/HOURLY_LOAD_FAIL';

/**
 * Reducer
 */
const initialState = {
  metricsLoaded: false,
  hourlyLoaded: false
};

/**
 * Location metrics actions
 */
export default function location(state = initialState, action = {}) {
  switch (action.type) {
    case METRICS_LOAD:
      return {
        ...state,
        metricsLoading: true,
      };
    case METRICS_LOAD_SUCCESS:
      return {
        ...state,
        metricsLoading: false,
        metricsLoaded: true,
        metricsData: action.result,
      };
    case METRICS_LOAD_FAIL:
      return {
        ...state,
        metricsLoading: false,
        metricsLoaded: false,
        error: action.error,
      };

    case HOURLY_LOAD:
      return {
        ...state,
        hourlyLoading: true,
      };
    case HOURLY_LOAD_SUCCESS:
      return {
        ...state,
        hourlyLoading: false,
        hourlyLoaded: true,
        hourlyData: action.result,
      };
    case HOURLY_LOAD_FAIL:
      return {
        ...state,
        hourlyLoading: false,
        hourlyLoaded: false,
        error: action.error,
      };
    default:
      return state;
  }
}

/**
 * Action Creators
 */
export function shouldFetchLocationMetrics(state) {
  return !(state.location && state.location.metricsLoaded &&
    state.location.hourlyLoaded);
}

export function fetchLocationMetrics() {
  return {
    types: [METRICS_LOAD, METRICS_LOAD_SUCCESS, METRICS_LOAD_FAIL],
    promise: (api) => api.getLocationMetrics('month', 'NA+US+MA+Cambridge'),
  };
}

export function fetchHourlyLocationMetrics() {

  var timePeriod = 'day';
  var locationId = 'NA+US+MA+Cambridge';
  return {
    types : [HOURLY_LOAD, HOURLY_LOAD_SUCCESS, HOURLY_LOAD_FAIL],
    promise: (api) => api.getLocationMetrics(timePeriod + '_hour', locationId)
  };
}

export function fetchLocationMetricsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchLocationMetrics(getState())) {
      dispatch(fetchLocationMetrics());
      dispatch(fetchHourlyLocationMetrics());
    }
  };
}

/**
 * Selectors
 */

/**
 * Input selector for getting location metrics
 */
function getLocationMetrics(state) {
  return state.location.metricsData;
}

function getHourlyLocationMetrics(state) {
  return state.location.hourlyData;
}

/**
 * A selector to transform API data to be usable in a time series chart.
 */
export const getLocationMetricsTimeSeriesData = createSelector(
  [getLocationMetrics],
  (locationMetrics) => {
    if (!locationMetrics || !locationMetrics.metrics) {
      return undefined;
    }

    // make the date field an actual date
    return locationMetrics.metrics.map(d =>
      Object.assign({}, d, {
        date: new Date(d.date),
      })
    );
  }
);

/**
 * A selector to transform the hourly API into an array grouped by hour.
 * @param  {function} [getHourlyLocationLetrics] input selector for data property
 * @param  {function} hourlyLocationMetrics  selector for hourly location metrics
 * @return {Array}  Array of grouped hourly data
 */
export const getHourlyLocationMetricsTimeSeriesData = createSelector(
  [getHourlyLocationMetrics],
  (hourlyLocationMetrics) => {
    if (!hourlyLocationMetrics || !hourlyLocationMetrics.metrics) {
      return undefined;
    }

    // group by hour
    let hourly = new Array(24);
    hourlyLocationMetrics.metrics.map(d => {
      let hour = parseInt(d.hour, 10);
      if (typeof(hourly[hour]) === "undefined") {
        hourly[hour] = [];
      }
      hourly[hour].push(Object.assign({}, d, {
        date_parsed : parseDate(d.date)
      }))
    });
    return hourly;
  }
);
