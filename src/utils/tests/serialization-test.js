import { expect } from 'chai';
import {
  encodeDate,
  decodeDate,
  spreadTest
} from '../serialization';

describe('utils', () => {
  describe('serialization', () => {
    describe('encodeDate', () => {
      it('produces the correct value', () => {
        const date = new Date(2016, 2, 1);
        const result = encodeDate(date);
        expect(result).to.equal('2016-03-01');
      });

      it('handles null', () => {
        const result = encodeDate(null);
        expect(result).to.not.be.ok;
      });
    });

    describe('decodeDate', () => {
      it('produces the correct value', () => {
        const date = new Date(2016, 2, 1);
        const result = decodeDate('2016-03-01');
        expect(result.getFullYear()).to.equal(2016);
        expect(result.getMonth()).to.equal(2);
        expect(result.getDate()).to.equal(1);
      });

      it('handles null', () => {
        const result = decodeDate(null);
        expect(result).to.not.be.ok;
      });
    });
  });
});