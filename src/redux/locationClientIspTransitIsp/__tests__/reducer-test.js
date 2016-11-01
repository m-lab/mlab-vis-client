/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import reducer, { initialState } from '../reducer';

describe('redux', () => {
  describe('locationClientIspTransitIsp', () => {
    describe('reducer', () => {
      it('adds a locationClientIspTransitIsp entry if not already there', () => {
        const newState = reducer({}, {
          type: 'FOO',
          clientIspId: 'clientIsp1',
          locationId: 'location1',
          transitIspId: 'transitIsp1',
        });
        expect(newState).to.contain.keys('location1_clientIsp1_transitIsp1');
        expect(newState.location1_clientIsp1_transitIsp1).to.deep.equal({
          ...initialState,
          id: 'location1_clientIsp1_transitIsp1',
        });
      });
    });
  });
});
