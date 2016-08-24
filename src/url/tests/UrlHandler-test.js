import { expect } from 'chai';
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
          myDate: new Date(2015, 0, 1),
        };

        const result = urlHandler.decodeQuery(query);
        expect(result).to.deep.equal(expectedOutput);
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
