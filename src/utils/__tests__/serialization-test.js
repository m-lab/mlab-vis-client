import { expect } from 'chai';
import moment from 'moment';
import {
  encodeDate,
  decodeDate,
  encodeBoolean,
  decodeBoolean,
  encodeJson,
  decodeJson,
  encodeArray,
  decodeArray,
  encodeSet,
  decodeSet,
  encodeObject,
  decodeObject,
  encode,
  decode,
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

      it('handles moment objects', () => {
        const date = moment('2015-11-15');
        const result = encodeDate(date);
        expect(result).to.equal('2015-11-15');
      });
    });

    describe('decodeDate', () => {
      it('produces the correct value', () => {
        let result = decodeDate('2016-03-01');
        // result is a moment object
        expect(result.year()).to.equal(2016);
        expect(result.month()).to.equal(2);
        expect(result.date()).to.equal(1);

        // javascript likes to give us 2015-12-31 19:00, so test this doesn't.
        result = decodeDate('2016');
        expect(result.year()).to.equal(2016);
        expect(result.month()).to.equal(0);
        expect(result.date()).to.equal(1);
      });

      it('handles null', () => {
        const result = decodeDate(null);
        expect(result).to.not.be.ok;
      });
    });

    describe('encodeBoolean', () => {
      it('produces the correct value', () => {
        expect(encodeBoolean(true)).to.equal('1');
        expect(encodeBoolean(false)).to.equal('0');
      });
    });

    describe('decodeBoolean', () => {
      it('produces the correct value', () => {
        expect(decodeBoolean('1')).to.equal(true);
        expect(decodeBoolean('0')).to.equal(false);
      });
    });

    describe('encodeJson', () => {
      it('produces the correct value', () => {
        const input = { test: '123', foo: [1, 2, 3] };
        expect(encodeJson(input)).to.equal(JSON.stringify(input));
      });
    });

    describe('decodeJson', () => {
      it('produces the correct value', () => {
        const output = decodeJson('{"foo": "bar", "jim": ["grill"]}');
        const expectedOutput = {
          foo: 'bar',
          jim: ['grill'],
        };
        expect(output).to.deep.equal(expectedOutput);
      });
    });

    describe('encodeArray', () => {
      it('produces the correct value', () => {
        const input = ['a', 'b', 'c'];
        expect(encodeArray(input)).to.equal('a_b_c');
      });
    });

    describe('decodeArray', () => {
      it('produces the correct value', () => {
        const output = decodeArray('a_b_c');
        const expectedOutput = ['a', 'b', 'c'];

        expect(output).to.deep.equal(expectedOutput);
      });
    });

    describe('encodeSet', () => {
      it('produces the correct value', () => {
        const input = ['a', 'b', 'c', 'b'];
        expect(encodeSet(input)).to.equal('a_b_c');
      });
    });

    describe('decodeSet', () => {
      it('produces the correct value', () => {
        const output = decodeSet('a_b_c_b');
        const expectedOutput = ['a', 'b', 'c'];

        expect(output).to.deep.equal(expectedOutput);
      });
    });

    describe('encodeObject', () => {
      it('produces the correct value', () => {
        const input = { test: 'bar', foo: 94 };
        const expectedOutput = 'test-bar_foo-94';
        expect(encodeObject(input, '-', '_')).to.equal(expectedOutput);
      });
    });

    describe('decodeObject', () => {
      it('produces the correct value', () => {
        const output = decodeObject('foo-bar_jim-grill_iros-91');
        const expectedOutput = {
          foo: 'bar',
          jim: 'grill',
          iros: '91',
        };
        expect(output).to.deep.equal(expectedOutput);
      });
    });

    describe('decode', () => {
      it('decodes by type', () => {
        const input = '91';
        expect(decode('number', input)).to.equal(91);
      });

      it('decodes using default value', () => {
        const input = undefined;
        expect(decode('number', input, '94')).to.equal('94');
      });

      it('decodes using custom function', () => {
        const input = '94';
        expect(decode(d => parseInt(d + d, 10), input)).to.equal(9494);
      });

      it('handles no decoder found', () => {
        const input = '94';
        expect(decode('fancy', input)).to.equal(input);
      });
    });

    describe('encode', () => {
      it('encodes by type', () => {
        const input = 91;
        expect(encode('number', input)).to.equal('91');
      });

      it('encodes using custom function', () => {
        const input = 94;
        expect(encode(d => `${d}${d}`, input)).to.equal('9494');
      });

      it('handles no encoder found', () => {
        const input = 94;
        expect(encode('fancy', input)).to.equal(input);
      });
    });

    describe('decode+encode', () => {
      it('encode(decode(number)) === number', () => {
        const input = '91';
        expect(encode('number', decode('number', input))).to.equal(input);
      });

      it('decode(encode(number)) === number', () => {
        const input = 91;
        expect(decode('number', encode('number', input))).to.equal(input);
      });

      it('encode(decode(boolean)) === boolean', () => {
        const input = '0';
        expect(encode('boolean', decode('boolean', input))).to.equal(input);
      });

      it('decode(encode(boolean)) === boolean', () => {
        const input = true;
        expect(decode('boolean', encode('boolean', input))).to.equal(input);
      });

      it('encode(decode(date)) === date', () => {
        const input = '2016-03-01';
        expect(encode('date', decode('date', input))).to.equal(input);
      });

      it('decode(encode(date)) === date', () => {
        const input = new Date(2016, 2, 1);
        expect(decode('date', encode('date', input)).toDate()).to.deep.equal(input);
      });

      it('encode(decode(json)) === json', () => {
        const input = '{"foo":"bar","baz":["jim"]}';
        expect(encode('json', decode('json', input))).to.equal(input);
      });

      it('decode(encode(json)) === json', () => {
        const input = { foo: 'bar', baz: ['jim'] };
        expect(decode('json', encode('json', input))).to.deep.equal(input);
      });

      it('encode(decode(object)) === object', () => {
        const input = 'foo-bar_baz-jim';
        expect(encode('object', decode('object', input))).to.equal(input);
      });

      it('decode(encode(object)) === object', () => {
        const input = { foo: 'bar', baz: 'jim' };
        expect(decode('object', encode('object', input))).to.deep.equal(input);
      });
    });
  });
});
