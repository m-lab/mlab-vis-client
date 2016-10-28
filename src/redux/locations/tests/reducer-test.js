/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import reducer, { initialState } from '../reducer';

describe('redux', () => {
  describe('locations', () => {
    describe('reducer', () => {
      it('adds a location entry if not already there', () => {
        const newState = reducer({}, { type: 'FOO', locationId: 'location1' });
        expect(newState).to.contain.keys('location1');
        expect(newState.location1).to.deep.equal({ ...initialState, id: 'location1' });
      });
    });
  });
});
