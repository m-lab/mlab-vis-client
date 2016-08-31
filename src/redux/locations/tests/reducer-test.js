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
  FETCH_INFO,
  FETCH_INFO_SUCCESS,
  FETCH_INFO_FAIL,
} from '../actions';
import reducer, { initialLocationState, initialClientIspTimeState } from '../reducer';

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

      it(FETCH_TIME_SERIES_SUCCESS, () => {
        const result = reducer({}, {
          type: FETCH_TIME_SERIES_SUCCESS,
          result: 'data!',
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
                data: 'data!',
                timeAggregation: 'day',
                isFetching: false,
                isFetched: true,
              },
            },
          },
        };

        expect(result).to.deep.equal(expectedOutput);
      });

      it(FETCH_TIME_SERIES_FAIL, () => {
        const result = reducer({}, {
          type: FETCH_TIME_SERIES_FAIL,
          error: 'error!',
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
                error: 'error!',
                isFetching: false,
                isFetched: false,
              },
            },
          },
        };

        expect(result).to.deep.equal(expectedOutput);
      });


      // -------------------------------------------------------------------------------------
      it(FETCH_HOURLY, () => {
        const result = reducer({}, {
          type: FETCH_HOURLY,
          locationId: 'myLocation',
          timeAggregation: 'day',
        });

        const expectedOutput = {
          myLocation: {
            ...initialLocationState,
            locationId: 'myLocation',
            time: {
              ...initialLocationState.time,
              hourly: {
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

      it(FETCH_HOURLY_SUCCESS, () => {
        const result = reducer({}, {
          type: FETCH_HOURLY_SUCCESS,
          result: 'data!',
          locationId: 'myLocation',
          timeAggregation: 'day',
        });

        const expectedOutput = {
          myLocation: {
            ...initialLocationState,
            locationId: 'myLocation',
            time: {
              ...initialLocationState.time,
              hourly: {
                data: 'data!',
                timeAggregation: 'day',
                isFetching: false,
                isFetched: true,
              },
            },
          },
        };

        expect(result).to.deep.equal(expectedOutput);
      });

      it(FETCH_HOURLY_FAIL, () => {
        const result = reducer({}, {
          type: FETCH_HOURLY_FAIL,
          error: 'error!',
          locationId: 'myLocation',
          timeAggregation: 'day',
        });

        const expectedOutput = {
          myLocation: {
            ...initialLocationState,
            locationId: 'myLocation',
            time: {
              ...initialLocationState.time,
              hourly: {
                error: 'error!',
                isFetching: false,
                isFetched: false,
              },
            },
          },
        };

        expect(result).to.deep.equal(expectedOutput);
      });


      // -------------------------------------------------------------------------------------
      it(FETCH_CLIENT_ISP_TIME_SERIES, () => {
        const result = reducer({}, {
          type: FETCH_CLIENT_ISP_TIME_SERIES,
          clientIspId: 'myClientIsp',
          locationId: 'myLocation',
          timeAggregation: 'day',
        });

        const expectedOutput = {
          myLocation: {
            ...initialLocationState,
            locationId: 'myLocation',
            time: {
              ...initialLocationState.time,
              clientIsps: {
                myClientIsp: {
                  ...initialClientIspTimeState,
                  timeSeries: {
                    data: undefined,
                    timeAggregation: 'day',
                    isFetching: true,
                    isFetched: false,
                  },
                },
              },
            },
          },
        };

        expect(result).to.deep.equal(expectedOutput);
      });

      it(FETCH_CLIENT_ISP_TIME_SERIES_SUCCESS, () => {
        const result = reducer({}, {
          type: FETCH_CLIENT_ISP_TIME_SERIES_SUCCESS,
          result: 'data!',
          clientIspId: 'myClientIsp',
          locationId: 'myLocation',
          timeAggregation: 'day',
        });

        const expectedOutput = {
          myLocation: {
            ...initialLocationState,
            locationId: 'myLocation',
            time: {
              ...initialLocationState.time,
              clientIsps: {
                myClientIsp: {
                  ...initialClientIspTimeState,
                  timeSeries: {
                    data: 'data!',
                    timeAggregation: 'day',
                    isFetching: false,
                    isFetched: true,
                  },
                },
              },
            },
          },
        };

        expect(result).to.deep.equal(expectedOutput);
      });

      it(FETCH_CLIENT_ISP_TIME_SERIES_FAIL, () => {
        const result = reducer({}, {
          type: FETCH_CLIENT_ISP_TIME_SERIES_FAIL,
          error: 'error!',
          clientIspId: 'myClientIsp',
          locationId: 'myLocation',
          timeAggregation: 'day',
        });

        const expectedOutput = {
          myLocation: {
            ...initialLocationState,
            locationId: 'myLocation',
            time: {
              ...initialLocationState.time,
              clientIsps: {
                myClientIsp: {
                  ...initialClientIspTimeState,
                  timeSeries: {
                    error: 'error!',
                    isFetching: false,
                    isFetched: false,
                  },
                },
              },
            },
          },
        };

        expect(result).to.deep.equal(expectedOutput);
      });

      // -------------------------------------------------------------------------------------
      it(FETCH_CLIENT_ISPS, () => {
        const result = reducer({}, {
          type: FETCH_CLIENT_ISPS,
          locationId: 'myLocation',
        });

        const expectedOutput = {
          myLocation: {
            ...initialLocationState,
            locationId: 'myLocation',
            clientIsps: {
              data: undefined,
              isFetching: true,
              isFetched: false,
            },
          },
        };

        expect(result.myLocation.clientIsps).to.deep.equal(expectedOutput.myLocation.clientIsps);
        expect(result).to.deep.equal(expectedOutput);
      });

      it(FETCH_CLIENT_ISPS_SUCCESS, () => {
        const result = reducer({}, {
          type: FETCH_CLIENT_ISPS_SUCCESS,
          result: { results: 'data!' },
          locationId: 'myLocation',
        });

        const expectedOutput = {
          myLocation: {
            ...initialLocationState,
            locationId: 'myLocation',
            clientIsps: {
              data: 'data!',
              isFetching: false,
              isFetched: true,
            },
          },
        };

        expect(result.myLocation.clientIsps).to.deep.equal(expectedOutput.myLocation.clientIsps);
        expect(result).to.deep.equal(expectedOutput);
      });

      it(FETCH_CLIENT_ISPS_FAIL, () => {
        const result = reducer({}, {
          type: FETCH_CLIENT_ISPS_FAIL,
          error: 'error!',
          locationId: 'myLocation',
        });

        const expectedOutput = {
          myLocation: {
            ...initialLocationState,
            locationId: 'myLocation',
            clientIsps: {
              error: 'error!',
              isFetching: false,
              isFetched: false,
            },
          },
        };

        expect(result).to.deep.equal(expectedOutput);
      });


      // -------------------------------------------------------------------------------------
      it(FETCH_INFO, () => {
        const result = reducer({}, {
          type: FETCH_INFO,
          locationId: 'myLocation',
        });

        const expectedOutput = {
          myLocation: {
            ...initialLocationState,
            locationId: 'myLocation',
            info: {
              data: undefined,
              isFetching: true,
              isFetched: false,
            },
            fixed: {
              data: undefined,
              isFetching: true,
              isFetched: false,
            },
          },
        };

        expect(result.myLocation.info).to.deep.equal(expectedOutput.myLocation.info);
        expect(result.myLocation.fixed).to.deep.equal(expectedOutput.myLocation.fixed);
        expect(result).to.deep.equal(expectedOutput);
      });

      it(FETCH_INFO_SUCCESS, () => {
        const result = reducer({}, {
          type: FETCH_INFO_SUCCESS,
          result: { meta: 'info', data: 'fixed-data' },
          locationId: 'myLocation',
        });

        const expectedOutput = {
          myLocation: {
            ...initialLocationState,
            locationId: 'myLocation',
            info: {
              data: 'info',
              isFetching: false,
              isFetched: true,
            },
            fixed: {
              data: 'fixed-data',
              isFetching: false,
              isFetched: true,
            },
          },
        };

        expect(result.myLocation.info).to.deep.equal(expectedOutput.myLocation.info);
        expect(result.myLocation.fixed).to.deep.equal(expectedOutput.myLocation.fixed);
        expect(result).to.deep.equal(expectedOutput);
      });

      it(FETCH_INFO_FAIL, () => {
        const result = reducer({}, {
          type: FETCH_INFO_FAIL,
          error: 'error!',
          locationId: 'myLocation',
        });

        const expectedOutput = {
          myLocation: {
            ...initialLocationState,
            locationId: 'myLocation',
            info: {
              error: 'error!',
              isFetching: false,
              isFetched: false,
            },
            fixed: {
              error: 'error!',
              isFetching: false,
              isFetched: false,
            },
          },
        };

        expect(result.myLocation.info).to.deep.equal(expectedOutput.myLocation.info);
        expect(result.myLocation.fixed).to.deep.equal(expectedOutput.myLocation.fixed);
        expect(result).to.deep.equal(expectedOutput);
      });
    }); // reducer
  });
});
