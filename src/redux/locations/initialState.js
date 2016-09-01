
export const initialState = {};

export const initialLocationState = {
  id: 123,

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
  id: 45,

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
