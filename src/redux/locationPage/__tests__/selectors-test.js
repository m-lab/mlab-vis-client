/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import {
  getLocation,
  getLocationHourly,
  getLocationTimeSeries,
  getLocationTopClientIsps,
  getHighlightHourly,
  getViewMetric,
  getLocationClientIspTimeSeries,
} from '../selectors';
/*

Disable this test suite until it is updated.

import { initialLocationState } from '../../locations/initialState';
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

      it('getLocationTopClientIsps', () => {
        const state = {
          locations: {
            myLocation: {
              ...initialLocationState,
              locationId: 'myLocation',
              topClientIsps: {
                data: ['one', 'two', 'three', 'four'],
              },
            },
          },
        };
        const result = getLocationTopClientIsps(state, { locationId: 'myLocation' });

        expect(result).to.deep.equal(['one', 'two', 'three', 'four']);

        // location not found
        expect(getLocationTopClientIsps(state, { locationId: 'foo' })).to.equal(undefined);
        expect(getLocationTopClientIsps({ locations: {} }, { locationId: 'foo' })).to.equal(undefined);
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
              clientIsps: {
                AS100: {
                  info: {
                    client_asn_number: 'AS100',
                  },
                  time: {
                    timeSeries: {
                      data: 'as100-time!',
                    },
                  },
                },
                AS200: {
                  info: {
                    client_asn_number: 'AS200',
                  },
                  time: {
                    timeSeries: {
                      data: 'as200-time!',
                    },
                  },
                },
              },
            },
          },
        };

        // should get the data from 100 and 200, but not 300 since it isn't there yet.
        // depends on selectedClientIspIds to determine starting point.
        const props = { locationId: 'myLocation', selectedClientIspIds: ['AS100', 'AS200', 'AS300'] };
        const result = getLocationClientIspTimeSeries(state, props);
        expect(result).to.deep.equal(['as100-time!', 'as200-time!']);
      });
    }); // reducer
  });
});

*/
