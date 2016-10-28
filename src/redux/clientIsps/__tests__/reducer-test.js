/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import reducer, { initialState } from '../reducer';

describe('redux', () => {
  describe('clientIsps', () => {
    describe('reducer', () => {
      it('adds a clientIsp entry if not already there', () => {
        const newState = reducer({}, { type: 'FOO', clientIspId: 'clientIsp1' });
        expect(newState).to.contain.keys('clientIsp1');
        expect(newState.clientIsp1).to.deep.equal({ ...initialState, id: 'clientIsp1' });
      });
    });
  });
});
