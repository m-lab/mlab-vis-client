import { expect } from 'chai';
import {
  multiExtent,
  findClosestUnsorted,
  findEqualUnsorted,
  findClosestSorted,
  findEqualSorted,
} from '../array';

describe('utils', () => {
  describe('array', () => {
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
        expect(result).to.be.undefined;
      });

      it('handles a falsy array', () => {
        const result = multiExtent(null);
        expect(result).to.be.undefined;
      });
    });

    describe('findClosestSorted', () => {
      it('finds the closest value', () => {
        const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        expect(findClosestSorted(values, 0)).to.equal(1);
        expect(findClosestSorted(values, 1)).to.equal(1);
        expect(findClosestSorted(values, 3.49)).to.equal(3);
        expect(findClosestSorted(values, 3.51)).to.equal(4);
        expect(findClosestSorted(values, 11)).to.equal(10);
        expect(findClosestSorted(values, 10)).to.equal(10);
      });

      it('works with accessor', () => {
        const values = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 10 }];
        const accessor = d => d.a;
        expect(findClosestSorted(values, 0, accessor)).to.deep.equal({ a: 1 });
        expect(findClosestSorted(values, 1, accessor)).to.deep.equal({ a: 1 });
        expect(findClosestSorted(values, 3.49, accessor)).to.deep.equal({ a: 3 });
        expect(findClosestSorted(values, 3.51, accessor)).to.deep.equal({ a: 4 });
        expect(findClosestSorted(values, 11, accessor)).to.deep.equal({ a: 10 });
        expect(findClosestSorted(values, 10, accessor)).to.deep.equal({ a: 10 });
      });
    });

    describe('findEqualSorted', () => {
      it('finds the value and returns it', () => {
        const values = [1, 2, 3, 4, 10];
        expect(findEqualSorted(values, 1)).to.equal(values[0]);
        expect(findEqualSorted(values, 10)).to.equal(values[4]);
        expect(findEqualSorted(values, 4)).to.equal(values[3]);
        expect(findEqualSorted(values, 3)).to.equal(values[2]);
      });

      it('finds the value and returns it with accessor', () => {
        const values = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 10 }];
        const accessor = d => d.a;
        expect(findEqualSorted(values, 1, accessor)).to.equal(values[0]);
        expect(findEqualSorted(values, 10, accessor)).to.equal(values[4]);
        expect(findEqualSorted(values, 4, accessor)).to.equal(values[3]);
        expect(findEqualSorted(values, 3, accessor)).to.equal(values[2]);
      });

      it('returns undefined for not found', () => {
        const values = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 10 }];
        const accessor = d => d.a;
        expect(findEqualSorted(values, 0, accessor)).to.be.undefined;
        expect(findEqualSorted(values, 99, accessor)).to.be.undefined;
      });
    });

    describe('findClosestUnsorted', () => {
      it('finds the closest value', () => {
        const values = [8, 9, 1, 2, 6, 3, 5, 4, 5, 10];
        expect(findClosestUnsorted(values, 0)).to.equal(1);
        expect(findClosestUnsorted(values, 1)).to.equal(1);
        expect(findClosestUnsorted(values, 3.49)).to.equal(3);
        expect(findClosestUnsorted(values, 3.51)).to.equal(4);
        expect(findClosestUnsorted(values, 11)).to.equal(10);
        expect(findClosestUnsorted(values, 10)).to.equal(10);
      });

      it('works with accessor', () => {
        const values = [{ a: 4 }, { a: 2 }, { a: 1 }, { a: 10 }, { a: 3 }];
        const accessor = d => d.a;
        expect(findClosestUnsorted(values, 0, accessor)).to.deep.equal({ a: 1 });
        expect(findClosestUnsorted(values, 1, accessor)).to.deep.equal({ a: 1 });
        expect(findClosestUnsorted(values, 3.49, accessor)).to.deep.equal({ a: 3 });
        expect(findClosestUnsorted(values, 3.51, accessor)).to.deep.equal({ a: 4 });
        expect(findClosestUnsorted(values, 11, accessor)).to.deep.equal({ a: 10 });
        expect(findClosestUnsorted(values, 10, accessor)).to.deep.equal({ a: 10 });
      });
    });

    describe('findEqualUnsorted', () => {
      it('finds the value and returns it', () => {
        const values = [{ a: 4 }, { a: 2 }, { a: 1 }, { a: 10 }, { a: 3 }];
        expect(findEqualUnsorted(values, values[0])).to.equal(values[0]);
        expect(findEqualUnsorted(values, values[4])).to.equal(values[4]);
        expect(findEqualUnsorted(values, values[3])).to.equal(values[3]);
        expect(findEqualUnsorted(values, 3, d => d.a)).to.equal(values[4]);
      });

      it('returns undefined for not found', () => {
        const values = [{ a: 4 }, { a: 2 }, { a: 1 }, { a: 10 }, { a: 3 }];
        expect(findEqualUnsorted(values, { a: 1 })).to.be.undefined;
        expect(findEqualUnsorted(values, { a: 99 })).to.be.undefined;
      });
    });
  });
});
