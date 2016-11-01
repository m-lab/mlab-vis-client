import { expect } from 'chai';
import moment from 'moment';
import UrlHandler from '../UrlHandler';

describe('url', () => {
  describe('UrlHandler', () => {
    describe('decodeQuery', () => {
      it('produces the correct value', () => {
        const config = {
          myStr: { type: 'string', defaultValue: 'download', urlKey: 'str' },
          myBool: { type: 'boolean', defaultValue: false },
          myDate: { type: 'date' },
        };

        const query = {
          myBool: '1',
          myDate: '2015-01-01',
        };

        const urlHandler = new UrlHandler(config);

        const expectedOutput = {
          myStr: 'download',
          myBool: true,
          myDate: moment(new Date(2015, 0, 1)),
        };

        const result = urlHandler.decodeQuery(query);
        expect(result).to.deep.equal(expectedOutput);
      });

      it('reuses cached values', () => {
        const config = {
          myArray: { type: 'array' },
          myObject: { type: 'object' },
          myArray2: { type: 'array' },
        };

        const query = {
          myArray: '1_2_3',
          myObject: 'a-1_b-2',
          myArray2: '3_4_5',
        };
        const urlHandler = new UrlHandler(config);

        const expectedOutput = {
          myArray: ['1', '2', '3'],
          myObject: { a: '1', b: '2' },
          myArray2: ['3', '4', '5'],
        };

        const result = urlHandler.decodeQuery(query);
        expect(result).to.deep.equal(expectedOutput);

        const query2 = {
          myArray: '1_2_3',
          myObject: 'a-1_b-2',
          myArray2: '4_5_6',
        };

        const result2 = urlHandler.decodeQuery(query2);
        expect(result2.myArray).to.equal(result.myArray);
        expect(result2.myObject).to.equal(result.myObject);
        expect(result2.myArray2).to.not.equal(result.myArray2);
        expect(result2.myArray2).to.deep.equal(['4', '5', '6']);
      });

      it('ignores query params not in config', () => {
        const config = {
          myStr: { type: 'string', defaultValue: 'download', urlKey: 'str' },
        };

        const query = {
          myBool: '1',
        };

        const urlHandler = new UrlHandler(config);

        const expectedOutput = {
          myStr: 'download',
        };

        const result = urlHandler.decodeQuery(query);
        expect(result).to.deep.equal(expectedOutput);
      });
    });

    describe('replaceInQuery', () => {
      it('produces the correct value', () => {
        const config = {
          myStr: { type: 'string', defaultValue: 'download', urlKey: 'str' },
          myBool: { type: 'boolean', defaultValue: false },
        };

        const location = {
          someStuff: 123,
          query: {
            str: 'foo',
            myBool: true,
          },
        };

        const urlHandler = new UrlHandler(config);

        const expectedOutput = {
          someStuff: 123,
          query: {
            str: 'baz',
            myBool: true,
          },
        };

        const result = urlHandler.replaceInQuery(location, 'myStr', 'baz');
        expect(result).to.deep.equal(expectedOutput);
      });
    });
  });
});
