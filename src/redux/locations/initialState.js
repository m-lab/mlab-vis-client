
export const initialState = {};

export const initialLocationState = {
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

  topClientIsps: {
    isFetching: false,
    isFetched: false,
  },

  fixed: {
    isFetching: false,
    isFetched: false,
  },

  clientIsps: {},
};

export const initialClientIspState = {
  id: null,

  info: {
    isFetching: false,
    isFetched: false,
  },

  fixed: {
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
