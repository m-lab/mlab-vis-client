/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import reducer, { initialState } from '../reducer';

describe('redux', () => {
  describe('locationTransitIsp', () => {
    describe('reducer', () => {
      it('adds a locationTransitIsp entry if not already there', () => {
        const newState = reducer({}, { type: 'FOO', transitIspId: 'transitIsp1', locationId: 'location1' });
        expect(newState).to.contain.keys('location1_transitIsp1');
        expect(newState.location1_transitIsp1).to.deep.equal({ ...initialState, id: 'location1_transitIsp1' });
      });
    });
  });
});
