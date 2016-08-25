/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import {
  shouldFetchTimeSeries,
  shouldFetchHourly,
  shouldFetchClientIsps,
  shouldFetchClientIspLocationTimeSeries,
} from '../actions';
import {
  initialLocationState,
  initialClientIspTimeState,
} from '../reducer';

describe('redux', () => {
  describe('locations', () => {
    describe('actions', () => {
      // -------------------------------------------------------------------------------------
      describe('shouldFetchTimeSeries', () => {
        it('no location state', () => {
          const result = shouldFetchTimeSeries({ locations: {} }, 'day', 'myLocation');
          expect(result).to.be.true;
        });

        it('different time aggregation', () => {
          const locationState = {
            ...initialLocationState,
            time: {
              ...initialLocationState.time,
              timeSeries: {
                ...initialLocationState.time.timeSeries,
                timeAggregation: 'month',
              },
            },
          };

          const result = shouldFetchTimeSeries({ locations: { myLocation: locationState } }, 'day', 'myLocation');
          expect(result).to.be.true;
        });

        it('already fetching', () => {
          const locationState = {
            ...initialLocationState,
            time: {
              ...initialLocationState.time,
              timeSeries: {
                ...initialLocationState.time.timeSeries,
                timeAggregation: 'day',
                isFetching: true,
              },
            },
          };

          const result = shouldFetchTimeSeries({ locations: { myLocation: locationState } }, 'day', 'myLocation');
          expect(result).to.be.false;
        });

        it('already fetched', () => {
          const locationState = {
            ...initialLocationState,
            time: {
              ...initialLocationState.time,
              timeSeries: {
                ...initialLocationState.time.timeSeries,
                timeAggregation: 'day',
                isFetching: false,
                isFetched: true,
              },
            },
          };

          const result = shouldFetchTimeSeries({ locations: { myLocation: locationState } }, 'day', 'myLocation');
          expect(result).to.be.false;
        });
      });

      // -------------------------------------------------------------------------------------
      describe('shouldFetchHourly', () => {
        it('no location state', () => {
          const result = shouldFetchHourly({ locations: {} }, 'day', 'myLocation');
          expect(result).to.be.true;
        });

        it('different time aggregation', () => {
          const locationState = {
            ...initialLocationState,
            time: {
              ...initialLocationState.time,
              hourly: {
                ...initialLocationState.time.hourly,
                timeAggregation: 'month',
              },
            },
          };

          const result = shouldFetchHourly({ locations: { myLocation: locationState } }, 'day', 'myLocation');
          expect(result).to.be.true;
        });

        it('already fetching', () => {
          const locationState = {
            ...initialLocationState,
            time: {
              ...initialLocationState.time,
              hourly: {
                ...initialLocationState.time.hourly,
                timeAggregation: 'day',
                isFetching: true,
              },
            },
          };

          const result = shouldFetchHourly({ locations: { myLocation: locationState } }, 'day', 'myLocation');
          expect(result).to.be.false;
        });

        it('already fetched', () => {
          const locationState = {
            ...initialLocationState,
            time: {
              ...initialLocationState.time,
              hourly: {
                ...initialLocationState.time.hourly,
                timeAggregation: 'day',
                isFetching: false,
                isFetched: true,
              },
            },
          };

          const result = shouldFetchHourly({ locations: { myLocation: locationState } }, 'day', 'myLocation');
          expect(result).to.be.false;
        });
      });

      // -------------------------------------------------------------------------------------
      describe('shouldFetchClientIsps', () => {
        it('no location state', () => {
          const result = shouldFetchClientIsps({ locations: {} }, 'myLocation');
          expect(result).to.be.true;
        });

        it('already fetching', () => {
          const locationState = {
            ...initialLocationState,
            clientIsps: {
              ...initialLocationState.clientIsps,
              isFetching: true,
            },
          };

          const result = shouldFetchClientIsps({ locations: { myLocation: locationState } }, 'myLocation');
          expect(result).to.be.false;
        });

        it('already fetched', () => {
          const locationState = {
            ...initialLocationState,
            clientIsps: {
              ...initialLocationState.clientIsps,
              isFetching: false,
              isFetched: true,
            },
          };

          const result = shouldFetchClientIsps({ locations: { myLocation: locationState } }, 'myLocation');
          expect(result).to.be.false;
        });
      });


      // -------------------------------------------------------------------------------------
      describe('shouldFetchClientIspLocationTimeSeries', () => {
        it('no location state', () => {
          const result = shouldFetchClientIspLocationTimeSeries({ locations: {} }, 'day', 'myLocation', 'myClientIsp');
          expect(result).to.be.true;
        });

        it('no location->clientIsp state', () => {
          const locationState = initialLocationState;
          const result = shouldFetchClientIspLocationTimeSeries({ locations: { myLocation: locationState } }, 'day',
            'myLocation', 'myClientIsp');
          expect(result).to.be.true;
        });

        it('different time aggregation', () => {
          const locationState = {
            ...initialLocationState,
            time: {
              ...initialLocationState.time,
              clientIsps: {
                ...initialLocationState.time.clientIsps,
                myClientIsp: {
                  ...initialClientIspTimeState,
                  timeSeries: {
                    ...initialClientIspTimeState.timeSeries,
                    timeAggregation: 'month',
                  },
                },
              },
            },
          };

          const result = shouldFetchClientIspLocationTimeSeries({ locations: { myLocation: locationState } }, 'day',
            'myLocation', 'myClientIsp');
          expect(result).to.be.true;
        });

        it('already fetching', () => {
          const locationState = {
            ...initialLocationState,
            time: {
              ...initialLocationState.time,
              clientIsps: {
                ...initialLocationState.time.clientIsps,
                myClientIsp: {
                  ...initialClientIspTimeState,
                  timeSeries: {
                    ...initialClientIspTimeState.timeSeries,
                    timeAggregation: 'day',
                    isFetching: true,
                  },
                },
              },
            },
          };

          const result = shouldFetchClientIspLocationTimeSeries({ locations: { myLocation: locationState } }, 'day',
            'myLocation', 'myClientIsp');
          expect(result).to.be.false;
        });

        it('already fetched', () => {
          const locationState = {
            ...initialLocationState,
            time: {
              ...initialLocationState.time,
              clientIsps: {
                ...initialLocationState.time.clientIsps,
                myClientIsp: {
                  ...initialClientIspTimeState,
                  timeSeries: {
                    ...initialClientIspTimeState.timeSeries,
                    timeAggregation: 'day',
                    isFetched: true,
                  },
                },
              },
            },
          };

          const result = shouldFetchClientIspLocationTimeSeries({ locations: { myLocation: locationState } }, 'day',
            'myLocation', 'myClientIsp');
          expect(result).to.be.false;
        });
      });
    }); // actions
  });
});
