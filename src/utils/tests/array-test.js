import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import { multiExtent } from '../array';

chai.use(dirtyChai);

describe('utils/array', () => {
  describe('multiExtent', () => {
    it('produces the correct value with defaults', () => {
      const outerArray = [
        [1, 2, 3],
        [0, 2, 1],
        [2, 5, 9],
      ];
      const result = multiExtent(outerArray);
      expect(result).to.deep.equal([0, 9]);
    });

    it('produces the correct value with accessors', () => {
      const outerArray = [
        { data: [{ v: 1 }, { v: 2 }, { v: 3 }] },
        { data: [{ v: 0 }, { v: 2 }, { v: 1 }] },
        { data: [{ v: 2 }, { v: 5 }, { v: 9 }] },
      ];
      const result = multiExtent(outerArray, d => d.v, inner => inner.data);
      expect(result).to.deep.equal([0, 9]);
    });

    it('handles empty array', () => {
      const data = [];
      const result = multiExtent(data);
      expect(result).to.be.undefined();
    });

    it('handles a falsy array', () => {
      const result = multiExtent(null);
      expect(result).to.be.undefined();
    });
  });
});
