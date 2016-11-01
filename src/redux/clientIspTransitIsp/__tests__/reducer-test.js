/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import reducer, { initialState } from '../reducer';

describe('redux', () => {
  describe('clientIspTransitIsp', () => {
    describe('reducer', () => {
      it('adds a clientIspTransitIsp entry if not already there', () => {
        const newState = reducer({}, { type: 'FOO', clientIspId: 'clientIsp1', transitIspId: 'transitIsp1' });
        expect(newState).to.contain.keys('clientIsp1_transitIsp1');
        expect(newState.clientIsp1_transitIsp1).to.deep.equal({ ...initialState, id: 'clientIsp1_transitIsp1' });
      });
    });
  });
});
