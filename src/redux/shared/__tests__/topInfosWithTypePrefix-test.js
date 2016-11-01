/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import topInfosWithTypePrefix, { initialState } from '../topInfosWithTypePrefix';

describe('redux', () => {
  describe('shared', () => {
    describe('topInfosWithTypePrefix', () => {
      const topInfos = topInfosWithTypePrefix('prefix/', 'top/');
      it('handles <prefix>FETCH_TOP', () => {
        expect(topInfos({ ...initialState, data: 123 }, { type: 'prefix/top/FETCH_TOP' }))
          .to.deep.equal({ data: 123, isFetching: true, isFetched: false });
      });

      it('handles <prefix>FETCH_TOP_SUCCESS', () => {
        expect(topInfos({ ...initialState, data: 123 }, {
          type: 'prefix/top/FETCH_TOP_SUCCESS',
          result: { results: 999 },
        })).to.deep.equal({ data: 999, isFetching: false, isFetched: true });
      });

      it('handles <prefix>FETCH_TOP_FAIL', () => {
        expect(topInfos({ ...initialState, data: 123 }, { type: 'prefix/top/FETCH_TOP_FAIL', error: 1 }))
          .to.deep.equal({ error: 1, isFetching: false, isFetched: true });
      });
    });
  });
});
