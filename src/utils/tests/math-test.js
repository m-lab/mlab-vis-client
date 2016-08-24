import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import { sum } from '../math';

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

    it('handles a falsy array', () => {
      const result = sum(null, d => d);
      expect(result).to.be.undefined();
      expect(result).to.be.undefined();
    });
  });
});
