/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import moment from 'moment';
import {
  shouldSaveLocationInfo,
  shouldFetchTimeSeries,
  shouldFetchHourly,
  shouldFetchInfo,
  shouldFetchTopClientIsps,
  shouldFetchTopTransitIsps,
} from '../actions';

describe('redux', () => {
  describe('locations', () => {
    describe('actions', () => {
      it('shouldSaveLocationInfo works properly', () => {
        // already has data
        expect(shouldSaveLocationInfo({
          locations: {
            location1: {
              info: {
                isFetched: true,
                isFetching: false,
              },
            },
          },
        }, { id: 'location1' })).to.be.false;

        // does not have data
        expect(shouldSaveLocationInfo({
          locations: {
            location1: {
              info: {
                isFetched: false,
                isFetching: false,
              },
            },
          },
        }, { id: 'location1' })).to.be.true;

        // no location state
        expect(shouldSaveLocationInfo({
          locations: {
          },
        }, { id: 'location1' })).to.be.true;
      });

      it('shouldFetchTimeSeries works properly', () => {
        // already has data
        expect(shouldFetchTimeSeries({
          locations: {
            location1: {
              time: { timeSeries: {
                timeAggregation: 'day',
                startDate: moment('2015-01-01'),
                endDate: moment('2016-01-01'),
                isFetched: true,
                isFetching: false,
              } },
            },
          },
        }, 'day', 'location1', {
          startDate: moment('2015-01-01'),
          endDate: moment('2016-01-01'),
        }))
        .to.be.false;

        // does not have data
        expect(shouldFetchTimeSeries({
          locations: {
            location1: {
              time: { timeSeries: {
                timeAggregation: 'day',
                startDate: moment('2015-01-01'),
                endDate: moment('2016-01-01'),
                isFetched: false,
                isFetching: false,
              } },
            },
          },
        }, 'day', 'location1', {
          startDate: moment('2015-01-01'),
          endDate: moment('2016-01-01'),
        }))
        .to.be.true;

        // no location state
        expect(shouldFetchTimeSeries({
          locations: {
          },
        }, 'day', 'location1', {
          startDate: moment('2015-01-01'),
          endDate: moment('2016-01-01'),
        }))
        .to.be.true;
      });

      it('shouldFetchHourly works properly', () => {
        // already has data
        expect(shouldFetchHourly({
          locations: {
            location1: {
              time: { hourly: {
                timeAggregation: 'day',
                startDate: moment('2015-01-01'),
                endDate: moment('2016-01-01'),
                isFetched: true,
                isFetching: false,
              } },
            },
          },
        }, 'day', 'location1', {
          startDate: moment('2015-01-01'),
          endDate: moment('2016-01-01'),
        }))
        .to.be.false;

        // does not have data
        expect(shouldFetchHourly({
          locations: {
            location1: {
              time: { hourly: {
                timeAggregation: 'day',
                startDate: moment('2015-01-01'),
                endDate: moment('2016-01-01'),
                isFetched: false,
                isFetching: false,
              } },
            },
          },
        }, 'day', 'location1', {
          startDate: moment('2015-01-01'),
          endDate: moment('2016-01-01'),
        }))
        .to.be.true;

        // no location state
        expect(shouldFetchHourly({
          locations: {
          },
        }, 'day', 'location1', {
          startDate: moment('2015-01-01'),
          endDate: moment('2016-01-01'),
        }))
        .to.be.true;
      });

      it('shouldFetchInfo works properly', () => {
        // already has data
        expect(shouldFetchInfo({
          locations: {
            location1: {
              info: {
                isFetched: true,
                isFetching: false,
              },
              fixed: {
                isFetched: true,
                isFetching: false,
              },
            },
          },
        }, 'location1')).to.be.false;

        // does not have data
        expect(shouldFetchInfo({
          locations: {
            location1: {
              info: {
                isFetched: false,
                isFetching: false,
              },
              fixed: {
                isFetched: true,
                isFetching: false,
              },
            },
          },
        }, 'location1')).to.be.true;

        // does not have data
        expect(shouldFetchInfo({
          locations: {
            location1: {
              info: {
                isFetched: true,
                isFetching: false,
              },
              fixed: {
                isFetched: false,
                isFetching: false,
              },
            },
          },
        }, 'location1')).to.be.true;

        // no location state
        expect(shouldFetchInfo({
          locations: {
          },
        }, 'location1')).to.be.true;
      });

      it('shouldFetchTopClientIsps works properly', () => {
        // already has data
        expect(shouldFetchTopClientIsps({
          locations: {
            location1: {
              topClientIsps: {
                isFetched: true,
                isFetching: false,
              },
            },
          },
        }, 'location1')).to.be.false;

        // does not have data
        expect(shouldFetchTopClientIsps({
          locations: {
            location1: {
              topClientIsps: {
                isFetched: false,
                isFetching: false,
              },
            },
          },
        }, 'location1')).to.be.true;

        // no location state
        expect(shouldFetchTopClientIsps({
          locations: {
          },
        }, 'location1')).to.be.true;
      });

      it('shouldFetchTopTransitIsps works properly', () => {
        // already has data
        expect(shouldFetchTopTransitIsps({
          locations: {
            location1: {
              topTransitIsps: {
                isFetched: true,
                isFetching: false,
              },
            },
          },
        }, 'location1')).to.be.false;

        // does not have data
        expect(shouldFetchTopTransitIsps({
          locations: {
            location1: {
              topTransitIsps: {
                isFetched: false,
                isFetching: false,
              },
            },
          },
        }, 'location1')).to.be.true;

        // no location state
        expect(shouldFetchTopTransitIsps({
          locations: {
          },
        }, 'location1')).to.be.true;
      });
    });
  });
});
