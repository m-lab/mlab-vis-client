import { initialState as initialInfoState } from '../shared/infoWithTypePrefix';
import { initialState as initialFixedState } from '../shared/fixedWithTypePrefix';
import { initialState as initialTimeState } from '../shared/timeWithTypePrefix';

export const initialState = {};

export const initialLocationState = {
  id: null,

  info: initialInfoState,
  time: initialTimeState,
  fixed: initialFixedState,

  topClientIsps: {
    isFetching: false,
    isFetched: false,
  },

  clientIsps: {},
  transitIsps: {},
};

export const initialClientIspState = {
  id: null,

  info: initialInfoState,
  time: initialTimeState,
  fixed: initialFixedState,

  transitIsps: {},
};

export const initialTransitIspState = {
  id: null,

  info: initialInfoState,
  time: initialTimeState,
  fixed: initialFixedState,
};
