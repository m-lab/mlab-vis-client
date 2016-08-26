/**
 * Reducer for locations
 */
import * as Actions from './actions';

/**
locations:
  locationId:
    locationId
    name
    parentLocations

    time:
      startDate
      endDate
      timeAggregation
      timeSeries
      hourly

      clientIsps:
        clientIspId:
          timeSeries
          hourly

    fixed:
      lastWeek
      lastMonth
      lastYear
      distribution

    clientIsps - array of client ISPs in the location

 */

/**
 * Reducer
 */
const initialState = {
};

export const initialLocationState = {
  time: {
    timeSeries: {
      isFetching: false,
      isFetched: false,
    },
    hourly: {
      isFetching: false,
      isFetched: false,
    },

    clientIsps: {},
  },

  clientIsps: {
    isFetching: false,
    isFetched: false,
  },
};

export const initialClientIspTimeState = {
  timeSeries: {
    isFetching: false,
    isFetched: false,
  },
  hourly: {
    isFetching: false,
    isFetched: false,
  },
};


// reducer for the time portion of a location+client ISP pairing
function clientIspTime(state = initialClientIspTimeState, action = {}) {
  switch (action.type) {
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES:
      return {
        ...state,
        timeSeries: {
          data: state.timeSeries.data,
          timeAggregation: action.timeAggregation,
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


// reducer for the time portion of a location
function locationTime(state = initialLocationState.time, action = {}) {
  switch (action.type) {
    case Actions.FETCH_TIME_SERIES:
      return {
        ...state,
        timeSeries: {
          data: state.timeSeries.data,
          timeAggregation: action.timeAggregation,
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
    case Actions.FETCH_HOURLY:
      return {
        ...state,
        hourly: {
          data: state.hourly.data,
          timeAggregation: action.timeAggregation,
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
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES:
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES_SUCCESS:
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES_FAIL:
      return {
        ...state,
        clientIsps: {
          ...state.clientIsps,
          [action.clientIspId]: clientIspTime(state.clientIsps[action.clientIspId], action),
        },
      };
    default:
      return state;
  }
}


// reducer for the clientIsps portion of a location
function locationClientIsps(state = initialLocationState.clientIsps, action = {}) {
  switch (action.type) {
    case Actions.FETCH_CLIENT_ISPS:
      return {
        data: state.data,
        isFetching: true,
        isFetched: false,
      };
    case Actions.FETCH_CLIENT_ISPS_SUCCESS:
      return {
        data: action.result.results,
        isFetching: false,
        isFetched: true,
      };
    case Actions.FETCH_CLIENT_ISPS_FAIL:
      return {
        isFetching: false,
        isFetched: false,
        error: action.error,
      };
    default:
      return state;
  }
}

// reducer for each location
function location(state, action = {}) {
  if (!state) {
    state = Object.assign({
      locationId: action.locationId,
    }, initialLocationState);
  }

  switch (action.type) {
    case Actions.FETCH_TIME_SERIES:
    case Actions.FETCH_TIME_SERIES_SUCCESS:
    case Actions.FETCH_TIME_SERIES_FAIL:
    case Actions.FETCH_HOURLY:
    case Actions.FETCH_HOURLY_SUCCESS:
    case Actions.FETCH_HOURLY_FAIL:
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES:
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES_SUCCESS:
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES_FAIL:
      return {
        ...state,
        time: locationTime(state.time, action),
      };
    case Actions.FETCH_CLIENT_ISPS:
    case Actions.FETCH_CLIENT_ISPS_SUCCESS:
    case Actions.FETCH_CLIENT_ISPS_FAIL:
      return {
        ...state,
        clientIsps: locationClientIsps(state.clientIsps, action),
      };
    default:
      return state;
  }
}

// The root reducer
function locations(state = initialState, action = {}) {
  const { locationId } = action;
  switch (action.type) {
    case Actions.FETCH_TIME_SERIES:
    case Actions.FETCH_TIME_SERIES_SUCCESS:
    case Actions.FETCH_TIME_SERIES_FAIL:
    case Actions.FETCH_HOURLY:
    case Actions.FETCH_HOURLY_SUCCESS:
    case Actions.FETCH_HOURLY_FAIL:
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES:
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES_SUCCESS:
    case Actions.FETCH_CLIENT_ISP_TIME_SERIES_FAIL:
    case Actions.FETCH_CLIENT_ISPS:
    case Actions.FETCH_CLIENT_ISPS_SUCCESS:
    case Actions.FETCH_CLIENT_ISPS_FAIL:
      return {
        ...state,
        [locationId]: location(state[locationId], action),
      };
    default:
      return state;
  }
}


// Export the reducer
export default locations;
