/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import {
  HIGHLIGHT_HOURLY,
} from '../actions';
import reducer, { initialState } from '../reducer';

describe('redux', () => {
  describe('locationPage', () => {
    describe('reducer', () => {
      // -------------------------------------------------------------------------------------
      it(HIGHLIGHT_HOURLY, () => {
        const result = reducer({}, {
          type: HIGHLIGHT_HOURLY,
          highlightPoint: 'point',
        });

        const expectedOutput = {
          ...initialState,
          highlightHourly: 'point',
        };

        expect(result).to.deep.equal(expectedOutput);
      });
    }); // reducer
  });
});
