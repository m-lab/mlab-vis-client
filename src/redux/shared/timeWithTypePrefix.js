import { combineReducers } from 'redux';
import { makeFetchState, reduceFetch, reduceFetchSuccess, reduceFetchFail } from './fetch';

export const initialState = {
  timeSeries: makeFetchState(),
  hourly: makeFetchState(),
};

function timeSeriesWithTypePrefix(typePrefix) {
  return function hourly(state = initialState.hourly, action) {
    switch (action.type) {
      case `${typePrefix}FETCH_TIME_SERIES`:
        return reduceFetch({
          data: state.data,
          timeAggregation: action.timeAggregation,
          startDate: action.options.startDate,
          endDate: action.options.endDate,
        });
      case `${typePrefix}FETCH_TIME_SERIES_SUCCESS`:
        return reduceFetchSuccess({
          data: action.result,
          timeAggregation: action.timeAggregation,
          startDate: action.options.startDate,
          endDate: action.options.endDate,
        });
      case `${typePrefix}FETCH_TIME_SERIES_FAIL`:
        return reduceFetchFail({ error: action.error });
      default:
        return state;
    }
  };
}

function hourlyWithTypePrefix(typePrefix) {
  return function hourly(state = initialState.hourly, action) {
    switch (action.type) {
      case `${typePrefix}FETCH_HOURLY`:
        return reduceFetch({
          data: state.data,
          timeAggregation: action.timeAggregation,
          startDate: action.options.startDate,
          endDate: action.options.endDate,
        });
      case `${typePrefix}FETCH_HOURLY_SUCCESS`:
        return reduceFetchSuccess({
          data: action.result,
          timeAggregation: action.timeAggregation,
          startDate: action.options.startDate,
          endDate: action.options.endDate,
        });
      case `${typePrefix}FETCH_HOURLY_FAIL`:
        return reduceFetchFail({ error: action.error });
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
