/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import moment from 'moment';
import {
  shouldFetch,
  keyShouldFetch,
  infoShouldFetch,
  fixedShouldFetch,
  timeShouldFetch,
  timeSeriesShouldFetch,
  hourlyShouldFetch,
} from '../shouldFetch';


describe('redux', () => {
  describe('shared', () => {
    describe('shouldFetch', () => {
      it('shouldFetch works properly', () => {
        expect(shouldFetch({ isFetched: false, isFetching: false })).to.be.true;
        expect(shouldFetch({ isFetched: true, isFetching: false })).to.be.false;
        expect(shouldFetch({ isFetched: false, isFetching: true })).to.be.false;
      });

      it('keyShouldFetch works properly', () => {
        expect(keyShouldFetch({ foo: { isFetched: false, isFetching: false } }, 'foo')).to.be.true;
        expect(keyShouldFetch({ foo: { isFetched: true, isFetching: false } }, 'foo')).to.be.false;
        expect(keyShouldFetch({ foo: { isFetched: false, isFetching: true } }, 'foo')).to.be.false;
      });

      it('infoShouldFetch works properly', () => {
        expect(infoShouldFetch({ info: { isFetched: false, isFetching: false } })).to.be.true;
        expect(infoShouldFetch({ info: { isFetched: true, isFetching: false } })).to.be.false;
        expect(infoShouldFetch({ info: { isFetched: false, isFetching: true } })).to.be.false;
      });

      it('fixedShouldFetch works properly', () => {
        expect(fixedShouldFetch({ fixed: { isFetched: false, isFetching: false } })).to.be.true;
        expect(fixedShouldFetch({ fixed: { isFetched: true, isFetching: false } })).to.be.false;
        expect(fixedShouldFetch({ fixed: { isFetched: false, isFetching: true } })).to.be.false;
      });

      it('timeShouldFetch works properly', () => {
        // already fetched
        expect(timeShouldFetch({
          timeAggregation: 'day',
          startDate: moment('2015-01-01'),
          endDate: moment('2016-01-01'),
          isFetched: true,
          isFetching: false,
        }, 'day', {
          startDate: moment('2015-01-01'),
          endDate: moment('2016-01-01'),
        })).to.be.false;

        // different time aggregation
        expect(timeShouldFetch({
          timeAggregation: 'day',
          startDate: moment('2015-01-01'),
          endDate: moment('2016-01-01'),
          isFetched: true,
          isFetching: false,
        }, 'month', {
          startDate: moment('2015-01-01'),
          endDate: moment('2016-01-01'),
        })).to.be.true;

        // different start date
        expect(timeShouldFetch({
          timeAggregation: 'day',
          startDate: moment('2015-01-01'),
          endDate: moment('2016-01-01'),
          isFetched: true,
          isFetching: false,
        }, 'day', {
          startDate: moment('2014-01-01'),
          endDate: moment('2016-01-01'),
        })).to.be.true;

        // different end date
        expect(timeShouldFetch({
          timeAggregation: 'day',
          startDate: moment('2015-01-01'),
          endDate: moment('2016-01-01'),
          isFetched: true,
          isFetching: false,
        }, 'day', {
          startDate: moment('2015-01-01'),
          endDate: moment('2017-01-01'),
        })).to.be.true;
      });

      it('timeSeriesShouldFetch works properly', () => {
        // already fetched
        expect(timeSeriesShouldFetch({ time: { timeSeries: {
          timeAggregation: 'day',
          startDate: moment('2015-01-01'),
          endDate: moment('2016-01-01'),
          isFetched: true,
          isFetching: false,
        } } }, 'day', {
          startDate: moment('2015-01-01'),
          endDate: moment('2016-01-01'),
        })).to.be.false;

        // different time aggregation
        expect(timeSeriesShouldFetch({ time: { timeSeries: {
          timeAggregation: 'day',
          startDate: moment('2015-01-01'),
          endDate: moment('2016-01-01'),
          isFetched: true,
          isFetching: false,
        } } }, 'month', {
          startDate: moment('2015-01-01'),
          endDate: moment('2016-01-01'),
        })).to.be.true;
      });

      it('hourlyShouldFetch works properly', () => {
        // already fetched
        expect(hourlyShouldFetch({ time: { hourly: {
          timeAggregation: 'day',
          startDate: moment('2015-01-01'),
          endDate: moment('2016-01-01'),
          isFetched: true,
          isFetching: false,
        } } }, 'day', {
          startDate: moment('2015-01-01'),
          endDate: moment('2016-01-01'),
        })).to.be.false;

        // different time aggregation
        expect(hourlyShouldFetch({ time: { hourly: {
          timeAggregation: 'day',
          startDate: moment('2015-01-01'),
          endDate: moment('2016-01-01'),
          isFetched: true,
          isFetching: false,
        } } }, 'month', {
          startDate: moment('2015-01-01'),
          endDate: moment('2016-01-01'),
        })).to.be.true;
      });
    });
  });
});
