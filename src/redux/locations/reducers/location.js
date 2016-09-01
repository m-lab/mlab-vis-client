/**
 * Reducer for an individual location within locations
 */
import { combineReducers } from 'redux';
import * as Actions from '../actions';
import clientIsp from './clientIsp';
import { initialLocationState } from '../initialState';

// reducer for the time series portion of a location
function timeSeries(state = initialLocationState.time.timeSeries, action = {}) {
  switch (action.type) {
    case Actions.FETCH_TIME_SERIES:
      return {
        ...state,
        timeSeries: {
          data: state.timeSeries.data,
          timeAggregation: action.timeAggregation,
          startDate: action.options.startDate,
          endDate: action.options.endDate,
          isFetching: true,
          isFetched: false,
        },
      };
    case Actions.FETCH_TIME_SERIES_SUCCESS:
      return {
        ...state,
        timeSeries: {
          data: action.result,
          timeAggregation: action.timeAggregation,
          startDate: action.options.startDate,
          endDate: action.options.endDate,
          isFetching: false,
          isFetched: true,
        },
      };
    case Actions.FETCH_TIME_SERIES_FAIL:
      return {
        ...state,
        timeSeries: {
          isFetching: false,
          isFetched: false,
          error: action.error,
        },
      };
    default:
      return state;
  }
}

function hourly(state = initialLocationState.time.hourly, action = {}) {
  switch (action.type) {
    case Actions.FETCH_HOURLY:
      return {
        ...state,
        hourly: {
          data: state.hourly.data,
          timeAggregation: action.timeAggregation,
          startDate: action.options.startDate,
          endDate: action.options.endDate,
          isFetching: true,
          isFetched: false,
        },
      };
    case Actions.FETCH_HOURLY_SUCCESS:
      return {
        ...state,
        hourly: {
          data: action.result,
          timeAggregation: action.timeAggregation,
          startDate: action.options.startDate,
          endDate: action.options.endDate,
          isFetching: false,
          isFetched: true,
        },
      };
    case Actions.FETCH_HOURLY_FAIL:
      return {
        ...state,
        hourly: {
          isFetching: false,
          isFetched: false,
          error: action.error,
        },
      };
    default:
      return state;
  }
}

const time = combineReducers({ timeSeries, hourly });


// reducer for the clientIsps portion of a location
function topClientIsps(state = initialLocationState.topClientIsps, action = {}) {
  switch (action.type) {
    case Actions.FETCH_TOP_CLIENT_ISPS:
      return {
        data: state.data,
        isFetching: true,
        isFetched: false,
      };
    case Actions.FETCH_TOP_CLIENT_ISPS_SUCCESS:
      return {
        data: action.result.results,
        isFetching: false,
        isFetched: true,
      };
    case Actions.FETCH_TOP_CLIENT_ISPS_FAIL:
      return {
        isFetching: false,
        isFetched: false,
        error: action.error,
      };
    default:
      return state;
  }
}

// reducer for location info
function info(state = initialLocationState.info, action = {}) {
  switch (action.type) {
    case Actions.FETCH_INFO:
      return {
        data: state.data,
        isFetching: true,
        isFetched: false,
      };
    case Actions.FETCH_INFO_SUCCESS:
      return {
        // store the meta info directly
        data: action.result.meta,
        isFetching: false,
        isFetched: true,
      };
    case Actions.FETCH_INFO_FAIL:
      return {
        isFetching: false,
        isFetched: false,
        error: action.error,
      };
    default:
      return state;
  }
}

// reducer for fixed time data about a location (e.g. last year, last week)
function fixed(state = initialLocationState.fixed, action = {}) {
  switch (action.type) {
    case Actions.FETCH_INFO:
      return {
        data: state.data,
        isFetching: true,
        isFetched: false,
      };
    case Actions.FETCH_INFO_SUCCESS:
      return {
        // store the data directly
        data: action.result.data,
        isFetching: false,
        isFetched: true,
      };
    case Actions.FETCH_INFO_FAIL:
      return {
        isFetching: false,
        isFetched: false,
        error: action.error,
      };
    default:
      return state;
  }
}

// reducer for the collection of client ISPs
function clientIsps(state = initialLocationState.clientIsps, action = {}) {
  console.log('client isps called', state);
  switch (action.type) {
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES:
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES_SUCCESS:
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES_FAIL:
      return {
        ...state,
        clientIsps: {
          ...state.clientIsps,
          [action.clientIspId]: clientIsp(state[action.clientIspId], action),
        },
      };
    default:
      return state;
  }
}

// reducer to get the ID
function id(state = initialLocationState.id, action = {}) {
  return action.locationId || state;
}

// Export the reducer
export default combineReducers({
  id,
  clientIsps,
  info,
  fixed,
  time,
  topClientIsps,
});
