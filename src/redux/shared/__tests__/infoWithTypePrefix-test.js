/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import infoWithTypePrefix, { initialState } from '../infoWithTypePrefix';

describe('redux', () => {
  describe('shared', () => {
    describe('infoWithTypePrefix', () => {
      const info = infoWithTypePrefix('prefix');
      it('handles <prefix>FETCH_INFO', () => {
        expect(info({ ...initialState, data: 123 }, { type: 'prefixFETCH_INFO' }))
          .to.deep.equal({ data: 123, isFetching: true, isFetched: false });
      });

      it('handles <prefix>FETCH_INFO_SUCCESS', () => {
        expect(info({ ...initialState, data: 123 }, { type: 'prefixFETCH_INFO_SUCCESS', result: { meta: 999 } }))
          .to.deep.equal({ data: 999, isFetching: false, isFetched: true });
      });

      it('handles <prefix>SAVE_INFO', () => {
        expect(info({ ...initialState, data: 123 }, { type: 'prefixSAVE_INFO', result: { meta: 999 } }))
          .to.deep.equal({ data: 999, isFetching: false, isFetched: true });
      });

      it('handles <prefix>FETCH_INFO_FAIL', () => {
        expect(info({ ...initialState, data: 123 }, { type: 'prefixFETCH_INFO_FAIL', error: 1 }))
          .to.deep.equal({ error: 1, isFetching: false, isFetched: true });
      });
    });
  });
});
