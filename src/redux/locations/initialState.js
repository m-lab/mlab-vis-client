
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
  transitIsps: {},
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

  transitIsps: {},
};

export const initialTransitIspState = {
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
