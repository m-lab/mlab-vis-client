/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import reducer, { initialState } from '../reducer';

describe('redux', () => {
  describe('locationClientIsp', () => {
    describe('reducer', () => {
      it('adds a locationClientIsp entry if not already there', () => {
        const newState = reducer({}, { type: 'FOO', clientIspId: 'clientIsp1', locationId: 'location1' });
        expect(newState).to.contain.keys('location1_clientIsp1');
        expect(newState.location1_clientIsp1).to.deep.equal({ ...initialState, id: 'location1_clientIsp1' });
      });
    });
  });
});
