/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import {
  getLocation,
  getLocationHourly,
  getLocationTimeSeries,
  getLocationClientIsps,
  getHighlightHourly,
  getViewMetric,
  getLocationClientIspTimeSeries,
} from '../selectors';
import { initialLocationState } from '../../locations/reducer';
import { metrics } from '../../../constants';

describe('redux', () => {
  describe('locationPage', () => {
    describe('selectors', () => {
      // -------------------------------------------------------------------------------------
      it('getLocation', () => {
        const state = {
          locations: {
            myLocation: {
              ...initialLocationState,
              locationId: 'myLocation',
            },
          },
        };
        const result = getLocation(state, { locationId: 'myLocation' });
        const expectedOutput = state.locations.myLocation;
        expect(result).to.deep.equal(expectedOutput);

        // location not found
        expect(getLocation(state, { locationId: 'foo' })).to.deep.equal(initialLocationState);
        expect(getLocation({ locations: {} }, { locationId: 'foo' })).to.deep.equal(initialLocationState);
      });

      it('getLocationHourly', () => {
        const state = {
          locations: {
            myLocation: {
              ...initialLocationState,
              locationId: 'myLocation',
              time: {
                ...initialLocationState.time,
                hourly: {
                  data: 'data!',
                },
              },
            },
          },
        };
        const result = getLocationHourly(state, { locationId: 'myLocation' });
        expect(result).to.deep.equal('data!');

        // location not found
        expect(getLocationHourly(state, { locationId: 'foo' })).to.equal(undefined);
        expect(getLocationHourly({ locations: {} }, { locationId: 'foo' })).to.equal(undefined);
      });

      it('getLocationTimeSeries', () => {
        const state = {
          locations: {
            myLocation: {
              ...initialLocationState,
              locationId: 'myLocation',
              time: {
                ...initialLocationState.time,
                timeSeries: {
                  data: 'data!',
                },
              },
            },
          },
        };
        const result = getLocationTimeSeries(state, { locationId: 'myLocation' });
        expect(result).to.deep.equal('data!');

        // location not found
        expect(getLocationTimeSeries(state, { locationId: 'foo' })).to.equal(undefined);
        expect(getLocationTimeSeries({ locations: {} }, { locationId: 'foo' })).to.equal(undefined);
      });

      it('getLocationClientIsps', () => {
        const state = {
          locations: {
            myLocation: {
              ...initialLocationState,
              locationId: 'myLocation',
              clientIsps: {
                data: ['one', 'two', 'three', 'four'],
              },
            },
          },
        };
        const result = getLocationClientIsps(state, { locationId: 'myLocation' });

        // Currently limits to top 3 ISPs
        expect(result).to.deep.equal(['one', 'two', 'three']);

        // location not found
        expect(getLocationClientIsps(state, { locationId: 'foo' })).to.equal(undefined);
        expect(getLocationClientIsps({ locations: {} }, { locationId: 'foo' })).to.equal(undefined);
      });

      it('getHighlightHourly', () => {
        const state = {
          locationPage: {
            highlightHourly: 123,
          },
        };
        const result = getHighlightHourly(state);

        // Currently limits to top 3 ISPs
        expect(result).to.deep.equal(123);
      });

      it('getViewMetric', () => {
        const upload = metrics.find(m => m.value === 'upload');
        const download = metrics.find(m => m.value === 'download');

        expect(getViewMetric({}, { viewMetric: 'upload' })).to.equal(upload);
        expect(getViewMetric({}, {})).to.equal(download);
        expect(getViewMetric({}, { viewMetric: 'foo' })).to.equal(download);
      });

      // -------------------------------------------------------------------------------------
      it('getLocationClientIspTimeSeries', () => {
        const state = {
          locations: {
            myLocation: {
              ...initialLocationState,
              locationId: 'myLocation',
              time: {
                ...initialLocationState.time,
                clientIsps: {
                  AS100: {
                    timeSeries: {
                      data: 'as100-time!',
                    },
                  },
                  AS200: {
                    timeSeries: {
                      data: 'as200-time!',
                    },
                  },
                },
              },

              clientIsps: {
                data: [
                  { meta: { client_asn_number: 'AS100' } },
                  { meta: { client_asn_number: 'AS200' } },
                  { meta: { client_asn_number: 'AS300' } },
                ],
              },
            },
          },
        };

        // should get the data from 100 and 200, but not 300 since it isn't there yet.
        const result = getLocationClientIspTimeSeries(state, { locationId: 'myLocation' });
        expect(result).to.deep.equal(['as100-time!', 'as200-time!']);
      });
    }); // reducer
  });
});
