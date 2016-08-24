import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import { sum, average, weightedAverage } from '../math';

chai.use(dirtyChai);

describe('utils/math', () => {
  describe('sum', () => {
    it('produces the correct sum with accessor', () => {
      const data = [{ a: 1 }, { a: 2 }, { a: 3 }];
      const result = sum(data, d => d.a);
      expect(result).to.equal(6);
    });

    it('produces the correct sum with string', () => {
      const data = [{ a: 1 }, { a: 2 }, { a: 3 }];
      const result = sum(data, 'a');
      expect(result).to.equal(6);
    });

    it('handles null values', () => {
      const data = [{ a: 1 }, { a: 2 }, {}, { a: 3 }];
      const result = sum(data, 'a');
      expect(result).to.equal(6);
    });

    it('handles empty array', () => {
      const data = [];
      const result = sum(data, 'a');
      expect(result).to.be.undefined();
    });

    it('handles a falsy array', () => {
      const result = sum(null, d => d);
      expect(result).to.be.undefined();
    });
  });

  describe('average', () => {
    it('produces the correct average with accessor', () => {
      const data = [{ a: 1 }, { a: 2 }, { a: 3 }];
      const result = average(data, d => d.a);
      expect(result).to.equal(2);
    });

    it('produces the correct average with string', () => {
      const data = [{ a: 1 }, { a: 2 }, { a: 3 }];
      const result = average(data, 'a');
      expect(result).to.equal(2);
    });

    it('handles null values', () => {
      const data = [{ a: 1 }, { a: 2 }, {}, { a: 3 }];
      const result = average(data, 'a');
      expect(result).to.equal(2);
    });

    it('handles empty array', () => {
      const data = [];
      const result = average(data, 'a');
      expect(result).to.be.undefined();
    });

    it('handles a falsy array', () => {
      const result = average(null, d => d);
      expect(result).to.be.undefined();
    });
  });

  describe('weightedAverage', () => {
    it('produces the correct weightedAverage with accessor', () => {
      const data = [{ a: 1, w: 10 }, { a: 2, w: 1 }, { a: 3, w: 3 }];
      const result = weightedAverage(data, d => d.a, d => d.w);
      expect(result).to.equal(1.5);
    });

    it('produces the correct weightedAverage with string', () => {
      const data = [{ a: 1, w: 10 }, { a: 2, w: 1 }, { a: 3, w: 3 }];
      const result = weightedAverage(data, 'a', 'w');
      expect(result).to.equal(1.5);
    });

    it('handles null values', () => {
      const data = [{ a: 1, w: 10 }, {}, { a: 2 }, { w: 1 }, { a: 4, w: 5 }];
      const result = weightedAverage(data, 'a', 'w');
      expect(result).to.equal(2);
    });

    it('handles empty array', () => {
      const data = [];
      const result = weightedAverage(data, 'a', 'w');
      expect(result).to.be.undefined();
    });

    it('handles a falsy array', () => {
      const result = weightedAverage(null, 'a', 'w');
      expect(result).to.be.undefined();
    });
  });
});
