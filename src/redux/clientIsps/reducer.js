/**
 * Reducer for clientIsps
 */
import { combineReducers } from 'redux';
import * as Actions from './actions';

/**

clientIsps:
  clientIspId:
    clientIspId
    name

    time:
      startDate
      endDate
      timeAggregation
      timeSeries
      hourly

    fixed:
      lastWeek
      lastMonth
      lastYear
      distribution
 */

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
};


// reducer for the time portion of client ISP data
function time(state = initialClientIspState.time, action = {}) {
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
          timeAggregation: state.timeSeries.timeAggregation,
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
