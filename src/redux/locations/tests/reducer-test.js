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
  FETCH_TOP_CLIENT_ISPS,
  FETCH_TOP_CLIENT_ISPS_SUCCESS,
  FETCH_TOP_CLIENT_ISPS_FAIL,
  FETCH_CLIENT_ISP_TIME_SERIES,
  FETCH_CLIENT_ISP_TIME_SERIES_SUCCESS,
  FETCH_CLIENT_ISP_TIME_SERIES_FAIL,
  FETCH_INFO,
  FETCH_INFO_SUCCESS,
  FETCH_INFO_FAIL,
} from '../actions';
import reducer from '../reducer';
import { initialLocationState, initialClientIspState } from '../initialState';

describe('redux', () => {
  describe('locations', () => {
    describe('reducer', () => {
      // -------------------------------------------------------------------------------------
      it(FETCH_TIME_SERIES, () => {
        const result = reducer({}, {
          type: FETCH_TIME_SERIES,
          locationId: 'myLocation',
          timeAggregation: 'day',
          options: { startDate: '1', endDate: '2' },
        });

        const expectedOutput = {
          myLocation: {
            ...initialLocationState,
            id: 'myLocation',
            time: {
              ...initialLocationState.time,
              timeSeries: {
                data: undefined,
                timeAggregation: 'day',
                isFetching: true,
                isFetched: false,
                startDate: '1',
                endDate: '2',
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
          options: { startDate: '1', endDate: '2' },
        });

        const expectedOutput = {
          myLocation: {
            ...initialLocationState,
            id: 'myLocation',
            time: {
              ...initialLocationState.time,
              timeSeries: {
                data: 'data!',
                timeAggregation: 'day',
                isFetching: false,
                isFetched: true,
                startDate: '1',
                endDate: '2',
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
            id: 'myLocation',
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
          options: { startDate: '1', endDate: '2' },
        });

        const expectedOutput = {
          myLocation: {
            ...initialLocationState,
            id: 'myLocation',
            time: {
              ...initialLocationState.time,
              hourly: {
                data: undefined,
                timeAggregation: 'day',
                isFetching: true,
                isFetched: false,
                startDate: '1',
                endDate: '2',
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
          options: { startDate: '1', endDate: '2' },
        });

        const expectedOutput = {
          myLocation: {
            ...initialLocationState,
            id: 'myLocation',
            time: {
              ...initialLocationState.time,
              hourly: {
                data: 'data!',
                timeAggregation: 'day',
                isFetching: false,
                isFetched: true,
                startDate: '1',
                endDate: '2',
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
            id: 'myLocation',
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
          options: { startDate: '1', endDate: '2' },
        });

        const expectedOutput = {
          myLocation: {
            ...initialLocationState,
            id: 'myLocation',
            clientIsps: {
              myClientIsp: {
                ...initialClientIspState,
                id: 'myClientIsp',
                time: {
                  ...initialClientIspState.time,
                  timeSeries: {
                    data: undefined,
                    timeAggregation: 'day',
                    isFetching: true,
                    isFetched: false,
                    startDate: '1',
                    endDate: '2',
                  },
                },
              },
            },
          },
        };

        expect(result.myLocation.clientIsps.myClientIsp).to.deep.equal(
          expectedOutput.myLocation.clientIsps.myClientIsp);
        expect(result).to.deep.equal(expectedOutput);
      });

      it(FETCH_CLIENT_ISP_TIME_SERIES_SUCCESS, () => {
        const result = reducer({}, {
          type: FETCH_CLIENT_ISP_TIME_SERIES_SUCCESS,
          result: 'data!',
          clientIspId: 'myClientIsp',
          locationId: 'myLocation',
          timeAggregation: 'day',
          options: { startDate: '1', endDate: '2' },
        });

        const expectedOutput = {
          myLocation: {
            ...initialLocationState,
            id: 'myLocation',
            clientIsps: {
              myClientIsp: {
                ...initialClientIspState,
                id: 'myClientIsp',
                time: {
                  ...initialClientIspState.time,
                  timeSeries: {
                    data: 'data!',
                    timeAggregation: 'day',
                    isFetching: false,
                    isFetched: true,
                    startDate: '1',
                    endDate: '2',
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
            id: 'myLocation',
            clientIsps: {
              myClientIsp: {
                ...initialClientIspState,
                id: 'myClientIsp',
                time: {
                  ...initialClientIspState.time,
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
      it(FETCH_TOP_CLIENT_ISPS, () => {
        const result = reducer({}, {
          type: FETCH_TOP_CLIENT_ISPS,
          locationId: 'myLocation',
        });

        const expectedOutput = {
          myLocation: {
            ...initialLocationState,
            id: 'myLocation',
            topClientIsps: {
              data: undefined,
              isFetching: true,
              isFetched: false,
            },
          },
        };

        expect(result.myLocation.clientIsps).to.deep.equal(expectedOutput.myLocation.clientIsps);
        expect(result).to.deep.equal(expectedOutput);
      });

      it(FETCH_TOP_CLIENT_ISPS_SUCCESS, () => {
        const result = reducer({}, {
          type: FETCH_TOP_CLIENT_ISPS_SUCCESS,
          result: { results: [{ client_asn_number: 'AS100', stat: 123 }] },
          locationId: 'myLocation',
        });

        const expectedOutput = {
          myLocation: {
            ...initialLocationState,
            id: 'myLocation',
            topClientIsps: {
              data: [{ client_asn_number: 'AS100', stat: 123 }],
              isFetching: false,
              isFetched: true,
            },

            clientIsps: {
              AS100: {
                ...initialClientIspState,
                id: 'AS100',
                info: {
                  ...initialClientIspState.info,
                  data: { client_asn_number: 'AS100', stat: 123 },
                  isFetched: true,
                },
              },
            },
          },
        };

        expect(result.myLocation.topClientIsps).to.deep.equal(expectedOutput.myLocation.topClientIsps);
        expect(result.myLocation.clientIsps.AS100).to.deep.equal(expectedOutput.myLocation.clientIsps.AS100);
        expect(result).to.deep.equal(expectedOutput);
      });

      it(`${FETCH_TOP_CLIENT_ISPS_SUCCESS} already has info`, () => {
        const result = reducer({
          myLocation: {
            ...initialLocationState,
            id: 'myLocation',
            clientIsps: {
              AS100: {
                ...initialClientIspState,
                id: 'AS100',
                info: {
                  data: 'foo',
                  isFetched: true,
                  isFetching: false,
                },
              },
            },
          },
        }, {
          type: FETCH_TOP_CLIENT_ISPS_SUCCESS,
          result: { results: [{ client_asn_number: 'AS100', stat: 123 }] },
          locationId: 'myLocation',
        });

        // shouldn't overwrite existing info
        const expectedOutput = {
          myLocation: {
            ...initialLocationState,
            id: 'myLocation',
            topClientIsps: {
              data: [{ client_asn_number: 'AS100', stat: 123 }],
              isFetching: false,
              isFetched: true,
            },

            clientIsps: {
              AS100: {
                ...initialClientIspState,
                id: 'AS100',
                info: {
                  ...initialClientIspState.info,
                  data: 'foo',
                  isFetched: true,
                  isFetching: false,
                },
              },
            },
          },
        };

        expect(result.myLocation.topClientIsps).to.deep.equal(expectedOutput.myLocation.topClientIsps);
        expect(result.myLocation.clientIsps.AS100).to.deep.equal(expectedOutput.myLocation.clientIsps.AS100);
        expect(result).to.deep.equal(expectedOutput);
      });

      it(FETCH_TOP_CLIENT_ISPS_FAIL, () => {
        const result = reducer({}, {
          type: FETCH_TOP_CLIENT_ISPS_FAIL,
          error: 'error!',
          locationId: 'myLocation',
        });

        const expectedOutput = {
          myLocation: {
            ...initialLocationState,
            id: 'myLocation',
            topClientIsps: {
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
            id: 'myLocation',
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
            id: 'myLocation',
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
            id: 'myLocation',
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
