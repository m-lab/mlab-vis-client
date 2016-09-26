import { combineReducers } from 'redux';

export const initialState = {
  timeSeries: {
    isFetching: false,
    isFetched: false,
  },
  hourly: {
    isFetching: false,
    isFetched: false,
  },
};

function timeSeriesWithTypePrefix(typePrefix) {
  return function hourly(state = initialState.hourly, action) {
    switch (action.type) {
      case `${typePrefix}FETCH_TIME_SERIES`:
        return {
          data: state.data,
          timeAggregation: action.timeAggregation,
          startDate: action.options.startDate,
          endDate: action.options.endDate,
          isFetching: true,
          isFetched: false,
        };
      case `${typePrefix}FETCH_TIME_SERIES_SUCCESS`:
        return {
          data: action.result,
          timeAggregation: action.timeAggregation,
          startDate: action.options.startDate,
          endDate: action.options.endDate,
          isFetching: false,
          isFetched: true,
        };
      case `${typePrefix}FETCH_TIME_SERIES_FAIL`:
        return {
          isFetching: false,
          isFetched: false,
          error: action.error,
        };
      default:
        return state;
    }
  };
}

function hourlyWithTypePrefix(typePrefix) {
  return function hourly(state = initialState.hourly, action) {
    switch (action.type) {
      case `${typePrefix}FETCH_HOURLY`:
        return {
          data: state.data,
          timeAggregation: action.timeAggregation,
          startDate: action.options.startDate,
          endDate: action.options.endDate,
          isFetching: true,
          isFetched: false,
        };
      case `${typePrefix}FETCH_HOURLY_SUCCESS`:
        return {
          data: action.result,
          timeAggregation: action.timeAggregation,
          startDate: action.options.startDate,
          endDate: action.options.endDate,
          isFetching: false,
          isFetched: true,
        };
      case `${typePrefix}FETCH_HOURLY_FAIL`:
        return {
          isFetching: false,
          isFetched: false,
          error: action.error,
        };
      default:
        return state;
    }
  };
}


export default function timeWithTypePrefix(typePrefix) {
  return combineReducers({
    timeSeries: timeSeriesWithTypePrefix(typePrefix),
    hourly: hourlyWithTypePrefix(typePrefix),
  });
}
