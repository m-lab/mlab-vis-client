/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import moment from 'moment';
import timeWithTypePrefix, { initialState } from '../timeWithTypePrefix';

describe('redux', () => {
  describe('shared', () => {
    describe('timeWithTypePrefix', () => {
      const time = timeWithTypePrefix('prefix');

      // time series

      it('handles <prefix>FETCH_TIME_SERIES', () => {
        const state = { ...initialState };
        state.timeSeries.data = 123;

        expect(time(state, {
          type: 'prefixFETCH_TIME_SERIES',
          timeAggregation: 'day',
          options: {
            startDate: moment('2015-01-01'),
            endDate: moment('2015-03-01'),
          },
        })).to.deep.equal({
          ...state,
          timeSeries: {
            data: 123,
            timeAggregation: 'day',
            startDate: moment('2015-01-01'),
            endDate: moment('2015-03-01'),
            isFetching: true,
            isFetched: false,
          },
        });
      });

      it('handles <prefix>FETCH_TIME_SERIES_SUCCESS', () => {
        const state = { ...initialState };
        state.timeSeries.data = 123;

        expect(time(state, {
          type: 'prefixFETCH_TIME_SERIES_SUCCESS',
          result: 999,
          timeAggregation: 'day',
          options: {
            startDate: moment('2015-01-01'),
            endDate: moment('2015-03-01'),
          },
        })).to.deep.equal({
          ...state,
          timeSeries: {
            data: 999,
            timeAggregation: 'day',
            startDate: moment('2015-01-01'),
            endDate: moment('2015-03-01'),
            isFetching: false,
            isFetched: true,
          },
        });
      });

      it('handles <prefix>FETCH_TIME_SERIES_FAIL', () => {
        const state = { ...initialState };
        state.timeSeries.data = 123;
        state.timeSeries.timeAggregation = 'month';
        state.timeSeries.startDate = moment('2014-01-01');
        state.timeSeries.endDate = moment('2014-02-01');

        expect(time(state, {
          type: 'prefixFETCH_TIME_SERIES_FAIL',
          error: 1,
          timeAggregation: 'day',
          options: {
            startDate: moment('2015-01-01'),
            endDate: moment('2015-03-01'),
          },
        })).to.deep.equal({
          ...state,
          timeSeries: {
            error: 1,
            timeAggregation: 'month',
            startDate: moment('2014-01-01'),
            endDate: moment('2014-02-01'),
            isFetching: false,
            isFetched: true,
          },
        });
      });

      // hourly

      it('handles <prefix>FETCH_HOURLY', () => {
        const state = { ...initialState };
        state.hourly.data = 123;

        expect(time(state, {
          type: 'prefixFETCH_HOURLY',
          timeAggregation: 'day',
          options: {
            startDate: moment('2015-01-01'),
            endDate: moment('2015-03-01'),
          },
        })).to.deep.equal({
          ...state,
          hourly: {
            data: 123,
            timeAggregation: 'day',
            startDate: moment('2015-01-01'),
            endDate: moment('2015-03-01'),
            isFetching: true,
            isFetched: false,
          },
        });
      });

      it('handles <prefix>FETCH_HOURLY_SUCCESS', () => {
        const state = { ...initialState };
        state.hourly.data = 123;

        expect(time(state, {
          type: 'prefixFETCH_HOURLY_SUCCESS',
          result: 999,
          timeAggregation: 'day',
          options: {
            startDate: moment('2015-01-01'),
            endDate: moment('2015-03-01'),
          },
        })).to.deep.equal({
          ...state,
          hourly: {
            data: 999,
            timeAggregation: 'day',
            startDate: moment('2015-01-01'),
            endDate: moment('2015-03-01'),
            isFetching: false,
            isFetched: true,
          },
        });
      });

      it('handles <prefix>FETCH_HOURLY_FAIL', () => {
        const state = { ...initialState };
        state.hourly.data = 123;
        state.hourly.timeAggregation = 'month';
        state.hourly.startDate = moment('2014-01-01');
        state.hourly.endDate = moment('2014-02-01');

        expect(time(state, {
          type: 'prefixFETCH_HOURLY_FAIL',
          error: 1,
          timeAggregation: 'day',
          options: {
            startDate: moment('2015-01-01'),
            endDate: moment('2015-03-01'),
          },
        })).to.deep.equal({
          ...state,
          hourly: {
            error: 1,
            timeAggregation: 'month',
            startDate: moment('2014-01-01'),
            endDate: moment('2014-02-01'),
            isFetching: false,
            isFetched: true,
          },
        });
      });
    });
  });
});
