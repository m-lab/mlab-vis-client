import { expect } from 'chai';
import moment from 'moment';
import timeAggregationFromDates from '../timeAggregationFromDates';

describe('utils', () => {
  describe('timeAggregationFromDates', () => {
    it('returns year for >= 3 years', () => {
      expect(timeAggregationFromDates(moment('2010-01-01'), moment('2014-01-01'))).to.equal('year');
      expect(timeAggregationFromDates(moment('2011-01-01'), moment('2014-01-01'))).to.equal('year');
      expect(timeAggregationFromDates(moment('2012-01-01'), moment('2014-01-01'))).to.not.equal('year');
    });
    it('returns month for >= 3 months', () => {
      expect(timeAggregationFromDates(moment('2010-01-01'), moment('2010-05-01'))).to.equal('month');
      expect(timeAggregationFromDates(moment('2010-01-01'), moment('2010-04-01'))).to.equal('month');
      expect(timeAggregationFromDates(moment('2010-01-01'), moment('2010-03-01'))).not.to.equal('month');
    });
    it('returns day for < 3 months', () => {
      expect(timeAggregationFromDates(moment('2010-01-01'), moment('2010-03-31'))).to.equal('day');
      expect(timeAggregationFromDates(moment('2010-01-01'), moment('2010-04-01'))).to.not.equal('day');
    });
  });
});
