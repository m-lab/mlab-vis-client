/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import fixedWithTypePrefix, { initialState } from '../fixedWithTypePrefix';

describe('redux', () => {
  describe('shared', () => {
    describe('fixedWithTypePrefix', () => {
      const fixed = fixedWithTypePrefix('prefix');
      it('handles <prefix>FETCH_INFO', () => {
        expect(fixed({ ...initialState, data: 123 }, { type: 'prefixFETCH_INFO' }))
          .to.deep.equal({ data: 123, isFetching: true, isFetched: false });
      });

      it('handles <prefix>FETCH_INFO_SUCCESS', () => {
        expect(fixed({ ...initialState, data: 123 }, { type: 'prefixFETCH_INFO_SUCCESS', result: { data: 999 } }))
          .to.deep.equal({ data: 999, isFetching: false, isFetched: true });
      });

      it('handles <prefix>SAVE_INFO', () => {
        expect(fixed({ ...initialState, data: 123 }, { type: 'prefixSAVE_INFO', result: { data: 999 } }))
          .to.deep.equal({ data: 999, isFetching: false, isFetched: true });
      });

      it('handles <prefix>FETCH_INFO_FAIL', () => {
        expect(fixed({ ...initialState, data: 123 }, { type: 'prefixFETCH_INFO_FAIL', error: 1 }))
          .to.deep.equal({ error: 1, isFetching: false, isFetched: true });
      });
    });
  });
});
