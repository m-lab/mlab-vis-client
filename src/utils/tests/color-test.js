import d3 from 'd3';
import { expect } from 'chai';
import { hashAsn, colorsFor, extractColors } from '../color';


describe('utils', () => {
  describe('color', () => {
    describe('hashAsn', () => {
      it('hashes asn numbers', () => {
        let asnum = 'AS123+';
        let result = hashAsn(asnum, 100);
        expect(result).to.equal(23);

        asnum = 'AS99';
        result = hashAsn(asnum, 100);
        expect(result).to.equal(99);
      });

      it('hashes asn numbers', () => {
      });
    });

    describe('extractColors', () => {
      it('provides colors to asns', () => {
        const asns = ['AS100', 'AS101', 'AS103'];
        const colors = extractColors(asns);
        expect(colors).to.deep.equal(['rgb(225, 69, 51)', 'rgb(141, 114, 227)', 'rgb(223, 70, 178)']);
      });
      it('does not duplicate colors', () => {
        const asns = ['AS100', 'AS100', 'AS100', 'AS100'];
        const colors = extractColors(asns);
        expect(colors.length).to.equal(asns.length);
        const uniqueColors = d3.set(colors).values();
        expect(colors.length).to.equal(uniqueColors.length);
      });
    });

    describe('colorsFor', () => {
      it('provides colors to asns', () => {
        const asns = ['AS100', 'AS101', 'AS103'];
        const colorMap = colorsFor(asns);
        expect(colorMap['AS100']).to.equal('rgb(225, 69, 51)');
      });

      it('provides colors for asns with accessor function', () => {
        const asns = [{ 'asn':'AS100' }, { 'asn':'AS101' }];
        const colorMap = colorsFor(asns, (d) => d.asn);
        expect(colorMap['AS100']).to.equal('rgb(225, 69, 51)');
      });
    });
  });
});
