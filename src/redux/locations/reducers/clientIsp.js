/**
 * Reducer for client ISP within a location
 */
import { combineReducers } from 'redux';
import * as Actions from '../actions';
import { initialClientIspState } from '../initialState';

// reducer for the time portion of a location
function timeSeries(state = initialClientIspState.time.timeSeries, action = {}) {
  switch (action.type) {
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES:
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
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES_SUCCESS:
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
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES_FAIL:
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

const time = combineReducers({ timeSeries });


// reducer for location+client ISP info
function info(state = initialClientIspState.info, action = {}) {
  switch (action.type) {
    case Actions.FETCH_CLIENT_ISP_INFO:
      return {
        data: state.data,
        isFetching: true,
        isFetched: false,
      };
    case Actions.FETCH_CLIENT_ISP_INFO_SUCCESS:
      return {
        // store the meta info directly
        data: action.result.meta,
        isFetching: false,
        isFetched: true,
      };
    case Actions.FETCH_CLIENT_ISP_INFO_FAIL:
      return {
        isFetching: false,
        isFetched: false,
        error: action.error,
      };
    default:
      return state;
  }
}

// reducer for fixed time data about a location+client ISP (e.g. last year, last week)
function fixed(state = initialClientIspState.fixed, action = {}) {
  switch (action.type) {
    case Actions.FETCH_CLIENT_ISP_INFO:
      return {
        data: state.data,
        isFetching: true,
        isFetched: false,
      };
    case Actions.FETCH_CLIENT_ISP_INFO_SUCCESS:
      return {
        // store the data directly
        data: action.result.data,
        isFetching: false,
        isFetched: true,
      };
    case Actions.FETCH_CLIENT_ISP_INFO_FAIL:
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


// Export the reducer
export default combineReducers({
  id,
  info,
  fixed,
  time,
});
