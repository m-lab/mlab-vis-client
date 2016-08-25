/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import {
  FETCH_TIME_SERIES,
  FETCH_TIME_SERIES_SUCCESS,
  FETCH_TIME_SERIES_FAIL,
  FETCH_HOURLY,
  FETCH_HOURLY_SUCCESS,
  FETCH_HOURLY_FAIL,
  FETCH_CLIENT_ISPS,
  FETCH_CLIENT_ISPS_SUCCESS,
  FETCH_CLIENT_ISPS_FAIL,
  FETCH_CLIENT_ISP_TIME_SERIES,
  FETCH_CLIENT_ISP_TIME_SERIES_SUCCESS,
  FETCH_CLIENT_ISP_TIME_SERIES_FAIL,
} from '../actions';
import reducer, { initialLocationState } from '../reducer';

describe('redux', () => {
  describe('locations', () => {
    describe('reducer', () => {
      // -------------------------------------------------------------------------------------
      it(FETCH_TIME_SERIES, () => {
        const result = reducer({}, {
          type: FETCH_TIME_SERIES,
          locationId: 'myLocation',
          timeAggregation: 'day',
        });

        const expectedOutput = {
          myLocation: {
            ...initialLocationState,
            locationId: 'myLocation',
            time: {
              ...initialLocationState.time,
              timeSeries: {
                data: undefined,
                timeAggregation: 'day',
                isFetching: true,
                isFetched: false,
              },
            },
          },
        };

        expect(result).to.deep.equal(expectedOutput);
      });
    }); // reducer
  });
});
