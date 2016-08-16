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

    fixed:
      lastWeek
      lastMonth
      lastYear
      distribution
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
  },

  fixed: {
    isFetching: false,
    isFetched: false,
  },
};

// reducer for the time portion of a location
function locationTime(state = initialLocationState.time, action = {}) {
  switch (action.type) {
    case Actions.FETCH_TIME_SERIES:
      return {
        ...state,
        timeSeries: {
          data: state.timeSeries.data,
          isFetching: true,
          isFetched: false,
        },
      };
    case Actions.FETCH_TIME_SERIES_SUCCESS:
      return {
        ...state,
        timeSeries: {
          data: action.result,
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
          isFetching: true,
          isFetched: false,
        },
      };
    case Actions.FETCH_HOURLY_SUCCESS:
      return {
        ...state,
        hourly: {
          data: action.result,
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


// reducer for each location
function location(state = initialLocationState, action = {}) {
  switch (action.type) {
    case Actions.FETCH_TIME_SERIES:
    case Actions.FETCH_TIME_SERIES_SUCCESS:
    case Actions.FETCH_TIME_SERIES_FAIL:
    case Actions.FETCH_HOURLY:
    case Actions.FETCH_HOURLY_SUCCESS:
    case Actions.FETCH_HOURLY_FAIL:
      return {
        ...state,
        time: locationTime(state.time, action),
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
