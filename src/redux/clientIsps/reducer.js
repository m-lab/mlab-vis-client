/**
 * Reducer for clientIsps
 */
import { combineReducers } from 'redux';
import * as Actions from './actions';

const initialState = {
};

export const initialClientIspState = {
  id: null,

  info: {
    isFetching: false,
    isFetched: false,
  },

  time: {
    timeSeries: {
      isFetching: false,
      isFetched: false,
    },
    hourly: {
      isFetching: false,
      isFetched: false,
    },
  },

  transitIsps: {},
};


// reducer for the time series portion of time
function timeSeries(state = initialClientIspState.time.timeSeries, action = {}) {
  switch (action.type) {
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES:
      return {
        data: state.data,
        timeAggregation: action.timeAggregation,
        startDate: action.options.startDate,
        endDate: action.options.endDate,
        isFetching: true,
        isFetched: false,
      };
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES_SUCCESS:
      return {
        data: action.result,
        timeAggregation: action.timeAggregation,
        startDate: action.options.startDate,
        endDate: action.options.endDate,
        isFetching: false,
        isFetched: true,
      };
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES_FAIL:
      return {
        isFetching: false,
        isFetched: false,
        error: action.error,
      };
    default:
      return state;
  }
}

// reducer for the hourly portion of time
function hourly(state = initialClientIspState.time.hourly, action = {}) {
  switch (action.type) {
    case Actions.FETCH_CLIENT_ISP_HOURLY:
      return {
        data: state.data,
        timeAggregation: action.timeAggregation,
        startDate: action.options.startDate,
        endDate: action.options.endDate,
        isFetching: true,
        isFetched: false,
      };
    case Actions.FETCH_CLIENT_ISP_HOURLY_SUCCESS:
      return {
        data: action.result,
        timeAggregation: action.timeAggregation,
        startDate: action.options.startDate,
        endDate: action.options.endDate,
        isFetching: false,
        isFetched: true,
      };
    case Actions.FETCH_CLIENT_ISP_HOURLY_FAIL:
      return {
        isFetching: false,
        isFetched: false,
        error: action.error,
      };
    default:
      return state;
  }
}

const time = combineReducers({ timeSeries, hourly });

// reducer for client ISP info
function info(state = initialClientIspState.info, action = {}) {
  switch (action.type) {
    case Actions.FETCH_INFO:
      return {
        data: state.data,
        isFetching: true,
        isFetched: false,
      };
    case Actions.SAVE_CLIENT_ISP_INFO:
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


// reducer to get the ID
function id(state = initialClientIspState.id, action = {}) {
  return action.clientIspId || state;
}

const clientIsp = combineReducers({
  id,
  info,
  time,
});

// The root reducer
function clientIsps(state = initialState, action = {}) {
  const { clientIspId } = action;
  switch (action.type) {
    case Actions.SAVE_CLIENT_ISP_INFO:
    case Actions.FETCH_INFO:
    case Actions.FETCH_INFO_SUCCESS:
    case Actions.FETCH_INFO_FAIL:
    case Actions.FETCH_HOURLY:
    case Actions.FETCH_HOURLY_SUCCESS:
    case Actions.FETCH_HOURLY_FAIL:
    case Actions.FETCH_TIME_SERIES:
    case Actions.FETCH_TIME_SERIES_SUCCESS:
    case Actions.FETCH_TIME_SERIES_FAIL:
      return {
        ...state,
        [clientIspId]: clientIsp(state[clientIspId], action),
      };
    default:
      return state;
  }
}


// Export the reducer
export default clientIsps;
