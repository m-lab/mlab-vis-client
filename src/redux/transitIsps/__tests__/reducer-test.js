/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import reducer, { initialState } from '../reducer';

describe('redux', () => {
  describe('transitIsps', () => {
    describe('reducer', () => {
      it('adds a transitIsp entry if not already there', () => {
        const newState = reducer({}, { type: 'FOO', transitIspId: 'transitIsp1' });
        expect(newState).to.contain.keys('transitIsp1');
        expect(newState.transitIsp1).to.deep.equal({ ...initialState, id: 'transitIsp1' });
      });
    });
  });
});
