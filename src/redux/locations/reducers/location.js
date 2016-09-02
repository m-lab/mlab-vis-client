/**
 * Reducer for an individual location within locations
 */
import { combineReducers } from 'redux';
import * as Actions from '../actions';
import clientIsp from './clientIsp';
import { initialLocationState, initialClientIspState } from '../initialState';

// reducer for the time series portion of a location
function timeSeries(state = initialLocationState.time.timeSeries, action = {}) {
  switch (action.type) {
    case Actions.FETCH_TIME_SERIES:
      return {
        data: state.data,
        timeAggregation: action.timeAggregation,
        startDate: action.options.startDate,
        endDate: action.options.endDate,
        isFetching: true,
        isFetched: false,
      };
    case Actions.FETCH_TIME_SERIES_SUCCESS:
      return {
        data: action.result,
        timeAggregation: action.timeAggregation,
        startDate: action.options.startDate,
        endDate: action.options.endDate,
        isFetching: false,
        isFetched: true,
      };
    case Actions.FETCH_TIME_SERIES_FAIL:
      return {
        isFetching: false,
        isFetched: false,
        error: action.error,
      };
    default:
      return state;
  }
}

function hourly(state = initialLocationState.time.hourly, action = {}) {
  switch (action.type) {
    case Actions.FETCH_HOURLY:
      return {
        data: state.data,
        timeAggregation: action.timeAggregation,
        startDate: action.options.startDate,
        endDate: action.options.endDate,
        isFetching: true,
        isFetched: false,
      };
    case Actions.FETCH_HOURLY_SUCCESS:
      return {
        data: action.result,
        timeAggregation: action.timeAggregation,
        startDate: action.options.startDate,
        endDate: action.options.endDate,
        isFetching: false,
        isFetched: true,
      };
    case Actions.FETCH_HOURLY_FAIL:
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
  switch (action.type) {
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES:
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES_SUCCESS:
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES_FAIL:
    case Actions.FETCH_CLIENT_ISP_INFO:
    case Actions.FETCH_CLIENT_ISP_INFO_SUCCESS:
    case Actions.FETCH_CLIENT_ISP_INFO_FAIL:
      return {
        ...state,
        [action.clientIspId]: clientIsp(state[action.clientIspId], action),
      };
    // when top ISPs come, merge them into info if they aren't already in there.
    case Actions.FETCH_TOP_CLIENT_ISPS_SUCCESS: {
      const topIsps = action.result.results;
      let result = state;
      // for each top ISP, see if we need to merge in info
      topIsps.forEach(topIsp => {
        const id = topIsp.client_asn_number;
        let clientIspState = state[id];
        // if we don't have state for this client ISP yet, initialize to the default + id
        if (!clientIspState) {
          clientIspState = {
            ...initialClientIspState,
            id,
          };
        }

        // if we don't have info for this client ISP, use the top client ISP data
        if (!clientIspState.info.isFetched) {
          clientIspState = {
            ...clientIspState,
            info: {
              ...clientIspState.info,
              data: topIsp,
              isFetched: true,
            },
          };

          // update the result to have the new info data
          result = {
            ...result,
            [id]: clientIspState,
          };
        }
      });

      return result;
    }
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
