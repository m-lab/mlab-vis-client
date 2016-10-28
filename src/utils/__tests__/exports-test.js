import { expect } from 'chai';
import { createCsv } from '../exports';

describe('utils', () => {
  describe('exports', () => {
    describe('createCsv', () => {
      it('produces the correct value', () => {
        const data = [
          { col1: 'val1', col2: 123 },
          { col1: 'val1_2', col2: 456 },
        ];
        const result = createCsv(data);

        const expectedOutput = 'col1,col2\n"val1",123\n"val1_2",456\n';
        expect(result).to.equal(expectedOutput);
      });

      it('handles strings with quotation marks in them', () => {
        const data = [
          { col1: 'val"1" two""three"', col2: 123 },
          { col1: 'val1_2', col2: 456 },
        ];
        const result = createCsv(data);

        const expectedOutput = 'col1,col2\n"val""1"" two""""three""",123\n"val1_2",456\n';
        expect(result).to.equal(expectedOutput);
      });

      it('handles columns that are not in the first element', () => {
        const data = [
          { col1: 'val1', col2: 123 },
          { col1: 'val1_2', col3: 456 },
        ];
        const result = createCsv(data);

        const expectedOutput = 'col1,col2,col3\n"val1",123,\n"val1_2",,456\n';
        expect(result).to.equal(expectedOutput);
      });

      it('handles falsy data', () => {
        const result = createCsv(null);
        expect(result).to.equal('');
      });

      it('handles empty data', () => {
        const result = createCsv([]);
        expect(result).to.equal('');
      });
    });
  });
});
